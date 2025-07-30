'use server'

import { Text } from '@/components/common/text'
import { WaveCard } from '../../../components/common/waveCard/WaveCard'
import { getT } from '@/i18n/server'
import './fastSetupSection.styles.css'

const WhosUseThisSection = async ({ lang }: { lang: string }) => {
  const t = await getT(lang, 'resellerPage')

  const featuresList = [
    {
      text: t('whoIsItFor.feature1'),
      icon: 'ri-briefcase-line',
      colorClass: 'text-warning',
      ariaLabel: 'Business briefcase icon'
    },
    {
      text: t('whoIsItFor.feature2'),
      icon: 'ri-building-line',
      colorClass: 'text-primary',
      ariaLabel: 'Building icon'
    },
    {
      text: t('whoIsItFor.feature3'),
      icon: 'ri-focus-3-line',
      colorClass: 'text-error',
      ariaLabel: 'Focus target icon'
    }
  ]

  return (
    <WaveCard
      waveColor={{
        Container: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-none  lg:h-[22rem]',
        Svg: 'fill-blue-200/40 dark:fill-primary/20'
      }}
    >
      <Text
        as='h2'
        value={t('whoIsItFor.title')}
        textColor='secondary'
        className='text-center  font-["Open_Sans_Extra_Bold"] text-[2rem] md:text-[2.1rem] font-bold mt-4 mb-2 px-2 uppercase tracking-wider leading-tight '
      />
      <Text
        as='p'
        value={t('whoIsItFor.subtitle')}
        textColor='textSecondary'
        className=' italic text-center text-[1.03rem] sm:text-[1.4rem] leading-relaxed  max-w-[650px] mx-auto font-roboto'
      />
      <div className='flex justify-center gap-5 w-full max-w-[1200px] mx-auto px-20 py-8 flex-col md:flex-row'>
        {featuresList.map((feature, index) => (
          <article
            key={feature.text}
            className='hover:scale-150
            hover:border-primary float-animation cursor-pointer flex flex-col
             items-center md:items-start lg:items-start flex-1 text-left
            rounded-4xl  transition-shadow duration-300 ease-in-out'
            aria-labelledby={`feature-heading-${index}`}
          >
            <i
              className={`${feature.icon}  text-6xl md:text-5xl  lg:text-5xl  ${feature.colorClass} mb-2 float-animation`}
              aria-hidden='true'
            />
            <Text
              id={`feature-heading-${index}`}
              as='h3'
              value={feature.text}
              className='text-[0.9rem] sm:text-[1.1rem] md:text-start lg:text-start text-center leading-relaxed max-w-[300px] font-semibold'
            />
          </article>
        ))}
      </div>
    </WaveCard>
  )
}

export default WhosUseThisSection
