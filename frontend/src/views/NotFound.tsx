'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const NotFound = ({ mode }: { mode: Mode }) => {
  // Vars
  const darkImg = '/images/pages/misc-mask-1-dark.png'
  const lightImg = '/images/pages/misc-mask-1-light.png'

  // Hooks
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        p: 2,
        overflow: 'hidden'
      }}
    >
      <Container maxWidth='sm' sx={{ textAlign: 'center', zIndex: 1 }}>
        <Typography
          variant='h1'
          component='div'
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '6rem', sm: '8rem' },
            color: 'text.primary'
          }}
        >
          404
        </Typography>
        <Typography variant='h4' sx={{ mb: 2 }} color='text.primary'>
          Page Not Found ⚠️
        </Typography>
        <Typography variant='body1' sx={{ mb: 4 }}>
          We couldn&apos;t find the page you are looking for.
        </Typography>

        <Button component={Link} href='/' variant='contained' color='primary' sx={{ color: 'white' }}>
          Back to Home
        </Button>
      </Container>
    </Box>
  )
}

export default NotFound
