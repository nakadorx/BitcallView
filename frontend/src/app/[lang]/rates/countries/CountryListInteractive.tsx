'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Country } from '@/data/countries'
import { Box, Button, TextField, InputAdornment, Typography, useTheme, useMediaQuery, Container } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getLocale } from '@/utils/commons'
interface CountryListInteractiveProps {
  countries: Country[]
}

// Define region options including an "All" filter.
const regions = ['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania']

export default function CountryListInteractive({ countries }) {
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  const locale = getLocale()
  // Component states.
  const [activeTab, setActiveTab] = useState<'countries' | 'areacodes'>('countries')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter countries based on selected region.
  let filteredCountries =
    selectedRegion === 'All' ? countries : countries.filter(country => country.region === selectedRegion)

  // Further filter by search term.
  if (searchTerm.trim() !== '') {
    filteredCountries = filteredCountries.filter(country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant={activeTab === 'countries' ? 'contained' : 'text'}
            onClick={() => setActiveTab('countries')}
            sx={{
              borderRadius: theme.shape.borderRadius,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Countries
          </Button>
          <Button
            variant={activeTab === 'areacodes' ? 'contained' : 'text'}
            onClick={() => setActiveTab('areacodes')}
            sx={{
              borderRadius: theme.shape.borderRadius,
              textTransform: 'none',
              px: 3,
              py: 1
            }}
          >
            Area Codes
          </Button>
        </Box>

        {activeTab === 'countries' && (
          <>
            {/* Region Filter and Search */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
                gap: 2
              }}
            >
              {/* Region Filter Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {regions.map(region => (
                  <Button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    variant={selectedRegion === region ? 'contained' : 'outlined'}
                    sx={{
                      borderRadius: 20,
                      textTransform: 'none',
                      px: 2,
                      py: 0.5
                    }}
                    aria-pressed={selectedRegion === region}
                  >
                    {region}
                  </Button>
                ))}
              </Box>

              {/* Search Field */}
              <TextField
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder='Search countries...'
                variant='outlined'
                size='small'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon color='action' />
                    </InputAdornment>
                  )
                }}
                sx={{ minWidth: isSmUp ? 250 : '100%' }}
                aria-label='Search countries'
              />
            </Box>

            {/* Countries Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                  lg: 'repeat(5, 1fr)'
                },
                gap: 2
              }}
            >
              {filteredCountries.map(country => (
                <Link
                  key={country.code}
                  href={`/${locale}/rates/countries/${country.code}`}
                  style={{ textDecoration: 'none' }}
                  aria-label={`View rates for ${country.name}`}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[1],
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: theme.shadows[4],
                        borderColor: theme.palette.primary.main,
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    <Image src={`/flags/${country.code.toLowerCase()}.png`} alt={country.name} width={40} height={25} />
                    <Typography variant='body2' align='center' sx={{ mt: 1, fontWeight: 500 }}>
                      {country.name}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          </>
        )}

        {activeTab === 'areacodes' && <Typography variant='body1'>Area Codes functionality coming soon!</Typography>}
      </Box>
    </Container>
  )
}
