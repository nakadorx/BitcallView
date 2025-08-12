import type { ButtonProps } from '@mui/material/Button'

export type SButtonProps = ButtonProps & {
  label?: string
  variant?: 'contained' | 'outlined'
  className?: string
  bold?: boolean
  fontSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export const SButton = ({
  label,
  variant,
  children,
  className,
  bold = false,
  fontSize = 'md',
  ...buttonProps
}: SButtonProps) => {
  const textSizeClass =
    fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : fontSize === 'xl' ? 'text-xl' : 'text-base'
  return (
    <button
      type='button'
      className={`
        cursor-pointer
         py-3 px-6
         rounded-lg
         ${bold ? 'font-bold' : 'font-medium'} ${textSizeClass}
          transition-all duration-200
          hover:outline-none hover:ring-7 hover:ring-opacity-30
          shadow-md
          hover:scale-105
          hover:shadow-lg
    ${
      variant === 'contained'
        ? 'bg-primary text-white hover:bg-primary/90 focus:ring-primary'
        : 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary'
    }
    ${className}

  `}
      {...buttonProps}
    >
      {children || label}
    </button>
  )
}
