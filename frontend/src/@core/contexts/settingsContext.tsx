'use client'

// React Imports
import type { ReactNode } from 'react'
import { createContext, useMemo, useState, useEffect } from 'react'

// Next Imports
import { usePathname } from 'next/navigation'

// Third-party Imports
import Cookies from 'js-cookie'

// Type Imports
import type { Mode, Skin, Layout, LayoutComponentWidth } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'
import primaryColorConfig from '@configs/primaryColorConfig'

// Hook Imports
import { useObjectCookie } from '@core/hooks/useObjectCookie'

// Settings type
export type Settings = {
  mode?: Mode
  skin?: Skin
  semiDark?: boolean
  layout?: Layout
  navbarContentWidth?: LayoutComponentWidth
  contentWidth?: LayoutComponentWidth
  footerContentWidth?: LayoutComponentWidth
  primaryColor?: string
}

// UpdateSettingsOptions type
type UpdateSettingsOptions = {
  updateCookie?: boolean
}

// SettingsContextProps type
type SettingsContextProps = {
  settings: Settings
  updateSettings: (settings: Partial<Settings>, options?: UpdateSettingsOptions) => void
  isSettingsChanged: boolean
  resetSettings: () => void
  updatePageSettings: (settings: Partial<Settings>) => () => void
}

type Props = {
  children: ReactNode
  settingsCookie: Settings | null
  mode?: Mode
}

// Initial Settings Context
export const SettingsContext = createContext<SettingsContextProps | null>(null)

// Settings Provider
export const SettingsProvider = (props: Props) => {
  const pathname = usePathname() // ✅ Detects navigation changes

  // Initial Settings
  const initialSettings: Settings = useMemo(
    () => ({
      mode: themeConfig.mode,
      skin: themeConfig.skin,
      semiDark: themeConfig.semiDark,
      layout: themeConfig.layout,
      navbarContentWidth: themeConfig.navbar.contentWidth,
      contentWidth: themeConfig.contentWidth,
      footerContentWidth: themeConfig.footer.contentWidth,
      primaryColor: primaryColorConfig[0].main
    }),
    []
  )

  const updatedInitialSettings = {
    ...initialSettings,
    mode: props.mode || themeConfig.mode
  }

  // Cookies
  const [settingsCookie, updateSettingsCookie] = useObjectCookie<Settings>(
    themeConfig.settingsCookieName,
    JSON.stringify(props.settingsCookie) !== '{}' ? props.settingsCookie : updatedInitialSettings
  )

  // State
  const [_settingsState, _updateSettingsState] = useState<Settings>(
    JSON.stringify(settingsCookie) !== '{}' ? settingsCookie : updatedInitialSettings
  )

  const updateSettings = (settings: Partial<Settings>, options?: UpdateSettingsOptions) => {
    const { updateCookie = true } = options || {}

    _updateSettingsState(prev => {
      const newSettings = { ...prev, ...settings }

      // Update cookie if needed
      if (updateCookie) updateSettingsCookie(newSettings)

      return newSettings
    })
  }

  /**
   * Updates the settings for page with the provided settings object.
   * Updated settings won't be saved to cookie hence will be reverted once navigating away from the page.
   *
   * @param settings - The partial settings object containing the properties to update.
   * @returns A function to reset the page settings.
   *
   * @example
   * useEffect(() => {
   *     return updatePageSettings({ theme: 'dark' });
   * }, []);
   */

  // ✅  Fix: Ensure Theme is Reapplied on Page Navigation
  useEffect(() => {
    // Read the latest theme from the cookie
    const newSettings = JSON.parse(Cookies.get(themeConfig.settingsCookieName) || '{}')

    // Apply the theme
    _updateSettingsState(prev => ({ ...prev, ...newSettings }))
    document.documentElement.setAttribute('data-theme', newSettings.mode)
  }, [pathname]) // ✅ Runs whenever pathname changes (user navigates)

  const updatePageSettings = (settings: Partial<Settings>): (() => void) => {
    updateSettings(settings, { updateCookie: false })

    // Returns a function to reset the page settings
    return () => updateSettings(settingsCookie, { updateCookie: false })
  }

  const resetSettings = () => {
    updateSettings(initialSettings)
  }

  const isSettingsChanged = useMemo(
    () => JSON.stringify(initialSettings) !== JSON.stringify(_settingsState),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialSettings, _settingsState]
  )

  return (
    <SettingsContext.Provider
      value={{
        settings: _settingsState,
        updateSettings,
        isSettingsChanged,
        resetSettings,
        updatePageSettings
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  )
}
