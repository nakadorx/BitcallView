'use server'

import { HeroSection } from '@/components/common/heroSection/HeroSection'

import WhosUseThisSection from './WhosUseThisSection'
import { EverythingYouNeedSection } from './EverythingYouNeedSection'

import { FastSetup } from './FastSetupSection'
import { WhiteLabelSection } from './WhiteLabelSection'
import { HeroSectionParallaxContent } from './HeroSectionParallaxContent'
import RealTimeInsightsSection from './RealTimeInsightsSection'
import CustomerReviews from '@/components/common/customerReviews/CustomerReviews'
import PricingSection from './PricingSection'
import dynamic from 'next/dynamic'
import ContactUs from '@/components/common/contactUs'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'
import { getCurrentTheme } from '@/utils/theme'
import { headers } from 'next/headers'
import { Mode } from '@core/types'

import Faqs from '@/components/common/faq/Faqs'

const ResellerWrapper = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'resellerPage')
  const headersList = headers()
  const mode = getCurrentTheme(headersList.get('cookie') || undefined) as Mode

  console.log('mod:  ', mode)

  return (
    <main>
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
        <HeroSectionParallaxContent mode={mode} />
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
    </main>
  )
}

export default ResellerWrapper
