// React imports
import React, { useState, useMemo } from 'react'

// Next Imports
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// MUI Imports
import StorageIcon from '@mui/icons-material/Storage'

import type { GlobalPlan } from './PlansDetails'

// Custom Components Imports
import PlansDetails from './PlansDetails'

const getFlagUrl = (plan: GlobalPlan): string => {
  if (plan.countryName.toLowerCase() === 'global') {
    return '/images/flags/Global.svg'
  }

  //
  return `/images/flags/${plan.countryName.toLowerCase()}.svg`
}

interface GlobalEsimTabProps {
  globalPlans: GlobalPlan[]
}

const GlobalEsimTab: React.FC<GlobalEsimTabProps> = ({ globalPlans }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [filterOption, setFilterOption] = useState<string>('')

  // Handler for toggle selection – only one option can be active at a time.
  const handleToggle = (option: string) => {
    setFilterOption(prev => (prev === option ? '' : option))
  }

  // Helper to convert capacity to GB (assumes capacity is numeric string)
  const getCapacityInGB = (plan: GlobalPlan) => {
    const cap = parseFloat(plan.capacity)

    return plan.capacityUnit.toLowerCase() === 'mb' ? cap / 1024 : cap
  }

  const enrichedPlans = useMemo(() => {
    return globalPlans.map(plan => ({
      ...plan,
      customFlag: getFlagUrl(plan)
    }))
  }, [globalPlans])

  const sortedPlans = useMemo(() => {
    const plans = [...enrichedPlans]

    if (filterOption === 'cheapest') {
      plans.sort((a, b) => a.price - b.price)
    } else if (filterOption === 'longest') {
      plans.sort((a, b) => parseFloat(b.vaildity) - parseFloat(a.vaildity))
    } else if (filterOption === 'largest') {
      plans.sort((a, b) => getCapacityInGB(b) - getCapacityInGB(a))
    }

    return plans
  }, [enrichedPlans, filterOption])

  const FilterPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minHeight: '300px' }}>
      <Button
        variant={filterOption === 'cheapest' ? 'contained' : 'outlined'}
        startIcon={<MonetizationOnIcon />}
        onClick={() => handleToggle('cheapest')}
        sx={{ textTransform: 'none', width: isMobile ? 100 : '100%', py: 2 }}
      >
        Cheapest
      </Button>
      <Button
        variant={filterOption === 'longest' ? 'contained' : 'outlined'}
        startIcon={<CheckCircleIcon />}
        onClick={() => handleToggle('longest')}
        sx={{ textTransform: 'none', width: isMobile ? 100 : '100%', py: 2 }}
      >
        Longest Validity
      </Button>
      <Button
        variant={filterOption === 'largest' ? 'contained' : 'outlined'}
        startIcon={<StorageIcon />}
        onClick={() => handleToggle('largest')}
        sx={{ textTransform: 'none', width: isMobile ? 100 : '100%', py: 2 }}
      >
        Largest GB
      </Button>
    </Box>
  )

  const isLoading = globalPlans.length === 0

  return (
    <Box>
      <PlansDetails plans={sortedPlans} isLoading={isLoading} />
    </Box>
  )
}

export default GlobalEsimTab
