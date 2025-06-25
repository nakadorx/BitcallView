import { Container, Typography, Box } from '@mui/material'
import TermsContent from './TermsContent'
import BreadcrumbsNav, { BreadcrumbItem } from '../BreadcrumbsNav'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

export const metadata = {
  title: 'Terms of Service - BitCall LTD',
  description:
    'Read the Terms of Service for BitCall LTD, including details on our scope of services, user responsibilities, billing practices, and more.'
}

export default async function TermsPage() {
  const locale = getLocale()
  const t = await getT(locale, 'legal')

  const termsData = {
    effectiveDate: '04/07/2025',
    lastUpdated: '04/07/2025',
    introduction: {
      company: 'BitCall LTD',
      companyNumber: '15288134',
      registeredOffice: '124 City Road, London, United Kingdom, EC1V 2NX',
      description: t('terms.introduction.description')
    },
    scopeOfServices: t('terms.scopeOfServices', { returnObjects: true }),
    userResponsibilities: t('terms.userResponsibilities', { returnObjects: true }),
    paymentAndBilling: t('terms.paymentAndBilling', { returnObjects: true }),
    dataStorageRetention: {
      cdrs: t('terms.dataStorageRetention.cdrs'),
      deletion: t('terms.dataStorageRetention.deletion')
    },
    intellectualProperty: t('terms.intellectualProperty'),
    disclaimerOfWarranties: t('terms.disclaimerOfWarranties'),
    limitationOfLiability: {
      content: t('terms.limitationOfLiability.content'),
      cap: t('terms.limitationOfLiability.cap')
    },
    indemnification: t('terms.indemnification'),
    termination: {
      byUser: t('terms.termination.byUser'),
      byUs: t('terms.termination.byUs'),
      effects: t('terms.termination.effects')
    },
    governingLaw: {
      content: t('terms.governingLaw.content'),
      disputeResolution: t('terms.governingLaw.disputeResolution')
    },
    changesToTerms: t('terms.changesToTerms'),
    contactInformation: {
      company: 'BitCall LTD',
      companyNumber: '15288134',
      registeredOffice: '124 City Road, London, United Kingdom, EC1V 2NX',
      email: 'support@bitcall.io'
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('breadcrumbs.home'), href: '/' },
    { label: t('breadcrumbs.legal'), href: '/legal' },
    { label: t('terms.title') }
  ]

  return (
    <Container maxWidth='md' sx={{ my: 4 }}>
      <Box sx={{ mb: 2 }}>
        <BreadcrumbsNav items={breadcrumbs} />
      </Box>
      <Typography variant='h3' component='h1' gutterBottom>
        {t('terms.title')}
      </Typography>
      <Typography variant='body1'>
        <strong>{t('terms.effectiveDateLabel')}:</strong> {termsData.effectiveDate}
      </Typography>
      <Typography variant='body1' gutterBottom>
        <strong>{t('terms.lastUpdatedLabel')}:</strong> {termsData.lastUpdated}
      </Typography>
      <TermsContent data={termsData} />
    </Container>
  )
}
