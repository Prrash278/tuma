// Mock FX rates service - in production, this would connect to a real FX API
export interface FXRate {
  from: string
  to: string
  rate: number
  timestamp: number
}

export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬' },
]

// Mock FX rates - in production, these would be fetched from a real API
const MOCK_FX_RATES: Record<string, number> = {
  'USD_NGN': 1600, // 1 USD = 1600 NGN
  'USD_INR': 83,   // 1 USD = 83 INR
  'USD_BRL': 5.2,  // 1 USD = 5.2 BRL
  'USD_KES': 150,  // 1 USD = 150 KES
  'USD_GHS': 12,   // 1 USD = 12 GHS
  'USD_ZAR': 18,   // 1 USD = 18 ZAR
  'USD_EGP': 31,   // 1 USD = 31 EGP
}

const MARKUP_PERCENTAGE = parseFloat(process.env.MARKUP_PERCENTAGE || '10')

export class FXService {
  private rates: Map<string, FXRate> = new Map()

  constructor() {
    this.initializeRates()
  }

  private initializeRates() {
    Object.entries(MOCK_FX_RATES).forEach(([pair, rate]) => {
      const [from, to] = pair.split('_')
      this.rates.set(pair, {
        from,
        to,
        rate: rate * (1 + MARKUP_PERCENTAGE / 100), // Apply markup
        timestamp: Date.now()
      })
    })
  }

  getRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1

    const directKey = `${fromCurrency}_${toCurrency}`
    const reverseKey = `${toCurrency}_${fromCurrency}`

    // Check direct rate
    if (this.rates.has(directKey)) {
      return this.rates.get(directKey)!.rate
    }

    // Check reverse rate
    if (this.rates.has(reverseKey)) {
      return 1 / this.rates.get(reverseKey)!.rate
    }

    // If no direct conversion, convert through USD
    if (fromCurrency !== 'USD' && toCurrency !== 'USD') {
      const fromToUSD = this.getRate(fromCurrency, 'USD')
      const usdToTarget = this.getRate('USD', toCurrency)
      return fromToUSD * usdToTarget
    }

    return 1 // Fallback
  }

  convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
    const rate = this.getRate(fromCurrency, toCurrency)
    return amount * rate
  }

  getSupportedCurrencies(): Currency[] {
    return SUPPORTED_CURRENCIES
  }

  getCurrencyByCode(code: string): Currency | undefined {
    return SUPPORTED_CURRENCIES.find(currency => currency.code === code)
  }

  formatAmount(amount: number, currency: string): string {
    const currencyInfo = this.getCurrencyByCode(currency)
    if (!currencyInfo) return `${amount.toFixed(2)} ${currency}`

    return `${currencyInfo.symbol}${amount.toFixed(2)}`
  }
}

export const fxService = new FXService()
