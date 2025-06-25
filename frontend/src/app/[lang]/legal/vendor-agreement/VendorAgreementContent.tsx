'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import TOC, { TOCItem } from '../TOC'
import { useT } from '@/i18n/client'

interface VendorAgreementContentProps {
  data: any
}

export default function VendorAgreementContent({ data }: VendorAgreementContentProps) {
  const { t } = useT('legal')

  const tocItems: TOCItem[] = [
    { id: 'relationship', label: t('vendor.toc.relationship') },
    { id: 'provision-of-services', label: t('vendor.toc.provision') },
    { id: 'warranties-representations', label: t('vendor.toc.warranties') },
    { id: 'indemnification', label: t('vendor.toc.indemnification') },
    { id: 'data-confidentiality', label: t('vendor.toc.confidentiality') },
    { id: 'fees-payment', label: t('vendor.toc.fees') },
    { id: 'term-termination', label: t('vendor.toc.termination') },
    { id: 'limitation-of-liability', label: t('vendor.toc.liability') },
    { id: 'governing-law', label: t('vendor.toc.law') },
    { id: 'contact-information', label: t('vendor.toc.contact') }
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '250px' } }}>
          <TOC items={tocItems} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Section id='relationship' title={tocItems[0].label}>
            <strong>{t('vendor.labels.independent')}:</strong> {data.relationship.independentContractors}
            <br />
            <strong>{t('vendor.labels.compliance')}:</strong> {data.relationship.legalCompliance}
          </Section>

          <Section id='provision-of-services' title={tocItems[1].label}>
            <strong>{t('vendor.labels.route')}:</strong> {data.provisionOfServices.routeCompliance}
            <br />
            <strong>{t('vendor.labels.grey')}:</strong> {data.provisionOfServices.greyRoutes}
          </Section>

          <Section id='warranties-representations' title={tocItems[2].label}>
            <strong>{t('vendor.labels.authority')}:</strong> {data.warrantiesRepresentations.authority}
            <br />
            <strong>{t('vendor.labels.quality')}:</strong> {data.warrantiesRepresentations.quality}
          </Section>

          <Section id='indemnification' title={tocItems[3].label}>
            {data.indemnification}
          </Section>

          <Section id='data-confidentiality' title={tocItems[4].label}>
            <strong>{t('vendor.labels.business')}:</strong> {data.dataConfidentiality.businessData}
            <br />
            <strong>{t('vendor.labels.user')}:</strong> {data.dataConfidentiality.userData}
          </Section>

          <Section id='fees-payment' title={tocItems[5].label}>
            <strong>{t('vendor.labels.pricing')}:</strong> {data.feesPayment.pricing}
            <br />
            <strong>{t('vendor.labels.payment')}:</strong> {data.feesPayment.paymentTerms}
            <br />
            <strong>{t('vendor.labels.disputes')}:</strong> {data.feesPayment.disputeResolution}
          </Section>

          <Section id='term-termination' title={tocItems[6].label}>
            <strong>{t('vendor.labels.term')}:</strong> {data.termTermination.term}
            <br />
            <strong>{t('vendor.labels.terminate')}:</strong> {data.termTermination.termination}
            <br />
            <strong>{t('vendor.labels.effect')}:</strong> {data.termTermination.effect}
          </Section>

          <Section id='limitation-of-liability' title={tocItems[7].label}>
            {data.limitationOfLiability.content}
            <br />
            <strong>{t('vendor.labels.cap')}:</strong> {data.limitationOfLiability.cap}
          </Section>

          <Section id='governing-law' title={tocItems[8].label}>
            {data.governingLaw.content}
            <br />
            <strong>{t('vendor.labels.disputes')}:</strong> {data.governingLaw.disputes}
          </Section>

          <Section id='contact-information' title={tocItems[9].label}>
            <strong>{t('vendor.labels.company')}:</strong> {data.contactInformation.company}
            <br />
            <strong>{t('vendor.labels.number')}:</strong> {data.contactInformation.companyNumber}
            <br />
            <strong>{t('vendor.labels.office')}:</strong> {data.contactInformation.registeredOffice}
            <br />
            <strong>{t('vendor.labels.email')}:</strong> {data.contactInformation.email}
          </Section>
        </Box>
      </Box>
    </Box>
  )
}

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant='h4' component='h2' id={id} gutterBottom>
      {title}
    </Typography>
    <Typography variant='body1'>{children}</Typography>
  </Box>
)
