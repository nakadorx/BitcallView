'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Intercom from '@intercom/messenger-js-sdk'
import { useSession } from 'next-auth/react'
import { useResolvedTheme } from '@/hooks/useUnifiedTheme'

interface IntercomChatProps {
  appId?: string
}

const IntercomChat = ({ appId = 'c9arr3w5' }: IntercomChatProps) => {
  const { data: session } = useSession()
  const resolvedTheme = useResolvedTheme()
  const pathname = usePathname()

  useEffect(() => {
    const isDarkMode = resolvedTheme === 'dark'

    const getPrimaryColor = () => {
      if (typeof window !== 'undefined') {
        const primaryFromCSS = getComputedStyle(document.documentElement)
          .getPropertyValue('--mui-palette-primary-main')
          .trim()
        return primaryFromCSS || (isDarkMode ? '#374151' : '#6366f1')
      }
      return isDarkMode ? '#374151' : '#6366f1'
    }

    const baseConfig = {
      app_id: appId,
      alignment: 'left',
      horizontal_padding: 40,
      vertical_padding: 50,
      action_color: getPrimaryColor(),
      background_color: isDarkMode ? '#1f2937' : '#ffffff',
      theme_mode: isDarkMode ? 'dark' : 'light'
    }

    if (session?.user) {
      const user = session.user
      Intercom({
        ...baseConfig,
        user_id: (user as any).id || user.email || `user_${Date.now()}`,
        name: user.name || 'Guest User',
        email: user.email || '',
        created_at: Math.floor(Date.now() / 1000)
      })
    } else {
      Intercom(baseConfig)
    }
  }, [session, appId, resolvedTheme, pathname])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Intercom) {
      const isDarkMode = resolvedTheme === 'dark'

      const getPrimaryColor = () => {
        const primaryFromCSS = getComputedStyle(document.documentElement)
          .getPropertyValue('--mui-palette-primary-main')
          .trim()
        return primaryFromCSS || (isDarkMode ? '#374151' : '#6366f1')
      }

      window.Intercom('update', {
        theme_mode: isDarkMode ? 'dark' : 'light',
        action_color: getPrimaryColor(),
        background_color: isDarkMode ? '#1f2937' : '#ffffff'
      })
    }
  }, [resolvedTheme, pathname])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.Intercom) {
        window.Intercom('shutdown')
      }
    }
  }, [])

  return null
}

export default IntercomChat
