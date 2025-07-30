'use server'

import { HeroSection } from '@/components/common/heroSection/HeroSection'
import { EverythingYouNeedSection } from './EverythingYouNeedSection'
import { FastSetup } from './FastSetupSection'
import { WhiteLabelSection } from './WhiteLabelSection'
import RealTimeInsightsSection from './RealTimeInsightsSection'
import CustomerReviews from '@/components/common/customerReviews/CustomerReviews'
import PricingSection from './PricingSection'
import ContactUs from '@/components/common/contactUs'
import { getT } from '@/i18n/server'
import Faqs from '@/components/common/faq/Faqs'
import { Suspense } from 'react'
import Loader from '@/components/common/loader'

import { HeroSectionParallaxContent } from './HeroSectionParallaxContent'
import WhosUseThisSection from './WhosUseThisSection'

const ResellerWrapper = async ({ lang }: { lang: string }) => {
  const t = await getT(lang, 'resellerPage')

  return (
    <main>
      <Suspense fallback={<Loader />}>
        <HeroSection
          title={[t('heroSection.title1'), t('heroSection.title2')]}
          description={t('heroSection.description')}
          buttons={[
            {
              label: t('heroSection.mainButton'),
              variant: 'contained' as const,
              color: 'primary' as const
            }
          ]}
        >
          <HeroSectionParallaxContent />
        </HeroSection>
        <WhosUseThisSection lang={lang} />
        <EverythingYouNeedSection lang={lang} />
        <FastSetup lang={lang} />
        <WhiteLabelSection lang={lang} />
        <RealTimeInsightsSection />
        <PricingSection lang={lang} />
        <CustomerReviews />
        <Faqs />
        <ContactUs />
      </Suspense>
    </main>
  )
}

export default ResellerWrapper
