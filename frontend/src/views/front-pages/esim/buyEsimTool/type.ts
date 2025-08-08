export enum EsimTabTypeEnum {
  LOCAL = 'local',
  REGIONAL = 'regional',
  GLOBAL = 'global'
}
export interface CountryData {
  name: string
  code: string
  flag: string
  minPrice: number
}

export interface ContentTabsCardsViewApiResponse {
  countries: CountryData[]
}

export interface PlanInformation {
  planType: string
  planCode: string
  planName: string
  countryName: string
  currency: string
  dataUnit: string | null
  price: number
  additionalInfo: string
  subscription: boolean
  subscriptionPeriod: string
  phoneNumber: boolean
  vaildity: string
  capacityUnit: string
  capacity: string
  dataallowanceMonthly: string | null
  travel_date: string | null
  validityType: string
  connectivity: string
  network_operator: string
  countries_covered: string
}

export interface PlanInformationApiResponse {
  isSuccess: boolean
  message: string
  getInformation: PlanInformation[]
}
