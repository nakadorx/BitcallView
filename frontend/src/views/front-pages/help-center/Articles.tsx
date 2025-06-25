'use client'

import { useTheme, Grid, Card, CardContent, Typography, Button } from '@mui/material'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useParams } from 'next/navigation'

export interface ArticleType {
  _id: string
  title: string | Record<string, string>
  slug: string
  mainImage: string
  description: string | Record<string, string>
  updatedAt: string
  isPopular: boolean
  icon?: string
}

interface ArticlesProps {
  articles: ArticleType[]
}

const Articles = ({ articles }) => {
  const params = useParams()
  const locale = params?.lang?.toString() || 'en'
  const theme = useTheme()

  const popularArticles = articles
    .filter(article => article.isPopular)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6)

  return (
    <section className='bg-backgroundPaper py-10 md:py-16'>
      <div className='mx-auto max-w-screen-lg px-0 sm:px-3'>
        <Typography variant='h4' className='text-center mb-6'>
          Popular Articles
        </Typography>
        <Grid container spacing={6}>
          {popularArticles.length > 0 ? (
            popularArticles.map(article => {
              const localizedTitle =
                typeof article.title === 'object'
                  ? article.title[locale] || article.title.en || Object.values(article.title)[0]
                  : article.title

              const localizedDesc =
                typeof article.description === 'object'
                  ? article.description[locale] || article.description.en || Object.values(article.description)[0]
                  : article.description

              return (
                <Grid item xs={12} lg={4} key={article._id}>
                  <Card variant='outlined'>
                    <CardContent
                      className='text-center'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        px: 3,
                        py: 4
                      }}
                    >
                      {article.icon ? (
                        <Icon
                          icon={article.icon}
                          style={{
                            fontSize: 64,
                            color: theme.palette.text.secondary,
                            marginBottom: 8
                          }}
                        />
                      ) : article.mainImage ? (
                        <img
                          src={article.mainImage}
                          alt={localizedTitle}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: 8
                          }}
                        />
                      ) : null}

                      <Typography variant='h6' sx={{ mb: 1 }}>
                        {localizedTitle}
                      </Typography>

                      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                        {localizedDesc}
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
              )
            })
          ) : (
            <Typography variant='body1' className='text-center' style={{ width: '100%' }}>
              No popular articles available.
            </Typography>
          )}
        </Grid>
      </div>
    </section>
  )
}

export default Articles
