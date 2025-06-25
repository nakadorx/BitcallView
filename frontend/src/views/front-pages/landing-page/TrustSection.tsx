'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Container } from '@mui/material'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'
import { Trans } from 'react-i18next'

const AnimatedNumber = ({ target = 3000, duration = 3000 }) => {
  const [current, setCurrent] = useState(0)
  const elementRef = useRef(null)
  const hasAnimated = useRef(false)
  const theme = useTheme()

  useEffect(() => {
    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const startTime = performance.now()

            const animate = time => {
              const elapsed = time - startTime
              const progress = Math.min(elapsed / duration, 1)
              setCurrent(Math.floor(progress * target))
              if (progress < 1) requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(node)
    return () => {
      if (node) observer.unobserve(node)
    }
  }, [target, duration])

  const displayColor = current === target ? theme.palette.primary.main : 'inherit'

  return (
    <span ref={elementRef} style={{ color: displayColor }}>
      {current}+
    </span>
  )
}

const logos = [
  {
    srcLight: '/images/front-pages/landing-page/partner1.png',
    srcDark: '/images/front-pages/landing-page/partner1-dark.png',
    alt: 'Partner 1'
  },
  {
    srcLight: '/images/front-pages/landing-page/partner2.png',
    srcDark: '/images/front-pages/landing-page/partner2-dark.png',
    alt: 'Continental'
  },
  {
    srcLight: '/images/front-pages/landing-page/partner3.png',
    srcDark: '/images/front-pages/landing-page/partner3-dark.png',
    alt: 'Airbnb'
  },
  {
    srcLight: '/images/front-pages/landing-page/partner4.png',
    srcDark: '/images/front-pages/landing-page/partner4-dark.png',
    alt: 'Eckerd'
  },
  {
    srcLight: '/images/front-pages/landing-page/partner5.png',
    srcDark: '/images/front-pages/landing-page/partner5-dark.png',
    alt: 'Partner 5'
  }
]

const TrustSection = props => {
  const theme = useTheme()
  const bgLight = '/images/front-pages/landing-page/trust-section.png'
  const bgDark = '/images/front-pages/landing-page/trust-section-dark.png'
  const bgImage = useImageVariant(theme.palette.mode, bgLight, bgDark)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useT('common')

  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = bgImage
    document.head.appendChild(preload)

    return () => {
      if (document.head.contains(preload)) {
        document.head.removeChild(preload)
      }
    }
  }, [bgImage])

  const content = (
    <Box
      component='section'
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 10, md: 11.5 },
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: { xs: 0, sm: '3.5rem' },
        mb: 'var(--section-margin-bottom)'
      }}
    >
      <Container maxWidth='md'>
        <AnimatedHeadline
          fontSize={{ xs: '0.85rem', md: '1.1rem' }}
          fontFamily='Open Sans Italic'
          animateOnScroll={false}
          sx={{ fontWeight: 700, textAlign: 'center', color: 'text.primary', mb: 4 }}
        >
          {t('trustSection.headline.prefix')}{' '}
          <Box component='span' sx={{ color: 'secondary.main' }}>
            <AnimatedNumber target={3000} duration={3000} />
          </Box>{' '}
          {t('trustSection.headline.suffix')}
        </AnimatedHeadline>

        {/* Horizontal scroll container on small screens, single line on desktop */}
        <Box
          sx={{
            display: 'flex',
            overflowX: { xs: 'auto', md: 'visible' },
            whiteSpace: { xs: 'nowrap', md: 'normal' },
            justifyContent: { xs: 'start', md: 'center' },
            alignItems: 'center',
            gap: 4,
            mb: 8,
            mt: 4,
            px: { xs: 2, md: 0 }
          }}
        >
          {logos.map((logo, index) => {
            const src = theme.palette.mode === 'dark' ? logo.srcDark : logo.srcLight
            const imageProps = theme.palette.mode === 'dark' ? { quality: 100 } : { unoptimized: true }

            return (
              <Box
                key={index}
                component='span'
                sx={{
                  display: 'inline-block',
                  width: 160,
                  minWidth: 160,
                  flexShrink: 0
                }}
              >
                <Image
                  src={src}
                  alt={logo.alt}
                  loading='lazy'
                  layout='responsive'
                  width={160}
                  height={55}
                  {...imageProps}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            )
          })}
        </Box>

        <Typography
          variant='subtitle1'
          textAlign='center'
          sx={{
            fontSize: { xs: '1rem', md: '1.3rem' },
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.6,
            color: 'secondary.main',
            fontFamily: 'Roboto'
          }}
        >
          <Trans
            i18nKey='trustSection.description'
            t={t}
            components={[<strong key='1' />, <strong key='3' />, <strong key='5' />, <strong key='7' />]}
          />
        </Typography>
      </Container>
    </Box>
  )

  return isMobile ? content : <Container maxWidth='lg'>{content}</Container>
}

export default TrustSection
