'use client'

import React from 'react'
import { Box, Typography, List, ListItem, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TOC, { TOCItem } from '../TOC'
import { useT } from '@/i18n/client'

interface Introduction {
  company: string
  companyNumber: string
  registeredOffice: string
  description: string
}

interface ScopeItem {
  title: string
  content: string
}

interface ResponsibilityItem {
  title: string
  content: string
}

interface PaymentItem {
  title: string
  content: string
}

interface TermsData {
  effectiveDate: string
  lastUpdated: string
  introduction: Introduction
  scopeOfServices: ScopeItem[]
  userResponsibilities: ResponsibilityItem[]
  paymentAndBilling: PaymentItem[]
  dataStorageRetention: {
    cdrs: string
    deletion: string
  }
  intellectualProperty: string
  disclaimerOfWarranties: string
  limitationOfLiability: {
    content: string
    cap: string
  }
  indemnification: string
  termination: {
    byUser: string
    byUs: string
    effects: string
  }
  governingLaw: {
    content: string
    disputeResolution: string
  }
  changesToTerms: string
  contactInformation: {
    company: string
    companyNumber: string
    registeredOffice: string
    email: string
  }
}

interface TermsContentProps {
  data: TermsData
}

export default function TermsContent({ data }: TermsContentProps) {
  const { t } = useT('legal')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const tocItems: TOCItem[] = [
    { id: 'introduction', label: t('terms.toc.introduction') },
    { id: 'scope-of-services', label: t('terms.toc.scope') },
    { id: 'user-responsibilities', label: t('terms.toc.responsibilities') },
    { id: 'payment-and-billing', label: t('terms.toc.billing') },
    { id: 'data-storage-retention', label: t('terms.toc.retention') },
    { id: 'intellectual-property', label: t('terms.toc.ip') },
    { id: 'disclaimer-of-warranties', label: t('terms.toc.disclaimer') },
    { id: 'limitation-of-liability', label: t('terms.toc.liability') },
    { id: 'indemnification', label: t('terms.toc.indemnification') },
    { id: 'termination', label: t('terms.toc.termination') },
    { id: 'governing-law', label: t('terms.toc.law') },
    { id: 'changes-to-terms', label: t('terms.toc.changes') },
    { id: 'contact-information', label: t('terms.toc.contact') }
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '250px' } }}>
          <TOC items={tocItems} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Section id='introduction' title={t('terms.toc.introduction')}>
            <Typography variant='body1'>
              <strong>{t('privacy.contact.company')}:</strong> {data.introduction.company} <br />
              <strong>{t('privacy.contact.companyNumber')}:</strong> {data.introduction.companyNumber} <br />
              <strong>{t('privacy.contact.office')}:</strong> {data.introduction.registeredOffice}
            </Typography>
            <Typography variant='body1' sx={{ mt: 1 }}>
              {data.introduction.description}
            </Typography>
          </Section>

          <Section id='scope-of-services' title={t('terms.toc.scope')}>
            <List>
              {data.scopeOfServices.map((service, index) => (
                <ListItem key={index} disablePadding>
                  <Typography variant='body1'>
                    <strong>{service.title}:</strong> {service.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Section>

          <Section id='user-responsibilities' title={t('terms.toc.responsibilities')}>
            <List>
              {data.userResponsibilities.map((resp, index) => (
                <ListItem key={index} disablePadding>
                  <Typography variant='body1'>
                    <strong>{resp.title}:</strong> {resp.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Section>

          <Section id='payment-and-billing' title={t('terms.toc.billing')}>
            <List>
              {data.paymentAndBilling.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <Typography variant='body1'>
                    <strong>{item.title}:</strong> {item.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Section>

          <Section id='data-storage-retention' title={t('terms.toc.retention')}>
            <Typography variant='body1'>
              <strong>CDRs:</strong> {data.dataStorageRetention.cdrs}
            </Typography>
            <Typography variant='body1'>
              <strong>Deletion:</strong> {data.dataStorageRetention.deletion}
            </Typography>
          </Section>

          <Section id='intellectual-property' title={t('terms.toc.ip')}>
            <Typography variant='body1'>{data.intellectualProperty}</Typography>
          </Section>

          <Section id='disclaimer-of-warranties' title={t('terms.toc.disclaimer')}>
            <Typography variant='body1'>{data.disclaimerOfWarranties}</Typography>
          </Section>

          <Section id='limitation-of-liability' title={t('terms.toc.liability')}>
            <Typography variant='body1'>{data.limitationOfLiability.content}</Typography>
            <Typography variant='body1'>
              <strong>{t('vendor.labels.cap')}:</strong> {data.limitationOfLiability.cap}
            </Typography>
          </Section>

          <Section id='indemnification' title={t('terms.toc.indemnification')}>
            <Typography variant='body1'>{data.indemnification}</Typography>
          </Section>

          <Section id='termination' title={t('terms.toc.termination')}>
            <Typography variant='body1'>
              <strong>{t('terms.labels.byUser')}:</strong> {data.termination.byUser}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('terms.labels.byUs')}:</strong> {data.termination.byUs}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('terms.labels.effects')}:</strong> {data.termination.effects}
            </Typography>
          </Section>

          <Section id='governing-law' title={t('terms.toc.law')}>
            <Typography variant='body1'>{data.governingLaw.content}</Typography>
            <Typography variant='body1'>
              <strong>{t('terms.labels.disputeResolution')}:</strong> {data.governingLaw.disputeResolution}
            </Typography>
          </Section>

          <Section id='changes-to-terms' title={t('terms.toc.changes')}>
            <Typography variant='body1'>{data.changesToTerms}</Typography>
          </Section>

          <Section id='contact-information' title={t('terms.toc.contact')}>
            <Typography variant='body1'>
              <strong>{t('privacy.contact.company')}:</strong> {data.contactInformation.company}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('privacy.contact.companyNumber')}:</strong> {data.contactInformation.companyNumber}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('privacy.contact.office')}:</strong> {data.contactInformation.registeredOffice}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('privacy.contact.email')}:</strong> {data.contactInformation.email}
            </Typography>
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
    {children}
  </Box>
)
