import { Container, Typography, Box } from '@mui/material'
import PrivacyContent from './PrivacyContent'
import BreadcrumbsNav, { BreadcrumbItem } from '../BreadcrumbsNav'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

export const metadata = {
  title: 'Privacy Policy - BitCall LTD',
  description: 'Read the Privacy Policy for BitCall LTD...'
}

export default async function PrivacyPage() {
  const locale = getLocale()
  const t = await getT(locale, 'legal')

  const scopeDetails = t('privacy.scope.details', { returnObjects: true })
  const scopeArray = Array.isArray(scopeDetails) ? scopeDetails : [String(scopeDetails)]

  const privacyData = {
    effectiveDate: '04/07/2025',
    lastUpdated: '04/07/2025',
    scope: {
      details: scopeArray
    },
    dataWeCollect: {
      accountInformation: t('privacy.dataWeCollect.accountInformation'),
      usageData: t('privacy.dataWeCollect.usageData'),
      technicalData: t('privacy.dataWeCollect.technicalData')
    },
    howWeUseData: {
      serviceProvision: t('privacy.howWeUseData.serviceProvision'),
      accountManagement: t('privacy.howWeUseData.accountManagement'),
      legalCompliance: t('privacy.howWeUseData.legalCompliance')
    },
    retentionDeletion: {
      cdrRetention: t('privacy.retentionDeletion.cdrRetention'),
      noCallAudio: t('privacy.retentionDeletion.noCallAudio'),
      accountDeletion: t('privacy.retentionDeletion.accountDeletion')
    },
    sharingData: {
      serviceProviders: t('privacy.sharingData.serviceProviders'),
      legalRequirements: t('privacy.sharingData.legalRequirements')
    },
    cookiesTracking: t('privacy.cookiesTracking'),
    dataSecurity: t('privacy.dataSecurity'),
    yourRights: t('privacy.yourRights'),
    updates: t('privacy.updates'),
    contactInformation: {
      company: 'BitCall LTD',
      companyNumber: '15288134',
      registeredOffice: '124 City Road, London, United Kingdom, EC1V 2NX',
      email: 'privacy@bitcall.io'
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('breadcrumbs.home'), href: '/' },
    { label: t('breadcrumbs.legal'), href: '/legal' },
    { label: t('privacy.title') }
  ]

  return (
    <Container maxWidth='md' sx={{ my: 4 }}>
      <Box sx={{ mb: 2 }}>
        <BreadcrumbsNav items={breadcrumbs} />
      </Box>
      <Typography variant='h3' component='h1' gutterBottom>
        {t('privacy.title')}
      </Typography>
      <Typography variant='body1'>
        <strong>{t('privacy.effectiveDateLabel')}:</strong> {privacyData.effectiveDate}
      </Typography>
      <Typography variant='body1' gutterBottom>
        <strong>{t('privacy.lastUpdatedLabel')}:</strong> {privacyData.lastUpdated}
      </Typography>
      <PrivacyContent data={privacyData} />
    </Container>
  )
}
