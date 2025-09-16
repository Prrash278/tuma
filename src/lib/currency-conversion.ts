import { CURRENCIES } from './currencies'

export interface ConversionResult {
  originalAmount: number
  convertedAmount: number
  rate: number
  spread: number
  finalRate: number
  fromCurrency: string
  toCurrency: string
}

export class CurrencyConversionService {
  private static readonly SPREAD_PERCENTAGE = 0.10 // 10% spread

  /**
   * Convert USD to a local currency with 10% spread
   */
  static convertFromUSD(usdAmount: number, targetCurrency: string): ConversionResult {
    const currency = CURRENCIES.find(c => c.code === targetCurrency)
    if (!currency) {
      throw new Error(`Currency ${targetCurrency} not supported`)
    }

    const baseRate = currency.rate
    const spread = baseRate * CurrencyConversionService.SPREAD_PERCENTAGE
    const finalRate = baseRate + spread

    return {
      originalAmount: usdAmount,
      convertedAmount: usdAmount * finalRate,
      rate: baseRate,
      spread: spread,
      finalRate: finalRate,
      fromCurrency: 'USD',
      toCurrency: targetCurrency
    }
  }

  /**
   * Convert from local currency to USD (for internal calculations)
   */
  static convertToUSD(localAmount: number, fromCurrency: string): ConversionResult {
    const currency = CURRENCIES.find(c => c.code === fromCurrency)
    if (!currency) {
      throw new Error(`Currency ${fromCurrency} not supported`)
    }

    const baseRate = currency.rate
    const spread = baseRate * CurrencyConversionService.SPREAD_PERCENTAGE
    const finalRate = baseRate + spread

    return {
      originalAmount: localAmount,
      convertedAmount: localAmount / finalRate,
      rate: baseRate,
      spread: spread,
      finalRate: finalRate,
      fromCurrency: fromCurrency,
      toCurrency: 'USD'
    }
  }

  /**
   * Get the current conversion rate with spread
   */
  static getConversionRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1

    if (fromCurrency === 'USD') {
      const conversion = this.convertFromUSD(1, toCurrency)
      return conversion.finalRate
    }

    if (toCurrency === 'USD') {
      const conversion = this.convertToUSD(1, fromCurrency)
      return conversion.finalRate
    }

    // Convert through USD
    const toUSD = this.convertToUSD(1, fromCurrency)
    const fromUSD = this.convertFromUSD(toUSD.convertedAmount, toCurrency)
    return fromUSD.finalRate
  }

  /**
   * Format currency amount with proper symbol and decimals
   */
  static formatCurrency(amount: number, currency: string): string {
    const currencyInfo = CURRENCIES.find(c => c.code === currency)
    if (!currencyInfo) return `${amount.toFixed(2)}`

    return `${currencyInfo.symbol}${amount.toFixed(2)}`
  }

  /**
   * Calculate the spread amount in the target currency
   */
  static getSpreadAmount(usdAmount: number, targetCurrency: string): number {
    const currency = CURRENCIES.find(c => c.code === targetCurrency)
    if (!currency) return 0

    const baseRate = currency.rate
    const spread = baseRate * CurrencyConversionService.SPREAD_PERCENTAGE
    return usdAmount * spread
  }
}
