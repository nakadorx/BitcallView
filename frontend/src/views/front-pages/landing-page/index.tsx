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

// Dynamically import non-critical components
const CustomerReviews = dynamic(() => import('./CustomerReviews'), {
  loading: () => <p>Loading customer reviews...</p>,
  ssr: false
})
// TODO: check here

const FAQSection = dynamic(() => import('./faq/FAQSection'), {
  loading: () => <p>Loading FAQ...</p>,
  ssr: false
})

const LandingPageWrapper = () => {
  return (
    <>
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
    </>
  )
}

export default LandingPageWrapper
