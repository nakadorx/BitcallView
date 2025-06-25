import React from 'react'
import classnames from 'classnames'

interface TextProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  value?: string
  textColor?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'textPrimary'
    | 'textSecondary'
    | 'textDisabled'
  boldColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'textPrimary' | 'textSecondary'
  children?: React.ReactNode
  as?: 'div' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const textColorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
  success: 'text-success',
  textPrimary: 'text-textPrimary',
  textSecondary: 'text-textSecondary',
  textDisabled: 'text-textDisabled'
}

const boldColorClasses = {
  primary: '[&_strong]:text-primary',
  secondary: '[&_strong]:text-secondary',
  error: '[&_strong]:text-error',
  warning: '[&_strong]:text-warning',
  info: '[&_strong]:text-info',
  success: '[&_strong]:text-success',
  textPrimary: '[&_strong]:text-textPrimary',
  textSecondary: '[&_strong]:text-textSecondary'
}

export const Text = ({
  value,
  className,
  textColor = 'textPrimary',
  boldColor = 'secondary',
  children,
  as: Component = 'p',
  ...props
}: TextProps) => {
  // Check if content contains <strong> tags
  const hasStrongTags =
    value?.includes('<strong>') ||
    (children &&
      React.Children.toArray(children).some(child => typeof child === 'string' && child.includes('<strong>')))

  const classes = [textColorClasses[textColor], className]

  if (hasStrongTags) {
    classes.push('[&_strong]:font-bold')
    classes.push(boldColorClasses[boldColor])
  }

  return (
    <Component
      {...props}
      className={`${classnames(classes)} ${className}`}
      dangerouslySetInnerHTML={children ? undefined : { __html: value || '' }}
    >
      {children && children}
    </Component>
  )
}
