import type { ButtonProps } from '@mui/material/Button'

export type SButtonProps = ButtonProps & {
  label?: string
  variant?: 'contained' | 'outlined'
  className?: string
}

export const SButton = ({ label, variant, children, className, ...buttonProps }: SButtonProps) => {
  return (
    <button
      type='button'
      className={`
        cursor-pointer
         py-3 px-6 
         rounded-lg 
         font-medium text-base
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
