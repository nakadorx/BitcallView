import ResellerWrapper from '@views/front-pages/reseller'
import { Metadata } from 'next'

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_BASE_URL || 'https://bitcall.io'
const resellerUrl = `${siteBaseUrl}/reseller`

export const metadata: Metadata = {
  title: 'Resell & Grow With Bitcall OS | Launch Your Telecom Business in Minutes',
  description:
    'Launch your own branded telecom business in minutes with Bitcall OS. Get white-label VOIP solutions, cheapest calling rates, one-click provisioning, and complete reseller control. Start earning recurring revenue today.',
  keywords: [
    'telecom reseller program',
    'white label VOIP',
    'branded telecom business',
    'VOIP reseller',
    'cheapest calling rates',
    'telecom business opportunity',
    'white label communication',
    'reseller dashboard',
    'telecom partnership',
    'business VOIP solutions',
    'SIP reseller',
    'communication reseller',
    'telecom franchise'
  ],
  authors: [{ name: 'Bitcall' }],
  creator: 'Bitcall',
  publisher: 'Bitcall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(siteBaseUrl),
  alternates: {
    canonical: '/reseller',
    languages: {
      'en-US': '/en/reseller',
      'fr-FR': '/fr/reseller',
      'ar-SA': '/ar/reseller'
    }
  },
  openGraph: {
    title: 'Resell & Grow With Bitcall OS | Launch Your Telecom Business',
    description:
      'Launch your own branded telecom business in minutes. White-label VOIP solutions with the cheapest calling rates. One-click provisioning, complete control, recurring revenue.',
    url: resellerUrl,
    siteName: 'Bitcall',
    images: [
      {
        url: '/images/front-pages/landing-pageTest/hero-dashboard-light.png',
        width: 1200,
        height: 800,
        alt: 'Bitcall OS Reseller Dashboard - White Label Telecom Solution'
      },
      {
        url: '/images/assets/21.png',
        width: 550,
        height: 500,
        alt: 'Fast Setup Telecom Reseller Features'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resell & Grow With Bitcall OS | Launch Your Telecom Business',
    description:
      'Launch your own branded telecom business in minutes. White-label VOIP solutions with cheapest calling rates. Start earning recurring revenue today.',
    images: ['/images/front-pages/landing-pageTest/hero-dashboard-light.png'],
    creator: '@bitcall'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      me: ['your-email@domain.com', 'https://bitcall.io']
    }
  }
}

// JSON-LD Structured Data for SEO
const jsonLdSchemas = [
  // Service Schema
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Bitcall OS Reseller Program',
    description:
      'Launch your own branded telecom business with white-label VOIP solutions, cheapest calling rates, and complete reseller control.',
    provider: {
      '@type': 'Organization',
      name: 'Bitcall',
      url: 'https://bitcall.io',
      logo: 'https://bitcall.io/logo.png'
    },
    serviceType: 'Telecom Reseller Program',
    areaServed: 'Worldwide',
    url: resellerUrl,
    offers: {
      '@type': 'Offer',
      name: 'Telecom Reseller Plans',
      description: 'White-label telecom solutions with pricing starting from $20/month',
      priceRange: '$20-$99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      seller: {
        '@type': 'Organization',
        name: 'Bitcall'
      }
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Reseller Plans',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Basic Plan',
          price: '20',
          priceCurrency: 'USD',
          description: 'Perfect for getting started with telecom reselling'
        },
        {
          '@type': 'Offer',
          name: 'Favourite Plan',
          price: '51',
          priceCurrency: 'USD',
          description: 'Most popular plan with advanced features'
        },
        {
          '@type': 'Offer',
          name: 'Standard Plan',
          price: '99',
          priceCurrency: 'USD',
          description: 'Enterprise-grade features for serious resellers'
        }
      ]
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': resellerUrl
    }
  },
  // FAQ Schema
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How quickly can I start reselling telecom services with Bitcall?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can start selling telecom services in just 15 minutes with our one-click provisioning system. No hardware is required, and you can accept payments via Credit Card, PayPal, or Crypto immediately.'
        }
      },
      {
        '@type': 'Question',
        name: 'What does white-label mean for my telecom business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'White-label means your clients will never see our branding. You get your own branded portal access, custom login domain, SIP address (e.g., calls.yourcompany.com), and all communications appear under your brand.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the pricing plans for resellers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer three reseller plans: Basic Plan at $20/month, Favourite Plan at $51/month (most popular), and Standard Plan at $99/month. All plans include 10% discount for yearly subscriptions and no long-term contracts.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need technical expertise to become a reseller?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No technical expertise required! Our platform provides one-click provisioning, works with existing softphones or desk phones, and includes comprehensive real-time dashboards and reporting tools.'
        }
      }
    ]
  },
  // Breadcrumb Schema
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteBaseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Reseller Program',
        item: resellerUrl
      }
    ]
  }
]

export default function ResellerPage() {
  return (
    <>
      {jsonLdSchemas.map((schema, index) => (
        <script key={index} type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ResellerWrapper />
    </>
  )
}
