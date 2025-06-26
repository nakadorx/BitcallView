'use server'

import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { VideoCardList } from '@/components/common/cards/VideoCardList'
import { Text } from '@/components/common/text'

export const FastReliableSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')
  return (
    <SectionContainer title={[t('useCases.title')]} description={t('useCases.description')}>
      <VideoCardList
        data={[
          {
            title: t('useCases.cases.business.title'),
            description: t('useCases.cases.business.description')
          },
          {
            title: t('useCases.cases.vacation.title'),
            description: t('useCases.cases.vacation.description')
          },
          {
            title: t('useCases.cases.hotspot.title'),
            description: t('useCases.cases.hotspot.description')
          }
        ]}
      />
      <Text
        as='p'
        value={t('useCases.footerText')}
        className='text-center text-[1.03rem] sm:text-[1.4rem] leading-relaxed  mx-auto font-roboto mb-[5rem] mt-[5rem]'
      />
    </SectionContainer>
  )
}
