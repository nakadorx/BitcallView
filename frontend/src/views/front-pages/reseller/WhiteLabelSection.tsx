'use server'

// TODO: check if possible refactor for SSR

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
      imageSrc: '/images/assets/ICons/13.png'
    },
    {
      title: t('whiteLabelSection.features.sipAddress.title'),
      description: t('whiteLabelSection.features.sipAddress.description'),
      imageSrc: '/images/assets/ICons/12.png'
    },
    {
      title: t('whiteLabelSection.features.whiteLabeledExperience.title'),
      description: t('whiteLabelSection.features.whiteLabeledExperience.description'),
      imageSrc: '/images/assets/ICons/10.png'
    },
    {
      title: t('whiteLabelSection.features.brandedReports.title'),
      description: t('whiteLabelSection.features.brandedReports.description'),
      imageSrc: '/images/assets/ICons/10.png'
    },
    {
      title: t('whiteLabelSection.features.customTemplates.title'),
      description: t('whiteLabelSection.features.customTemplates.description'),
      imageSrc: '/images/assets/ICons/9.png'
    },
    {
      title: t('whiteLabelSection.features.customTemplates.title'),
      description: t('whiteLabelSection.features.customTemplates.description'),
      imageSrc: '/images/assets/ICons/9.png'
    }
  ]

  return (
    <SectionContainer
      title={[t('whiteLabelSection.title')]}
      description={t('whiteLabelSection.subtitle')}
      bgClass='bg-bleu-2'
      containerClassName='lg:mb-[7rem] lg:mt-[3rem]'
    >
      <div className='w-full mt-4 flex justify-center lg:px-[15rem]'>
        <div className=' w-full text-center'>
          <ul
            role='list'
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-3 justify-items-center lg:max-h-[50rem]'
          >
            {firstRowFeatures.map((feature, index) => (
              <li role='listitem' key={index} className='flex justify-center cursor-pointer'>
                <div className='hover:border-primary hover:border-2 bg-backgroundDefault flex flex-col items-center text-center w-[20rem] p-8 shadow-lg rounded-4xl'>
                  <div className='mb-2 relative w-20 h-20 transition-transform duration-300 ease-in-out cursor-pointer '>
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
