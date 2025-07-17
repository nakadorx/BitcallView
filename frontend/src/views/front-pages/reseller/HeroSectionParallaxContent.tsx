'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

import React from 'react'

const HeroSectionParallaxComponent = () => {
  const [dashboardPosition, setDashboardPosition] = useState({ x: 0, y: 0 })
  const [elementsPosition, setElementsPosition] = useState({ x: 0, y: 0 })
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  const dashboardImageLight = '/images/front-pages/landing-pageTest/hero-dashboard-light.png'
  const dashboardImageDark = '/images/front-pages/landing-pageTest/hero-dashboard-dark.png'
  const elementsImageLight = '/images/front-pages/landing-pageTest/hero-elements-light.png'
  const elementsImageDark = '/images/front-pages/landing-pageTest/hero-elements-dark.png'

  const dashboardImage = currentTheme === 'dark' ? dashboardImageDark : dashboardImageLight
  const elementsImage = currentTheme === 'dark' ? elementsImageDark : elementsImageLight

  // Direct theme detection using DOM
  useEffect(() => {
    const detectTheme = () => {
      const htmlElement = document.documentElement
      const isDark =
        htmlElement.classList.contains('dark') ||
        htmlElement.style.colorScheme === 'dark' ||
        htmlElement.getAttribute('data-theme') === 'dark'

      const detectedTheme = isDark ? 'dark' : 'light'
      setCurrentTheme(detectedTheme)
    }

    // Initial detection
    detectTheme()

    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' ||
            mutation.attributeName === 'style' ||
            mutation.attributeName === 'data-theme')
        ) {
          detectTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const isAboveLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const speedDashboard = 2
      const speedElements = 2.5

      const updateMousePosition = (ev: MouseEvent) => {
        const x = ev.clientX
        const y = ev.clientY

        setDashboardPosition({
          x: (window.innerWidth - x * speedDashboard) / 100,
          y: Math.max((window.innerHeight - y * speedDashboard) / 100, -40)
        })

        setElementsPosition({
          x: (window.innerWidth - x * speedElements) / 100,
          y: Math.max((window.innerHeight - y * speedElements) / 100, -40)
        })
      }

      window.addEventListener('mousemove', updateMousePosition)

      return () => {
        window.removeEventListener('mousemove', updateMousePosition)
      }
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'relative',
        textAlign: 'center',
        margin: 'auto',
        paddingInline: '1.5rem',
        maxWidth: {
          xs: '100%',
          md: '1200px',
          lg: '1300px',
          xl: '1440px'
        },
        transform: isAboveLgScreen ? `translate(${dashboardPosition.x}px, ${dashboardPosition.y}px)` : 'none'
      }}
    >
      <Link href='https://bitcall.io/index.html' target='_blank'>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
            width: { xs: '85%', lg: '85%' },
            zIndex: 0,
            marginInline: 'auto'
          }}
        >
          <Image
            key={`dashboard-${currentTheme}`}
            src={dashboardImage}
            alt='Bitcall OS dashboard interface for telecom resellers'
            width={1200}
            height={800}
            priority
            className='object-contain relative lg:right-[5rem] lg:w-[1000px] w-full h-auto'
          />
          <Box
            sx={{
              position: 'absolute',
              top: '18%',
              right: '3%',
              zIndex: 1,
              width: '100%'
            }}
          >
            <Image
              key={`elements-${currentTheme}`}
              src={elementsImage}
              alt='dashboard-elements'
              width={1331}
              height={548}
              className='lg:relative  lg:left-[-10rem] lg:w-[83.19rem] lg:h-[34.25rem] w-full h-auto'
              style={{
                transform: isAboveLgScreen ? `translate(${elementsPosition.x}px, ${elementsPosition.y}px)` : 'none'
              }}
            />
          </Box>
        </Box>
      </Link>
    </Box>
  )
}

export const HeroSectionParallaxContent = HeroSectionParallaxComponent
