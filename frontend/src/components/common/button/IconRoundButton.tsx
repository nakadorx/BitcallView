'use client'

import React from 'react'

interface IconRoundButtonProps {
  onClick?: () => void
  ariaLabel: string
  disabled?: boolean
  icon: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'neutral'
}

const sizeToClasses: Record<NonNullable<IconRoundButtonProps['size']>, string> = {
  sm: 'w-9 h-9 text-lg',
  md: 'w-12 h-12 text-xl',
  lg: 'w-14 h-14 text-2xl'
}

const variantToClasses: Record<NonNullable<IconRoundButtonProps['variant']>, string> = {
  primary: 'bg-primary text-white hover:scale-110 transition-colors duration-200 disabled:opacity-50',
  neutral: 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50'
}

export const IconRoundButton: React.FC<IconRoundButtonProps> = ({
  onClick,
  ariaLabel,
  disabled = false,
  icon,
  className = '',
  size = 'md',
  variant = 'primary'
}) => {
  const sizeClasses = sizeToClasses[size]
  const variantClasses = variantToClasses[variant]

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`rounded-full flex transition-all duration-200 items-center justify-center cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon}
    </button>
  )
}

export default IconRoundButton
