'use client'
import { useState } from 'react'
import { EsimTabTypeEnum } from './type'
import { useT } from '@/i18n/client'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MapIcon from '@mui/icons-material/Map'
import PublicIcon from '@mui/icons-material/Public'
import { ContentTabLocalCardsView } from './layouts/ContentTabLocalCardsView'
import { ContentTabsListOffersView } from './layouts/ContentTabsListOffersView'
import { HeaderTabsView } from './layouts/HeaderTabsView'
import { SearchSection } from './layouts/SearchSection'
import { Country } from '@/data/countries'
import { ContentTabRegionCardsView } from './layouts/ContentTabRegionCardsView'
import Image from 'next/image'

export const BuyEsimTool = () => {
  const { t } = useT('esim')
  const [activeTab, setActiveTab] = useState<EsimTabTypeEnum>(EsimTabTypeEnum.LOCAL)
  const [selectedItemPayload, setSelectedItemPayload] = useState<{ data: string }>({ data: '' })

  const handleTabChange = (tab: EsimTabTypeEnum) => {
    setActiveTab(tab)
    setSelectedItemPayload({ data: '' })
  }

  const tabsData = [
    {
      label: t('buy.tabs.local'),
      value: EsimTabTypeEnum.LOCAL,
      icon: <LocationOnIcon fontSize='small' />
    },
    {
      label: t('buy.tabs.regional'),
      value: EsimTabTypeEnum.REGIONAL,
      icon: <MapIcon fontSize='small' />
    },
    {
      label: t('buy.tabs.global'),
      value: EsimTabTypeEnum.GLOBAL,
      icon: <PublicIcon fontSize='small' />
    }
  ]

  const handleCountrySelect = (country: Country) => {
    setSelectedItemPayload({ data: country.code })
  }

  const handleSelect = (opt: { type: 'country' | 'region'; name: string; code?: string }) => {
    if (opt.type === 'country' && opt.code) {
      setSelectedItemPayload({ data: opt.code })
      return
    }
    if (opt.type === 'region') {
      // For regional search, use array payload as per utils contract
      setSelectedItemPayload({ data: opt.name })
      setActiveTab(EsimTabTypeEnum.REGIONAL)
    }
  }

  const renderContent = () => {
    if (selectedItemPayload?.data) {
      return <ContentTabsListOffersView selectedItemPayload={selectedItemPayload} activeTab={activeTab} />
    }

    switch (activeTab) {
      case EsimTabTypeEnum.LOCAL:
        return <ContentTabLocalCardsView setSelectedItemPayload={setSelectedItemPayload} />
      case EsimTabTypeEnum.REGIONAL:
        return <ContentTabRegionCardsView setSelectedItemPayload={setSelectedItemPayload} />
      case EsimTabTypeEnum.GLOBAL:
        setSelectedItemPayload({ data: 'GLOBAL' })
        return <ContentTabsListOffersView selectedItemPayload={selectedItemPayload} activeTab={activeTab} />
      default:
        return <ContentTabRegionCardsView setSelectedItemPayload={setSelectedItemPayload} />
    }
  }

  return (
    <div className='w-full max-w-[120rem] mx-auto pb-[5rem] relative px-4 sm:px-8 md:px-12 lg:px-[20rem]'>
      <div className='relative px-4 sm:px-6 py-[2rem] border-2 border-primary rounded-4xl bg-backgroundPaper'>
        {selectedItemPayload?.data && (
          <div className='absolute z-10 top-[11rem] left-[2rem] sm:top-[11.5rem] sm:left-[10rem] md:top-[2rem] md:left-[3rem]'>
            <button
              aria-label='Go back «'
              className='cursor-pointer w-12 h-12 flex
               items-center justify-center rounded-full
               text-primary bg-transparent  transform hover:scale-110 transition-all duration-200 ease-out'
              onClick={() => {
                if (activeTab === EsimTabTypeEnum.GLOBAL) {
                  setActiveTab(EsimTabTypeEnum.LOCAL)
                  setSelectedItemPayload({ data: '' })
                } else {
                  setSelectedItemPayload({ data: '' })
                }
              }}
            >
              <span className='leading-none drop-shadow-md text-4xl sm:text-5xl md:text-6xl'>«</span>
              <span className='ml-2 text-xl leading-none font-["Open_Sans_Extra_Bold"] relative top-1'>
                {t('buy.back')}
              </span>
            </button>
          </div>
        )}

        <HeaderTabsView tabsData={tabsData} activeTab={activeTab} handleTabChange={handleTabChange} />

        <div className='mt-8 mb-6'>
          {!selectedItemPayload?.data && (
            <SearchSection activeTab={activeTab} onSelect={handleSelect} placeholder={t('buy.search.placeholder')} />
          )}
        </div>

        <div>{renderContent()}</div>
      </div>
      <div aria-hidden='true' className='hidden lg:block'>
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184310/AR4_piigth.png'
          alt=''
          className=' float-animation absolute lg:top-[-2rem] lg:left-[15rem] md:top-[9rem] md:left-[12rem] top-[17rem] left-[0rem]'
          width={80}
          aria-hidden='true'
          height={80}
        />
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184311/AR5_xqa8nc.png'
          alt=''
          className=' float-animation absolute lg:top-[40rem] lg:right-[15rem] md:top-[10rem] md:right-[12rem] top-[32rem] right-[0rem]'
          width={80}
          aria-hidden='true'
          height={80}
        />
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184310/AR3_cakyv7.png'
          alt=''
          className=' float-animation absolute lg:top-[4rem] lg:right-[15rem]
          md:top-[37rem] md:right-[10rem] top-[15rem] right-[0rem]
          rotate-45'
          width={80}
          aria-hidden='true'
          height={80}
        />
      </div>
    </div>
  )
}
