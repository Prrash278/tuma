// Currency utilities with flags and pricing
export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  country: string
  exchangeRate: number // USD to local currency
}

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    country: 'United States',
    exchangeRate: 1.0
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    country: 'India',
    exchangeRate: 83.5
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾',
    country: 'Malaysia',
    exchangeRate: 4.7
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    country: 'Nigeria',
    exchangeRate: 1600
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    flag: '🇲🇽',
    country: 'Mexico',
    exchangeRate: 18.2
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    flag: '🇧🇷',
    country: 'Brazil',
    exchangeRate: 5.1
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    country: 'Kenya',
    exchangeRate: 150
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    flag: '🇮🇩',
    country: 'Indonesia',
    exchangeRate: 15500
  }
]

export const getCurrencyByCode = (code: string): Currency | undefined => {
  return CURRENCIES.find(currency => currency.code === code)
}

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return `$${amount.toFixed(2)}`
  
  const localAmount = amount * currency.exchangeRate
  return `${currency.symbol}${localAmount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`
}

export const convertToUSD = (amount: number, fromCurrency: string): number => {
  const currency = getCurrencyByCode(fromCurrency)
  if (!currency) return amount
  return amount / currency.exchangeRate
}

export const convertFromUSD = (usdAmount: number, toCurrency: string): number => {
  const currency = getCurrencyByCode(toCurrency)
  if (!currency) return usdAmount
  return usdAmount * currency.exchangeRate
}
