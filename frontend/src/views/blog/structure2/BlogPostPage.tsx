'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// Next Import
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Link,
  Breadcrumbs,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Link as MuiLink
} from '@mui/material'
import Twitter from '@mui/icons-material/Twitter'
import Star from '@mui/icons-material/Star'
import StarBorder from '@mui/icons-material/StarBorder'
import LinkIcon from '@mui/icons-material/Link'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import Comment from '@mui/icons-material/Comment'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Home from '@mui/icons-material/Home'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import Twittericon from '@mui/icons-material/Twitter'

import HomeIcon from '@mui/icons-material/Home'
// thirdy party imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/swiper-bundle.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Utils Imports
import { formatDate } from '../utils/common'
import { customLog, getLocale } from '@/utils/commons'
export default function BlogPost({ data }: { data: any }) {
  useEffect(() => {
    customLog('in BlogPostPage data: ', data)
  })
  function useCurrentLang() {
    const params = useParams()
    return typeof params?.lang === 'string' ? params.lang : 'en' // fallback to 'en'
  }
  const theme = useTheme()
  const locale = useCurrentLang()
  const VIEWPORT_THRESHOLD = 0.4 // Set threshold for active section

  const [isSticky, setIsSticky] = useState(false)

  const [activeSection, setActiveSection] = useState<number | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [sidebarTopOffset, setSidebarTopOffset] = useState(0)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (sidebarRef.current) {
      const offset = sidebarRef.current.getBoundingClientRect().top + window.scrollY

      setSidebarTopOffset(offset)
    }

    const handleScroll = () => {
      if (!sidebarRef.current) return

      const scrollY = window.scrollY

      if (scrollY > sidebarTopOffset) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }

      // Highlight active section when it crosses the defined threshold of the viewport height
      const viewportHeight = window.innerHeight

      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()

          if (rect.top <= viewportHeight * VIEWPORT_THRESHOLD && rect.bottom > viewportHeight * VIEWPORT_THRESHOLD) {
            setActiveSection(index)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sidebarTopOffset])

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  const handleRating = (value: number) => {
    if (rating === 0) {
      // Allow rating only if no rating is set
      setRating(value)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href) // Copy current page URL
    toast.success('Link copied to clipboard successfully!', {
      position: 'top-center',
      autoClose: 3000, // Auto close after 3 seconds
      hideProgressBar: true, // Remove the progress bar for cleaner look
      closeOnClick: true, // Close when clicked
      pauseOnHover: true, // Pause closing on hover
      draggable: true // Allow dragging
    })
  }

  function processDarkLightHtml(html: string, mode: 'light' | 'dark'): string {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const imgs = Array.from(doc.querySelectorAll('img.dark-light-img'))

    imgs.forEach(img => {
      // Normalize attributes
      if (!img.hasAttribute('data-light') && img.hasAttribute('light')) {
        img.setAttribute('data-light', img.getAttribute('light')!)
        img.removeAttribute('light')
      }
      if (!img.hasAttribute('data-dark') && img.hasAttribute('dark')) {
        img.setAttribute('data-dark', img.getAttribute('dark')!)
        img.removeAttribute('dark')
      }

      const lightSrc = img.getAttribute('data-light')
      const darkSrc = img.getAttribute('data-dark')
      const chosen = mode === 'dark' ? darkSrc : lightSrc

      if (chosen) {
        img.setAttribute('src', chosen)
      }
    })

    return doc.body.innerHTML
  }

  return (
    <Container maxWidth='lg' sx={{ paddingTop: 4, paddingBottom: 4 }}>
      {/* ✅ Breadcrumb Navigation */}
      <Breadcrumbs aria-label='breadcrumb' sx={{ marginBottom: 2 }}>
        <Link href='/' sx={{ display: 'flex', alignItems: 'center' }}>
          <Home fontSize='small' sx={{ mr: 0.5 }} />
          Home
        </Link>
        <MuiLink href={`/${locale}/blog`}>Blog</MuiLink>
        <Typography color='text.primary'>
          {' '}
          {typeof data.title === 'object' ? data.title[locale] : data.title}
        </Typography>
      </Breadcrumbs>
      {/* Header */}
      {/* Banner Image */}
      <Box
        component='div'
        sx={{
          backgroundImage: `url(${
            typeof data.mainImage === 'object'
              ? theme.palette.mode === 'dark'
                ? data.mainImage.dark || data.mainImage.light
                : data.mainImage.light
              : data.mainImage
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '79vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          mb: 4
        }}
      ></Box>
      <Box display='flex' alignItems='center' gap={2}>
        <Box display='flex' alignItems='center' gap={1}>
          <CalendarMonth sx={{ color: 'text.primary', fontSize: 20 }} />
          <Typography variant='body2' color='text.secondary'>
            {formatDate(data.date)}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={1}>
          <Comment sx={{ color: 'text.primary', fontSize: 20 }} />
          <Typography variant='body2' color='text.secondary'>
            {data.commentCount} comments
          </Typography>
        </Box>
        {/* Blog title */}
      </Box>
      <Box flexGrow={1}>
        <Typography variant='h2' fontWeight='bold' sx={{ my: 2 }}>
          {typeof data.title === 'object' ? data.title[locale] : data.title}
        </Typography>
      </Box>
      <Box sx={{ mt: 2, mb: 8 }} display='flex' gap={1}>
        {Array.isArray(data.tags)
          ? data.tags.map((tag, index) => <Chip key={index} label={tag} />)
          : data.tags?.[locale]?.map((tag: string, index: number) => <Chip key={index} label={tag} />)}
      </Box>
      {/* Content Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <Typography variant='body1' paragraph>
            {typeof data.intro === 'object' ? data.intro[locale] : data.intro}
          </Typography>

          {data.sections?.map((section: { title: string; description: string }, index: number) => (
            <Box
              key={index}
              ref={(el: HTMLDivElement | null) => {
                sectionRefs.current[index] = el
              }}
              id={`section-${index}`}
              sx={{ marginBottom: 3 }}
            >
              <Typography variant='h5' fontWeight='bold' gutterBottom>
                {typeof section.title === 'object' ? section.title[locale] : section.title}
              </Typography>
              <Box
                dangerouslySetInnerHTML={{
                  __html: processDarkLightHtml(
                    typeof section.description === 'object' ? section.description[locale] : section.description,
                    theme.palette.mode
                  )
                }}
                sx={{
                  maxWidth: '100%',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  padding: 2,
                  borderRadius: 1,
                  '&::-webkit-scrollbar': { height: '6px' },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'primary.light', borderRadius: '3px' },
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'primary.light background.paper'
                }}
              />
            </Box>
          ))}

          {/* Footer of the blog */}
          <Box sx={{ marginTop: 6, padding: 4, color: 'white', borderRadius: 2 }}>
            {/* Navigation Section */}
            <Box display='flex' justifyContent='space-between' my={4}>
              {/* Previous Post */}
              <Button
                href={data?.previousPost?.slug || '#'}
                sx={{
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  textTransform: 'none'
                }}
                disabled={!data.previousPost} // Disable button if no previous post
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    marginRight: 1
                  }}
                >
                  <ArrowBack sx={{ color: 'text.primary', fontSize: '2rem' }} />
                </Box>
                <Box sx={{ ml: 10 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ marginBottom: 1 }}>
                    Previous Post
                  </Typography>
                  <Typography variant='h6'>
                    {typeof data.previousPost?.title === 'object'
                      ? data.previousPost.title[locale]
                      : data.previousPost?.title || 'No previous post'}
                  </Typography>
                </Box>
              </Button>

              {/* Next Post */}
              <Button
                href={data.nextPost?.slug || '#'}
                sx={{
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  textTransform: 'none'
                }}
                disabled={!data.nextPost} // Disable button if no next post
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    marginLeft: 1
                  }}
                >
                  <ArrowForward sx={{ color: 'text.primary', fontSize: '2rem' }} />
                </Box>
                <Box sx={{ mr: 10 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ marginBottom: 0.5 }}>
                    Next Post
                  </Typography>
                  <Typography variant='h6'>
                    {typeof data.nextPost?.title === 'object'
                      ? data.nextPost.title[locale]
                      : data.nextPost?.title || 'No next post'}
                  </Typography>{' '}
                </Box>
              </Button>
            </Box>

            {/* Social Media Icons for Mobile */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                justifyContent: 'space-between',
                marginTop: 4,
                pb: 4,
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <Box
                sx={{
                  pb: 4,
                  display: 'block',
                  width: '100%'
                }}
              >
                <Swiper
                  spaceBetween={10}
                  pagination={{
                    clickable: true,
                    renderBullet: (index, className) =>
                      `<span class="${className}" style="
                        background-color: rgba(255, 255, 255, 1);
                        width: 9px;
                        height: 9px;
                        margin: 5px;
                        border-radius: 50%;
                        "></span>`
                  }}
                  modules={[Pagination]}
                >
                  {data.images?.map((img: any, index: number) => {
                    const src =
                      typeof img === 'object'
                        ? theme.palette.mode === 'dark'
                          ? img.dark || img.light
                          : img.light
                        : img // fallback if old string format

                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={src}
                          alt={`Slide ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </SwiperSlide>
                    )
                  })}
                </Swiper>
              </Box>

              <Typography variant='body1' sx={{ mb: 1 }}>
                Share
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2, // Space between icons
                  marginBottom: 2 // Space between icons and carousel
                }}
              >
                {' '}
                <Link href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
                  <Twitter sx={{ fontSize: 24, color: 'text.primary' }} />
                </Link>
                <Link href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
                  <FacebookIcon sx={{ fontSize: 24, color: 'text.primary' }} />
                </Link>
                <Link href='https://linkedin.com' target='_blank' rel='noopener noreferrer'>
                  <LinkedInIcon sx={{ fontSize: 24, color: 'text.primary' }} />
                </Link>
                <Link href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
                  <InstagramIcon sx={{ fontSize: 24, color: 'text.primary' }} />
                </Link>
                <Tooltip title='Copy Link' arrow>
                  <Link onClick={handleCopyLink} sx={{ cursor: 'pointer' }}>
                    <LinkIcon sx={{ fontSize: 28, color: 'text.primary' }} />
                  </Link>
                </Tooltip>
              </Box>
            </Box>
            {/* Related Posts */}
            <Box sx={{ marginTop: 6 }}>
              <Typography variant='h5' sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                Related content
              </Typography>
              <Box>
                {data?.relatedPosts?.map((post: any, index: number) => (
                  <Card
                    key={index}
                    sx={{
                      backgroundColor: 'transparent',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 2,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      router.push(`/${locale}/blog/${post.slug}`)
                    }}
                  >
                    <Box
                      component='img'
                      src={
                        mounted
                          ? typeof post.mainImage === 'object'
                            ? theme.palette.mode === 'dark'
                              ? post.mainImage.dark || post.mainImage.light
                              : post.mainImage.light
                            : post.mainImage
                          : '' // Prevent mismatch on SSR
                      }
                      alt={post.title}
                      sx={{
                        width: 250,
                        height: 190,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        backgroundColor: 'grey.300' // fallback while loading
                      }}
                    />

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        padding: 2
                      }}
                    >
                      <Typography variant='h5' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        {typeof post.title === 'object' ? post.title[locale] : post.title}
                      </Typography>
                      <Box display='flex' alignItems='center' gap={1} marginBottom={1}>
                        <CalendarMonth sx={{ fontSize: 16, color: 'text.primary' }} />
                        <Typography variant='body2' color='text.secondary'>
                          {formatDate(post.date)}
                        </Typography>
                        <Comment sx={{ fontSize: 16, color: 'text.secondary', marginLeft: 2 }} />
                        <Typography variant='body2' color='text.secondary'>
                          {post.commentCount} comments
                        </Typography>
                      </Box>
                      <Typography variant='body1' color='text.secondary'>
                        {typeof post.description === 'object' ? post.description[locale] : post.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right section (desktop) */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          {/* Swiper Carousel */}
          <Box sx={{ marginBottom: 2 }}>
            <Swiper
              spaceBetween={10}
              pagination={{
                clickable: true,
                renderBullet: (index, className) =>
                  `<span class="${className}" style="
                    background-color: rgba(255, 255, 255, 1);
                    width: 9px;
                    height: 9px;
                    margin: 5px;
                    border-radius: 50%;
                    bottom: 0;
                  "></span>`
              }}
              modules={[Pagination]}
            >
              {data.images?.map((img: any, index: number) => {
                const src =
                  typeof img === 'object' ? (theme.palette.mode === 'dark' ? img.dark || img.light : img.light) : img // fallback if old string format

                return (
                  <SwiperSlide key={index}>
                    <img
                      src={src}
                      alt={`Slide ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </Box>
          <Typography sx={{ mb: 1 }}>Share</Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2, // Space between icons
              marginBottom: 2 // Space between icons and carousel
            }}
          >
            <Link href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
              <Twittericon sx={{ fontSize: 24, color: 'text.primary' }} />
            </Link>
            <Link href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
              <FacebookIcon sx={{ fontSize: 24, color: 'text.primary' }} />
            </Link>
            <Link href='https://linkedin.com' target='_blank' rel='noopener noreferrer'>
              <LinkedInIcon sx={{ fontSize: 24, color: 'text.primary' }} />
            </Link>
            <Link href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
              <InstagramIcon sx={{ fontSize: 24, color: 'text.primary' }} />
            </Link>
            <Tooltip title='Copy Link' arrow>
              <Link onClick={handleCopyLink} sx={{ cursor: 'pointer' }}>
                <LinkIcon sx={{ fontSize: 30, color: 'text.primary' }} />
              </Link>
            </Tooltip>
          </Box>

          <Box
            ref={sidebarRef}
            sx={{
              position: isSticky ? 'fixed' : 'relative',
              top: isSticky ? '60px' : 'auto',
              width: '300px',
              zIndex: 999,
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <Card>
              <CardContent>
                <Box component='ul' sx={{ position: 'relative', paddingLeft: 2, listStyle: 'none' }}>
                  {data.sections?.map((section: { title: string; description: string }, index: number) => (
                    <li
                      key={index}
                      style={{
                        position: 'relative',
                        paddingLeft: '24px'
                      }}
                    >
                      {activeSection === index && (
                        <Box
                          sx={{
                            position: 'absolute',
                            insetInlineStart: '-24px',
                            top: 0,
                            width: '3px',
                            height: '100%',
                            backgroundColor: 'primary.main',
                            borderRadius: '0 10px 10px 0',
                            transition: 'all 0.3s ease-in-out'
                          }}
                        ></Box>
                      )}
                      <Link
                        href={`#section-${index}`}
                        sx={{
                          fontWeight: activeSection === index ? 'bold' : 'normal',
                          color: activeSection === index ? 'primary.main' : 'text.primary',
                          transition: 'font-weight 0.3s ease-in-out',
                          textDecoration: 'none',
                          fontSize: '0.8rem'
                        }}
                      >
                        {typeof section.title === 'object' ? section.title[locale] : section.title}
                      </Link>
                    </li>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
