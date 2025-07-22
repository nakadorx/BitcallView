// server
import Head from 'next/head'
import Faqs from './Faqs'
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What VoIP services does BitCall offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We cover A-Z termination, outbound call center routes, CLI/NCLI routes, and inbound virtual numbers.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does BitCall ensure the quality of its VoIP calls?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We employ advanced routing algorithms and network monitoring to maintain high call quality and minimal latency.'
      }
    },
    {
      '@type': 'Question',
      name: 'What are the benefits of using BitCall’s reseller panel?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our reseller panel offers competitive wholesale rates, a user-friendly interface, and flexible pricing options for your business.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can BitCall support international calling?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our services include global termination routes, making international calling simple and cost-effective.'
      }
    },
    {
      '@type': 'Question',
      name: 'What payment methods are accepted by BitCall?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept various payment methods including Visa, Mastercard, BTC, USDT, ETH, SOL, and BNB.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I get started with BitCall?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply sign up, add your IPs, and make a test payment starting from just $1 to explore our services.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is BitCall’s communication secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We use state-of-the-art encryption and security protocols to protect your data and communications.'
      }
    }
  ]
}

export default function FAQSection() {
  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Faqs />
    </>
  )
}
