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
      <ul className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-[4rem] mt-6 sm:mt-10'>
        <li
          className='w-full max-w-[30rem] h-[18rem] sm:h-[28rem] lg:h-[48rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/11.png")]
           bg-cover bg-center bg-no-repeat rounded-4xl
           hover:scale-105 transition-all duration-300 shadow-lg
           cursor-pointer
           px-5 py-4'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text
            as='h3'
            value={t('features.points.affordable.title')}
            className='text-white text-lg sm:text-2xl mb-2 sm:mb-4'
          />
          <Text
            as='p'
            value={t('features.points.affordable.description')}
            className='text-white text-sm sm:text-base hidden lg:block'
          />
          <Text
            as='p'
            value={t('features.points.affordable.textContent')}
            className='text-white bg-black/30 rounded-4xl p-2 sm:p-4 shadow-lg font-bold text-sm sm:text-lg relative top-[8rem] sm:top-[18rem] lg:top-[27rem] text-center hidden lg:block'
          />
        </li>
        <li
          className='w-full max-w-[30rem] h-[18rem] sm:h-[28rem] lg:h-[48rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/12.png")]
           bg-cover bg-center bg-no-repeat rounded-4xl
           hover:scale-105 transition-all duration-300 shadow-lg
           cursor-pointer
           px-5 py-4'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text
            as='h3'
            value={t('features.points.flexible.title')}
            className=' text-lg sm:text-2xl mb-2 sm:mb-4 dark:text-gray-800'
          />
          <Text
            as='p'
            value={t('features.points.flexible.description')}
            className='text-sm sm:text-base mb-2 sm:mb-4 dark:text-gray-800 hidden lg:block'
          />
          <ul className='space-y-2 w-full sm:w-[16rem] lg:w-[12rem] relative left-0 sm:left-10 lg:left-[14.5rem] top-2 sm:top-6 lg:top-10 hidden lg:block'>
            {t('features.points.flexible.featList').map((item: string, index: number) => (
              <li
                key={index}
                className='flex items-start
                 p-4 bg-primary rounded-4xl
                 hover:scale-105 transition-all
                duration-300'
              >
                <Text as='span' value={item} className='text-white font-bold text-xs sm:text-sm' />
              </li>
            ))}
          </ul>
        </li>
        <li
          className='w-full max-w-[30rem] h-[18rem] sm:h-[28rem] lg:h-[48rem]
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
          <ul className='space-y-2 w-full sm:w-[18rem] lg:w-[20rem] relative left-0 sm:left-8 lg:left-[7rem] top-0 sm:top-1 hidden lg:block'>
            {t('features.points.trusted.featList').map((item: string, index: number) => (
              <li
                key={index}
                className='flex items-start
                 p-4 bg-primary rounded-4xl
                 hover:scale-105 transition-all
                duration-300'
              >
                <Text as='span' value={item} className='text-xs sm:text-sm  text-white text-center' />
              </li>
            ))}
          </ul>
          <div className='relative top-[6rem] lg:right-0 right-[4rem] md:bottom-[10rem] lg:top-[25.5rem]'>
            <Text
              as='h3'
              value={t('features.points.trusted.title')}
              className='text-white  text-lg sm:text-2xl mb-2 sm:mb-4 text-shadow-lg relative bottom-[7rem] left-[4rem] sm:left-0 lg:left-0 sm:top-0 lg:top-0'
            />
            <Text
              as='p'
              value={t('features.points.trusted.description')}
              className='text-white text-sm sm:text-base hidden lg:block'
            />
          </div>
        </li>
        <li
          className='w-full max-w-[30rem] h-[18rem] sm:h-[28rem] lg:h-[48rem]
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
            className=' text-lg sm:text-2xl mb-2 sm:mb-4'
            textColor='primary'
          />
          <Text
            as='p'
            value={t('features.points.peaceOfMind.description')}
            className='text-sm sm:text-base dark:text-gray-800 hidden lg:block'
          />
        </li>
      </ul>
    </SectionContainer>
  )
}

export default BitcallDataSection
