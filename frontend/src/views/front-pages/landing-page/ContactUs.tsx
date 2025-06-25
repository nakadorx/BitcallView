// React Imports
import { useEffect, useState, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

// Third-party Imports
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, pipe, nonEmpty, minLength, email } from 'valibot'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useT } from '@/i18n/client'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'
import { customCtaBtnWCSx } from '@/app/globalStyles'
// API Imports
import { sendEmail } from '@/app/server/actions'

// Utils Imports
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
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

const ContactUs = props => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()
  const { t } = useT('common')
  const [loading, setLoading] = useState(false) // loading state for the submit button

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      setLoading(true) // Start loading

      const response = await sendEmail(
        `New Contact from ${data.fullName}`,
        `Email: ${data.email}\n\nMessage: ${data.message}`
      )

      if (!response.success) {
        throw new Error('Failed to send email')
      }

      const result = response.message

      // Show success toast
      toast.success(result || 'Message sent successfully!')
      reset() // Reset form fields after success
    } catch (error) {
      toast.error('An error occurred while sending your message. Please try again.')
    } finally {
      setLoading(false) // Stop loading
    }
  }

  return (
    <section
      id='contact'
      className={classnames('flex flex-col gap-14 mb-32', frontCommonStyles.layoutSpacing)}
      ref={ref}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex items-baseline flex-wrap gap-2 mbe-3 sm:mbe-2'>
          <AnimatedHeadline variant='fadeIn' fontSize={{ xs: '0.92rem', md: '1.65rem' }}>
            {t('contact.headline')}
          </AnimatedHeadline>
        </div>
        <Typography className='text-center' variant='h2' sx={{ fontSize: { xs: '1rem', md: '1.4rem' } }}>
          {t('contact.subheading')}
        </Typography>
      </div>
      <div>
        <Grid container spacing={6} alignItems='stretch'>
          {/* Left Card */}
          <Grid item xs={12} md={6} lg={5}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #FF6F59 0%, #FFA07A 100%)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: 2
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  px: { xs: 2, md: 4 },
                  py: { xs: 3, md: 6 }
                }}
              >
                <LightbulbIcon
                  sx={{
                    fontSize: { xs: 40, md: 60 },
                    color: 'white',
                    mb: 2
                  }}
                />
                <Typography variant='h3' sx={{ color: 'white', mb: 1, fontSize: { xs: '1.5rem', md: '1.7rem' } }}>
                  {t('contact.leftTitle')}
                </Typography>
                <Typography
                  variant='subtitle1'
                  sx={{
                    color: 'white',
                    fontWeight: 'normal',
                    fontSize: { xs: '1rem', md: '1.5rem' },
                    px: { xs: 1, md: 3 }
                  }}
                >
                  {t('contact.leftSubtitle')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Card with Form (remains unchanged) */}
          <Grid item xs={12} md={6} lg={7}>
            <Card>
              <CardContent>
                <form className='flex flex-col items-start gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <div className='flex flex-col md:flex-row gap-5 is-full'>
                    <Controller
                      name='fullName'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('contact.form.fullName')}
                          {...field}
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message}
                        />
                      )}
                    />
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          label={t('contact.form.email')}
                          {...field}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    name='message'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        multiline
                        rows={7}
                        label={t('contact.form.message')}
                        {...field}
                        error={!!errors.message}
                        helperText={errors.message?.message}
                      />
                    )}
                  />
                  <Button
                    variant='contained'
                    type='submit'
                    disabled={loading}
                    sx={{
                      ...customCtaBtnWCSx,
                      backgroundColor: '#FF6F59',
                      '&:hover': {
                        backgroundColor: '#FF6F59'
                      }
                    }}
                  >
                    {loading ? t('contact.button.loading') : t('contact.button.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default ContactUs
