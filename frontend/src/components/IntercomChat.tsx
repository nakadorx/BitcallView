'use client'

// React Imports
import { useEffect } from 'react'

// Third-party Imports
import Intercom from '@intercom/messenger-js-sdk'
import { useSession } from 'next-auth/react'

// Hooks Imports
import { useResolvedTheme } from '@/hooks/useUnifiedTheme'

interface IntercomChatProps {
  appId?: string
}

const IntercomChat = ({ appId = 'c9arr3w5' }: IntercomChatProps) => {
  const { data: session } = useSession()
  const resolvedTheme = useResolvedTheme()

  // Initialize Intercom when session changes
  useEffect(() => {
    if (session?.user) {
      const user = session.user

      // Initialize Intercom with user data
      Intercom({
        app_id: appId,
        user_id: (user as any).id || user.email || `user_${Date.now()}`,
        name: user.name || 'Guest User',
        email: user.email || '',
        // Use current time as created_at since we don't have this field in the user data
        created_at: Math.floor(Date.now() / 1000),
        // Position the widget in top right
        alignment: 'right',
        horizontal_padding: 40,
        vertical_padding: 50 // 3rem = 48px (assuming 16px base font size)
      })
    } else {
      // Initialize Intercom for anonymous users
      Intercom({
        app_id: appId,
        // Position the widget in top right
        alignment: 'right',
        horizontal_padding: 40,
        vertical_padding: 50 // 3rem = 48px (assuming 16px base font size)
      })
    }
  }, [session, appId])

  // Update theme when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Intercom) {
      window.Intercom('update', {
        theme_mode: resolvedTheme === 'dark' ? 'dark' : 'light'
      })
    }
  }, [resolvedTheme])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.Intercom) {
        window.Intercom('shutdown')
      }
    }
  }, [])

  // Add custom CSS for positioning at top
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      #intercom-container {
        position: fixed !important;
        top: 5rem !important;
        right: 20px !important;
        z-index: 2147483647 !important;
      }

      .intercom-messenger-frame {
        position: fixed !important;
        top: 5rem !important;
        right: 20px !important;
      }

      .intercom-borderless-frame {
        position: fixed !important;
        top: 5rem !important;
        right: 20px !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null // This component doesn't render anything
}

export default IntercomChat
