import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import React from 'react'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'
import { Text } from '@/components/common/text'

const BitcallDataSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  return (
    <SectionContainer title={[t('features.title')]}>
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[4rem] mt-10'>
        <li
          className='w-[35rem] h-[50rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/11.png")] 
           bg-cover bg-center bg-no-repeat rounded-4xl 
           hover:scale-105 transition-all duration-300 shadow-lg 
           cursor-pointer
           px-5 py-10'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text as='h3' value={t('features.points.affordable.title')} className='text-white text-3xl mb-4' />
          <Text as='p' value={t('features.points.affordable.description')} className='text-white text-base' />
          <Text
            as='p'
            value={t('features.points.affordable.textContent')}
            className='text-white bg-white/10 rounded-4xl p-4  text-lg relative top-[27rem] text-center'
          />
        </li>
        <li
          className='w-[35rem] h-[50rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/12.png")] 
           bg-cover bg-center bg-no-repeat rounded-4xl 
           hover:scale-105 transition-all duration-300 shadow-lg 
           cursor-pointer
           px-5 py-10'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text as='h3' value={t('features.points.trusted.title')} className=' text-3xl mb-4' />
          <Text as='p' value={t('features.points.trusted.description')} className='text-base' />
        </li>
        <li
          className='w-[35rem] h-[50rem]
          hover:border-primary hover:border-2
           bg-[url("/images/assets/esimPageAsserts/13.png")] 
           bg-cover bg-center bg-no-repeat rounded-4xl 
           hover:scale-105 transition-all duration-300 shadow-lg 
           cursor-pointer
           px-5 py-10
           flex flex-col justify-end'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text as='h3' value={t('features.points.flexible.title')} className='text-white text-3xl mb-4' />
          <Text as='p' value={t('features.points.flexible.description')} className='text-white text-base' />
        </li>
        <li
          className='w-[35rem] h-[50rem]
          hover:border-primary hover:border-2   
           bg-[url("/images/assets/esimPageAsserts/14.png")] 
           bg-cover bg-center bg-no-repeat rounded-4xl 
           hover:scale-105 transition-all duration-300 shadow-lg 
           cursor-pointer
           px-5 py-10'
          role='img'
          aria-label='The Most Affordable eSIM on the Planet'
        >
          <Text
            as='h3'
            value={t('features.points.peaceOfMind.title')}
            className=' text-3xl mb-4  text-center'
            textColor='primary'
          />
          <Text as='p' value={t('features.points.peaceOfMind.description')} className='text-base text-center' />
        </li>
      </ul>
    </SectionContainer>
  )
}

export default BitcallDataSection
