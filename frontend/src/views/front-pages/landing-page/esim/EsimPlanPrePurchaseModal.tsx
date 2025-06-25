// React Imports
import React, { useState, useEffect } from 'react'

// Next Imports
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// MUI Imports
import { Dialog, DialogContent, DialogActions, IconButton, Typography, Box, Button, Collapse } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import DataUsageIcon from '@mui/icons-material/DataUsage'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Redux Imports
import { useDispatch } from 'react-redux'

import { addPlan } from '@/redux-store/slices/cart'
import { customLog, getLocale } from '@/utils/commons'

export interface Plan {
  flag: string
  planName: string
  vaildity: string
  capacity: string
  additionalInfo: string
  price: number
  currency: string
  countryName?: string
  planType?: string
  planCode?: any
  validityType?: string
  capacityUnit?: string
}

// Function to generate a dynamic marketing tagline
const getMarketingTagline = (plan: Plan): string => {
  const capacityStr = plan.capacity + (plan.capacityUnit ? ` ${plan.capacityUnit}` : '')
  const validityStr = plan.vaildity + (plan.validityType ? ` ${plan.validityType}` : '')

  return `Get the perfect plan for your needs, including ${capacityStr} data, for only ${plan.currency} ${plan.price.toFixed(
    2
  )}, with ${validityStr} validity—powered by our reliable network.`
}

const EsimPlanPrePurchaseModal: React.FC<any> = ({
  open,
  onClose,
  plan,
  onPurchase = () => {
    console.log('Purchase clicked')
  }
}) => {
  // State for toggling the Additional Info dropdown
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)
  const toggleAdditionalInfo = () => setShowAdditionalInfo(prev => !prev)

  // Hooks
  const dispatch = useDispatch()
  const router = useRouter()

  const locale = getLocale()

  const handlePurchase = () => {
    customLog('plan: ', plan)

    // Dispatch addPlan action with the plan data and a default quantity of 1
    dispatch(
      addPlan({
        planCode: plan.planCode,
        name: plan.planName,
        countryName: plan.countryName || '',
        countryCode: plan.countryCode || '',
        price: plan.price,
        currency: plan.currency,
        quantity: 1,
        validity: plan.vaildity,
        validityType: plan.validityType,
        capacity: plan.capacity,
        capacityUnit: plan.capacityUnit,
        customFlag: plan.customFlag
      })
    )
    onClose()

    // Navigate to Checkout page
    router.push(`/${locale}/checkout`)
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing on clicking the backdrop.
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      fullWidth
      maxWidth='sm'
    >
      {/* Top Header with flag on left and close button on right */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 2,
          borderBottom: '1px solid #eee'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image src={plan.customFlag} alt='Plan Flag' width={40} height={30} objectFit='contain' />
        </Box>
        <IconButton onClick={onClose} aria-label='close'>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers>
        {/*  additional plan keys */}

        <Typography variant='h4' align='center' color='primary.main' gutterBottom sx={{ mt: 1 }}>
          {plan.planName}
        </Typography>

        <Typography
          variant='subtitle1'
          align='center'
          color='text.main'
          sx={{ fontStyle: 'italic', mb: 2, fontSize: '0.71rem' }}
        >
          {getMarketingTagline(plan)}
        </Typography>

        {/* Validity & Capacity with Icons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon fontSize='small' sx={{ mr: 0.5 }} />
            <Typography variant='body1'>
              Validity: {plan.vaildity}
              {plan.validityType ? ` ${plan.validityType}` : ''}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DataUsageIcon fontSize='small' sx={{ mr: 0.5 }} />
            <Typography variant='body1'>
              Capacity: {plan.capacity}
              {plan.capacityUnit ? ` ${plan.capacityUnit}` : ''}
            </Typography>
          </Box>
        </Box>

        {/* Additional Info Dropdown */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={toggleAdditionalInfo}
          >
            <Typography variant='subtitle1'>Additional Info</Typography>
            <IconButton size='small'>{showAdditionalInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Box>
          <Collapse in={showAdditionalInfo}>
            <Box sx={{ mt: 1 }}>
              <div dangerouslySetInnerHTML={{ __html: plan.additionalInfo }} />
            </Box>
          </Collapse>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button variant='contained' startIcon={<ShoppingCartIcon />} onClick={handlePurchase} sx={{ px: 3, py: 2 }}>
          {plan.currency} {plan.price.toFixed(2)} - Claim Your Plan Now
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EsimPlanPrePurchaseModal
