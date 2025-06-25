'use client'

import React, { useEffect, useMemo } from 'react'
import { Box, useTheme } from '@mui/material'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Modern animation variants for marketing/UX
const animationVariants = {
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  },
  fadeUp: {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  },
  slideLeft: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  zoomOut: {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  },
  popIn: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1.05, opacity: 1 },
    transition: { type: 'spring', stiffness: 100 }
  }
}

const AnimatedHeadline = ({
  children,
  tag = 'h2',
  fontSize = { xs: '0.85rem', md: '1.65rem' },
  fontFamily = 'var(--section-headline-font-family)',
  variant = 'scaleIn',
  animateOnScroll = true,
  delay = 0
}) => {
  const theme = useTheme()
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  })
  // TODO: check this
  const selectedVariant = animationVariants[variant] || animationVariants.scaleIn

  useEffect(() => {
    if (!animateOnScroll) return

    if (inView) {
      controls.start({
        ...selectedVariant.animate,
        transition: selectedVariant.transition || { duration: 0.5, delay }
      })
    } else {
      controls.start(selectedVariant.initial)
    }
  }, [controls, inView, selectedVariant, animateOnScroll, delay])

  const MotionHeadline = useMemo(() => motion(tag), [tag])

  return (
    <Box
      sx={{
        textAlign: 'center',
        fontFamily: fontFamily,
        fontSize: fontSize,
        color: theme.palette.secondary.main,
        pb: 1
      }}
    >
      <MotionHeadline
        ref={ref}
        initial={animateOnScroll ? selectedVariant.initial : false}
        animate={animateOnScroll ? controls : false}
      >
        {children}
      </MotionHeadline>
    </Box>
  )
}

export default AnimatedHeadline
