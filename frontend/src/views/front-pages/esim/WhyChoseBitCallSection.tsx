import React from 'react'
import { WaveCard } from '@/components/common/waveCard/WaveCard'
import { Text } from '@/components/common/text'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

const WhyChoseBitCallSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  return (
    <WaveCard
      waveColor={{
        Container: `bg-gradient-to-br from-primary to-primary/50 dark:bg-none `,
        Svg: `fill-primary dark:fill-primary`
      }}
    >
      <Text
        as='h2'
        value={t('features.title')}
        textColor='white'
        className='text-center text-[2rem] md:text-[2.1rem] font-bold mt-4 mb-2 px-2 uppercase tracking-wider leading-tight font-open-sans-extra-bold'
      />
      <Text
        as='p'
        value={t('features.points.affordable.title')}
        textColor='white'
        className='text-center text-[1.03rem] sm:text-[1.4rem] leading-relaxed mb-2 max-w-[650px] mx-auto font-roboto'
      />
      <Text
        as='p'
        value={t('features.points.affordable.description')}
        textColor='white'
        className='text-center text-[1.03rem] sm:text-[1.4rem] leading-relaxed  mx-auto font-roboto mb-[5rem]'
      />
    </WaveCard>
  )
}

export default WhyChoseBitCallSection
