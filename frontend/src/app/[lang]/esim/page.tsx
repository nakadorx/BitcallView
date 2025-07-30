import Head from 'next/head'
import dynamic from 'next/dynamic'

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://bitcall.io'
const esimUrl = `${siteBaseUrl}/en/esim`

// Dynamically load the client-side eSIM component from the correct path
const EsimClient = dynamic(() => import('@/views/front-pages/landing-page/esim/Esim'), { ssr: false })

// Component for JSON‑LD Structured Data for the eSIM page
const EsimStructuredData = () => {
  const esimSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'eSIM Data & Calling Plans for Travellers',
    description: 'Explore local, regional, and global eSIM plans designed for travellers to stay connected instantly.',
    url: esimUrl
  }

  // If you have specific eSIM plan details to mark up as Product/Offer,
  // you could add more objects to this graph.
  const aggregatedSchema = {
    '@context': 'https://schema.org',
    '@graph': [esimSchema]
  }

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregatedSchema) }} />
}

export default function EsimPage() {
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>eSIM Data & Calling Plans for Travellers | Bitcall</title>
        <meta
          name='description'
          content='Explore local, regional, and global eSIM plans designed for travellers to stay connected instantly.'
        />
        <link rel='canonical' href={esimUrl} />

        {/* Open Graph Meta Tags */}
        <meta property='og:title' content='eSIM Data & Calling Plans for Travellers | Bitcall' />
        <meta
          property='og:description'
          content='Explore local, regional, and global eSIM plans designed for travellers to stay connected instantly.'
        />
        <meta property='og:url' content={esimUrl} />
        <meta property='og:type' content='website' />

        {/* Twitter Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='eSIM Data & Calling Plans for Travellers | Bitcall' />
        <meta
          name='twitter:description'
          content='Explore local, regional, and global eSIM plans designed for travellers to stay connected instantly.'
        />
      </Head>

      {/* JSON‑LD Structured Data */}
      <EsimStructuredData />

      {/* Render the interactive eSIM component */}
      <EsimClient />
    </>
  )
}
