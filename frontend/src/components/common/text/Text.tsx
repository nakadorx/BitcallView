import { Typography, TypographyProps } from '@mui/material'

interface TextProps extends Omit<TypographyProps, 'children'> {
  value?: string
  customBoldColor?: string
  children?: React.ReactNode
}

export const Text = ({ value, sx, customBoldColor, children, ...props }: TextProps) => {
  return (
    <Typography
      {...props}
      sx={{
        '& strong': {
          fontWeight: 'bold',
          color: customBoldColor ? customBoldColor : 'secondary.main'
        },
        ...sx
      }}
      color='text.primary'
      dangerouslySetInnerHTML={children ? undefined : { __html: value || '' }}
    >
      {children && children}
    </Typography>
  )
}

// TODO: remove this component
