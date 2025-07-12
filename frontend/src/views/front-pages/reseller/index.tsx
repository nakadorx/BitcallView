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
import { getLocale } from '@/utils/commons'
import Faqs from '@/components/common/faq/Faqs'
import { Suspense } from 'react'
import Loader from '@/components/common/loader'
import dynamic from 'next/dynamic'
import Spinner from '@/components/common/spinner'
import { Skeleton } from '@mui/material'

import { HeroSectionParallaxContent } from './HeroSectionParallaxContent'
import WhosUseThisSection from './WhosUseThisSection'

const ResellerWrapper = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'resellerPage')

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
        <WhosUseThisSection />
        <EverythingYouNeedSection />
        <FastSetup />
        <WhiteLabelSection />
        <RealTimeInsightsSection />
        <CustomerReviews />
        <PricingSection />
        <Faqs />
        <ContactUs />
      </Suspense>
    </main>
  )
}

export default ResellerWrapper
