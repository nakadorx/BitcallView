import { SxProps, Theme } from '@mui/material'

export const customCtaBtnSx: SxProps<Theme> = {
  fontFamily: 'Open Sans SemiBold',
  fontSize: { xs: '0.97rem', sm: '1.4rem' },
  borderRadius: 'var(--btn-border-radius)',
  padding: { xs: '0.8rem 1.8rem', sm: '1.1rem 2.7rem' },
  transition: 'background-color 0.3s ease'
}
export const customCtaBtnWCSx: SxProps<Theme> = {
  fontFamily: 'Open Sans SemiBold',
  fontSize: { xs: '0.97rem', sm: '1.4rem' },
  borderRadius: 'var(--btn-border-radius)',
  padding: { xs: '0.8rem 1.8rem', sm: '1.1rem 2.7rem' },
  transition: 'background-color 0.3s ease',
  color: 'white'
}
export const customCtaBtnWCSx2: SxProps<Theme> = {
  fontFamily: '"Open Sans SemiBold", sans-serif',
  fontSize: { xs: '0.9rem', sm: '1rem' },
  borderRadius: 'var(--btn-border-radius)',
  padding: '0.6rem 2rem ',
  transition: 'background-color 0.3s ease',
  color: 'white'
}
