'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Next Imports
import Image from 'next/image'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import type { Mode } from '@core/types'

// TODO  : check if its possible to import mode here idrectly
interface LogoProps {
  mode?: Mode
  customMode?: Mode
}

const Logo = ({ mode, customMode }: LogoProps) => {
  const logoTextRef = useRef<HTMLSpanElement>(null)

  // Hooks
  const { isHovered, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()

  // Vars
  const { layout } = settings

  const logolight = '/images/logos/logo-v1.svg'
  const logodark = '/images/logos/logo-dark.svg'
  const effectiveMode = customMode || mode || 'light'

  // If customMode is provided, bypass the hook and use the appropriate image directly.
  const logoImage = customMode
    ? customMode === 'dark'
      ? logodark
      : logolight
    : useImageVariant(effectiveMode, logolight, logodark)

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
      <Image src={logoImage} alt='Logo' width={80} height={40} className='logo-image' />
    </div>
  )
}

export default Logo
