import Head from 'next/head'
import CountryListInteractive from './CountryListInteractive'
import { countryList } from '@/data/countries'

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://bitcall.io'
const ratesUrl = `${siteBaseUrl}/rates`

export default function RatesPage(props) {
  return (
    <>
      <Head>
        <title>Check Rates Per Country | Bitcall</title>
        <meta
          name='description'
          content='Browse calling and data rates for various countries. Find your best eSIM plan and compare international rates easily.'
        />
        <link rel='canonical' href={ratesUrl} />

        {/* Open Graph Meta Tags */}
        <meta property='og:title' content='Check Rates Per Country | Bitcall' />
        <meta
          property='og:description'
          content='Browse calling and data rates for various countries. Find your best eSIM plan and compare international rates easily.'
        />
        <meta property='og:url' content={ratesUrl} />
        <meta property='og:type' content='website' />

        {/* Twitter Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Check Rates Per Country | Bitcall' />
        <meta
          name='twitter:description'
          content='Browse calling and data rates for various countries. Find your best eSIM plan and compare international rates easily.'
        />

        {/* (Optional) JSON‑LD Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Check Rates Per Country | Bitcall',
              description:
                'Browse calling and data rates for various countries. Find your best eSIM plan and compare international rates easily.',
              url: ratesUrl
            })
          }}
        />
      </Head>
      <main className='min-h-screen'>
        <h1 className='text-center py-10'>List Of All Countries</h1>
        {/* Pass the pre-fetched countryList to your interactive component */}
        <CountryListInteractive countries={countryList} />
      </main>
    </>
  )
}
