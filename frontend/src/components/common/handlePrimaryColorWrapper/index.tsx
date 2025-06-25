'use client'
import { useSettings } from '@/@core/hooks/useSettings'
import primaryColorConfig, { PrimaryColorNames } from '@/configs/primaryColorConfig'
import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

export const HandlePrimaryColorWrapper = ({
  color,
  children
}: {
  color: PrimaryColorNames
  children: React.ReactNode
}) => {
  const { updateSettings } = useSettings()
  const pathname = usePathname()
  console.log('pathname', pathname)
  useEffect(() => {
    updateSettings({
      primaryColor: primaryColorConfig.find(el => el.name === color)?.main || primaryColorConfig[1].main
    })
  }, [color, pathname])

  return <>{children}</>
}

export const HandlePrimaryColorWrapperTest = ({ children }: { children: React.ReactNode }) => {
  const { updateSettings } = useSettings()
  const pathname = usePathname()

  useLayoutEffect(() => {
    let selectedColor: string

    // Set color based on pathname
    if (pathname === '/en/reseller') {
      selectedColor = primaryColorConfig[1].main // Orange
    } else if (pathname === '/en') {
      selectedColor = primaryColorConfig[0].main // Blue
    } else {
      // Fallback to the color prop or default
      selectedColor = primaryColorConfig.find(el => el.name === 'red')?.main || primaryColorConfig[1].main
    }

    updateSettings({
      primaryColor: selectedColor
    })
  }, [pathname])

  return <>{children}</>
}
