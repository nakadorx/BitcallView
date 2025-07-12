'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Mode } from '@core/types'
import {
  getUnifiedTheme,
  setUnifiedTheme,
  applyThemeToDOM,
  getResolvedTheme,
  toggleTheme,
  listenForSystemThemeChanges,
  migrateFromOldSystem
} from '@/utils/unifiedTheme'

interface UseUnifiedThemeReturn {
  mode: Mode
  resolvedTheme: 'light' | 'dark'
  isLoading: boolean
  setMode: (mode: Mode) => void
  toggle: () => void
}

/**
 * ✅ Custom hook for unified theme management
 * Eliminates cookie conflicts and provides easy theme control
 */
export function useUnifiedTheme(): UseUnifiedThemeReturn {
  const [mode, setModeState] = useState<Mode>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize theme
  useEffect(() => {
    // Migrate from old system
    migrateFromOldSystem()

    // Get current theme
    const themeData = getUnifiedTheme()
    const resolved = getResolvedTheme()

    setModeState(themeData.mode)
    setResolvedTheme(resolved)
    setIsLoading(false)

    // Apply to DOM
    applyThemeToDOM()
  }, [])

  // Listen for system changes
  useEffect(() => {
    const cleanup = listenForSystemThemeChanges(systemTheme => {
      setResolvedTheme(systemTheme)
    })

    return cleanup
  }, [])

  // Set theme mode
  const setMode = useCallback((newMode: Mode) => {
    setUnifiedTheme(newMode)
    applyThemeToDOM()

    setModeState(newMode)
    setResolvedTheme(getResolvedTheme())
  }, [])

  // Toggle theme (light/dark, skips system)
  const toggle = useCallback(() => {
    const newMode = toggleTheme()
    setModeState(newMode)
    setResolvedTheme(getResolvedTheme())
  }, [])

  return {
    mode,
    resolvedTheme,
    isLoading,
    setMode,
    toggle
  }
}

/**
 * ✅ Simple hook for just getting the current resolved theme
 */
export function useResolvedTheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const resolved = getResolvedTheme()
    setTheme(resolved)

    // Listen for changes
    const cleanup = listenForSystemThemeChanges(systemTheme => {
      const currentTheme = getUnifiedTheme()
      if (currentTheme.mode === 'system') {
        setTheme(systemTheme)
      }
    })

    return cleanup
  }, [])

  return theme
}

/**
 * ✅ Simple hook for checking if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const resolvedTheme = useResolvedTheme()
  return resolvedTheme === 'dark'
}
