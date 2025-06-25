'use client'
import { useSettings } from '@/@core/hooks/useSettings'
import primaryColorConfig, { PrimaryColorNames } from '@/configs/primaryColorConfig'
import { useEffect } from 'react'

export const useHandlePrimaryColor = ({ color }: { color: PrimaryColorNames }) => {
  const { updateSettings } = useSettings()

  useEffect(() => {
    updateSettings({
      primaryColor: primaryColorConfig.find(el => el.name === color)?.main || primaryColorConfig[1].main
    })
  }, [])
}

// TODO: delete this hook
