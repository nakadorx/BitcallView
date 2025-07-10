'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useT } from '@/i18n/client'
import { Text } from '@/components/common/text'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'

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
    <SectionContainer title={[t('testimonials.title')]}>
      <div className='px-[20rem] mt-10'>
        <div className='bg-white rounded-3xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-0'>
            <div className='relative h-64 lg:h-full min-h-[400px] flex items-center justify-start'>
              <Image
                src={review.image}
                alt={`${review.author} testimonial`}
                height={500}
                width={500}
                className='object-cover rounded-4xl'
                sizes='(max-width: 1024px) 100vw, 50vw'
              />
            </div>

            <div className='py-8 lg:p-12 flex flex-col justify-center'>
              <Text as='div' className='text-2xl lg:text-3xl font-light text-gray-800 leading-relaxed mb-8'>
                <Text as='span' className='text-4xl text-gray-400 mr-2' value='"' />
                {review.text}
                <Text as='span' className='text-4xl text-gray-400 ml-2' value='"' />
              </Text>

              <div className='mb-8'>
                <Text as='p' value={review.author} className='text-lg font-medium text-gray-800' />
              </div>

              <div className='flex space-x-4'>
                <button
                  onClick={prevReview}
                  className='w-12 h-12 rounded-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-200 disabled:opacity-50'
                  disabled={customerReviews.length <= 1}
                  aria-label='Previous review'
                >
                  <i className='ri-arrow-left-s-line text-xl' />
                </button>

                <button
                  onClick={nextReview}
                  className='w-12 h-12 rounded-full bg-orange-400 hover:bg-orange-500 text-white flex items-center justify-center transition-colors duration-200 disabled:opacity-50'
                  disabled={customerReviews.length <= 1}
                  aria-label='Next review'
                >
                  <i className='ri-arrow-right-s-line text-xl' />
                </button>
              </div>

              {customerReviews.length > 1 && (
                <div className='flex space-x-2 mt-6'>
                  {customerReviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentReview(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentReview ? 'bg-orange-400' : 'bg-gray-300'
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
