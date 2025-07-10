'use client'

import { useState, useEffect } from 'react'
import { useT } from '@/i18n/client'
import { useKeenSlider } from 'keen-slider/react'
import type { TrackDetails } from 'keen-slider/react'
import classnames from 'classnames'
import AppKeenSlider from '@/libs/styles/AppKeenSlider'
import frontCommonStyles from '@views/front-pages/styles.module.css'
import { Text } from '@/components/common/text'

// Enhanced Star Rating Component with structured data
const StarRating = ({
  rating,
  reviewerName,
  className = ''
}: {
  rating: number
  reviewerName: string
  className?: string
}) => {
  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role='img'
      aria-label={`${rating} out of 5 stars rating by ${reviewerName}`}
      itemScope
      itemType='https://schema.org/Rating'
    >
      <meta itemProp='ratingValue' content={rating.toString()} />
      <meta itemProp='bestRating' content='5' />
      <meta itemProp='worstRating' content='1' />
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          aria-hidden='true'
        >
          ★
        </span>
      ))}
    </div>
  )
}

const CustomerReviews = () => {
  const { t } = useT('common')

  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [details, setDetails] = useState<TrackDetails>()
  const [announceSlide, setAnnounceSlide] = useState<string>('')

  const [sliderRef, instanceRef] = useKeenSlider<HTMLUListElement>(
    {
      loop: true,
      slideChanged: slider => {
        const newSlide = slider.track.details.rel
        setCurrentSlide(newSlide)
        // Announce slide change for screen readers
        const items = t('customerReviews.items', { returnObjects: true }) as any[]
        if (items[newSlide]) {
          setAnnounceSlide(`Now viewing testimonial ${newSlide + 1} of ${items.length} by ${items[newSlide].name}`)
        }
      },
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
          }, 4000) // Slightly longer for better UX
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  const getSlideClasses = (idx: number) => {
    if (!details) return 'scale-90 opacity-50'
    const activeSlideIndex = details.rel
    return activeSlideIndex === idx ? 'scale-100 opacity-100' : 'scale-90 opacity-50'
  }

  // Clear announcement after screen reader has time to read it
  useEffect(() => {
    if (announceSlide) {
      const timer = setTimeout(() => setAnnounceSlide(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [announceSlide])

  const testimonials = t('customerReviews.items', { returnObjects: true }) as any[]

  return (
    <section
      className='flex flex-col gap-2 mb-[5rem]'
      aria-labelledby='testimonials-heading'
      itemScope
      itemType='https://schema.org/Review'
    >
      {/* Screen reader announcements */}
      <div aria-live='polite' aria-atomic='true' className='sr-only' role='status'>
        {announceSlide}
      </div>

      <div
        className={`${frontCommonStyles.layoutSpacing} flex flex-col items-center justify-center text-center p-2 md:p-4`}
      >
        <div className='flex justify-center items-center flex-wrap mb-2 md:mb-3'>
          <Text
            as='h3'
            id='testimonials-heading'
            className='text-3xl md:text-4xl font-extrabold font-open-sans-extra-bold'
          >
            {t('customerReviews.title')}
          </Text>
        </div>

        <Text as='p' className='text-base md:text-xl text-textSecondary mb-5' role='doc-subtitle'>
          {t('customerReviews.subtitle')}
        </Text>
      </div>

      <AppKeenSlider>
        <>
          <ul
            ref={sliderRef}
            className='keen-slider list-none'
            role='region'
            aria-labelledby='testimonials-heading'
            aria-live='polite'
          >
            {testimonials.map((item, index) => (
              <li
                key={index}
                className='keen-slider__slide flex px-3 sm:px-2 py-0 sm:py-2'
                role='group'
                aria-roledescription='testimonial'
                aria-label={`Testimonial ${index + 1} of ${testimonials.length}`}
              >
                <article
                  className={`flex items-center  bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-white/20 transition-all duration-200 ease-in-out ${getSlideClasses(index)}`}
                  itemScope
                  itemType='https://schema.org/Review'
                >
                  <div className='p-4 flex items-center mx-auto'>
                    <div className='flex flex-col gap-2 items-center justify-center text-center'>
                      <blockquote className='text-sm leading-relaxed text-textPrimary' itemProp='reviewBody'>
                        <Text as='p' className='text-sm leading-relaxed text-textPrimary'>
                          {item.desc}
                        </Text>
                      </blockquote>

                      <div itemProp='reviewRating'>
                        <StarRating rating={item.rating} reviewerName={item.name} />
                      </div>

                      <footer className='mt-2' itemProp='author' itemScope itemType='https://schema.org/Person'>
                        <Text as='p' className='font-medium text-sm text-textPrimary' itemProp='name'>
                          {item.name}
                        </Text>
                        <Text as='p' className='text-xs mt-1 text-textSecondary' itemProp='jobTitle'>
                          {item.position}
                        </Text>
                      </footer>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          {loaded && instanceRef.current && (
            <nav className='flex justify-center gap-1 mt-2' role='tablist' aria-label='Choose testimonial to view'>
              {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => (
                <button
                  key={idx}
                  type='button'
                  role='tab'
                  aria-label={`View testimonial ${idx + 1} by ${testimonials[idx]?.name || 'customer'}`}
                  aria-selected={currentSlide === idx}
                  aria-controls={`testimonial-${idx}`}
                  tabIndex={currentSlide === idx ? 0 : -1}
                  className={classnames(
                    'w-2 h-2 rounded-full transition-all duration-200 cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    currentSlide === idx
                      ? 'bg-primary scale-125'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  )}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      instanceRef.current?.moveToIdx(idx)
                    }
                  }}
                />
              ))}
            </nav>
          )}
        </>
      </AppKeenSlider>
    </section>
  )
}

export default CustomerReviews
