'use client'

import React from 'react'
import { Box, Typography, List, ListItem } from '@mui/material'
import TOC, { TOCItem } from '../TOC'
import { useT } from '@/i18n/client'

interface ProhibitedActivity {
  title: string
  content: string
}

interface Responsibility {
  title: string
  content: string
}

interface ContactInformation {
  company: string
  companyNumber: string
  registeredOffice: string
  email: string
}

interface AupData {
  effectiveDate: string
  lastUpdated: string
  purpose: string
  prohibitedActivities: ProhibitedActivity[]
  responsibilities: Responsibility[]
  enforcement: string
  liability: string
  changes: string
  contactInformation: ContactInformation
}

interface AupContentProps {
  data: AupData
}

export default function AupContent({ data }: AupContentProps) {
  const { t } = useT('legal')

  const tocItems: TOCItem[] = [
    { id: 'purpose', label: t('aup.toc.purpose') },
    { id: 'prohibited-activities', label: t('aup.toc.prohibitedActivities') },
    { id: 'responsibilities', label: t('aup.toc.responsibilities') },
    { id: 'enforcement', label: t('aup.toc.enforcement') },
    { id: 'liability', label: t('aup.toc.liability') },
    { id: 'changes', label: t('aup.toc.changes') },
    { id: 'contact-information', label: t('aup.toc.contact') }
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}
      >
        <Box sx={{ width: { xs: '100%', md: '250px' } }}>
          <TOC items={tocItems} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Section id='purpose' title={t('aup.toc.purpose')} content={data.purpose} />

          <Box sx={{ mb: 4 }}>
            <Typography variant='h4' component='h2' id='prohibited-activities' gutterBottom>
              {t('aup.toc.prohibitedActivities')}
            </Typography>
            <List>
              {data.prohibitedActivities.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <Typography variant='body1'>
                    <strong>{item.title}:</strong> {item.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant='h4' component='h2' id='responsibilities' gutterBottom>
              {t('aup.toc.responsibilities')}
            </Typography>
            <List>
              {data.responsibilities.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <Typography variant='body1'>
                    <strong>{item.title}:</strong> {item.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>

          <Section id='enforcement' title={t('aup.toc.enforcement')} content={data.enforcement} />
          <Section id='liability' title={t('aup.toc.liability')} content={data.liability} />
          <Section id='changes' title={t('aup.toc.changes')} content={data.changes} />

          <Box sx={{ mb: 4 }}>
            <Typography variant='h4' component='h2' id='contact-information' gutterBottom>
              {t('aup.toc.contact')}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('aup.contact.company')}:</strong> {data.contactInformation.company}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('aup.contact.companyNumber')}:</strong> {data.contactInformation.companyNumber}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('aup.contact.office')}:</strong> {data.contactInformation.registeredOffice}
            </Typography>
            <Typography variant='body1'>
              <strong>{t('aup.contact.email')}:</strong> {data.contactInformation.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// Reusable section component
const Section = ({ id, title, content }: { id: string; title: string; content: string }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant='h4' component='h2' id={id} gutterBottom>
      {title}
    </Typography>
    <Typography variant='body1'>{content}</Typography>
  </Box>
)
