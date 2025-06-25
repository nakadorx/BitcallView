'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ArticleDetails from '@/views/front-pages/help-center/ArticleDetails'
import api from '@/utils/api'
import { customLog } from '@/utils/commons'
import { toast } from 'react-toastify'

// MUI Imports
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const ArticleSkeleton = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <section className='w-full bg-backgroundPaper py-14'>
      <div className='w-full max-w-[1440px] px-6 md:px-10 mx-auto'>
        <Grid container spacing={6}>
          {/* Left Content Skeleton */}
          <Grid item xs={12} lg={8}>
            <Box mb={3}>
              <Skeleton variant='text' width={160} height={24} />
              <Skeleton variant='text' width='60%' height={40} sx={{ mt: 2 }} />
              <Skeleton variant='text' width='30%' height={24} />
            </Box>

            <Divider className='mb-6' />

            {isMobile && (
              <Box mb={4}>
                <Skeleton variant='text' width={180} height={28} />
                <Skeleton variant='rectangular' height={40} width='100%' sx={{ mt: 2, borderRadius: 1 }} />
              </Box>
            )}

            {[...Array(3)].map((_, i) => (
              <Box key={i} mb={6}>
                <Skeleton variant='text' width='50%' height={28} />
                <Skeleton variant='rectangular' height={100} width='100%' sx={{ mt: 2, borderRadius: 1 }} />
              </Box>
            ))}
          </Grid>

          {/* Right TOC Skeleton */}
          {!isMobile && (
            <Grid item xs={12} lg={4}>
              <Box className='sticky top-28'>
                <Skeleton variant='rectangular' width='100%' height={40} sx={{ borderRadius: 1, mb: 4 }} />
                <Box>
                  <Skeleton variant='text' width='70%' height={24} sx={{ mb: 2 }} />
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} variant='text' width='90%' height={20} sx={{ mb: 1 }} />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </div>
    </section>
  )
}

const ArticlePage = () => {
  const { slug, lang } = useParams() as { slug: string; lang: string }
  const [articleData, setArticleData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchArticle() {
      try {
        customLog('Fetching article with slug:', slug)
        const res = await api.get(`/help-center/articles/slug/${slug}`)
        customLog('Fetched article:', res.data)
        setArticleData(res.data)
      } catch (err: any) {
        console.error('Error fetching article:', err)
        setError('Error fetching article')
        toast.error('Error fetching article')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchArticle()
    }
  }, [slug])

  if (loading) return <ArticleSkeleton />
  if (error) return <p>{error}</p>
  if (!articleData) return <p>No article found.</p>

  return <ArticleDetails articleData={articleData} />
}

export default ArticlePage
