'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useT } from '@/i18n/client'

// MUI Imports
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import {
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Pagination,
  Button,
  Link
} from '@mui/material'

// MUI Icons
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

// Additional Icons for Tab Buttons
import CallIcon from '@mui/icons-material/Call'
import StoreIcon from '@mui/icons-material/Store'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'

// Additional Icons for Table/Mobile cells
import DialpadIcon from '@mui/icons-material/Dialpad'
import PublicIcon from '@mui/icons-material/Public'
import DescriptionIcon from '@mui/icons-material/Description'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
// Utils Imports
import { customLog } from '@/utils/commons'
import { iso3toIso2 } from './utils'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
// Text Component
import { Text } from '@/components/common/text'
// Type Imports
import type { Mode } from '@core/types'
import { locale } from 'dayjs'
import { getLocale } from '@/utils/commons'

// Utils
import api from '@/utils/api'

// Define the row data type for the table.
type RowData = {
  id: number
  prefix: string
  country: string
  description: string
  price: string
  countryIso?: string
}

// Mapping for region flags (SVG)
const regionFlagMap: Record<string, string> = {
  Africa: '/images/flags/Africa.svg',
  'Asia-Pacific': '/images/flags/Asia-Pacific.svg',
  Balkans: '/images/flags/Balkans.svg',
  Caribbean: '/images/flags/Caribbean.svg',
  Eurasia: '/images/flags/Eurasia.svg',
  Europe: '/images/flags/Europe.svg',
  Global: '/images/flags/Global.svg',
  'Middle-east': '/images/flags/Middle-east.svg',
  'North-America': '/images/flags/North-America.svg',
  'South-Latin-America': '/images/flags/South-Latin-America.svg'
}

const local = getLocale()

// Helper function to determine the flag source.
const getFlagSrc = (row: RowData): string => {
  if (row.countryIso && row.countryIso.trim().length > 0) {
    return `/flags/${iso3toIso2(row.countryIso)}.png`
  }
  const regionKey = row.country.replace(/\s+/g, '-')
  if (regionFlagMap[row.country]) return regionFlagMap[row.country]
  if (regionFlagMap[regionKey]) return regionFlagMap[regionKey]
  return '/images/flags/Global.svg'
}

// Columns definition for the MUI Table header

// Define tab keys.
type TabKey = 'CC' | 'Retail' | 'Low Cost'

// Custom hook for debouncing any fast-changing value (such as searchTerm)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// -----------------------------------------------------------------------------
// Memoized row components for Desktop and Mobile views.
// -----------------------------------------------------------------------------

// Desktop Table Row Component.
const DesktopTableRow = React.memo(({ row, theme }: { row: RowData; theme: any }) => (
  <TableRow key={row.id} hover>
    <TableCell sx={{ fontSize: '1.05rem' }} align='left'>
      {row.prefix}
    </TableCell>
    <TableCell align='left'>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Image src={getFlagSrc(row)} alt={`${row.country} flag`} width={20} height={15} />
        <Typography sx={{ ml: 2, fontSize: '1.05rem' }}>{row.country}</Typography>
      </Box>
    </TableCell>
    <TableCell align='left'>{row.description}</TableCell>
    <TableCell align='left'>{row.price}</TableCell>
  </TableRow>
))

// Mobile Card Row Component.
const MobileCardRow = React.memo(({ row, theme }: { row: RowData; theme: any }) => {
  const flagSrc = getFlagSrc(row)
  return (
    <Box
      key={row.id}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        mb: 2
      }}
    >
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <DialpadIcon fontSize='small' sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
        <Typography variant='subtitle2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
          Prefix:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {row.prefix}
        </Typography>
      </Box>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <PublicIcon fontSize='small' sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
        <Typography variant='subtitle2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
          Country:
        </Typography>
        <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
          <Image src={flagSrc} alt={`${row.country} flag`} width={20} height={15} />
          <Typography variant='body1' sx={{ ml: 1 }}>
            {row.country}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <DescriptionIcon fontSize='small' sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
        <Typography variant='subtitle2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
          Description:
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {row.description}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <AttachMoneyIcon fontSize='small' sx={{ mr: 0.5, color: theme.palette.text.secondary }} />
        <Typography variant='subtitle2' color='text.secondary' sx={{ fontWeight: 'bold' }}>
          Starting Price (USD):
        </Typography>
        <Typography variant='body1' sx={{ ml: 1 }}>
          {row.price}
        </Typography>
      </Box>
    </Box>
  )
})

