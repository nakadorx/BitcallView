// React & Next Imports
import React, { useState, useMemo } from 'react'
import Image from 'next/image'

// MUI Imports
import { Box, Grid, Card, Typography, Button, Skeleton, useMediaQuery, useTheme } from '@mui/material'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DataUsageIcon from '@mui/icons-material/DataUsage'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

// Modal Component Import
import EsimPlanPrePurchaseModal from './EsimPlanPrePurchaseModal'

import { useT } from '@/i18n/client'

// TypeScript interface for GlobalPlan
export interface GlobalPlan {
  planType: string
  planCode: string
  planName: string
  countryName: string
  currency: string
  price: number
  additionalInfo: string
  vaildity: string
  capacityUnit: string
  capacity: string
  validityType: string
  customFlag?: string // optional URL for the flag image
}

interface PlansDetailsProps {
  plans: GlobalPlan[]
  isLoading: boolean
}

const PlansDetails: React.FC<PlansDetailsProps> = ({ plans, isLoading }) => {
  const theme = useTheme()
  const { t } = useT('plansDetails')

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  // State for filtering plans & modal
  const [filterOption, setFilterOption] = useState<string>('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<GlobalPlan | null>(null)

  // Toggle filter option (if the same is clicked, remove the filter)
  const handleToggle = (option: string) => {
    setFilterOption(prev => (prev === option ? '' : option))
  }

  // Helper to convert capacity to GB (if given in MB)
  const getCapacityInGB = (plan: GlobalPlan) => {
    const cap = parseFloat(plan.capacity)
    return plan.capacityUnit.toLowerCase() === 'mb' ? cap / 1024 : cap
  }

  // Sort the plans based on the filter option
  const sortedPlans = useMemo(() => {
    const sorted = [...plans]
    if (filterOption === 'cheapest') {
      sorted.sort((a, b) => a.price - b.price)
    } else if (filterOption === 'longest') {
      sorted.sort((a, b) => parseFloat(b.vaildity) - parseFloat(a.vaildity))
    } else if (filterOption === 'largest') {
      sorted.sort((a, b) => getCapacityInGB(b) - getCapacityInGB(a))
    }
    return sorted
  }, [plans, filterOption])

  // Handle clicking on a plan price button to open the modal
  const handlePriceClick = (plan: GlobalPlan) => {
    setSelectedPlan(plan)
    setOpenModal(true)
  }

  // --- Enhanced Filter Panel --- //
  // Desktop version: vertical layout with buttons (includes icons inline)
  const DesktopFilterPanel = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mb: 2,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        alignItems: 'flex-start'
      }}
    >
      <Typography variant='h6' sx={{ mb: 2 }}>
        Filter Plans
      </Typography>
      <Button
        variant={filterOption === 'cheapest' ? 'contained' : 'outlined'}
        startIcon={<PriceChangeIcon />}
        onClick={() => handleToggle('cheapest')}
        sx={{ textTransform: 'none' }}
      >
        {t('plansDetails.cheapest')}{' '}
      </Button>
      <Button
        variant={filterOption === 'longest' ? 'contained' : 'outlined'}
        startIcon={<CheckCircleIcon />}
        onClick={() => handleToggle('longest')}
        sx={{ textTransform: 'none' }}
      >
        {t('plansDetails.longest')}{' '}
      </Button>
      <Button
        variant={filterOption === 'largest' ? 'contained' : 'outlined'}
        startIcon={<DataUsageIcon />}
        onClick={() => handleToggle('largest')}
        sx={{ textTransform: 'none' }}
      >
        {t('plansDetails.largest')}{' '}
      </Button>
    </Box>
  )

  // Mobile version: grid-based icon buttons with icons on top and text below
  const MobileFilterPanel = () => {
    // Mobile filter button component
    const MobileFilterButton = ({
      active,
      icon,
      label,
      onClick
    }: {
      active: boolean
      icon: React.ReactNode
      label: string
      onClick: () => void
    }) => (
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 1,
          borderRadius: 1,
          backgroundColor: active ? 'primary.main' : 'background.default',
          color: active ? 'primary.contrastText' : 'text.primary',
          border: active ? 'none' : `1px solid ${theme.palette.divider}`,
          width: 80
        }}
      >
        {icon}
        <Typography variant='caption' sx={{ mt: 0.5, textAlign: 'center' }}>
          {label}
        </Typography>
      </Box>
    )

    return (
      <Box sx={{ p: 2, mb: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        <Typography variant='h6' sx={{ mb: 1, textAlign: 'center' }}>
          Filter Plans
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <MobileFilterButton
            active={filterOption === 'cheapest'}
            icon={<PriceChangeIcon />}
            label={t('plansDetails.cheapest')}
            onClick={() => handleToggle('cheapest')}
          />
          <MobileFilterButton
            active={filterOption === 'longest'}
            icon={<CheckCircleIcon />}
            label={t('plansDetails.longest')}
            onClick={() => handleToggle('longest')}
          />
          <MobileFilterButton
            active={filterOption === 'largest'}
            icon={<DataUsageIcon />}
            label={t('plansDetails.largest')}
            onClick={() => handleToggle('largest')}
          />
        </Box>
      </Box>
    )
  }

  // Choose the filter panel based on device
  const FilterPanel = isDesktop ? DesktopFilterPanel : <MobileFilterPanel />

  // Display loading state if data is being fetched
  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant='rectangular' width='100%' height={200} />
      </Box>
    )
  }

  // Display a message if no plans are available
  if (sortedPlans.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>{t('plansDetails.noPlans')}</Typography>
      </Box>
    )
  }

  // Internal component to render each plan card with responsive layout and hover effects
  interface PlanCardProps {
    plan: GlobalPlan
    isDesktop: boolean
    onPriceClick: (plan: GlobalPlan) => void
  }

  const PlanCard: React.FC<PlanCardProps> = ({ plan, isDesktop, onPriceClick }) => {
    if (isDesktop) {
      // Desktop layout: row-oriented card
      return (
        <Card
          variant='outlined'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            p: 1.5,
            mb: 1,
            borderRadius: 2,
            boxShadow: 1,
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': { boxShadow: 4 },
            alignItems: 'center'
          }}
        >
          {/* Left Column: Plan Name & Flag */}
          <Box sx={{ flex: 3, display: 'flex', alignItems: 'center', pl: 1 }}>
            {plan.customFlag && (
              <Image
                src={plan.customFlag}
                alt='Plan flag'
                width={20}
                height={20}
                layout='fixed'
                objectFit='contain'
                quality={100}
                style={{ marginLeft: '0.5rem' }}
              />
            )}
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '0.95rem', ml: 1 }}>
              {plan.planName.replace(/free/gi, '').trim()}
            </Typography>
          </Box>
          {/* Middle Column: Validity */}
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              pl: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' sx={{ fontWeight: 'medium', mr: 0.5 }}>
                {t('plansDetails.validity')}{' '}
              </Typography>
              <CheckCircleIcon fontSize='small' sx={{ mr: 0.25 }} />
            </Box>
            <Typography variant='body2' sx={{ fontSize: '0.85rem', pl: 2 }}>
              {plan.vaildity} {plan.validityType}
            </Typography>
          </Box>
          {/* Next Column: Data Capacity */}
          <Box
            sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              pl: 1
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' sx={{ fontWeight: 'medium', mr: 0.5 }}>
                {t('plansDetails.data')}{' '}
              </Typography>
              <DataUsageIcon fontSize='small' sx={{ mr: 0.25 }} />
            </Box>
            <Typography variant='body2' sx={{ fontSize: '0.85rem', pl: 2 }}>
              {plan.capacity} {plan.capacityUnit}
            </Typography>
          </Box>
          {/* Right Column: Price Button */}
          <Box
            sx={{
              flex: 3,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              pr: 3
            }}
          >
            <Button
              variant='contained'
              size='small'
              onClick={() => onPriceClick(plan)}
              sx={{ display: 'flex', alignItems: 'center', px: 5, py: 2 }}
            >
              <ShoppingCartIcon fontSize='small' sx={{ mr: 0.5 }} />
              {plan.currency} {plan.price.toFixed(2)}
            </Button>
          </Box>
        </Card>
      )
    }

    // Mobile layout: column-oriented card with enhanced icon support for validity and data
    return (
      <Card
        variant='outlined'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          mb: 1,
          borderRadius: 2,
          boxShadow: 1,
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': { boxShadow: 4 },
          alignItems: 'center'
        }}
      >
        {/* Top: Plan Name & Flag */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {plan.customFlag && (
            <Image
              src={plan.customFlag}
              alt='Plan flag'
              width={20}
              height={20}
              layout='fixed'
              objectFit='contain'
              quality={100}
              style={{ marginLeft: '0.5rem' }}
            />
          )}
          <Typography variant='subtitle1' sx={{ fontWeight: 'bold', ml: 1 }}>
            {plan.planName.replace(/free/gi, '').trim()}
          </Typography>
        </Box>
        {/* Middle: Validity and Data with icons */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon fontSize='small' sx={{ mr: 0.25 }} />
                <Typography variant='caption' sx={{ fontWeight: 'medium' }}>
                  Validity
                </Typography>
              </Box>
              <Typography variant='body2'>
                {plan.vaildity} {plan.validityType}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DataUsageIcon fontSize='small' sx={{ mr: 0.25 }} />
                <Typography variant='caption' sx={{ fontWeight: 'medium' }}>
                  Data
                </Typography>
              </Box>
              <Typography variant='body2'>
                {plan.capacity} {plan.capacityUnit}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* Bottom: Price Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button
            variant='contained'
            size='small'
            onClick={() => onPriceClick(plan)}
            sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2.2, my: 1 }}
          >
            <ShoppingCartIcon fontSize='small' sx={{ mr: 0.5 }} />
            {plan.currency} {plan.price.toFixed(2)}
          </Button>
        </Box>
      </Card>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      {isDesktop ? (
        // Desktop Layout: Grid with Filter Panel on left and Plans list on right
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            {FilterPanel}
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {sortedPlans.map(plan => (
                <Grid item xs={12} key={plan.planCode}>
                  <PlanCard plan={plan} isDesktop={isDesktop} onPriceClick={handlePriceClick} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        // Mobile Layout: Filter Panel on top, then Plans list
        <>
          {FilterPanel}
          <Grid container spacing={2}>
            {sortedPlans.map(plan => (
              <Grid item xs={12} key={plan.planCode}>
                <PlanCard plan={plan} isDesktop={isDesktop} onPriceClick={handlePriceClick} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Pre-Purchase Modal */}
      {openModal && selectedPlan && (
        <EsimPlanPrePurchaseModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          plan={selectedPlan}
          onPurchase={() => {}}
        />
      )}
    </Box>
  )
}

export default PlansDetails
