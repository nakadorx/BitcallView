'use server'

import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { Text } from '@/components/common/text'
import Image from 'next/image'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

export const WhiteLabelSection = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'resellerPage')

  const firstRowFeatures = [
    {
      title: t('whiteLabelSection.features.portalAccess.title'),
      description: t('whiteLabelSection.features.portalAccess.description'),
      imageSrc: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184309/13_rf3d1o.png'
    },
    {
      title: t('whiteLabelSection.features.sipAddress.title'),
      description: t('whiteLabelSection.features.sipAddress.description'),
      imageSrc: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184309/12_a2txs2.png'
    },
    {
      title: t('whiteLabelSection.features.whiteLabeledExperience.title'),
      description: t('whiteLabelSection.features.whiteLabeledExperience.description'),
      imageSrc: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184309/10_n2dzhz.png'
    },
    {
      title: t('whiteLabelSection.features.brandedReports.title'),
      description: t('whiteLabelSection.features.brandedReports.description'),
      imageSrc: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184309/10_n2dzhz.png'
    },
    {
      title: t('whiteLabelSection.features.customTemplates.title'),
      description: t('whiteLabelSection.features.customTemplates.description'),
      imageSrc: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184309/9_rvv5ka.png'
    },
    {
      title: t('whiteLabelSection.features.customTemplates.title'),
      description: t('whiteLabelSection.features.customTemplates.description'),
      imageSrc: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184309/9_rvv5ka.png'
    }
  ]

  return (
    <SectionContainer
      title={[t('whiteLabelSection.title1'), t('whiteLabelSection.title2')]}
      description={t('whiteLabelSection.subtitle')}
      bgClass='control-label-bg'
      containerClassName='lg:mb-[7rem] lg:mt-[3rem] '
    >
      <div className='w-full mt-4 flex justify-center lg:px-[17rem]'>
        <div className=' w-full text-center'>
          <ul role='list' className='flex flex-wrap justify-center lg:gap-[4rem] mb-3'>
            {firstRowFeatures.map((feature, index) => (
              <li
                role='listitem'
                key={index}
                className='flex justify-center cursor-pointer w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] max-w-[20rem]'
              >
                <div
                  className='hover:border-primary hover:border-2
                  lg:bg-backgroundDefault flex flex-col items-center text-center
                  w-full h-[15rem] p-8 lg:shadow-lg rounded-4xl
                   transition-all duration-300'
                >
                  <div
                    className='mb-2 relative
                  w-10 lg:w-20 h-10 lg:h-20
                  transition-transform duration-300 ease-in-out cursor-pointer '
                  >
                    <Image
                      src={feature.imageSrc}
                      alt={feature.title}
                      fill
                      className='object-contain'
                      aria-hidden='true'
                    />
                  </div>
                  <Text as='h3' className='text-lg font-semibold mb-2' value={feature.title} />
                  <Text className='text-sm' textColor='textSecondary' value={feature.description} />
                </div>
              </li>
            ))}
          </ul>
          <Text
            className='bg-backgroundPaper rounded-[20px] shadow-lg inline-block py-4 px-8 italic text-center  mt-10'
            textColor='textSecondary'
            value={t('whiteLabelSection.footerNote')}
          />
        </div>
      </div>
    </SectionContainer>
  )
}
