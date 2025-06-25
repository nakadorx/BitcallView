'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MuiStepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import type { StepperProps } from '@mui/material/Stepper'

// Component Imports
import StepCart from './StepCart'
import StepAddress from './StepAddress'
import StepPayment from './StepPayment'
import StepConfirmation from './StepConfirmation'
import DirectionalIcon from '@components/DirectionalIcon'
import Payment from '@/views/front-pages/Payment'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'

// Utils Imports
import api from '@/utils/api'
import { customLog } from '@/utils/commons'

// Vars
const steps = [
  {
    title: 'Payment',
    icon: (
      <svg id='wizardCart' xmlns='http://www.w3.org/2000/svg' width='45' height='45' viewBox='0 0 60 60'>
        <path d='M60 41.6949V15.2542H50.8475C50.2851 15.2542 49.8305 15.7088 49.8305 16.2712C49.8305 16.8336 50.2851 17.2881 50.8475 17.2881H57.9661V39.661H11.1864V17.2881H18.3051C18.8675 17.2881 19.322 16.8336 19.322 16.2712C19.322 15.7088 18.8675 15.2542 18.3051 15.2542H11.1864V7.11864C11.1864 6.55627 10.7319 6.10169 10.1695 6.10169H7.99119C7.53661 4.35254 5.95831 3.05084 4.0678 3.05084C1.82441 3.05084 0 4.87525 0 7.11864C0 9.36203 1.82441 11.1864 4.0678 11.1864C5.95831 11.1864 7.53661 9.88474 7.99119 8.13559H9.15254V15.2542V16.2712V40.678V41.6949V47.7966C9.15254 48.359 9.60712 48.8136 10.1695 48.8136H17.3197C16.0739 49.741 15.2542 51.2125 15.2542 52.8814C15.2542 55.6851 17.5353 57.9661 20.339 57.9661C23.1427 57.9661 25.4237 55.6851 25.4237 52.8814C25.4237 51.2125 24.6041 49.741 23.3583 48.8136H41.7264C40.4807 49.741 39.661 51.2125 39.661 52.8814C39.661 55.6851 41.942 57.9661 44.7458 57.9661C47.5495 57.9661 49.8305 55.6851 49.8305 52.8814C49.8305 51.2125 49.0108 49.741 47.7651 48.8136H53.8983C54.4607 48.8136 54.9153 48.359 54.9153 47.7966C54.9153 47.2342 54.4607 46.7797 53.8983 46.7797H11.1864V41.6949H60ZM4.0678 9.15254C2.9461 9.15254 2.0339 8.24033 2.0339 7.11864C2.0339 5.99694 2.9461 5.08474 4.0678 5.08474C4.81729 5.08474 5.4661 5.4966 5.81898 6.10169H5.08475C4.52237 6.10169 4.0678 6.55627 4.0678 7.11864C4.0678 7.68101 4.52237 8.13559 5.08475 8.13559H5.81898C5.4661 8.74067 4.81729 9.15254 4.0678 9.15254ZM20.339 55.9322C18.6569 55.9322 17.2881 54.5634 17.2881 52.8814C17.2881 51.1993 18.6569 49.8305 20.339 49.8305C22.021 49.8305 23.3898 51.1993 23.3898 52.8814C23.3898 54.5634 22.021 55.9322 20.339 55.9322ZM44.7458 55.9322C43.0637 55.9322 41.6949 54.5634 41.6949 52.8814C41.6949 51.1993 43.0637 49.8305 44.7458 49.8305C46.4278 49.8305 47.7966 51.1993 47.7966 52.8814C47.7966 54.5634 46.4278 55.9322 44.7458 55.9322Z' />
        <path d='M34.5762 30.5085C42.427 30.5085 48.8134 24.122 48.8134 16.2712C48.8134 8.42035 42.427 2.03391 34.5762 2.03391C26.7253 2.03391 20.3389 8.42035 20.3389 16.2712C20.3389 24.122 26.7253 30.5085 34.5762 30.5085ZM34.5762 4.0678C41.3053 4.0678 46.7795 9.54204 46.7795 16.2712C46.7795 23.0003 41.3053 28.4746 34.5762 28.4746C27.847 28.4746 22.3728 23.0003 22.3728 16.2712C22.3728 9.54204 27.847 4.0678 34.5762 4.0678Z' />
        <path d='M32.9074 22.138C32.9735 22.1919 33.0478 22.2244 33.122 22.26C33.1525 22.2753 33.18 22.2997 33.2115 22.3109C33.3234 22.3515 33.4413 22.3729 33.5583 22.3729C33.7007 22.3729 33.843 22.3414 33.9742 22.2824C34.0241 22.26 34.0617 22.2153 34.1085 22.1848C34.1807 22.137 34.2579 22.0993 34.3179 22.0312L34.3373 22.0088C34.3373 22.0088 34.3383 22.0078 34.3393 22.0078C34.3393 22.0078 34.3403 22.0068 34.3403 22.0058L42.4525 12.8787C42.8257 12.4597 42.7881 11.8159 42.3681 11.4437C41.9481 11.0695 41.3054 11.1071 40.9332 11.5282L33.4525 19.9444L28.1074 15.4902C27.6732 15.1312 27.0346 15.1892 26.6746 15.6204C26.3146 16.0526 26.3735 16.6943 26.8047 17.0532L32.9074 22.138Z' />
      </svg>
    )
  },
  {
    title: 'Confirmation',
    icon: (
      <svg id='wizardConfirm' xmlns='http://www.w3.org/2000/svg' width='45' height='45' viewBox='0 0 60 60'>
        <g>
          <path d='M8 16H23C23.552 16 24 15.553 24 15C24 14.447 23.552 14 23 14H8C7.448 14 7 14.447 7 15C7 15.553 7.448 16 8 16Z' />
          <path d='M8 13H17C17.552 13 18 12.553 18 12C18 11.447 17.552 11 17 11H8C7.448 11 7 11.447 7 12C7 12.553 7.448 13 8 13Z' />
          <path d='M24 18C24 17.447 23.552 17 23 17H8C7.448 17 7 17.447 7 18C7 18.553 7.448 19 8 19H23C23.552 19 24 18.553 24 18Z' />
          <path d='M60 4H31V1C31 0.447 30.552 0 30 0C29.448 0 29 0.447 29 1V4H0V46H27.586L15.293 58.293C14.902 58.684 14.902 59.316 15.293 59.707C15.488 59.902 15.744 60 16 60C16.256 60 16.512 59.902 16.707 59.707L29 47.414V57C29 57.553 29.448 58 30 58C30.552 58 31 57.553 31 57V47.414L43.293 59.707C43.488 59.902 43.744 60 44 60C44.256 60 44.512 59.902 44.707 59.707C45.098 59.316 45.098 58.684 44.707 58.293L32.414 46H60V4ZM58 44H2V6H58V44Z' />
          <path d='M41 20H45.586L33.6 31.986L25.307 23.693C24.916 23.302 24.284 23.302 23.893 23.693L11.293 36.293C10.902 36.684 10.902 37.316 11.293 37.707C11.488 37.902 11.744 38 12 38C12.256 38 12.512 37.902 12.707 37.707L24.6 25.814L32.893 34.107C33.088 34.302 33.344 34.4 33.6 34.4C33.856 34.4 34.112 34.302 34.307 34.107L47 21.414V26C47 26.553 47.447 27 48 27C48.553 27 49 26.553 49 26V19C49 18.87 48.974 18.74 48.923 18.618C48.822 18.373 48.627 18.178 48.382 18.077C48.26 18.026 48.13 18 48 18H41C40.448 18 40 18.447 40 19C40 19.553 40.448 20 41 20Z' />
        </g>
        <defs>
          <clipPath id='clip0_7904_84930'>
            <rect width='60' height='60' />
          </clipPath>
        </defs>
      </svg>
    )
  }
]

