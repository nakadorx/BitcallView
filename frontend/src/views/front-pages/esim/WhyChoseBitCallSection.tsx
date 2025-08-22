import React from 'react'
import { WaveCard } from '@/components/common/waveCard/WaveCard'
import { Text } from '@/components/common/text'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

const WhyChoseBitCallSection = async ({ lang }: { lang: string }) => {

  const t = await getT(lang, 'esim')

  return (
    <WaveCard
      className='hover:scale-105 transition-all duration-300 cursor-pointer px-4 sm:px-6'
      waveColor={{
        Container: ` md:bg-gradient-to-br md:from-primary md:to-primary/50 dark:bg-none  bg-primary`,
        Svg: `fill-primary dark:fill-primary`
      }}
    
    >
      <Text
        as='h2'
        textColor='secondary'
        className='text-center text-secondary lg:text-[2rem] md:text-[2.1rem] font-bold mt-4 mb-2 px-2 uppercase tracking-wider leading-tight font-open-sans-extra-bold'
      >
        <span className='text-secondary'>{t('features.title1')}</span>
        <span className='text-white'>{t('features.title2')}</span>
        <span className='text-secondary'>{t('features.title3')}</span>
      </Text>
      <Text
        as='p'
        value={t('features.points.affordable.title')}
        textColor='secondary'
        className='text-center  italic text-[.9rem] sm:text-[1.4rem]
        leading-relaxed mb-2 max-w-[650px] mx-auto font-roboto'
      />
      <div className='flex justify-center items-center bg-gray-200 dark:bg-transparent bg-opacity-20 rounded-4xl p-4 w-full max-w-[70rem] mx-auto my-[2rem]'>
        <Text
          as='p'
          value={t('features.points.affordable.description')}
          textColor='white'
          className='text-center text-[1rem] sm:text-[1.2rem] md:text-[1.4rem] leading-relaxed px-2 sm:px-4 mx-auto font-bold'
        />
      </div>
    </WaveCard>
  )
}

export default WhyChoseBitCallSection
