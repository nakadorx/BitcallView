'use server'
import React, { Suspense } from 'react'
import WhyChoseBitCallSection from './WhyChoseBitCallSection'
import BitcallDataSection from './BitcallDataSection'
import EasyStepsSection from './EasyStepsSection'
import { FastReliableSection } from './FastReliableSection'
import ForWhomSection from './ForWhomSection'
import FlexiblePlansSection from './FlexiblePlansSection'
import { ReadyToConnectSection } from './ReadyToConnectSection'
import CustomerReviewsEsim from './CustmerReviewsEsim'
import { HeroSection } from '@/components/common/heroSection/HeroSection'
import { getT } from '@/i18n/server'
import { BuyEsimTool } from './buyEsimTool'
import Loader from '@/components/common/loader'

const EsimSection = async ({ lang }: { lang: string }) => {
  const t = await getT(lang, 'esim')

  return (
    <Suspense fallback={<Loader />}>
      <div className='pt-10'>
        <HeroSection
          title={['', t('hero.title1'), t('hero.title2'), t('hero.title3')]}
          description={t('hero.subtitle')}
          bgSection='bg-sectionEsim-1'
        >
          <BuyEsimTool lang={lang} />
        </HeroSection>
        <WhyChoseBitCallSection  lang={lang}/>
        <BitcallDataSection lang={lang} />
        <EasyStepsSection lang={lang} />
        <FastReliableSection lang={lang} />
        <ForWhomSection lang={lang} />
        <FlexiblePlansSection lang={lang} />
        <CustomerReviewsEsim  lang={lang} />
        <ReadyToConnectSection lang={lang} />
      </div>
    </Suspense>
  )
}

export default EsimSection