// -----------------------------------------------------------------------------
// Main Rates Component
// -----------------------------------------------------------------------------

const Rates = () => {
  const theme = useTheme()
  const bgLight = '/images/front-pages/landing-page/bg-rates-section.png'
  const bgDark = '/images/front-pages/landing-page/bg-rates-section-dark.png'
  const bgRates = useImageVariant(theme.palette.mode, bgLight, bgDark)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { t } = useT('common')
  const columns = [
    {
      id: 'prefix',
      label: t('ratesSection.table.prefix'),
      icon: <DialpadIcon fontSize='small' sx={{ mr: 0.5, color: 'secondary.main' }} />
    },
    {
      id: 'country',
      label: t('ratesSection.table.country'),
      icon: <PublicIcon fontSize='small' sx={{ mr: 0.5, color: 'secondary.main' }} />
    },
    {
      id: 'description',
      label: t('ratesSection.table.description'),
      icon: <DescriptionIcon fontSize='small' sx={{ mr: 0.5, color: 'secondary.main' }} />
    },
    {
      id: 'price',
      label: t('ratesSection.table.price'),
      icon: <AttachMoneyIcon fontSize='small' sx={{ mr: 0.5, color: 'secondary.main' }} />
    }
  ]
  const sectionRef = useRef<HTMLDivElement | null>(null)
  // Ref for the top of the table area (headers & tabs)
  const headerRef = useRef<HTMLDivElement | null>(null)
  const { updateIntersections } = useIntersection()

  // States for tab, loading, data, pagination, search, and sorting.
  const [activeTab, setActiveTab] = useState<TabKey>('CC')
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<RowData[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Use debounced version of searchTerm to prevent filtering on every keystroke.
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const [sortConfig, setSortConfig] = useState<{ key: keyof RowData; direction: 'asc' | 'desc' } | null>(null)

  const itemsPerPage = 10

  // Wrap tabToParam in useMemo so its reference is stable and doesn't trigger the effect repeatedly.
  const tabToParam = useMemo(() => {
    return {
      CC: 5,
      Retail: 6,
      'Low Cost': 7
    }
  }, [])

  // Memoized callback for setting active tab.
  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab)
  }, [])

  // Fetch data when activeTab changes.
  // TODO will use the backend api instead of utils api
  useEffect(() => {
    const param = tabToParam[activeTab]
    setLoading(true)
    customLog('in rates-section: param', param)
    api
      .get(`/rates/saved/${param}`)
      .then(response => {
        const apiRates = response.data?.rates || []

        type ApiRateRecord = {
          prefix: string
          country: string
          description: string
          price_1: string
          countryIso: string
        }

        const rows: RowData[] = apiRates.map((record: ApiRateRecord, index: number) => ({
          id: index + 1,
          prefix: record.prefix,
          country: record.country || '',
          description: record.description || '',
          price: record.price_1 || '',
          countryIso: record.countryIso || ''
        }))
        customLog('Fetched data:', rows)
        setData(rows)
        setCurrentPage(1)
        setSearchTerm('')
        setSortConfig(null)
      })
      .catch(error => {
        customLog('Error fetching rates from backend:', error)
        setData([])
      })
      .finally(() => {
        setLoading(false)
        customLog('Loading finished for tab:', activeTab)
      })
  }, [activeTab, tabToParam])

  // Filter data based on the debounced search term.
  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm) return data
    const term = debouncedSearchTerm.toLowerCase()
    return data.filter(
      item =>
        item.prefix.toLowerCase().includes(term) ||
        item.country.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
    )
  }, [data, debouncedSearchTerm])

  // Sort data manually based on sortConfig.
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData
    const { key, direction } = sortConfig
    return [...filteredData].sort((a, b) => {
      const aVal = String(a[key]).toLowerCase()
      const bVal = String(b[key]).toLowerCase()
      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Pagination logic.
  const totalPages = useMemo(() => Math.ceil(sortedData.length / itemsPerPage), [sortedData])
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])

  // Reset current page when the debounced search term changes.
  useEffect(() => {
    setCurrentPage(1)
    customLog('Search term changed. Resetting current page to 1.')
  }, [debouncedSearchTerm])

  // Memoized callback for sorting.
  const handleSort = useCallback((columnId: keyof RowData) => {
    setSortConfig(prev =>
      prev && prev.key === columnId
        ? { key: columnId, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key: columnId, direction: 'asc' }
    )
  }, [])

  // Memoized callback for pagination change.
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
    setTimeout(() => {
      const stickyOffset = 80
      if (headerRef.current) {
        const elementTop = headerRef.current.getBoundingClientRect().top + window.pageYOffset - stickyOffset
        window.scrollTo({ top: elementTop, behavior: 'smooth' })
      }
    }, 50)
  }, [])

  // Memoized callback for search input changes.
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  return (
    <section id='rates' ref={sectionRef}>
      <Box
        className='flex flex-col items-center px-4 min-h-screen pb-8'
        sx={{
          backgroundImage: `url(${bgRates})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mb: 'var(--section-margin-bottom)',
          pt: 4
        }}
      >
        <Divider sx={{ borderBottomWidth: '0.08rem', mb: 0, borderColor: theme.palette.text.primary }} />
        <Box sx={{ textAlign: 'center', mb: 0 }}>
          <AnimatedHeadline variant='fadeUp' fontSize={{ xs: '0.65rem', md: '1.65rem' }}>
            <Box component='span' sx={{ color: 'secondary.main' }}>
              {t('ratesSection.headline.part1')}{' '}
            </Box>
            <Box component='span' sx={{ color: 'primary.main', fontFamily: 'Open Sans Bold' }}>
              {t('ratesSection.headline.part2')}
            </Box>
          </AnimatedHeadline>

          <Typography>
            {t('ratesSection.description')}
            <br />
            {t('ratesSection.descriptionSub')}
          </Typography>
        </Box>
        {/* Top "See All Countries" Link */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Link href={mounted ? `/${local}/rates/countries` : `/rates/countries`}>
            <Typography
              variant='subtitle1'
              sx={{ cursor: 'pointer', color: theme.palette.primary.main, textDecoration: 'underline' }}
            >
              {t('ratesSection.seeAllCountries')}
            </Typography>
          </Link>
        </Box>
        {/* Interactive Elements with blur effect and overlay */}
        <Box className='relative w-full max-w-3xl'>
          {/* Blurred Content */}
          <Box className='blur-md pointer-events-none select-none'>
            {/* Tab Buttons */}
            <Box className='flex justify-center mb-4 w-full'>
              {(['CC', 'Retail', 'Low Cost'] as TabKey[]).map(tab => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: tab === 'CC' ? '0.5rem 0 0 0.5rem' : tab === 'Low Cost' ? '0 0.5rem 0.5rem 0' : 0,
                    flex: 1,
                    backgroundColor: activeTab === tab ? 'primary.main' : 'transparent',
                    color: activeTab === tab ? 'white' : 'text.primary'
                  }}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab === 'CC' ? (
                    <CallIcon fontSize='small' sx={{ mr: 0.5 }} />
                  ) : tab === 'Retail' ? (
                    <StoreIcon fontSize='small' sx={{ mr: 0.5 }} />
                  ) : (
                    <MoneyOffIcon fontSize='small' sx={{ mr: 0.5 }} />
                  )}
                  {t(`ratesSection.tabs.${tab}`)}
                </Button>
              ))}
            </Box>
            {/* Search Bar */}
            <Box className='w-full mb-2'>
              <TextField
                fullWidth
                placeholder={t('ratesSection.searchPlaceholder')}
                size='small'
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={e => {
                  const input = e.target as HTMLInputElement
                  if (typeof input.select === 'function') {
                    input.select()
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: theme.palette.text.primary }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setSearchTerm('')}>
                        <ClearIcon sx={{ color: theme.palette.text.primary }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: theme.palette.text.primary,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: `${theme.palette.text.primary} !important`
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: `${theme.palette.text.primary} !important`
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: `${theme.palette.text.primary} !important`
                    }
                  }
                }}
                sx={{
                  input: { color: theme.palette.text.primary },
                  '& .MuiInputAdornment-root': {
                    borderColor: `${theme.palette.text.primary} !important`
                  }
                }}
              />
            </Box>
            {/* Card Container */}
            <Card
              className='w-full'
              sx={{
                border: '1px solid',
                borderColor: 'text.primary.main',
                borderRadius: '12px',
                padding: '35px 25px 14px 19px'
              }}
            >
              {/* Top element for scrolling reference */}
              <div id='ratesTop' ref={headerRef} />
              {loading ? (
                isMobile ? (
                  // Mobile loading skeleton in a scrollable container.
                  <Box className='custom-scrollbar' sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Box key={index} sx={{ border: '1px solid #ddd', borderRadius: 1, p: 2, mb: 2, width: '90%' }}>
                        <Skeleton variant='text' width='85%' height={20} />
                        <Skeleton variant='text' width='96%' height={20} sx={{ mt: 1 }} />
                        <Skeleton variant='text' width='96%' height={20} sx={{ mt: 1 }} />
                        <Skeleton variant='text' width='90%' height={20} sx={{ mt: 1 }} />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  // Desktop loading skeleton with header separated from scrollable rows.
                  <Paper className='custom-scrollbar' sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {columns.map(column => (
                            <TableCell key={column.id}>
                              <Skeleton variant='text' width='80%' height={30} />
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                    </Table>
                    <TableContainer
                      className='custom-scrollbar'
                      sx={{ maxHeight: 'calc(70vh - 60px)', overflowY: 'auto' }}
                    >
                      <Table>
                        <TableBody>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              {columns.map(column => (
                                <TableCell key={column.id}>
                                  <Skeleton variant='text' width='90%' height={25} />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )
              ) : isMobile ? (
                // Mobile view: render cards inside a scrollable container.
                <Box className='custom-scrollbar' sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {paginatedData.length > 0 ? (
                    paginatedData.map(row => <MobileCardRow key={row.id} row={row} theme={theme} />)
                  ) : (
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography>{t('ratesSection.noData')}</Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                // Desktop view: render using MUI Table with header outside the scrollable rows.
                <TableContainer
                  className='custom-scrollbar'
                  component={Paper}
                  sx={{ maxHeight: 'calc(70vh - 60px)', minHeight: '30rem', overflowY: 'auto' }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        {columns.map(column => (
                          <TableCell
                            key={column.id}
                            sx={{ fontSize: '1rem', cursor: 'pointer' }}
                            onClick={() => handleSort(column.id as keyof RowData)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {column.icon}
                              <TableSortLabel
                                active={sortConfig?.key === column.id}
                                direction={sortConfig?.key === column.id ? sortConfig.direction : 'asc'}
                                sx={{
                                  '& .MuiTableSortLabel-icon': { color: `${theme.palette.primary.main} !important` }
                                }}
                              >
                                {column.label}
                              </TableSortLabel>
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map(row => <DesktopTableRow key={row.id} row={row} theme={theme} />)
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} align='center'>
                            No matching data available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Pagination Component – shown on mobile always and on desktop if more than one page */}
              {!loading && (isMobile || totalPages > 1) && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color='primary'
                    variant='outlined'
                    shape='rounded'
                    sx={{ '& .MuiPaginationItem-root.Mui-disabled': { cursor: 'not-allowed' } }}
                  />
                </Box>
              )}
            </Card>

            {/* "See All Countries" Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link href={mounted ? `/${local}/rates/countries` : `/rates/countries`}>
                <Typography
                  variant='subtitle1'
                  sx={{ cursor: 'pointer', color: theme.palette.primary.main, textDecoration: 'underline' }}
                >
                  {t('ratesSection.seeAllCountries')}
                </Typography>
              </Link>
            </Box>
          </Box>

          {/* Coming Soon Overlay */}
          <Box className='absolute inset-0 flex flex-col justify-center items-center bg-black/30 z-10 rounded-lg cursor-wait '>
            <Text
              as='h2'
              textColor='white'
              className='font-coolvetica font-bold text-center text-4xl sm:text-5xl  text-shadow-lg lg:text-8xl md:text-6xl mb-4 float-animation'
            >
              {t('comingSoon.title').toUpperCase()}
            </Text>
            <Text
              as='h6'
              textColor='white'
              className='font-coolvetica text-center text-base sm:text-xl px-4  float-animation'
            >
              {t('comingSoon.description')}
            </Text>
          </Box>
        </Box>
      </Box>

      <style jsx global>{`
        /* Custom scrollbar styling: always thin and black */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3c3f59 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3c3f59;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #3c3f59;
        }
      `}</style>
    </section>
  )
}

export default Rates
