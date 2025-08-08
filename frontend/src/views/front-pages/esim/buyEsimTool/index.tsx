'use client'
import { useState } from 'react'
import { EsimTabTypeEnum } from './type'
import { ContentTabsCardsView } from './layouts/ContentTabsCardsView'
import { ContentTabsListOffersView } from './layouts/ContentTabsListOffersView'
import { HeaderTabsView } from './layouts/HeaderTabsView'
import { SearchSection } from './layouts/SearchSection'
import { Country } from '@/data/countries'

export const BuyEsimTool = () => {
  const [activeTab, setActiveTab] = useState<EsimTabTypeEnum>(EsimTabTypeEnum.LOCAL)
  const [selectedItemPayload, setSelectedItemPayload] = useState<{ data: string }>({ data: '' })

  const handleTabChange = (tab: EsimTabTypeEnum) => {
    setActiveTab(tab)
  }

  const tabsData = [
    {
      label: 'Local eSims',
      value: EsimTabTypeEnum.LOCAL
    },
    {
      label: 'Regional eSims',
      value: EsimTabTypeEnum.REGIONAL
    },
    {
      label: 'Global eSims',
      value: EsimTabTypeEnum.GLOBAL
    }
  ]

  const handleCountrySelect = (country: Country) => {
    setSelectedItemPayload({ data: country.code })
  }

  return (
    <div className='w-full px-[20rem] py-[5rem]'>
      <div className='relative px-[2rem] py-[2rem] border-2 border-primary rounded-4xl bg-backgroundPaper'>
        {selectedItemPayload?.data && (
          <div className='absolute top-[2rem] left-[3rem] z-10'>
            <button
              aria-label='Go back «'
              className='cursor-pointer w-12 h-12 flex
               items-center justify-center rounded-full
               text-primary bg-transparent  transform hover:scale-110 transition-all duration-200 ease-out'
              onClick={() => setSelectedItemPayload({ data: '' })}
            >
              <span className='text-6xl leading-none drop-shadow-md'>«</span>
              <span className='ml-2 text-xl leading-none font-["Open_Sans_Extra_Bold"] relative top-1'>Back</span>
            </button>
          </div>
        )}
        {!selectedItemPayload?.data && (
          <HeaderTabsView tabsData={tabsData} activeTab={activeTab} handleTabChange={handleTabChange} />
        )}

        <div className='mt-8 mb-6'>
          {!selectedItemPayload?.data && (
            <SearchSection
              onCountrySelect={handleCountrySelect}
              placeholder='Search for countries to find eSIM plans...'
            />
          )}
        </div>

        <div>
          {!selectedItemPayload?.data ? (
            <ContentTabsCardsView setSelectedItemPayload={setSelectedItemPayload} />
          ) : (
            <ContentTabsListOffersView selectedItemPayload={selectedItemPayload} />
          )}
        </div>
      </div>
    </div>
  )
}
