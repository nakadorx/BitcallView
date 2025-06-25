'use client'

import type { FC } from 'react'
import Link from 'next/link'

// MUI Imports
import { Typography, Button, Card, CardContent, Grid, Box, Container, useTheme } from '@mui/material'

// Iconify
import { Icon } from '@iconify/react'

// Router (locale from URL)
import { useParams } from 'next/navigation'

interface Article {
  _id: string
  slug: string
  title: string | Record<string, string>
  description: string | Record<string, string>
  mainImage: string
  icon?: string
}

interface Props {
  articles?: Article[]
}

const KeepLearning: FC<Props> = ({ articles = [] }) => {
  const { lang: locale } = useParams() as { lang: string }
  const theme = useTheme()

  const getLocalizedText = (field: string | Record<string, string>) => {
    if (typeof field === 'object') {
      return field[locale] || field.en || ''
    }
    return field
  }

  return (
    <Box
      component='section'
      sx={{
        bgcolor: 'background.paper',
        py: { xs: 10, md: 15 }
      }}
    >
      <Container>
        <Typography variant='h4' align='center' sx={{ mb: 6 }}>
          Keep Learning
        </Typography>

        <Grid container spacing={6}>
          {articles.length > 0 ? (
            articles.map(article => (
              <Grid item xs={12} lg={4} key={article._id}>
                <Card variant='outlined'>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: 2,
                      px: 3,
                      py: 4
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      {article.icon ? (
                        <Icon icon={article.icon} style={{ fontSize: 64, color: theme.palette.text.secondary }} />
                      ) : article.mainImage ? (
                        <img
                          src={article.mainImage}
                          alt={getLocalizedText(article.title)}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : null}
                    </Box>

                    <Typography variant='h6' sx={{ mb: 1 }}>
                      {getLocalizedText(article.title)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                      {getLocalizedText(article.description)}
                    </Typography>
                    <Button
                      component={Link}
                      href={`/${locale}/help-center/article/${article.slug}`}
                      variant='outlined'
                      size='small'
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant='body1' align='center'>
                No articles available.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )
}

export default KeepLearning
