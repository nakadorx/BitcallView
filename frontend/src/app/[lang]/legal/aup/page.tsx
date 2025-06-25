import { Container, Typography, Box } from '@mui/material'
import AupContent from './AupContent'
import BreadcrumbsNav, { BreadcrumbItem } from '../BreadcrumbsNav'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

export const metadata = {
  title: 'Acceptable Use Policy - BitCall LTD',
  description:
    'Review the Acceptable Use Policy for BitCall LTD, outlining the standards and prohibited activities for using our services.'
}

export default async function AupPage() {
  const locale = getLocale()
  const t = await getT(locale, 'legal')

  const aupData = {
    effectiveDate: '04/07/2025',
    lastUpdated: '04/07/2025',
    purpose: t('aup.purpose'),
    prohibitedActivities: [
      {
        title: t('aup.activities.violateLaws.title'),
        content: t('aup.activities.violateLaws.content')
      },
      {
        title: t('aup.activities.spam.title'),
        content: t('aup.activities.spam.content')
      },
      {
        title: t('aup.activities.fraud.title'),
        content: t('aup.activities.fraud.content')
      },
      {
        title: t('aup.activities.networkAbuse.title'),
        content: t('aup.activities.networkAbuse.content')
      },
      {
        title: t('aup.activities.offensiveContent.title'),
        content: t('aup.activities.offensiveContent.content')
      }
    ],
    responsibilities: [
      {
        title: t('aup.responsibilities.security.title'),
        content: t('aup.responsibilities.security.content')
      },
      {
        title: t('aup.responsibilities.monitoring.title'),
        content: t('aup.responsibilities.monitoring.content')
      },
      {
        title: t('aup.responsibilities.compliance.title'),
        content: t('aup.responsibilities.compliance.content')
      },
      {
        title: t('aup.responsibilities.vendor.title'),
        content: t('aup.responsibilities.vendor.content')
      }
    ],
    enforcement: t('aup.enforcement'),
    liability: t('aup.liability'),
    changes: t('aup.changes'),
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
    { label: t('aup.title') }
  ]

  return (
    <Container maxWidth='md' sx={{ my: 4 }}>
      <Box sx={{ mb: 2 }}>
        <BreadcrumbsNav items={breadcrumbs} />
      </Box>
      <Typography variant='h3' component='h1' gutterBottom>
        {t('aup.title')}
      </Typography>
      <Typography variant='body1'>
        <strong>{t('aup.effectiveDateLabel')}:</strong> {aupData.effectiveDate}
      </Typography>
      <Typography variant='body1' gutterBottom>
        <strong>{t('aup.lastUpdatedLabel')}:</strong> {aupData.lastUpdated}
      </Typography>
      <AupContent data={aupData} />
    </Container>
  )
}
