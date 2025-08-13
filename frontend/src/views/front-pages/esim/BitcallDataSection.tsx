import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import React from 'react'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'
import { Text } from '@/components/common/text'
import { SButton } from '@/components/common/button/SButton'

const BitcallDataSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  return (
    <SectionContainer
      title={['', t('features.title1'), t('features.title2'), t('features.title3')]}
      bgClass='esim-choose-Bitcall-esim-data-bg'
    >
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[4rem] mt-10'>
        <li
          className='w-[30rem] h-[48rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/11.png")]
           bg-cover bg-center bg-no-repeat rounded-4xl
           hover:scale-105 transition-all duration-300 shadow-lg
           cursor-pointer
           px-5 py-4'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text as='h3' value={t('features.points.affordable.title')} className='text-white text-2xl mb-4' />
          <Text as='p' value={t('features.points.affordable.description')} className='text-white text-base' />
          <Text
            as='p'
            value={t('features.points.affordable.textContent')}
            className='text-white bg-black/30 rounded-4xl p-4 shadow-lg font-bold  text-lg relative top-[27rem] text-center'
          />
        </li>
        <li
          className='w-[30rem] h-[48rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/12.png")]
           bg-cover bg-center bg-no-repeat rounded-4xl
           hover:scale-105 transition-all duration-300 shadow-lg
           cursor-pointer
           px-5 py-4'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text as='h3' value={t('features.points.flexible.title')} className=' text-2xl mb-4 dark:text-gray-800' />
          <Text
            as='p'
            value={t('features.points.flexible.description')}
            className='text-base mb-4 dark:text-gray-800'
          />
          <ul className='space-y-2 w-[12rem] relative left-[14.5rem] top-10'>
            {t('features.points.flexible.featList').map((item: string, index: number) => (
              <li
                key={index}
                className='flex items-start
                 p-4 bg-primary rounded-4xl
                 hover:scale-105 transition-all
                duration-300'
              >
                <Text
                  as='span'
                  value={item}
                  className='  text-white
                  font-bold '
                />
              </li>
            ))}
          </ul>
        </li>
        <li
          className='w-[30rem] h-[48rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/13.png")]
           bg-cover bg-center bg-no-repeat rounded-4xl
           hover:scale-105 transition-all duration-300 shadow-lg
           cursor-pointer
           px-5 py-4
           flex flex-col'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <ul className='space-y-2 w-[20rem] relative left-[7rem] top-1'>
            {t('features.points.trusted.featList').map((item: string, index: number) => (
              <li
                key={index}
                className='flex items-start
                 p-4 bg-primary rounded-4xl
                 hover:scale-105 transition-all
                duration-300'
              >
                <Text as='span' value={item} className='text-sm  text-white text-center' />
              </li>
            ))}
          </ul>
          <div className='relative top-[25.5rem]'>
            <Text as='h3' value={t('features.points.trusted.title')} className='text-white text-2xl mb-4' />
            <Text as='p' value={t('features.points.trusted.description')} className='text-white text-base' />
          </div>
        </li>
        <li
          className='w-[30rem] h-[48rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/14.png")]
           bg-cover bg-center bg-no-repeat rounded-4xl
           hover:scale-105 transition-all duration-300 shadow-lg
           cursor-pointer
           px-5 py-4'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text
            as='h3'
            value={t('features.points.peaceOfMind.title')}
            className=' text-2xl mb-4  '
            textColor='primary'
          />
          <Text as='p' value={t('features.points.peaceOfMind.description')} className='text-base dark:text-gray-800 ' />
        </li>
      </ul>
    </SectionContainer>
  )
}

export default BitcallDataSection
