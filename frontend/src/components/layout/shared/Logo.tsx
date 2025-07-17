'use client'

import { useEffect, useRef, useState } from 'react'


import Image from 'next/image'
import { usePathname } from 'next/navigation'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import type { Mode } from '@core/types'

interface LogoProps {
  mode?: Mode
  customMode?: Mode
}

const Logo = ({ mode, customMode }: LogoProps) => {
  const logoTextRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  const { isHovered, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  // Direct theme detection using DOM - inspired by HeroSectionParallaxContent
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

  // Function to determine logo based on route
  const getLogoByRoute = (path: string, isDark: boolean) => {
    // Remove language prefix if exists (e.g., /en/, /fr/)
    const cleanPath = path.replace(/^\/[a-z]{2}\//, '/')

    if (cleanPath.includes('/esim')) {
      return isDark ? '/images/finalLogo/eSim-Dark.svg' : '/images/finalLogo/eSim.svg'
    } else if (cleanPath.includes('/reseller')) {
      return isDark ? '/images/finalLogo/Reseller-Dark.svg' : '/images/finalLogo/Reseller.svg'
    } else {
      // Default logo for other pages
      return isDark ? '/images/finalLogo/Logo-dark-mode.svg' : '/images/finalLogo/Logo-V1.svg'
    }
  }

  // Determine logo based on route and theme
  const logoImage = customMode
    ? getLogoByRoute(pathname, customMode === 'dark')
    : getLogoByRoute(pathname, currentTheme === 'dark')

  useEffect(() => {
    if (layout !== 'collapsed') return

    if (logoTextRef?.current) {
      if (!isBreakpointReached && layout === 'collapsed' && !isHovered) {
        logoTextRef.current.classList.add('hidden')
      } else {
        logoTextRef.current.classList.remove('hidden')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, layout, isBreakpointReached])

  return (
    <div className='flex items-center min-bs-[24px]'>
      <Image
        key={`logo-${currentTheme}-${pathname}`}
        src={logoImage}
        alt='Logo'
        width={80}
        height={40}
        className='logo-image'
      />
    </div>
  )
}

export default Logo
