'use client'

import React from 'react'
import { Box, Container, Typography, Button, useMediaQuery, useTheme } from '@mui/material'
import { customCtaBtnWCSx } from '@/app/globalStyles'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'

const CallToAction = props => {
  const theme = useTheme()
  const { t } = useT('common')
  const bgLight = '/images/front-pages/landing-page/cta-bg.png'
  const bgDark = '/images/front-pages/landing-page/cta-bg-dark.png'
  const bgImage = useImageVariant(theme.palette.mode, bgLight, bgDark)
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))

  const content = (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: { xs: 12.5, md: 4.5 },

        borderRadius: { xs: '0', sm: '3.5rem' },
        mb: 'var(--section-margin-bottom)',
        width: '100%'
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <AnimatedHeadline variant='popIn' fontSize={{ xs: '0.6rem', md: '1.65rem' }}>
          {t('callToAction.headline')}
        </AnimatedHeadline>
        <Typography
          variant='body1'
          sx={{
            mb: 4,
            fontSize: { xs: '1rem', sm: '1.85rem' },
            color: 'secondary.main',
            fontFamily: 'Open Sans Regular',
            lineHeight: 1.8
          }}
        >
          {t('callToAction.description.part1')}
          <br />
          {t('callToAction.description.part2')}
        </Typography>
        <Button variant='contained' sx={customCtaBtnWCSx}>
          {t('callToAction.cta')}
        </Button>
      </Box>
    </Box>
  )

  return isXs ? content : <Container maxWidth='lg'>{content}</Container>
}

export default CallToAction
