'use client'

import { useState } from 'react'
import { useT } from '@/i18n/client'

import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Badge from '@mui/material/Badge'
import Rating from '@mui/material/Rating'
import { Box } from '@mui/material'

import { useKeenSlider } from 'keen-slider/react'
import type { TrackDetails } from 'keen-slider/react'
import classnames from 'classnames'

import AppKeenSlider from '@/libs/styles/AppKeenSlider'
import frontCommonStyles from '@views/front-pages/styles.module.css'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'

const CustomerReviews = () => {
  const { t } = useT('common')

  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [details, setDetails] = useState<TrackDetails>()

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged: slider => setCurrentSlide(slider.track.details.rel),
      created: () => setLoaded(true),
      detailsChanged: s => setDetails(s.track.details),
      slides: {
        perView: 4,
        origin: 'center'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: { perView: 3, spacing: 26, origin: 'center' }
        },
        '(max-width: 900px)': {
          slides: { perView: 2, spacing: 26, origin: 'center' }
        },
        '(max-width: 600px)': {
          slides: { perView: 1, spacing: 26, origin: 'center' }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        const mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  const scaleStyle = (idx: number) => {
    if (!details) return {}
    const activeSlideIndex = details.rel

    return {
      transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
      ...(activeSlideIndex === idx ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.9)', opacity: 0.5 })
    }
  }

  return (
    <section id='reviews' className='flex flex-col gap-4'>
      <Box sx={{ mb: 'var(--section-margin-bottom)' }}>
        <Box
          className={classnames('flex flex-col items-center justify-center', frontCommonStyles.layoutSpacing)}
          sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              mb: { xs: 0.6, md: 0.8 }
            }}
          >
            <AnimatedHeadline variant='slideLeft'>{t('customerReviews.title')}</AnimatedHeadline>
          </Box>

          <Typography sx={{ fontSize: { xs: '1rem', md: '1.4rem' } }}>{t('customerReviews.subtitle')}</Typography>
        </Box>

        <AppKeenSlider>
          <>
            <div ref={sliderRef} className='keen-slider'>
              {(t('customerReviews.items', { returnObjects: true }) as any[]).map((item, index) => (
                <div key={index} className='keen-slider__slide flex px-6 sm:p-4'>
                  <Card
                    elevation={8}
                    className='flex items-center'
                    style={scaleStyle(index)}
                    sx={{
                      boxShadow: theme =>
                        theme.palette.mode === 'dark'
                          ? '0px 4px 12px rgba(255,255,255,0.2)'
                          : '0px 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <CardContent className='p-8 items-center mlb-auto'>
                      <div className='flex flex-col gap-4 items-center justify-center text-center'>
                        <Typography color='text.primary'>{item.desc}</Typography>
                        <Rating value={item.rating} readOnly />
                        <div>
                          <Typography color='text.primary' className='font-medium'>
                            {item.name}
                          </Typography>
                          <Typography variant='body2'>{item.position}</Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            {loaded && instanceRef.current && (
              <div className='swiper-dots'>
                {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => (
                  <Badge
                    key={idx}
                    variant='dot'
                    component='div'
                    className={classnames({ active: currentSlide === idx })}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                  />
                ))}
              </div>
            )}
          </>
        </AppKeenSlider>
      </Box>
    </section>
  )
}

export default CustomerReviews
