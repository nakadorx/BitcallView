'use client'

import React from 'react'

import { Box, Container, Grid, Typography } from '@mui/material'

// MUI Icons (placeholder icons—replace as desired)
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import ChatIcon from '@mui/icons-material/Chat'
import PublicIcon from '@mui/icons-material/Public'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import LockIcon from '@mui/icons-material/Lock'
import AssessmentIcon from '@mui/icons-material/Assessment'

// Replace with your actual CustomAvatar import path
import CustomAvatar from '@core/components/mui/Avatar'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'

const iconList = [
  <HeadsetMicIcon fontSize='large' />,
  <ChatIcon fontSize='large' />,
  <PublicIcon fontSize='large' />,
  <CallSplitIcon fontSize='large' />,
  <LockIcon fontSize='large' />,
  <AssessmentIcon fontSize='large' />
]

const colorList = ['primary', 'success', 'info', 'warning', 'primary', 'success']

const Benefits = () => {
  const { t } = useT('common')

  const benefitItems = [0, 1, 2, 3, 4, 5].map(i => ({
    title: t(`benefits.items.${i}.title`),
    description: t(`benefits.items.${i}.description`),
    icon: iconList[i],
    avatarColor: colorList[i]
  }))

  return (
    <Box sx={{ mb: 'var(--section-margin-bottom)', pb: 7, px: 0.2 }} className='bg-backgroundPaper'>
      <Container maxWidth='lg'>
        <Container>
          {/* -- Top Headings -- */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <AnimatedHeadline variant='zoomOut' fontSize={{ xs: '0.75rem', md: '2rem' }}>
              {t('benefits.headline')}
            </AnimatedHeadline>

            <Typography
              variant='h2'
              component='h3'
              sx={{
                fontWeight: 300,
                fontSize: { xs: '1.25rem', md: '1.8rem' },
                mb: 'var(--section-headline-body-margin)'
              }}
            >
              {t('benefits.subheadline')}
            </Typography>
          </Box>

          {/* -- Benefits Grid -- */}
          <Grid container spacing={4}>
            {benefitItems.map((item, index) => (
              <Grid item xs={6} md={4} key={index}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CustomAvatar color={item.avatarColor} skin='light' size={60}>
                    {item.icon}
                  </CustomAvatar>
                  <Typography
                    variant='h5'
                    sx={{
                      fontWeight: 600,
                      mt: 2,
                      mb: 1,
                      fontSize: { xs: '0.72rem', md: '1.5rem' }
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      textAlign: 'center'
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </Box>
  )
}

export default Benefits
