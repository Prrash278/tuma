// Note: This service should only be used on the server-side
// Client-side components should call API routes instead

const RAPYD_ACCESS_KEY = process.env.RAPYD_ACCESS_KEY!
const RAPYD_SECRET_KEY = process.env.RAPYD_SECRET_KEY!
const RAPYD_BASE_URL = process.env.RAPYD_BASE_URL!

interface RapydPaymentMethod {
  id: string
  type: string
  name: string
  category: string
  image: string
  is_online: boolean
  is_offline: boolean
  is_online_offline: boolean
  supported_currencies: string[]
  supported_countries: string[]
}

interface RapydCheckoutRequest {
  amount: number
  currency: string
  country: string
  payment_method_types: string[]
  merchant_reference_id: string
  customer: {
    id: string
    email: string
    name: string
  }
  description: string
  complete_payment_url: string
  error_payment_url: string
}

interface RapydCheckoutResponse {
  id: string
  status: string
  amount: number
  currency: string
  payment_method_types: string[]
  payment_method_options: RapydPaymentMethod[]
  redirect_url: string
  merchant_reference_id: string
  created_at: number
  expires_at: number
}

export class RapydService {
  private generateSignature(method: string, url: string, body: string, salt: string, timestamp: number): string {
    const crypto = require('crypto')
    
    // Remove trailing slashes and normalize URL
    const normalizedUrl = url.replace(/\/$/, '') || '/'
    
    // Create the string to sign
    const toSign = method.toLowerCase() + normalizedUrl + salt + timestamp + RAPYD_ACCESS_KEY + RAPYD_SECRET_KEY + body
    
    // Generate HMAC signature
    const signature = crypto.createHmac('sha256', RAPYD_SECRET_KEY).update(toSign).digest('hex')
    
    return Buffer.from(signature).toString('base64')
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<any> {
    const crypto = require('crypto')
    const url = `${RAPYD_BASE_URL}${endpoint}`
    const bodyString = body ? JSON.stringify(body) : ''
    const timestamp = Math.floor(Date.now() / 1000)
    const salt = crypto.randomBytes(12).toString('hex')
    
    const signature = this.generateSignature(method, endpoint, bodyString, salt, timestamp)
    
    const headers = {
      'Content-Type': 'application/json',
      'access_key': RAPYD_ACCESS_KEY,
      'salt': salt,
      'timestamp': timestamp.toString(),
      'signature': signature,
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    }

    // Only include body for POST/PUT/PATCH requests
    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestOptions.body = bodyString
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Rapyd API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getPaymentMethods(country: string, currency: string): Promise<RapydPaymentMethod[]> {
    try {
      const response = await this.makeRequest('GET', `/v1/payment_methods/country/${country}?currency=${currency}`)
      return response.data || []
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      return []
    }
  }

  async createCheckout(request: RapydCheckoutRequest): Promise<RapydCheckoutResponse> {
    try {
      const response = await this.makeRequest('POST', '/v1/checkout', request)
      return response.data
    } catch (error) {
      console.error('Error creating checkout:', error)
      throw error
    }
  }

  async getCheckoutStatus(checkoutId: string): Promise<any> {
    try {
      const response = await this.makeRequest('GET', `/v1/checkout/${checkoutId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching checkout status:', error)
      throw error
    }
  }

  async getSupportedCountries(): Promise<any[]> {
    try {
      const response = await this.makeRequest('GET', '/v1/data/countries')
      return response.data || []
    } catch (error) {
      console.error('Error fetching supported countries:', error)
      return []
    }
  }

  async getSupportedCurrencies(): Promise<any[]> {
    try {
      const response = await this.makeRequest('GET', '/v1/data/currencies')
      return response.data || []
    } catch (error) {
      console.error('Error fetching supported currencies:', error)
      return []
    }
  }
}

export const rapydService = new RapydService()
