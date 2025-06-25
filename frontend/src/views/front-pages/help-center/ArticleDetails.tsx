'use client'

import React, { useEffect, useRef, useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Component Imports
import Link from '@components/Link'
import DirectionalIcon from '@components/DirectionalIcon'

// Utils
import { formatDate } from '@/views/blog/utils/common'
import { useParams } from 'next/navigation'

function processDarkLightHtml(html: string, mode: 'light' | 'dark'): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const imgs = Array.from(doc.querySelectorAll('img.dark-light-img'))

  imgs.forEach(img => {
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

const ArticleDetails: React.FC<{ articleData: any }> = ({ articleData }) => {
  const { lang: locale } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const getLocalized = (field: any) =>
    typeof field === 'object' ? field[locale as string] || field.en || Object.values(field)[0] : field

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  useEffect(() => {
    const ids = articleData.sections.map((s: any) => `section-${s.id}`)
    const els = ids.map(id => document.getElementById(id))
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )
    observerRef.current?.disconnect()
    els.forEach(el => el && obs.observe(el))
    observerRef.current = obs
    return () => obs.disconnect()
  }, [articleData.sections])

  return (
    <section className='bg-backgroundPaper pbs-[70px] mt-3'>
      <div className='max-w-screen-lg mx-auto px-4 md:px-6'>
        <Grid container spacing={6}>
          {/* Main column */}
          <Grid item xs={12} lg={8}>
            {/* Header */}
            <div className='flex flex-col gap-2'>
              <Breadcrumbs aria-label='breadcrumb'>
                <Link href={`/${locale}/help-center`} className='hover:text-primary'>
                  Help Center
                </Link>
                <Link href={`/${locale}/help-center/article/${articleData.slug}`} className='hover:text-primary'>
                  {getLocalized(articleData.title)}
                </Link>
              </Breadcrumbs>
              <Typography variant='h4'>{getLocalized(articleData.title)}</Typography>
              <Typography>{formatDate(articleData.updatedAt)}</Typography>
            </div>

            <Divider className='mlb-6' />

            {/* Mobile TOC */}
            {isMobile && (
              <div className='flex flex-col gap-2 mb-6'>
                <Typography variant='h6'>Sections in this article</Typography>
                <div className='flex gap-3 overflow-x-auto pb-2'>
                  {articleData.sections.map((sec: any) => (
                    <a
                      key={sec.id}
                      href={`#section-${sec.id}`}
                      className='whitespace-nowrap text-sm text-primary hover:underline'
                    >
                      {getLocalized(sec.title)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className='flex flex-col gap-6 overflow-x-auto' style={{ maxWidth: '100%', paddingRight: '1rem' }}>
              <div
                className='flex flex-col gap-6'
                style={{ minWidth: 'min(100%, 500px)', maxWidth: '800px', marginInline: 'auto' }}
              >
                {articleData.sections.map((sec: any) => (
                  <div key={sec.id} id={`section-${sec.id}`} className='flex flex-col gap-2 scroll-mt-24'>
                    <Typography variant='h5'>{getLocalized(sec.title)}</Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: processDarkLightHtml(getLocalized(sec.description), theme.palette.mode)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Grid>

          {/* Desktop TOC */}
          {!isMobile && (
            <Grid item xs={12} lg={4}>
              <div className='flex flex-col gap-6 sticky top-28'>
                <FormControl fullWidth variant='outlined'>
                  <OutlinedInput
                    placeholder='Search...'
                    startAdornment={
                      <InputAdornment position='start'>
                        <i className='ri-search-line' />
                      </InputAdornment>
                    }
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </FormControl>

                <div className='flex flex-col gap-4'>
                  <div className='pli-5 plb-2 bg-actionHover rounded-lg'>
                    <Typography variant='h5'>Sections in this article</Typography>
                  </div>
                  <div className='flex flex-col gap-4'>
                    {articleData.sections.map((sec: any) => {
                      const isActive = `section-${sec.id}` === activeSection
                      return (
                        <Typography
                          key={sec.id}
                          component='a'
                          href={`#section-${sec.id}`}
                          className={`flex gap-2 justify-between text-sm transition-all duration-200 ${
                            isActive ? 'text-primary' : 'text-textPrimary'
                          } hover:text-primary`}
                        >
                          <Typography color='inherit'>{getLocalized(sec.title)}</Typography>
                          <DirectionalIcon
                            className='text-textDisabled text-xl'
                            ltrIconClass='ri-arrow-right-s-line'
                            rtlIconClass='ri-arrow-left-s-line'
                          />
                        </Typography>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    </section>
  )
}

export default ArticleDetails
