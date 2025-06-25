// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// MUI Icons (Corresponding to each feature)
import DialerSipIcon from '@mui/icons-material/DialerSip' // SIP trunking
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead' // SMS newsletter
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled' // DID numbers
import CallSplitIcon from '@mui/icons-material/CallSplit' // IPRN
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver' // IVR

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'

const UsefulFeature = (props) => {
  //  const
  const ICON_SIZE = '2.35rem' // Feature Icon size

  // Data
  const feature = [
    {
      icon: <DialerSipIcon sx={{ fontSize: ICON_SIZE }} />,
      title: 'SIP trunking',
      description:
        'A-Z voice term inationat standard and Premium quality. We terminate whole sale traffic, retail traffic, business traffic,call center traffic, IVR traffic.',
      available: true
    },
    {
      icon: <MarkEmailReadIcon sx={{ fontSize: ICON_SIZE }} />,
      title: 'SMS newsletter',
      description: 'A-Z SMS termination for VAS campaigns and promotions.',
      available: true
    },
    {
      icon: <PhoneEnabledIcon sx={{ fontSize: ICON_SIZE }} />,
      title: 'DID numbers',
      description: 'We provide A-Z DID numbers and Toll-free numbers all over the world.',
      available: true
    },
    {
      icon: <CallSplitIcon sx={{ fontSize: ICON_SIZE }} />,
      title: 'IPRN',
      description: 'Get premium rate numbers and manage your calls from any part of the globe.',
      available: true
    },
    {
      icon: <RecordVoiceOverIcon sx={{ fontSize: ICON_SIZE }} />,
      title: 'IVR',
      description:
        'Create an IVR to any country of the world. Promotion alI VRs, advertising and any other kind of IVRs are available.',
      available: false
    }
  ]

  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

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

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper'>
      <div className={classnames('flex flex-col gap-12 plb-[100px]', frontCommonStyles.layoutSpacing)}>
        <div className={classnames('flex flex-col items-center justify-center')}>
          <div className='flex items-baseline max-sm:flex-col gap-x-2 mbe-3 sm:mbe-2'>
            <Typography variant='h4' className='font-bold' sx={{ color: 'primary.main' }}>
              Everything you need
            </Typography>
            <Typography variant='h5'>to start your next project</Typography>
          </div>
          <Typography className='font-medium text-center'>
            Expand the possibilities of your companies with BitCall.
          </Typography>
        </div>
        <div>
          <Grid container rowSpacing={12} columnSpacing={6} justifyContent='center'>
            {feature.map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <div className='flex flex-col gap-2 justify-center items-center'>
                  <div className={classnames('', styles.featureIconContainer)}>
                    <div className={styles.featureIcon}>{item.icon}</div>
                  </div>
                  <Typography variant='h5' sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                  <Typography className='max-is-[264px] text-center' sx={{ fontSize: '0.875rem' }}>
                    {item.description}
                  </Typography>
                  {item.available === false ? (
                    <Typography variant='body2' sx={{ color: 'gray', fontStyle: 'italic' }}>
                      Coming Soon
                    </Typography>
                  ) : (
                    <Button variant='text' sx={{ color: '#FF6F59' }}>
                      Details
                    </Button>
                  )}
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default UsefulFeature
