'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

import { getCurrentTheme } from '@/utils/theme'
import type { Mode } from '@core/types'
import React from 'react'

const HeroSectionParallaxComponent = ({ mode }: { mode: Mode }) => {
  const [dashboardPosition, setDashboardPosition] = useState({ x: 0, y: 0 })
  const [elementsPosition, setElementsPosition] = useState({ x: 0, y: 0 })

  const dashboardImageLight = '/images/front-pages/landing-pageTest/hero-dashboard-light.png'
  const dashboardImageDark = '/images/front-pages/landing-pageTest/hero-dashboard-dark.png'
  const elementsImageLight = '/images/front-pages/landing-pageTest/hero-elements-light.png'
  const elementsImageDark = '/images/front-pages/landing-pageTest/hero-elements-dark.png'

  const dashboardImage = mode === 'dark' ? dashboardImageDark : dashboardImageLight
  const elementsImage = mode === 'dark' ? elementsImageDark : elementsImageLight
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
            src={dashboardImage}
            alt='Bitcall OS dashboard interface for telecom resellers'
            width={1200}
            height={800}
            priority
            className='w-full h-auto object-contain'
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
              src={elementsImage}
              alt='dashboard-elements'
              width={800}
              height={600}
              className='w-full h-auto object-contain'
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

export const HeroSectionParallaxContent = React.memo(HeroSectionParallaxComponent)
