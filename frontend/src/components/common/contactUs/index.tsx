'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty, minLength, email } from 'valibot'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useT } from '@/i18n/client'

// Component Imports
import { Text } from '@/components/common/text'
import { SButton } from '@/components/common/button/SButton'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { sendEmail } from '@/app/server/actions'

// Validation Schema
const contactSchema = object({
  fullName: pipe(string('Full name is required'), nonEmpty('Full name cannot be empty')),
  email: pipe(
    string('Email is required'),
    nonEmpty('Email cannot be empty'),
    email('Please provide a valid email address')
  ),
  message: pipe(
    string('Message is required'),
    nonEmpty('Message cannot be empty'),
    minLength(10, 'Message must be at least 10 characters long')
  )
})

type FormData = {
  fullName: string
  email: string
  message: string
}

const ContactUs = () => {
  // Refs
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { t } = useT('common')
  const [loading, setLoading] = useState(false)

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: valibotResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      message: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const response = await sendEmail(
        `New Contact from ${data.fullName}`,
        `Email: ${data.email}\n\nMessage: ${data.message}`
      )

      if (!response.success) {
        throw new Error('Failed to send email')
      }

      const result = response.message

      toast.success(result || 'Message sent successfully!')
      reset()
    } catch (error) {
      toast.error('An error occurred while sending your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section
        id='contact'
        ref={ref}
        className='flex flex-col gap-14 mb-32 px-6 sm:px-10 md:px-12 lg:px-16 py-8 md:py-12 max-w-7xl mx-auto'
        aria-label='Contact Us'
        itemScope
        itemType='https://schema.org/ContactPage'
      >
        <div className='flex flex-col items-center justify-center'>
          <Text as='h1' className='text-3xl md:text-5xl font-bold text-textPrimary mb-4 text-center animate-fade-in'>
            {t('contact.headline')}
          </Text>
          <Text
            as='p'
            className='text-center text-lg md:text-xl text-textSecondary animate-fade-in-delay'
            itemProp='description'
          >
            {t('contact.subheading')}
          </Text>
        </div>

        {/* Contact Content */}
        <div className='w-full'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch'>
            {/* Left Card - Contact Info */}
            <div className='md:col-span-5'>
              <article
                className='h-full bg-gradient-to-br from-primaryDark to-primary shadow-lg rounded-lg'
                itemScope
                itemType='https://schema.org/Organization'
              >
                <div className='h-full flex flex-col justify-center items-center text-center px-4 md:px-8 py-6 md:py-12'>
                  {/* Lightbulb Icon */}
                  <div className='mb-4'>
                    <svg
                      className='w-12 h-12 md:w-16 md:h-16 text-white'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      aria-hidden='true'
                    >
                      <path d='M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1zM12 20h-2c0 1.1.9 2 2 2s2-.9 2-2h-2z' />
                    </svg>
                  </div>

                  <Text as='h2' className='text-white mb-2 text-2xl md:text-3xl font-bold' itemProp='name'>
                    {t('contact.leftTitle')}
                  </Text>

                  <Text
                    as='p'
                    className='text-white font-normal text-base md:text-xl px-2 md:px-6'
                    itemProp='description'
                  >
                    {t('contact.leftSubtitle')}
                  </Text>
                </div>
              </article>
            </div>

            {/* Right Card - Contact Form */}
            <div className='md:col-span-7'>
              <article className='bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
                <div className='p-6'>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-6'
                    noValidate
                    aria-label='Contact form'
                  >
                    {/* Name and Email Row */}
                    <div className='flex flex-col md:flex-row gap-6'>
                      <div className='flex-1'>
                        <Controller
                          name='fullName'
                          control={control}
                          render={({ field }) => (
                            <div className='w-full'>
                              <label htmlFor='fullName' className='block text-sm font-medium text-textPrimary mb-2'>
                                {t('contact.form.fullName')}
                                <span className='text-red-500 ml-1' aria-label='required'>
                                  *
                                </span>
                              </label>
                              <input
                                {...field}
                                type='text'
                                id='fullName'
                                className={`
                                  w-full px-4 py-3 border rounded-lg text-textPrimary bg-white dark:bg-gray-900
                                  transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20
                                  ${
                                    errors.fullName
                                      ? 'border-red-500 focus:border-red-500'
                                      : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                                  }
                                `}
                                placeholder='Enter your full name'
                                aria-invalid={!!errors.fullName}
                                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                              />
                              {errors.fullName && (
                                <p id='fullName-error' className='mt-2 text-sm text-red-500' role='alert'>
                                  {errors.fullName.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>

                      <div className='flex-1'>
                        <Controller
                          name='email'
                          control={control}
                          render={({ field }) => (
                            <div className='w-full'>
                              <label htmlFor='email' className='block text-sm font-medium text-textPrimary mb-2'>
                                {t('contact.form.email')}
                                <span className='text-red-500 ml-1' aria-label='required'>
                                  *
                                </span>
                              </label>
                              <input
                                {...field}
                                type='email'
                                id='email'
                                className={`
                                  w-full px-4 py-3 border rounded-lg text-textPrimary bg-white dark:bg-gray-900
                                  transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20
                                  ${
                                    errors.email
                                      ? 'border-red-500 focus:border-red-500'
                                      : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                                  }
                                `}
                                placeholder='Enter your email address'
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                              />
                              {errors.email && (
                                <p id='email-error' className='mt-2 text-sm text-red-500' role='alert'>
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <Controller
                        name='message'
                        control={control}
                        render={({ field }) => (
                          <div className='w-full'>
                            <label htmlFor='message' className='block text-sm font-medium text-textPrimary mb-2'>
                              {t('contact.form.message')}
                              <span className='text-red-500 ml-1' aria-label='required'>
                                *
                              </span>
                            </label>
                            <textarea
                              {...field}
                              id='message'
                              rows={7}
                              className={`
                                w-full px-4 py-3 border rounded-lg text-textPrimary bg-white dark:bg-gray-900
                                transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20
                                resize-vertical
                                ${
                                  errors.message
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 dark:border-gray-600 focus:border-primary'
                                }
                              `}
                              placeholder='Tell us about your project or question...'
                              aria-invalid={!!errors.message}
                              aria-describedby={errors.message ? 'message-error' : undefined}
                            />
                            {errors.message && (
                              <p id='message-error' className='mt-2 text-sm text-red-500' role='alert'>
                                {errors.message.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-start'>
                      <SButton
                        type='submit'
                        variant='contained'
                        disabled={loading}
                        className='bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed'
                        aria-label={loading ? 'Sending message...' : 'Send message'}
                      >
                        {loading ? (
                          <div className='flex items-center gap-2'>
                            <svg className='animate-spin h-4 w-4' fill='none' viewBox='0 0 24 24'>
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                              />
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              />
                            </svg>
                            {t('contact.button.loading')}
                          </div>
                        ) : (
                          t('contact.button.submit')
                        )}
                      </SButton>
                    </div>
                  </form>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactUs
