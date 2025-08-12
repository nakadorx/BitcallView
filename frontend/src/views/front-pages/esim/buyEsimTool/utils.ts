import { EsimTabTypeEnum } from './type'
// create a function that takes currency and returns the symbol, example: USD should return $, EUR should return €

export const getCurrencySymbol = (currencyCode: string): string => {
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RUB: '₽',
    TRY: '₺',
    BRL: 'R$',
    MXN: '$',
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    NZD: 'NZ$',
    THB: '฿',
    MYR: 'RM',
    PHP: '₱',
    IDR: 'Rp',
    VND: '₫',
    ZAR: 'R'
  }

  return currencySymbols[currencyCode.toUpperCase()] || currencyCode
}

export const fetchPlanInformation = async ({
  data,
  activeTab
}: {
  data: string | string[]
  activeTab: EsimTabTypeEnum
}): Promise<Response> => {
  if (activeTab === EsimTabTypeEnum.GLOBAL) {
    return fetch('https://api.demo-bc.site/esim/global-plans')
  }

  if (activeTab === EsimTabTypeEnum.REGIONAL) {
    const multiple = Array.isArray(data) ? data : [data]
    return fetch('https://api.demo-bc.site/esim/plan-information', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag: 2, countryCode: '', multiplecountrycode: multiple })
    })
  }

  // Local by default
  return fetch('https://api.demo-bc.site/esim/plan-information-countrywise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 1, countryCode: data as string })
  })
}