// Styled Components
const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
  justifyContent: 'center',
  '& .MuiStep-root': {
    '& + svg': {
      display: 'none',
      color: 'var(--mui-palette-text-disabled)'
    },
    '& .MuiStepLabel-label': {
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      svg: {
        marginInlineEnd: theme.spacing(1.5),
        fill: 'var(--mui-palette-text-primary)'
      },
      '&.Mui-active, &.Mui-completed': {
        '& .MuiTypography-root': {
          color: 'var(--mui-palette-primary-main)'
        },
        '& svg': {
          fill: 'var(--mui-palette-primary-main)'
        }
      }
    },
    '&.Mui-completed + i': {
      color: 'var(--mui-palette-primary-main) !important'
    },

    [theme.breakpoints.up('md')]: {
      paddingBottom: 0,
      '& + svg': {
        display: 'block'
      },
      '& .MuiStepLabel-label': {
        display: 'block'
      }
    }
  }
}))

const CheckoutWizard = props => {
  const getStepContent = (step: number, handleNext: () => void) => {
    switch (step) {
      case 0:
        return <Payment handleNext={handleNext} />
      case 1:
        return <StepConfirmation sessionData={sessionData} orderData={orderData} />
      default:
        return null
    }
  }

  // States
  const [activeStep, setActiveStep] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  const [orderData, setOrderData] = useState(null)

  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  // If session_id exists, fetch session details from your backend.
  useEffect(() => {
    if (sessionId) {
      const fetchSession = async () => {
        setLoading(true)

        try {
          const res = await api.get(`/payment/session/${sessionId}`)

          customLog('res: ', res)

          if (res.data && res.data.session.id) {
            // If valid session data is returned, set active step to confirmation.
            setSessionData(res.data.session)
            setOrderData(res.data.order)
            setActiveStep(1)
          }

          // TODO clear cart data
        } catch (error) {
          console.error('Error fetching session data:', error)

          // keep activeStep at 0 if the session isn't valid.
          setActiveStep(0)
        } finally {
          setLoading(false)
        }
      }

      fetchSession()
    } else {
      // No session_id, remain on Payment step.
      setActiveStep(0)
    }
  }, [sessionId])

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper
            className='gap-10 md:gap-4'
            activeStep={activeStep}
            connector={
              <DirectionalIcon
                ltrIconClass='ri-arrow-right-s-line'
                rtlIconClass='ri-arrow-left-s-line'
                className='mli-12 hidden md:block text-xl text-textDisabled'
              />
            }
          >
            {steps.map((step, index) => {
              return (
                <Step key={index}>
                  <StepLabel icon={<></>} className='flex flex-col gap-2 text-center'>
                    {step.icon}
                    <Typography className='step-title'>{step.title}</Typography>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>
      <Divider />

      <CardContent>{getStepContent(activeStep, handleNext)}</CardContent>
    </Card>
  )
}

export default CheckoutWizard
