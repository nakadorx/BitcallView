'use client'

import Link from 'next/link'
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Box } from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import PolicyIcon from '@mui/icons-material/Policy'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import HandshakeIcon from '@mui/icons-material/Handshake'
import { useT } from '@/i18n/client'

interface Props {
  locale: string
}

export default function LegalHubClient({ locale }: Props) {
  const { t } = useT('legal')

  const legalItems = [
    {
      title: t('hub.terms'),
      href: `/${locale}/legal/terms`,
      icon: <GavelIcon fontSize='large' color='primary' />
    },
    {
      title: t('hub.aup'),
      href: `/${locale}/legal/aup`,
      icon: <PolicyIcon fontSize='large' color='primary' />
    },
    {
      title: t('hub.privacy'),
      href: `/${locale}/legal/privacy`,
      icon: <PrivacyTipIcon fontSize='large' color='primary' />
    },
    {
      title: t('hub.vendor'),
      href: `/${locale}/legal/vendor-agreement`,
      icon: <HandshakeIcon fontSize='large' color='primary' />
    }
  ]

  return (
    <Container maxWidth='md' sx={{ my: 4 }}>
      <Typography variant='h3' component='h1' gutterBottom>
        {t('hub.title')}
      </Typography>
      <Grid container spacing={4}>
        {legalItems.map(item => (
          <Grid item xs={12} sm={6} key={item.title}>
            <Link href={item.href}>
              <Card
                component='a'
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <CardActionArea>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography variant='h6' component='h2'>
                      {item.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                      {t('hub.readMore')}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
