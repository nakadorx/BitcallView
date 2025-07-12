'use client'

import Cookies from 'js-cookie'
import { type Mode } from '@core/types'

// ===================================================================
// UNIFIED THEME MANAGEMENT - Eliminates Cookie Conflicts
// ===================================================================

/**
 * Single source of truth for theme storage
 * Uses only ONE cookie name to avoid conflicts
 */
const THEME_COOKIE_NAME = 'bitcall-theme-unified'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

interface ThemeData {
  mode: Mode
  systemPreference: 'light' | 'dark'
  lastUpdated: number
}

/**
 * ✅ GET theme from unified cookie
 */
export function getUnifiedTheme(): ThemeData {
  try {
    const cookieValue = Cookies.get(THEME_COOKIE_NAME)
    if (cookieValue) {
      return JSON.parse(cookieValue)
    }
  } catch (error) {
    console.warn('Failed to parse theme cookie:', error)
  }

  // Fallback: detect system preference
  const systemPreference =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'light'

  return {
    mode: 'system',
    systemPreference,
    lastUpdated: Date.now()
  }
}

/**
 * ✅ SET theme to unified cookie
 */
export function setUnifiedTheme(mode: Mode): void {
  const systemPreference =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : 'light'

  const themeData: ThemeData = {
    mode,
    systemPreference,
    lastUpdated: Date.now()
  }

  // Set unified cookie
  Cookies.set(THEME_COOKIE_NAME, JSON.stringify(themeData), {
    expires: THEME_COOKIE_MAX_AGE / (60 * 60 * 24), // Convert to days
    sameSite: 'lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:'
  })

  // Sync with MUI localStorage (for compatibility)
  if (typeof window !== 'undefined') {
    const resolvedMode = mode === 'system' ? systemPreference : mode
    localStorage.setItem('bitcall-mui-template-mode', resolvedMode)
  }
}

/**
 * ✅ GET current resolved theme (light/dark, not system)
 */
export function getResolvedTheme(): 'light' | 'dark' {
  const { mode, systemPreference } = getUnifiedTheme()
  return mode === 'system' ? systemPreference : (mode as 'light' | 'dark')
}

/**
 * ✅ APPLY theme to DOM immediately (no reload needed)
 */
export function applyThemeToDOM(): void {
  if (typeof window === 'undefined') return

  const resolvedTheme = getResolvedTheme()
  const htmlElement = document.documentElement

  // Apply Tailwind dark class
  if (resolvedTheme === 'dark') {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }

  // Apply data attribute for custom CSS
  htmlElement.setAttribute('data-theme', resolvedTheme)
}

/**
 * ✅ TOGGLE between light/dark (skips system)
 */
export function toggleTheme(): Mode {
  const currentTheme = getResolvedTheme()
  const newMode: Mode = currentTheme === 'dark' ? 'light' : 'dark'

  setUnifiedTheme(newMode)
  applyThemeToDOM()

  return newMode
}

/**
 * ✅ CLEAN old cookies (migration helper)
 */
export function cleanupOldThemeCookies(): void {
  if (typeof window === 'undefined') return

  // Remove old conflicting cookies
  const oldCookies = ['themeColor', 'colorPref']
  oldCookies.forEach(cookieName => {
    Cookies.remove(cookieName)
    // Also try with different paths
    Cookies.remove(cookieName, { path: '/' })
  })

  console.log('✅ Cleaned up old theme cookies')
}

/**
 * ✅ MIGRATE from old cookie system
 */
export function migrateFromOldSystem(): void {
  if (typeof window === 'undefined') return

  // Check if unified cookie already exists
  const existing = Cookies.get(THEME_COOKIE_NAME)
  if (existing) return // Already migrated

  // Try to get mode from old cookies
  let migratedMode: Mode = 'system'

  // Check old theme cookies
  const oldThemeColor = Cookies.get('themeColor')
  if (oldThemeColor && ['light', 'dark', 'system'].includes(oldThemeColor)) {
    migratedMode = oldThemeColor as Mode
  }

  // Check MUI localStorage
  const muiTheme = localStorage.getItem('bitcall-mui-template-mode')
  if (muiTheme && ['light', 'dark'].includes(muiTheme)) {
    migratedMode = muiTheme as Mode
  }

  // Set unified theme
  setUnifiedTheme(migratedMode)

  // Cleanup old cookies
  cleanupOldThemeCookies()

  console.log(`✅ Migrated theme from old system: ${migratedMode}`)
}

/**
 * ✅ LISTEN for system theme changes
 */
export function listenForSystemThemeChanges(callback: (theme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const handler = (e: MediaQueryListEvent) => {
    const newSystemTheme = e.matches ? 'dark' : 'light'

    // Update system preference in cookie
    const currentTheme = getUnifiedTheme()
    if (currentTheme.mode === 'system') {
      setUnifiedTheme('system') // This will update systemPreference
      applyThemeToDOM()
    }

    callback(newSystemTheme)
  }

  mediaQuery.addEventListener('change', handler)

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler)
}

/**
 * ✅ SERVER-SIDE theme detection (for SSR)
 */
export function getUnifiedThemeFromCookieString(cookieString: string): ThemeData {
  if (!cookieString) {
    return { mode: 'system', systemPreference: 'light', lastUpdated: Date.now() }
  }

  try {
    const match = cookieString.split('; ').find(row => row.startsWith(`${THEME_COOKIE_NAME}=`))

    if (match) {
      const value = decodeURIComponent(match.split('=')[1])
      return JSON.parse(value)
    }
  } catch (error) {
    console.warn('Failed to parse server-side theme cookie:', error)
  }

  return { mode: 'system', systemPreference: 'light', lastUpdated: Date.now() }
}
