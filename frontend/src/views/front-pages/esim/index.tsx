'use server'
import React from 'react'
import WhyChoseBitCallSection from './WhyChoseBitCallSection'
import BitcallDataSection from './BitcallDataSection'
import EasyStepsSection from './EasyStepsSection'
import { FastReliableSection } from './FastReliableSection'
import ForWhomSection from './ForWhomSection'
import FlexiblePlansSection from './FlexiblePlansSection'
import { ReadyToConnectSection } from './ReadyToConnectSection'
import CustomerReviewsEsim from './CustmerReviewsEsim'
import { HeroSection } from '@/components/common/heroSection/HeroSection'
import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'
import { BuyEsimTool } from './buyEsimTool'

const EsimSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  return (
    <div className='pt-10'>
      <HeroSection title={[t('hero.title')]} description={t('hero.subtitle')}>
        <BuyEsimTool />
      </HeroSection>
      {/* <WhyChoseBitCallSection /> */}
      <BitcallDataSection />
      <EasyStepsSection />
      <FastReliableSection />
      <ForWhomSection />
      <FlexiblePlansSection />
      <CustomerReviewsEsim />
      <ReadyToConnectSection />
    </div>
  )
}

export default EsimSection
