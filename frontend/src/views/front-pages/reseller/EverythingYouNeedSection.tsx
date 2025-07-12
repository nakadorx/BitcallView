'use server'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'

import { VideoCardList } from '@/components/common/cards/VideoCardList'
import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'

export const EverythingYouNeedSection = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'common')
  const tReseller = await getT(locale, 'resellerPage')

  const data = [0, 1, 2, 3].map(i => ({
    title: t(`advantages.items.${i}.title`),
    description: t(`advantages.items.${i}.description`),
    video: `/images/front-pages/landing-page/${i === 0 ? 'accelerate-with-ai-2x-compressed' : i}.mp4`
  }))

  return (
    <SectionContainer
      title={[tReseller('everythingYouNeedSection.title1'), tReseller('everythingYouNeedSection.title2')]}
      description={tReseller('everythingYouNeedSection.description')}
      containerClassName='min-h-[54rem] xs:min-h-[100rem] lg:px-10'
      bgClass='everything-you-need-bg'
    >
      <VideoCardList data={data} withContent />
    </SectionContainer>
  )
}
