'use client'

import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import { customLog } from '@/utils/commons'
import { customCtaBtnSx, customCtaBtnWCSx } from '@/app/globalStyles'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'

// TODO: remove this file and replace this componat by the one created in compoant commn
const HeroSection = () => {
  const theme = useTheme()
  const { t } = useT('common')
  const [showVideo, setShowVideo] = useState(false)

  // Preload hero poster (affects LCP)
  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    document.head.appendChild(preload)

    // Lazy load video slightly after mount
    const timeout = setTimeout(() => {
      setShowVideo(true)
    }, 300)

    return () => {
      document?.head?.removeChild(preload)
      clearTimeout(timeout)
    }
  }, [])

  const videoSrcMp4 =
    theme.palette.mode === 'light' ? '/videos/landing-page/hero.mp4' : '/videos/landing-page/hero-dark.mp4'
  const videoSrcWebm =
    theme.palette.mode === 'light' ? '/videos/landing-page/hero.webm' : '/videos/landing-page/hero-dark.webm'

  return (
    <Box
      component='section'
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: '1.2rem', sm: '2rem' },
        mb: 'var(--section-margin-bottom)'
      }}
    >
      <Container sx={{ pt: { xs: 3, sm: 5 }, pb: { xs: 3, sm: 5 } }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Headline */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <AnimatedHeadline tag='h1' fontFamily='Open Sans Extra Bold' fontSize={{ xs: '0.99rem', md: '2.6rem' }}>
              <Box component='span' sx={{ color: 'secondary.main' }}>
                {t('heroSection.titlePart1')}{' '}
              </Box>
              <Box component='span' sx={{ color: 'primary.main', ml: 1 }}>
                {t('heroSection.titlePart2')}{' '}
              </Box>
            </AnimatedHeadline>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography
              variant='body1'
              sx={{
                fontSize: { xs: '1.03rem', sm: '1.4rem' },
                lineHeight: 1.8,
                fontFamily: 'Roboto',
                textAlign: 'center',
                mb: 2,
                maxWidth: '650px',
                margin: '0 auto'
              }}
              color='text.primary'
            >
              {t('heroSection.descriptionPart1')}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {t('heroSection.boldPart1')}
              </Box>
              {t('heroSection.descriptionPart2')}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {t('heroSection.boldPart2')}
              </Box>
              {t('heroSection.descriptionPart3')}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {t('heroSection.boldPart3')}
              </Box>
              {t('heroSection.descriptionPart4')}
              <Box component='span' sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {t('heroSection.boldPart4')}
              </Box>
              {t('heroSection.descriptionPart5')}
            </Typography>
          </Grid>

          {/* CTA Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 4, sm: 8 },
                pt: 2,
                mb: 2,
                flexWrap: 'wrap'
              }}
            >
              <Button variant='contained' color='primary' sx={customCtaBtnWCSx}>
                {t('heroSection.cta1')}
              </Button>
              <Button variant='outlined' color='primary' sx={customCtaBtnSx}>
                {t('heroSection.cta2')}
              </Button>
            </Box>
          </Grid>

          {/* Optimized Video */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {showVideo && (
                <video
                  key={theme.palette.mode}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload='none'
                  title='Bitcall Hero Video'
                  style={{
                    width: '97%',
                    height: 'auto',
                    objectFit: 'cover',
                    borderRadius: 'var(--btn-border-radius)'
                  }}
                >
                  <source src={videoSrcMp4} type='video/mp4' />
                  <source src={videoSrcWebm} type='video/webm' />
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default HeroSection
