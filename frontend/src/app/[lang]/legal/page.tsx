import { getLocale } from '@/utils/commons'
import LegalHubClient from './LegalHubClient'

export const metadata = {
  title: 'Legal Documents - BitCall LTD',
  description:
    'Access all legal documents for BitCall LTD including our Terms of Service, Acceptable Use Policy, Privacy Policy, and Vendor Agreement.'
}

export default function LegalHubPage() {
  const locale = getLocale()
  return <LegalHubClient locale={locale} />
}
