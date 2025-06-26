'use server'
import React from 'react'
import WhyChoseBitCallSection from './WhyChoseBitCallSection'
import BitcallDataSection from './BitcallDataSection'
import EasyStepsSection from './EasyStepsSection'
import { FastReliableSection } from './FastReliableSection'
import ForWhomSection from './ForWhomSection'

const EsimSection = async () => {
  return (
    <div className='pt-10'>
      <WhyChoseBitCallSection />
      <BitcallDataSection />
      <EasyStepsSection />
      <FastReliableSection />
      <ForWhomSection />
    </div>
  )
}

export default EsimSection
