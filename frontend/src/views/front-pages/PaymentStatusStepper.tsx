'use client'
import React from 'react'
import { Box, Stepper, Step, StepLabel, Tooltip, IconButton, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

interface StepInfo {
  label: string
  description: string
}

interface PaymentStatusStepperProps {
  currentStatus: 'waiting' | 'confirming' | 'confirmed'
}

const PaymentStatusStepper: React.FC<PaymentStatusStepperProps> = ({ currentStatus }) => {
  const steps: StepInfo[] = [
    {
      label: 'Waiting',
      description: 'Waiting for the customer to send the payment. The initial status of each payment.'
    },
    {
      label: 'Confirming',
      description:
        'The transaction is being processed on the blockchain. Appears when NOWPayments detects the funds from the user on the blockchain.'
    },
    {
      label: 'Confirmed',
      description: 'The process is confirmed by the blockchain. Customer’s funds have accumulated enough confirmations.'
    }
  ]

  // Map current status to the active step index.
  const statusToStep = {
    waiting: 0,
    confirming: 1,
    confirmed: 2
  }
  const activeStep = statusToStep[currentStatus] ?? 0

  return (
    <Stepper activeStep={activeStep} orientation='horizontal'>
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel>
            <Box display='flex' alignItems='center'>
              <Typography variant='body1'>{step.label}</Typography>
              <Tooltip title={step.description} arrow>
                <IconButton size='small' sx={{ ml: 1 }}>
                  <InfoIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default PaymentStatusStepper
