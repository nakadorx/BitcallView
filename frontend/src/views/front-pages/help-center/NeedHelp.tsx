'use client'

import Link from 'next/link'

// MUI Imports
import { Box, Typography, Button, Stack } from '@mui/material'

import { getLocale } from '@/utils/commons'

const locale = getLocale()

const NeedHelp = () => {
  return (
    <Box
      component='section'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        py: { xs: 6, md: 12 },
        px: { xs: 2, md: 6 },
        backgroundColor: 'customColors.cardBg'
      }}
    >
      <Typography variant='h4' align='center'>
        Still need help?
      </Typography>
      <Typography align='center' maxWidth={600}>
        Our specialists are always happy to help. Contact us during standard business hours or email us 24/7, and
        we&apos;ll get back to you.
      </Typography>
      <Stack direction='row' spacing={2} flexWrap='wrap' justifyContent='center'>
        <Button variant='contained'>Visit our community</Button>
        <Button variant='contained' component={Link} href={`/${locale}/#contact`}>
          Contact Us
        </Button>
      </Stack>
    </Box>
  )
}

export default NeedHelp
