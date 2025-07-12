'use client'
// TODO: check for server side rendering need
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { useT } from '@/i18n/client'
import { useMediaQuery, useTheme } from '@mui/material'
import { CardList } from '@/components/common/cards/CardList'
import Image from 'next/image'
import { Text } from '@/components/common/text'

const RealTimeInsightsSection = () => {
  const { t } = useT('resellerPage')

  const data = [
    {
      CardCustomContent: CardCustomContent({ icon: '📊', text: t('realTimeInsightsSection.features.dashboards') })
    },
    {
      CardCustomContent: CardCustomContent({ icon: '✅', text: t('realTimeInsightsSection.features.reports') })
    },
    {
      CardCustomContent: CardCustomContent({ icon: '🔍', text: t('realTimeInsightsSection.features.monitoring') })
    },
    {
      CardCustomContent: CardCustomContent({ icon: '📤', text: t('realTimeInsightsSection.features.export') })
    },
    {
      CardCustomContent: CardCustomContent({ icon: '📈', text: t('realTimeInsightsSection.features.analytics') })
    }
  ]

  const theme = useTheme()
  const userIsMobile = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <SectionContainer
      bgClass='real-time-insights-bg'
      ariaLabel={t('realTimeInsightsSection.title')}
      containerClassName='lg:px-[21rem] '
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 h-[1100px] md:h-[1000px] lg:h-auto'>
        {!userIsMobile && (
          <div className='w-full h-full flex md:justify-center lg:justify-end mg:items-end px-4 items-center'>
            <Image
              src={'/images/assets/23.png'}
              alt={'Real-time telecom insights dashboard showing call analytics and monitoring'}
              width={470}
              height={500}
            />
          </div>
        )}
        <div className='w-full'>
          <CardList
            title={t('realTimeInsightsSection.title')}
            subtitle={t('realTimeInsightsSection.subtitle')}
            data={data}
            cardContainerClassName='bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-lg hover:transform hover:scale-105'
            headerExtraContent={
              userIsMobile && (
                <div className='flex justify-center items-center p-5'>
                  <Image
                    src={'/images/assets/23.png'}
                    alt={'Real-time telecom insights dashboard - mobile view'}
                    width={370}
                    height={400}
                  />
                </div>
              )
            }
            hideSelector
          />
        </div>
      </div>
      <div aria-hidden='true'>
        <Image
          src={'/images/assets/Arrows/4.png'}
          alt=''
          className=' float-animation absolute lg:top-4 lg:left-[16rem] md:top-[9rem] md:left-[12rem] top-[12rem] left-[0rem]'
          width={70}
          aria-hidden='true'
          height={70}
        />
        <Image
          src={'/images/assets/Arrows/2.png'}
          alt=''
          className=' float-animation absolute lg:top-[4rem] lg:right-[15rem] md:top-[10rem] md:right-[12rem] top-[12rem] right-[0rem]'
          width={70}
          aria-hidden='true'
          height={70}
        />
        <Image
          src={'/images/assets/Arrows/3.png'}
          alt=''
          className=' float-animation absolute lg:top-[30rem] lg:right-[14rem] md:top-[37rem] md:right-[10rem] top-[30rem] right-[0rem]'
          width={70}
          aria-hidden='true'
          height={70}
        />
      </div>
    </SectionContainer>
  )
}

export default RealTimeInsightsSection

const CardCustomContent = ({ icon, text }: { icon: string; text: string }) => {
  return (
    <div className='flex items-center gap-2'>
      <span aria-hidden='true' aria-label={text} role='img'>
        {icon}
      </span>
      <Text
        value={text}
        as='p'
        className='text-[1.1rem] md:text-[1.3rem] font-roboto leading-relaxed text-gray-700 dark:text-gray-300'
      />
    </div>
  )
}
