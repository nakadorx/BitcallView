'use client'

// Component Imports
import HeroSection from './HeroSection'
import TrustSection from './TrustSection'
import Advantages from './Advantages'
import Benefits from './Benefits'
import WhyChoose from './WhyChoose'
import AllInOne from './AllInOne'
import CallToAction from './CallToAction'
import Rates from './rates/Rates'
import ContactUs from './ContactUs'
import dynamic from 'next/dynamic'
import Spinner from '@/components/common/spinner'
import { Suspense } from 'react'

// Dynamically import non-critical components
const CustomerReviews = dynamic(() => import('./CustomerReviews'), {
  loading: () => <p>Loading customer reviews...</p>,
  ssr: false
})

const FAQSection = dynamic(() => import('./faq/FAQSection'), {
  loading: () => <p>Loading FAQ...</p>,
  ssr: false
})

const LandingPageWrapper = () => {
  return (
    <main>
      <Suspense fallback={<Spinner />}>
        <HeroSection />
        <TrustSection />
        <Advantages />
        <Benefits />
        <WhyChoose />
        <AllInOne />
        <CallToAction />
        <Rates />
        <CustomerReviews />
        <FAQSection />
        <ContactUs />
      </Suspense>
    </main>
  )
}

export default LandingPageWrapper
