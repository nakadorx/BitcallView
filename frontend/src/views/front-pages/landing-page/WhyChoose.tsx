'use client'

import React from 'react'
import { Box, Container, Typography, Button, useMediaQuery, useTheme } from '@mui/material'
import { customCtaBtnWCSx } from '@/app/globalStyles'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'

const WhyChoose = () => {
  const theme = useTheme()
  const { t } = useT('common')
  const bgLight = '/images/front-pages/landing-page/who-choose-bg.png'
  const bgDark = '/images/front-pages/landing-page/who-choose-bg-dark.png'
  const bgImage = useImageVariant(theme.palette.mode, bgLight, bgDark)
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  const content = (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mb: 'var(--section-margin-bottom)',
        py: { xs: 4.5, md: 3.5 },
        borderRadius: { xs: '0', sm: '3.5rem' },
        px: { xs: 2, md: 0 }
      }}
    >
      <AnimatedHeadline variant='fadeIn'>{t('whyChoose.headline')}</AnimatedHeadline>

      <Typography
        variant='body1'
        sx={{
          textAlign: 'center',
          maxWidth: 900,
          mx: 'auto',
          mb: 0,
          color: 'secondary.main',
          lineHeight: 1.55,
          fontSize: { xs: '0.9rem', sm: '1.27rem' },
          fontFamily: 'Open Sans SemiBold',
          whiteSpace: 'pre-line'
        }}
      >
        {t('whyChoose.description')}
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 4.5 }}>
        <Button variant='contained' sx={customCtaBtnWCSx}>
          {t('whyChoose.cta')}
        </Button>
      </Box>
    </Box>
  )

  return isXs ? content : <Container maxWidth='lg'>{content}</Container>
}

export default WhyChoose
