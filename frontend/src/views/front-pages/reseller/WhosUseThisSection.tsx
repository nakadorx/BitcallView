'use server'

import { Text } from '@/components/common/text'
import { WaveCard } from '../../../components/common/waveCard/WaveCard'
import { getT } from '@/i18n/server'
import './fastSetupSection.styles.css'
import { getLocale } from '@/utils/commons'

const WhosUseThisSection = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'resellerPage')

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
        Container: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-none  lg:h-[27rem]',
        Svg: 'fill-blue-200/40 dark:fill-primary/20'
      }}
    >
      <Text
        as='h2'
        value={t('whoIsItFor.title')}
        textColor='secondary'
        className='text-center text-[2rem] md:text-[2.1rem] font-bold mt-4 mb-2 px-2 uppercase tracking-wider leading-tight font-open-sans-extra-bold'
      />
      <Text
        as='p'
        value={t('whoIsItFor.subtitle')}
        textColor='textSecondary'
        className='text-center text-[1.03rem] sm:text-[1.4rem] leading-relaxed mb-2 max-w-[650px] mx-auto font-roboto'
      />
      <div className='flex justify-center gap-4 w-full max-w-[1200px] mx-auto px-20 py-8 flex-col md:flex-row'>
        {featuresList.map((feature, index) => (
          <article
            key={feature.text}
            className='hover:scale-150  dark:hover:border-2 hover:border-solid hover:border-primary float-animation cursor-pointer flex flex-col items-start flex-1 text-left p-6 rounded-4xl hover:shadow-lg hover:bg-backgroundPaper transition-shadow duration-300 ease-in-out'
            aria-labelledby={`feature-heading-${index}`}
          >
            <i className={`${feature.icon} text-5xl ${feature.colorClass} mb-2 float-animation`} aria-hidden='true' />
            <Text
              id={`feature-heading-${index}`}
              value={feature.text}
              className='text-[0.9rem] sm:text-[1.1rem] leading-relaxed max-w-[300px]'
            />
          </article>
        ))}
      </div>
    </WaveCard>
  )
}

export default WhosUseThisSection
