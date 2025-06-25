// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardMedia'
import Skeleton from '@mui/material/Skeleton'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Utils Import
import api from '@/utils/api'
import { getLocale } from '@/utils/commons'
const Articles = ({ blogs, searchValue }: { blogs: any; searchValue: string }) => {
  const params = useParams()
  function useCurrentLang() {
    const params = useParams()
    return typeof params?.lang === 'string' ? params.lang : 'en' // fallback to 'en'
  }
  const theme = useTheme()
  const locale = useCurrentLang()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (Array.isArray(blogs)) {
      setTimeout(() => setLoading(false), 400) // Simulate a loading effect
    }
  }, [blogs])

  // Filter blogs based on search query
  const filteredBlogs = searchValue
    ? blogs.filter(blog =>
        [blog.title, blog.description, ...(blog.tags || [])].join(' ').toLowerCase().includes(searchValue.toLowerCase())
      )
    : blogs

  const getShortDescription = (desc: any, locale: string) => {
    const text =
      typeof desc === 'object' ? desc[locale] || Object.values(desc)[0] || '' : typeof desc === 'string' ? desc : ''
    return text.substring(0, 100) + '...'
  }

  const handleCardClick = async (slug: string) => {
    router.push(`/${locale}/blog/${slug}`)
  }

  return (
    <section className='md:plb-[30px] plb-[50px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Typography variant='h4' className='text-center mbe-6'>
          Blog Posts
        </Typography>
        <Grid container spacing={6}>
          {loading ? (
            // Show Skeleton Loaders while data is loading
            Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} lg={4} key={index}>
                <Card variant='outlined'>
                  <Skeleton variant='rectangular' height={180} width='100%' />
                  <CardContent className='flex flex-col items-center justify-center gap-3 text-center'>
                    <Skeleton variant='text' width='60%' height={30} />
                    <Skeleton variant='text' width='80%' height={20} />
                    <Skeleton variant='rectangular' width='50%' height={40} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog: any) => (
              <Grid item xs={12} lg={4} key={blog.id}>
                <Card variant='outlined'>
                  <CardMedia
                    component='img'
                    height='180'
                    image={
                      typeof blog.mainImage === 'object'
                        ? theme.palette.mode === 'dark'
                          ? blog.mainImage.dark || blog.mainImage.light
                          : blog.mainImage.light
                        : blog.mainImage
                    }
                    alt={blog?.title || 'Blog Post'}
                    sx={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                  />
                  <CardContent className='flex flex-col items-center justify-center gap-3 text-center'>
                    <Typography variant='h5'>
                      {typeof blog.title === 'object'
                        ? blog.title[locale] || Object.values(blog.title)[0]
                        : blog.title || 'No Title'}
                    </Typography>{' '}
                    <Typography>{getShortDescription(blog.description, locale)}</Typography>
                    <Button onClick={() => handleCardClick(blog?.slug)} variant='outlined'>
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant='h6' align='center'>
                No posts available. Please check back another time.
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>
    </section>
  )
}

export default Articles
