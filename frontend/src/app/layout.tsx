import { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcall.io'

export const metadata: Metadata = {
  title: 'Bitcall - The All-in-One Global Communication Hub',
  description: 'Activate Bitcall on any device for simple, efficient, and cost-effective global communication.',
  openGraph: {
    title: 'Bitcall - The All-in-One Global Communication Hub',
    description: 'Activate Bitcall on any device for simple, efficient, and cost-effective global communication.',
    url: baseUrl,
    siteName: 'Bitcall',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcall - The All-in-One Global Communication Hub',
    description: 'Activate Bitcall on any device for simple, efficient, and cost-effective global communication.'
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html id='__next' lang='en' dir='ltr'>
      <head>
        {/* Preload critical fonts */}
        <link rel='preload' href='/fonts/OpenSans-Regular.ttf' as='font' type='font/ttf' crossOrigin='anonymous' />
        <link rel='preload' href='/fonts/OpenSans-Bold.ttf' as='font' type='font/ttf' crossOrigin='anonymous' />
        <link rel='preload' href='/fonts/OpenSans-SemiBold.ttf' as='font' type='font/ttf' crossOrigin='anonymous' />
        <link rel='preload' href='/fonts/Roboto-Regular.ttf' as='font' type='font/ttf' crossOrigin='anonymous' />

        {/* Favicons */}
        <link rel='icon' href='/favicon.ico' sizes='any' />
        {/* <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' /> */}

        {/* JSON-LD Structured Data */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Bitcall LTD',
              url: baseUrl,
              logo: `${baseUrl}/images/logos/bitcall-logo.png`,
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+33756990982',
                  contactType: 'customer support',
                  email: 'contact@bitcall.io'
                }
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Bitcall 124 City Road',
                addressLocality: 'London',
                postalCode: 'EC1V 2NX',
                addressCountry: 'UK'
              },
              identifier: {
                '@type': 'PropertyValue',
                name: 'Registration',
                value: '15288134'
              },
              sameAs: ['https://www.facebook.com/bitcall', 'https://twitter.com/bitcall']
            })
          }}
        />
      </head>

      <body className='flex is-full min-bs-full flex-auto flex-col'>
        {/* Google Analytics */}
        <Script src='https://www.googletagmanager.com/gtag/js?id=G-PS12HYRC5Y' strategy='afterInteractive' />
        <Script
          id='gtag-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PS12HYRC5Y', {
                page_path: window.location.pathname,
              });
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getTheme() {
                  if (typeof localStorage !== 'undefined') {
                    const theme = localStorage.getItem('bitcall-mui-template-mode');
                    if (theme) return theme;
                  }
               
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
                }
                const theme = getTheme();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
            
              })();
            `
          }}
        />

        {children}
      </body>
    </html>
  )
}
