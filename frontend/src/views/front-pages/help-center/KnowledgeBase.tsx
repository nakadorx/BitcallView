'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Icon } from '@iconify/react'
import DirectionalIcon from '@components/DirectionalIcon'
import CustomAvatar from '@core/components/mui/Avatar'

export type CategoryType = {
  _id: string
  title: string | Record<string, string>
  image: string
  icon?: string
}

export type ArticleType = {
  _id: string
  title: string | Record<string, string>
  slug: string
  icon?: string
  mainImage?: string
  category: CategoryType
}

interface KnowledgeBaseProps {
  categories: CategoryType[]
  articles: ArticleType[]
}

const KnowledgeBase = ({ categories, articles }) => {
  const { lang: locale } = useParams() as { lang: string }
  const [groupedArticles, setGroupedArticles] = useState<{ [key: string]: ArticleType[] }>({})
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)

  useEffect(() => {
    const grouping: { [key: string]: ArticleType[] } = {}
    articles.forEach(article => {
      const catId = typeof article.category === 'object' ? article.category._id : article.category
      if (catId) {
        if (!grouping[catId]) grouping[catId] = []
        grouping[catId].push(article)
      }
    })
    setGroupedArticles(grouping)
  }, [articles])

  const selectedCategory = categories.find(cat => cat._id === openCategoryId)
  const selectedArticles = openCategoryId ? groupedArticles[openCategoryId] || [] : []

  const renderArticleIcon = (article: ArticleType) => {
    if (article.icon) {
      return <Icon icon={article.icon} fontSize={20} style={{ marginInlineEnd: 8 }} />
    } else if (article.mainImage) {
      return (
        <Avatar
          src={article.mainImage}
          sx={{ width: 20, height: 20, marginInlineEnd: 1 }}
          variant='rounded'
          onError={(e: any) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = ''
          }}
        />
      )
    } else {
      return null
    }
  }

  const getLocalizedText = (field: string | Record<string, string>) => {
    if (typeof field === 'object') {
      return field[locale] || field.en || ''
    }
    return field
  }

  return (
    <Box component='section' sx={{ bgcolor: 'customColors.cardBg', py: { xs: 10, md: 19 } }}>
      <Container>
        <Typography variant='h4' align='center' sx={{ mb: 6 }}>
          Knowledge Base
        </Typography>
        <Grid container spacing={6}>
          {categories.map(category => {
            const articlesForCategory = (groupedArticles[category._id] || []).slice(0, 6)
            if (articlesForCategory.length === 0) return null

            return (
              <Grid item xs={12} lg={4} key={category._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 4 }}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      {category.icon ? (
                        <CustomAvatar skin='light' variant='rounded' color='primary' size={38}>
                          <Icon icon={category.icon} fontSize={22} />
                        </CustomAvatar>
                      ) : category.image ? (
                        <Avatar
                          src={category.image}
                          alt={getLocalizedText(category.title)}
                          sx={{ width: 38, height: 38 }}
                        />
                      ) : (
                        <Avatar sx={{ width: 38, height: 38 }}>{getLocalizedText(category.title).charAt(0)}</Avatar>
                      )}
                      <Typography variant='h5'>{getLocalizedText(category.title)}</Typography>
                    </Stack>

                    <Stack spacing={1} sx={{ flexGrow: 1 }}>
                      {articlesForCategory.map(article => (
                        <Box
                          key={article._id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'color 0.3s',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          <Typography
                            component={Link}
                            href={`/${locale}/help-center/article/${article.slug}`}
                            color='inherit'
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              textDecoration: 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '85%'
                            }}
                          >
                            {getLocalizedText(article.title)}
                          </Typography>
                          <DirectionalIcon
                            className='text-textDisabled text-xl'
                            ltrIconClass='ri-arrow-right-s-line'
                            rtlIconClass='ri-arrow-left-s-line'
                          />
                        </Box>
                      ))}
                    </Stack>

                    {groupedArticles[category._id]?.length > 6 && (
                      <Box sx={{ mt: 4, cursor: 'pointer' }} onClick={() => setOpenCategoryId(category._id)}>
                        <Typography color='primary' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          See all {groupedArticles[category._id].length} articles
                          <DirectionalIcon
                            className='text-lg'
                            ltrIconClass='ri-arrow-right-line'
                            rtlIconClass='ri-arrow-left-line'
                          />
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>

        {/* 🔍 Modal for showing all articles in category */}
        <Dialog open={!!openCategoryId} onClose={() => setOpenCategoryId(null)} fullWidth maxWidth='sm' scroll='paper'>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {getLocalizedText(selectedCategory?.title || '')}
            <IconButton onClick={() => setOpenCategoryId(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '60vh' }}>
            <Stack spacing={2}>
              {selectedArticles.map(article => (
                <Box
                  key={article._id}
                  component={Link}
                  href={`/${locale}/help-center/article/${article.slug}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'text.primary',
                    gap: 2,
                    borderRadius: 1,
                    px: 2,
                    py: 1.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      color: 'primary.main'
                    }
                  }}
                >
                  {renderArticleIcon(article)}
                  <Typography sx={{ flexGrow: 1 }}>{getLocalizedText(article.title)}</Typography>
                  <DirectionalIcon
                    className='text-textDisabled text-xl'
                    ltrIconClass='ri-arrow-right-s-line'
                    rtlIconClass='ri-arrow-left-s-line'
                  />
                </Box>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  )
}

export default KnowledgeBase
