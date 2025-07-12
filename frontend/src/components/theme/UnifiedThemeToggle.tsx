'use client'

import { useUnifiedTheme } from '@/hooks/useUnifiedTheme'

interface UnifiedThemeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

/**
 * ✅ Simple theme toggle button using unified theme system
 * No more cookie conflicts, no page reload needed!
 */
export function UnifiedThemeToggle({ className = '', size = 'md', showLabel = false }: UnifiedThemeToggleProps) {
  const { mode, resolvedTheme, toggle, setMode } = useUnifiedTheme()

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  const getIcon = () => {
    switch (mode) {
      case 'dark':
        return '🌙'
      case 'light':
        return '☀️'
      case 'system':
        return '🖥️'
      default:
        return '☀️'
    }
  }

  const getNextMode = () => {
    switch (mode) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'system'
      case 'system':
        return 'light'
      default:
        return 'light'
    }
  }

  const handleClick = () => {
    const nextMode = getNextMode()
    setMode(nextMode)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          bg-gray-200 hover:bg-gray-300
          dark:bg-gray-700 dark:hover:bg-gray-600
          rounded-full
          flex items-center justify-center
          transition-all duration-200
          hover:scale-110
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        title={`Current: ${mode} mode (${resolvedTheme})`}
        aria-label={`Switch theme mode. Current: ${mode}`}
      >
        <span className='text-lg'>{getIcon()}</span>
      </button>

      {showLabel && (
        <span className='text-sm text-gray-600 dark:text-gray-400 capitalize'>
          {mode} ({resolvedTheme})
        </span>
      )}
    </div>
  )
}

/**
 * ✅ Simple light/dark toggle (no system mode)
 */
export function SimpleThemeToggle({ className = '' }: { className?: string }) {
  const { toggle, resolvedTheme } = useUnifiedTheme()

  return (
    <button
      onClick={toggle}
      className={`
        w-10 h-10
        bg-gray-200 hover:bg-gray-300
        dark:bg-gray-700 dark:hover:bg-gray-600
        rounded-full
        flex items-center justify-center
        transition-all duration-200
        hover:scale-110
        ${className}
      `}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Toggle theme. Current: ${resolvedTheme}`}
    >
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
