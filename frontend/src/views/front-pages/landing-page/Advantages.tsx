import React from 'react'
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material'
import DesktopAdvantages from './advantages/DesktopAdvantages'
import MobileAdvantages from './advantages/MobileAdvantages'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'
const Advantages = props => {
  const theme = useTheme()
  // TODO:make a hook to check if the screen is mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useT('common')

  const advantagesData = [0, 1, 2, 3].map(i => ({
    title: t(`advantages.items.${i}.title`),
    description: t(`advantages.items.${i}.description`),
    video: `/images/front-pages/landing-page/${i === 0 ? 'accelerate-with-ai-2x-compressed' : i}.mp4`
  }))

  return (
    <Box sx={{ pb: 'var(--section-margin-bottom)' }}>
      <Box sx={{ p: 2 }}>
        <Container>
          <AnimatedHeadline variant='slideLeft'>{t('advantages.headline')}</AnimatedHeadline>
          <Typography
            variant='h2'
            component='h3'
            sx={{
              textAlign: 'center',
              fontWeight: 400,
              fontSize: { xs: '1.25rem', md: '1.8rem' },
              mb: 'var(--section-headline-body-margin)'
            }}
          >
            {t('advantages.subheadline')}
          </Typography>
        </Container>
      </Box>
      {isMobile ? <MobileAdvantages data={advantagesData} /> : <DesktopAdvantages data={advantagesData} />}
    </Box>
  )
}

export default Advantages
