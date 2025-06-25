import { Container, Typography, Box } from '@mui/material'
import VendorAgreementContent from './VendorAgreementContent'
import BreadcrumbsNav, { BreadcrumbItem } from '../BreadcrumbsNav'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

export const metadata = {
  title: 'Vendor Agreement - BitCall LTD',
  description:
    'Read the Vendor Agreement for BitCall LTD, outlining the terms and conditions for all route providers, infrastructure suppliers, and other vendors working with BitCall LTD.'
}

export default async function VendorAgreementPage() {
  const locale = getLocale()
  const t = await getT(locale, 'legal')

  const vendorData = {
    effectiveDate: '04/07/2025',
    lastUpdated: '04/07/2025',
    relationship: {
      independentContractors: t('vendor.relationship.independentContractors'),
      legalCompliance: t('vendor.relationship.legalCompliance')
    },
    provisionOfServices: {
      routeCompliance: t('vendor.provisionOfServices.routeCompliance'),
      greyRoutes: t('vendor.provisionOfServices.greyRoutes')
    },
    warrantiesRepresentations: {
      authority: t('vendor.warrantiesRepresentations.authority'),
      quality: t('vendor.warrantiesRepresentations.quality')
    },
    indemnification: t('vendor.indemnification'),
    dataConfidentiality: {
      businessData: t('vendor.dataConfidentiality.businessData'),
      userData: t('vendor.dataConfidentiality.userData')
    },
    feesPayment: {
      pricing: t('vendor.feesPayment.pricing'),
      paymentTerms: t('vendor.feesPayment.paymentTerms'),
      disputeResolution: t('vendor.feesPayment.disputeResolution')
    },
    termTermination: {
      term: t('vendor.termTermination.term'),
      termination: t('vendor.termTermination.termination'),
      effect: t('vendor.termTermination.effect')
    },
    limitationOfLiability: {
      content: t('vendor.limitationOfLiability.content'),
      cap: t('vendor.limitationOfLiability.cap')
    },
    governingLaw: {
      content: t('vendor.governingLaw.content'),
      disputes: t('vendor.governingLaw.disputes')
    },
    contactInformation: {
      company: 'BitCall LTD',
      companyNumber: '15288134',
      registeredOffice: '124 City Road, London, United Kingdom, EC1V 2NX',
      email: 'vendors@bitcall.io'
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: t('breadcrumbs.home'), href: '/' },
    { label: t('breadcrumbs.legal'), href: '/legal' },
    { label: t('vendor.title') }
  ]

  return (
    <Container maxWidth='md' sx={{ my: 4 }}>
      <Box sx={{ mb: 2 }}>
        <BreadcrumbsNav items={breadcrumbs} />
      </Box>
      <Typography variant='h3' component='h1' gutterBottom>
        {t('vendor.title')}
      </Typography>
      <Typography variant='body1'>
        <strong>{t('vendor.effectiveDateLabel')}:</strong> {vendorData.effectiveDate}
      </Typography>
      <Typography variant='body1' gutterBottom>
        <strong>{t('vendor.lastUpdatedLabel')}:</strong> {vendorData.lastUpdated}
      </Typography>
      <VendorAgreementContent data={vendorData} />
    </Container>
  )
}
