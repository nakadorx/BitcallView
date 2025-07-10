'use server'

import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { Text } from '@/components/common/text'
import { ImageCardList } from '@/components/common/cards/ImageCardList'

export const FastReliableSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  const data = [
    {
      title: t('useCases.cases.business.title'),
      description: t('useCases.cases.business.description'),
      imgSrc: '/images/assets/esimPageAsserts/16.png'
    },
    {
      title: t('useCases.cases.vacation.title'),
      description: t('useCases.cases.vacation.description'),
      imgSrc: '/images/assets/esimPageAsserts/17.png'
    },
    {
      title: t('useCases.cases.hotspot.title'),
      description: t('useCases.cases.hotspot.description'),
      imgSrc: '/images/assets/esimPageAsserts/16.png'
    }
  ]

  return (
    <SectionContainer title={['', t('useCases.title'), t('useCases.title2')]} description={t('useCases.description')}>
      <ImageCardList data={data} />
      <Text
        as='p'
        value={t('useCases.footerText')}
        className='text-center text-[1.03rem] sm:text-[1.4rem] leading-relaxed  mx-auto font-roboto mb-[5rem] mt-[5rem]'
      />
    </SectionContainer>
  )
}
