import Head from 'next/head'
import ResellerWrapper from '@views/front-pages/reseller'
import { PrimaryColorNames } from '@/configs/primaryColorConfig'
import { HandlePrimaryColorWrapper } from '@/components/common/handlePrimaryColorWrapper'
const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://bitcall.io'
const resellerUrl = `${siteBaseUrl}/en/reseller`

export default function ResellerPage() {
  // todo udpate meta
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Become a Reseller | Bitcall</title>
        <meta
          name='description'
          content="Join Bitcall's reseller program and empower your business with our cutting-edge global communication solutions."
        />
        <link rel='canonical' href={resellerUrl} />

        {/* Open Graph Meta Tags */}
        <meta property='og:title' content='Become a Reseller | Bitcall' />
        <meta
          property='og:description'
          content="Join Bitcall's reseller program and empower your business with our cutting-edge global communication solutions."
        />
        <meta property='og:url' content={resellerUrl} />
        <meta property='og:type' content='website' />

        {/* Twitter Meta Tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Become a Reseller | Bitcall' />
        <meta
          name='twitter:description'
          content="Join Bitcall's reseller program and empower your business with our cutting-edge global communication solutions."
        />

        {/* (Optional) JSON‑LD Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Become a Reseller | Bitcall',
              description:
                "Join Bitcall's reseller program and empower your business with our cutting-edge global communication solutions.",
              url: resellerUrl
            })
          }}
        />
      </Head>
      <ResellerWrapper />
    </>
  )
}
