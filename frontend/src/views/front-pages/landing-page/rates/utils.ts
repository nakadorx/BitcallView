import { customLog } from '@/utils/commons'
import { iso3Mapping } from './countries'

// Define interfaces for type safety.
export interface Destination {
  country: string
  description: string
}

export type DestinationMap = { [prefix: string]: Destination }

export interface RateRecord {
  i_rate: string
  prefix: string
  price_1: string
  price_n: string
  interval_1: string
  interval_n: string
  grace_period_enable: string
  activation_date: string
  expiration_date: string
  forbidden: string

  // Enriched fields:
  matched_prefix?: string | null
  country?: string | null
  description?: string | null
  countryIso?: string // New field for storing the ISO3 code
}

/**
 * Extracts the rates array from the nested XML-RPC API response.
 * Transforms each record into a plain RateRecord object.
 */
export function extractRates(apiData: any): RateRecord[] {
  try {
    const members = apiData?.methodResponse?.params?.param?.value?.struct?.member
    const ratesMember = members?.find((m: any) => m.name === 'rates')
    if (!ratesMember) {
      throw new Error('Rates member not found.')
    }
    const ratesArray = ratesMember.value?.array?.data?.value
    const plainRates: RateRecord[] = ratesArray.map((rateWrapper: any) => {
      const rateStruct = rateWrapper.struct
      const rate: any = {}
      rateStruct.member.forEach((field: any) => {
        const fieldName = field.name
        const valueType = Object.keys(field.value)[0]
        rate[fieldName] = field.value[valueType]
      })
      return rate as RateRecord
    })
    return plainRates
  } catch (error: any) {
    throw new Error('Error extracting rates: ' + error.message)
  }
}

export const iso3toIso2 = (iso3: string): string => {
  return iso3Mapping[iso3.toUpperCase()] || iso3.slice(0, 2).toLowerCase()
}
