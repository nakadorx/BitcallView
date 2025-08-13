'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { SButton } from '@/components/common/button/SButton'
import { useT } from '@/i18n/client'
import { CountryCardSkeletonList } from '@/components/common/Skeletons'
import { CountryData, ContentTabsCardsViewApiResponse } from '../type'

const Card = ({
  name,
  flag,
  minPrice,
  validity,
  code,
  setSelectedItemPayload
}: {
  name: string
  flag: string
  minPrice: string
  validity: string
  code: string
  setSelectedItemPayload: (payload: { data: string }) => void
}) => (
  <li
    className='group relative z-5 w-[18rem] cursor-pointer overflow-hidden rounded-2xl border-2 border-primary bg-backgroundPaper shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:bg-backgroundDefault'
    onClick={() => setSelectedItemPayload({ data: code })}
  >
    <div className='p-4'>
      <div className='flex items-center gap-3'>
        <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/60  shadow-sm'>
          <Image src={flag} alt={`${name} flag`} fill className='object-cover' />
        </div>
        <h2 className='truncate text-lg font-extrabold leading-tight'>{name}</h2>
      </div>

      <div className='mt-4 flex items-end justify-between'>
        <div>
          <span className='block text-[10px] uppercase tracking-wide text-secondary'>from</span>
          <span className='text-2xl font-bold text-primary'>${minPrice}</span>
        </div>
        <span className='text-xs text-gray-500'>{validity}</span>
      </div>
    </div>

    <div className='h-[3px] w-full bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50 transition-opacity group-hover:opacity-100' />
  </li>
)

export const ContentTabLocalCardsView = ({
  setSelectedItemPayload
}: {
  setSelectedItemPayload: (payload: { data: string }) => void
}) => {
  const { t } = useT('esim')
  const [countries, setCountries] = useState<CountryData[]>([])
  const [allData, setAllData] = useState<CountryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.demo-bc.site/esim/local-esims?offset=0&limit=1000')

        if (!response.ok) {
          throw new Error('Failed to fetch countries')
        }

        const data: ContentTabsCardsViewApiResponse = await response.json()
        setAllData(data.countries)
        setCountries(data.countries.slice(0, 8)) // Show only first 8 countries
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  if (loading) {
    return <CountryCardSkeletonList />
  }

  if (error) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='text-red-500'>Error: {error}</div>
      </div>
    )
  }

  const handleLoadMore = () => {
    setCountries(allData.slice(0, countries.length + 8))
  }

  return (
    <ul className='flex gap-6 sm:gap-8 mt-6 sm:mt-10 flex-col'>
      <div className='flex flex-wrap gap-4 sm:gap-6 justify-center '>
        {countries.map(country => (
          <Card
            key={country?.code}
            name={country?.name}
            flag={country?.flag}
            minPrice={country?.minPrice?.toFixed(2)?.toString()}
            validity='from 7 days'
            setSelectedItemPayload={setSelectedItemPayload}
            code={country?.code}
          />
        ))}
      </div>
      <div>
        <SButton label={t('buy.loadMore')} variant='contained' onClick={handleLoadMore} />
      </div>
    </ul>
  )
}
