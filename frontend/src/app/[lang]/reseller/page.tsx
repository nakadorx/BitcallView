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
        height: 630,
        alt: 'Bitcall OS Reseller Dashboard - White Label Telecom Solution',
        type: 'image/png'
      },
      {
        url: '/images/assets/21.png',
        width: 1200,
        height: 630,
        alt: 'Fast Setup Telecom Reseller Features',
        type: 'image/png'
      },
      {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/640px-Google_2015_logo.svg.png',
        width: 1200,
        height: 630,
        alt: 'Telecom Reseller Business Growth Opportunities',
        type: 'image/png'
      }
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'United States',
    emails: ['info@bitcall.io'],
    // TODO: add phone numbers
    phoneNumbers: ['+1-800-BITCALL'],
    faxNumbers: ['+1-800-BITCALL'],
    determiner: 'the',
    ttl: 604800,
    audio: [],
    videos: []
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bitcall',
    creator: '@bitcall',
    title: 'Resell & Grow With Bitcall OS | Launch Your Telecom Business',
    description:
      'Launch your own branded telecom business in minutes. White-label VOIP solutions with cheapest calling rates. Start earning recurring revenue today.',
    images: {
      url: '/images/front-pages/landing-pageTest/hero-dashboard-light.png',
      alt: 'Bitcall OS Reseller Dashboard - White Label Telecom Solution',
      width: 1200,
      height: 630
    }
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
      me: ['info@bitcall.io', 'https://bitcall.io'],
      'facebook-domain-verification': 'your-facebook-domain-verification',
      'pinterest-site-verification': 'your-pinterest-verification',
      'msvalidate.01': 'your-bing-verification'
    }
  },
  // Additional social media and SEO meta tags
  other: {
    // X enhanced tags
    'twitter:label1': 'Pricing',
    'twitter:data1': 'Starting from $20/month',
    'twitter:label2': 'Setup Time',
    'twitter:data2': '15 minutes',
    'twitter:app:name:iphone': 'Bitcall',
    'twitter:app:name:ipad': 'Bitcall',
    'twitter:app:name:googleplay': 'Bitcall',
    'twitter:app:id:iphone': '1234567890',
    'twitter:app:id:ipad': '1234567890',
    'twitter:app:id:googleplay': 'com.bitcall.app',
    'twitter:app:url:iphone': 'bitcall://reseller',
    'twitter:app:url:ipad': 'bitcall://reseller',
    'twitter:app:url:googleplay': 'bitcall://reseller',

    // Facebook specific tags
    'fb:app_id': 'your-facebook-app-id',
    'fb:pages': 'your-facebook-page-id',
    'fb:admins': 'your-facebook-admin-id',

    // LinkedIn specific tags
    'linkedin:owner': 'your-linkedin-company-id',

    // Pinterest specific tags
    'pinterest:id': 'your-pinterest-id',
    'pinterest:description': 'Launch your branded telecom business with Bitcall OS white-label solutions',

    // WhatsApp specific tags
    'whatsapp:title': 'Bitcall OS Reseller Program',
    'whatsapp:description': 'Start your telecom business in 15 minutes',
    'whatsapp:image': '/images/front-pages/landing-pageTest/hero-dashboard-light.png',

    // Telegram specific tags
    'telegram:channel': '@bitcall',

    // Rich media tags
    'article:author': 'Bitcall Team',
    'article:publisher': 'https://facebook.com/bitcall',
    'article:section': 'Business Solutions',
    'article:tag': 'telecom, reseller, VOIP, business',
    'article:published_time': new Date().toISOString(),
    'article:modified_time': new Date().toISOString(),

    // Business specific tags
    'business:contact_data:street_address': 'Your Business Address',
    'business:contact_data:locality': 'Your City',
    'business:contact_data:region': 'Your State',
    'business:contact_data:postal_code': 'Your ZIP',
    'business:contact_data:country_name': 'United States',
    'business:contact_data:email': 'info@bitcall.io',
    'business:contact_data:phone_number': '+1-800-BITCALL',
    'business:contact_data:website': 'https://bitcall.io',

    // App links for social sharing
    'al:ios:app_name': 'Bitcall',
    'al:ios:app_store_id': '1234567890',
    'al:android:app_name': 'Bitcall',
    'al:android:package': 'com.bitcall.app',
    'al:web:url': resellerUrl,

    // Price and availability
    'product:price:amount': '20.00',
    'product:price:currency': 'USD',
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:retailer_item_id': 'reseller-program',
    'product:brand': 'Bitcall',
    'product:category': 'Business Software',

    // Rating and review tags
    'rating:value': '4.8',
    'rating:scale': '5',
    'rating:count': '250',

    // Geographic targeting
    'geo.region': 'US',
    'geo.placename': 'United States',
    'geo.position': '39.8283;-98.5795',
    ICBM: '39.8283, -98.5795',

    // Mobile optimization
    'mobile-web-app-capable': 'yes',
    'mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-title': 'Bitcall Reseller',

    // Theme colors for better mobile experience
    'theme-color': '#7367F0',
    'msapplication-TileColor': '#7367F0',
    'msapplication-navbutton-color': '#7367F0',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',

    // Additional SEO tags
    referrer: 'origin-when-cross-origin',
    'format-detection': 'telephone=no',
    skype_toolbar: 'skype_toolbar_parser_compatible',

    // Content freshness
    'revisit-after': '7 days',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),

    // Social proof
    'customer-count': '10000+',
    'countries-served': '150+',
    uptime: '99.9%'
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
