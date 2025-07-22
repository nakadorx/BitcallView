'use client'

import React from 'react'
import { Box, Typography, List, ListItem, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TOC, { TOCItem } from '../TOC'
import { useT } from '@/i18n/client'

interface PrivacyData {
  effectiveDate: string
  lastUpdated: string
  scope: {
    details: string[]
  }
  dataWeCollect: {
    accountInformation: string
    usageData: string
    technicalData: string
  }
  howWeUseData: {
    serviceProvision: string
    accountManagement: string
    legalCompliance: string
  }
  retentionDeletion: {
    cdrRetention: string
    noCallAudio: string
    accountDeletion: string
  }
  sharingData: {
    serviceProviders: string
    legalRequirements: string
  }
  cookiesTracking: string
  dataSecurity: string
  yourRights: string
  updates: string
  contactInformation: {
    company: string
    companyNumber: string
    registeredOffice: string
    email: string
  }
}

interface PrivacyContentProps {
  data: PrivacyData
}

export default function PrivacyContent({ data }: PrivacyContentProps) {
  const { t } = useT('legal')
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const tocItems: TOCItem[] = [
    { id: 'scope', label: t('privacy.toc.scope') },
    { id: 'data-we-collect', label: t('privacy.toc.dataWeCollect') },
    { id: 'how-we-use-data', label: t('privacy.toc.howWeUseData') },
    { id: 'retention-deletion', label: t('privacy.toc.retentionDeletion') },
    { id: 'sharing-data', label: t('privacy.toc.sharing') },
    { id: 'cookies-tracking', label: t('privacy.toc.cookies') },
    { id: 'data-security', label: t('privacy.toc.security') },
    { id: 'your-rights', label: t('privacy.toc.rights') },
    { id: 'updates', label: t('privacy.toc.updates') },
    { id: 'contact-information', label: t('privacy.toc.contact') }
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '250px' } }}>
          <TOC items={tocItems} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Section id='scope' title={t('privacy.toc.scope')}>
            <List>
              {data.scope.details.map((detail, index) => (
                <ListItem key={index} disablePadding>
                  <Typography variant='body1'>• {detail}</Typography>
                </ListItem>
              ))}
            </List>
          </Section>

          <Section id='data-we-collect' title={t('privacy.toc.dataWeCollect')}>
            <Typography variant='body1'>
              <strong>{t('privacy.labels.accountInfo')}:</strong> {data.dataWeCollect.accountInformation}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.usageData')}:</strong> {data.dataWeCollect.usageData}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.technicalData')}:</strong> {data.dataWeCollect.technicalData}
            </Typography>
          </Section>

          <Section id='how-we-use-data' title={t('privacy.toc.howWeUseData')}>
            <Typography variant='body1'>
              <strong>{t('privacy.labels.service')}:</strong> {data.howWeUseData.serviceProvision}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.account')}:</strong> {data.howWeUseData.accountManagement}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.legal')}:</strong> {data.howWeUseData.legalCompliance}
            </Typography>
          </Section>

          <Section id='retention-deletion' title={t('privacy.toc.retentionDeletion')}>
            <Typography variant='body1'>
              <strong>{t('privacy.labels.cdr')}:</strong> {data.retentionDeletion.cdrRetention}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.audio')}:</strong> {data.retentionDeletion.noCallAudio}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.deletion')}:</strong> {data.retentionDeletion.accountDeletion}
            </Typography>
          </Section>

          <Section id='sharing-data' title={t('privacy.toc.sharing')}>
            <Typography variant='body1'>
              <strong>{t('privacy.labels.providers')}:</strong> {data.sharingData.serviceProviders}
            </Typography>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>{t('privacy.labels.requirements')}:</strong> {data.sharingData.legalRequirements}
            </Typography>
          </Section>

          <Section id='cookies-tracking' title={t('privacy.toc.cookies')}>
            <Typography variant='body1'>{data.cookiesTracking}</Typography>
          </Section>

          <Section id='data-security' title={t('privacy.toc.security')}>
            <Typography variant='body1'>{data.dataSecurity}</Typography>
          </Section>

          <Section id='your-rights' title={t('privacy.toc.rights')}>
            <Typography variant='body1'>{data.yourRights}</Typography>
          </Section>

          <Section id='updates' title={t('privacy.toc.updates')}>
            <Typography variant='body1'>{data.updates}</Typography>
          </Section>

          <Section id='contact-information' title={t('privacy.toc.contact')}>
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
