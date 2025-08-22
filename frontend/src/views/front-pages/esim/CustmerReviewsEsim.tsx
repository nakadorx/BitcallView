'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useT } from '@/i18n/client'
import { Text } from '@/components/common/text'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { IconRoundButton } from '@/components/common/button/IconRoundButton'

interface CustomerReview {
  id: number
  text: string
  author: string
  image: string
}

const CustomerReviewsEsim = () => {
  const { t } = useT('esim')
  const [currentReview, setCurrentReview] = useState(0)

  const testimonialQuotes = t('testimonials.quotes', { returnObjects: true }) as Array<{
    text: string
    author: string
  }>

  const customerReviews: CustomerReview[] = testimonialQuotes.map((quote, index) => ({
    id: index + 1,
    text: quote.text,
    author: quote.author,
    image: `/images/assets/esimPageAsserts/cutomorsReviews/${index + 1}.png` // You can customize this path
  }))

  const nextReview = () => {
    setCurrentReview(prev => (prev + 1) % customerReviews.length)
  }

  const prevReview = () => {
    setCurrentReview(prev => (prev - 1 + customerReviews.length) % customerReviews.length)
  }

  const review = customerReviews[currentReview]

  return (
    <SectionContainer title={['', t('testimonials.title1'), t('testimonials.title2'), t('testimonials.title3')]}>
      <div className='px-4 sm:px-8 lg:px-[20rem] mt-10'>
        <div className='bg-[#ed7760]  bg-opacity-30 rounded-3xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch'>
            <div className='relative w-full h-[260px] sm:h-[360px] lg:h-[520px] min-h-[260px] sm:min-h-[360px] lg:min-h-[520px] overflow-hidden flex items-center justify-center shrink-0'>
              <Image
                src={review.image}
                alt={`${review.author} testimonial`}
                fill
                className='object-cover rounded-4xl'
              />
            </div>

            <div className='p-6 sm:p-8 lg:p-12 flex flex-col justify-center min-h-[260px] sm:min-h-[360px] lg:min-h-[520px]'>
              <Text
                as='div'
                className='text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 leading-relaxed mb-6 sm:mb-8'
              >
                <Text as='span' className='text-3xl sm:text-4xl text-gray-400 mr-2' value='"' />
                {review.text}
                <Text as='span' className='text-3xl sm:text-4xl text-gray-400 ml-2' value='"' />
              </Text>

              <div className='mb-8'>
                <Text
                  as='p'
                  value={review.author}
                  className='text-base sm:text-lg font-medium text-gray-800 text-center sm:text-left'
                />
              </div>

              <div className='rtl:flex-row-reverse  flex flex-row space-x-4 justify-center sm:justify-start'>
                <IconRoundButton
                  onClick={prevReview}
                  ariaLabel='Previous review'
                  disabled={customerReviews.length <= 1}
                  icon={<i className='ri-arrow-left-s-line' />}
                  size='md'
                  variant='primary'
                />
                <IconRoundButton
                  onClick={nextReview}
                  ariaLabel='Next review'
                  disabled={customerReviews.length <= 1}
                  icon={<i className='ri-arrow-right-s-line' />}
                  size='md'
                  variant='primary'
                />
              </div>

              {customerReviews.length > 1 && (
                <div className='rtl:flex-row-reverse  flex flex-row   space-x-2 mt-6 justify-center sm:justify-start'>
                  {customerReviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentReview ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to review ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}

export default CustomerReviewsEsim
