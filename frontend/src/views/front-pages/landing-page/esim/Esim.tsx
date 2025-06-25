'use client'

// React imports
import { useState, useRef, useEffect } from 'react'

// Next Imports
import Image from 'next/image'
import { useT } from '@/i18n/client'

// MUI Imports
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  Container,
  TextField,
  InputAdornment,
  ClickAwayListener,
  Chip,
  Skeleton
} from '@mui/material'
import Map from '@mui/icons-material/Map'
import Public from '@mui/icons-material/Public'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import LocationOnIcon from '@mui/icons-material/LocationOn'

// Hook Imports
import { useTheme } from '@mui/material/styles'

// Custom Components Imports
import GlobalEsimTab from './GlobalEsimTab'
import PlansDetails from './PlansDetails'

// Utils Imports
import api from '@/utils/api'
import { customLog, formatPrice } from '@/utils/commons'

/**
 * FlagImage component
 */
const FlagImage = ({ country, width = 100, height = 60, isRegion = false }) => {
  if (!country) return null

  if (!isRegion && !country.code && !country.flag) return null

  const [src, setSrc] = useState('')
  const code = country.code ? country.code.toLowerCase() : null
  const localFlagPath = code ? `/flags/${code}.png` : country.flag || ''

  useEffect(() => {
    if (!isRegion && code) {
      setSrc(localFlagPath)
    }
  }, [isRegion, code, localFlagPath])

  if (isRegion) {
    const regionFlagMap = {
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

    const localSrc = regionFlagMap[country.name] || '/images/flags/default-region.svg'

    return (
      <Box sx={{ position: 'relative', width, height }}>
        <Image
          src={localSrc}
          alt={country.name}
          layout='fixed'
          width={width}
          height={height}
          objectFit='contain'
          quality={100}
        />
      </Box>
    )
  } else {
    const fallbackFlag = '/flags/default.png'

    return (
      <Box sx={{ position: 'relative', width, height }}>
        <Image
          src={src || fallbackFlag}
          alt={country.name}
          layout='fixed'
          width={width}
          height={height}
          objectFit='contain'
          quality={100}
          onError={() => {
            if (src === localFlagPath) {
              setSrc(fallbackFlag)
            }
          }}
        />
      </Box>
    )
  }
}

const Esim = props => {
  const { t } = useT('common')
  const tabs = [
    { label: t('esim.tabs.local'), icon: <LocationOnIcon /> },
    { label: t('esim.tabs.regional'), icon: <Map /> },
    { label: t('esim.tabs.global'), icon: <Public /> }
  ]
  const regionsTabNbr = 1
  const globalTabNbr = 2

  // activeTab: 0 = Local; 1 = Regional; 2 = Global
  const [activeTab, setActiveTab] = useState(0)
  const [isGlobalTagActive, setIsGlobalTagActive] = useState(true)

  // Local, region and global eSIM data
  const [localEsims, setLocalEsims] = useState([])
  const [regionEsims, setRegionEsims] = useState([])
  const [globalEsims, setGlobalEsims] = useState([])

  // Separate loading states
  const [localLoading, setLocalLoading] = useState(false)
  const [regionLoading, setRegionLoading] = useState(false)
  const [globalLoading, setGlobalLoading] = useState(false)

  // Client-side pagination for Local tab:
  const [displayCount, setDisplayCount] = useState(20)
  const [loadMoreCount, setLoadMoreCount] = useState(0)

  // Search & dropdown state
  const [searchText, setSearchText] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  // Selected country/region state and its plans
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryPlans, setCountryPlans] = useState([])
  const [countryPlansLoading, setCountryPlansLoading] = useState(false)

  const ref = useRef(null)
  const theme = useTheme()

  // Fetch local eSIM data on mount
  useEffect(() => {
    if (activeTab === 0 && localEsims.length === 0) {
      const fetchLocal = async () => {
        try {
          setLocalLoading(true)
          const res = await api.get('/esim/local-esims?offset=0&limit=1000')
          if (res.data?.countries) {
            setLocalEsims(res.data.countries)
          }
        } catch (err) {
          console.error('Error fetching local eSIMs:', err)
        } finally {
          setLocalLoading(false)
        }
      }
      fetchLocal()
    }
  }, [activeTab, localEsims.length])

  // Fetch regional eSIM data
  useEffect(() => {
    if (localEsims.length > 0 && regionEsims.length === 0) {
      const fetchRegion = async () => {
        try {
          setRegionLoading(true)
          const res = await api.get('/esim/region-esims?offset=0&limit=30')
          if (res.data?.regions) {
            setRegionEsims(res.data.regions.map(item => ({ ...item, isRegion: true })))
          }
        } catch (err) {
          console.error('Error fetching regional eSIMs:', err)
        } finally {
          setRegionLoading(false)
        }
      }
      fetchRegion()
    }
  }, [activeTab, regionEsims.length, localEsims.length])

  // Fetch global eSIM data
  useEffect(() => {
    if (globalEsims.length === 0) {
      const fetchGlobal = async () => {
        try {
          setGlobalLoading(true)
          const res = await api.get('/esim/global-plans')
          if (res.data?.getInformation) {
            setGlobalEsims(res.data.getInformation)
          }
        } catch (err) {
          console.error('Error fetching global plans:', err)
        } finally {
          setGlobalLoading(false)
        }
      }
      fetchGlobal()
    }
  }, [activeTab, globalEsims.length])

  useEffect(() => {
    if (activeTab === globalTabNbr) {
      setIsGlobalTagActive(true)
    }
    // Clear any selected country when switching tabs
    setSelectedCountry(null)
    setCountryPlans([])
  }, [activeTab])

  // Filter out local items with no price.
  const filteredLocalEsims = localEsims.filter(item => item.minPrice !== null && item.minPrice !== undefined)

  // Combine local and regional data with an isRegion flag.
  const combinedData = [
    ...filteredLocalEsims.map(item => ({ ...item, isRegion: false })),
    ...regionEsims
      .filter(item => item.minPrice !== null && item.minPrice !== undefined)
      .map(item => ({ ...item, isRegion: true }))
  ]

  // Conditional search filtering
  let filteredSearchResults = []
  if (activeTab === globalTabNbr && isGlobalTagActive) {
    filteredSearchResults = globalEsims
      .filter(plan => plan.planName.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        const search = searchText.toLowerCase()
        const aStarts = a.planName.toLowerCase().startsWith(search) ? 0 : 1
        const bStarts = b.planName.toLowerCase().startsWith(search) ? 0 : 1
        return aStarts - bStarts
      })
  } else if (selectedCountry) {
    filteredSearchResults = countryPlans
      .filter(plan => plan.planName.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        const search = searchText.toLowerCase()
        const aStarts = a.planName.toLowerCase().startsWith(search) ? 0 : 1
        const bStarts = b.planName.toLowerCase().startsWith(search) ? 0 : 1
        return aStarts - bStarts
      })
  } else {
    filteredSearchResults = combinedData
      .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        const search = searchText.toLowerCase()
        const aStarts = a.name.toLowerCase().startsWith(search) ? 0 : 1
        const bStarts = b.name.toLowerCase().startsWith(search) ? 0 : 1
        return aStarts - bStarts
      })
  }

  // Grid view data for local/region (when no country is selected)
  const esimsData =
    activeTab === 0 ? filteredLocalEsims.slice(0, displayCount) : activeTab === regionsTabNbr ? regionEsims : []

  // Load More for local tab
  const handleLoadMore = () => {
    if (activeTab !== 0) return
    if (loadMoreCount < 2) {
      setDisplayCount(prev => Math.min(prev + 10, filteredLocalEsims.length))
      setLoadMoreCount(prev => prev + 1)
    } else {
      setDisplayCount(filteredLocalEsims.length)
    }
  }

  // Clear search and hide dropdown.
  const clearSearch = () => {
    setSearchText('')
    setShowDropdown(false)
  }

  // Handle key events on the search input.
  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      clearSearch()
    }
  }

  // ---- Handling click on a local/region card ----
  const handleLocalCardClick = async item => {
    setSelectedCountry(item)
    try {
      setCountryPlansLoading(true)
      if (item.isRegion) {
        const payload = {
          flag: 2,
          countryCode: '',
          multiplecountrycode: [item.name]
        }
        const res = await api.post('/esim/plan-information', payload)
        if (res.data?.getInformation) {
          const regionPlans = res.data.getInformation
            .filter(plan => plan.countryName.toLowerCase().includes(item.name.toLowerCase()))
            .map(plan => ({
              ...plan,
              customFlag: (() => {
                const regionFlagMap = {
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
                return regionFlagMap[item.name] || ''
              })()
            }))
          setCountryPlans(regionPlans)
        }
      } else {
        const payload = {
          type: 1,
          countryCode: item.code
        }
        const res = await api.post('/esim/plan-information-countrywise', payload)
        if (res.data?.getInformation) {
          const enrichedPlans = res.data.getInformation.map(plan => ({
            ...plan,
            customFlag: `/flags/${item.code.toLowerCase()}.png`
          }))
          setCountryPlans(enrichedPlans)
        }
      }
    } catch (err) {
      console.error('Error fetching country/region plans:', err)
    } finally {
      setCountryPlansLoading(false)
    }
  }

  // Compute combined loading state based on active tab.
  const isLoading =
    activeTab === globalTabNbr ? globalLoading : activeTab === regionsTabNbr ? regionLoading : localLoading

  // Main content rendering:
  let content

  if (activeTab === globalTabNbr) {
    content = isLoading ? (
      <Box sx={{ p: 2, minHeight: '300px', transition: 'opacity 0.3s ease' }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          <Typography>{t('esim.loadingPlans')}</Typography>
        </Typography>
        <Skeleton variant='rectangular' width='100%' height={400} />
      </Box>
    ) : (
      <GlobalEsimTab globalPlans={globalEsims} />
    )
  } else if (selectedCountry) {
    // When a country is selected, check if its plans are still loading.
    content = countryPlansLoading ? (
      <Box sx={{ p: 2, minHeight: '300px', transition: 'opacity 0.3s ease' }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Loading Plan Details, please wait...
        </Typography>
        <Skeleton variant='rectangular' width='100%' height={300} />
      </Box>
    ) : (
      <PlansDetails plans={countryPlans} isLoading={false} />
    )
  } else {
    content = isLoading ? (
      <Box sx={{ p: 2, minHeight: '300px', transition: 'opacity 0.3s ease' }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Loading Plans, please wait...
        </Typography>
        <Skeleton variant='rectangular' width='100%' height={300} />
      </Box>
    ) : (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Grid
          container
          spacing={3}
          sx={{
            pb: 1,
            maxWidth: '100%',
            mx: 'auto',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {esimsData.map((item, index) => (
            <Grid
              item
              xs={4}
              sm={3}
              md={2.4}
              lg={2}
              key={`${activeTab}-${item.code || item.name}-${index}`}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 6,
                mb: 0.2
              }}
              onClick={() => handleLocalCardClick(item)}
            >
              <Box
                sx={{
                  background: 'linear-gradient(45deg, #0FB799, #153B50)',
                  borderRadius: '18px',
                  p: 0.5,
                  width: '90%',
                  cursor: 'pointer'
                }}
              >
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'box-shadow 0.4s ease',
                    '&:hover': { boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)' },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'rgba(15, 183, 153, 0.12)',
                      transition: 'left 0.6s ease'
                    },
                    '&:hover:before': {
                      left: 0
                    }
                  }}
                >
                  <Box
                    sx={{
                      mx: 'auto',
                      display: 'flex',
                      justifyContent: 'center',
                      p: 0.5,
                      bgcolor: 'grey.300',
                      borderRadius: 0,
                      width: 65.4,
                      height: 43.2
                    }}
                  >
                    <FlagImage country={item} width={65} height={43} isRegion={activeTab === regionsTabNbr} />
                  </Box>
                  <Box
                    sx={{
                      py: 1.5,
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                      borderBottom: '1px solid #eee',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant='subtitle2' sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      from $ {formatPrice(item.minPrice)}
                    </Typography>
                  </Box>
                  <Box sx={{ backgroundColor: 'customColors.secondary', py: 1.5, textAlign: 'center' }}>
                    <Typography
                      variant='subtitle1'
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        fontSize: '0.85rem'
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>

        {activeTab === 0 && filteredLocalEsims.length > displayCount && (
          <Button
            variant='contained'
            onClick={handleLoadMore}
            sx={{
              mt: 12,
              backgroundColor: '#00897b',
              color: 'white',
              borderRadius: '9px',
              px: 8.5,
              py: 4,
              fontSize: '1.1rem',
              '&:hover': { backgroundColor: '#00695c' }
            }}
          >
            {t('esim.loadMore')}
          </Button>
        )}
      </Box>
    )
  }

  return (
    <section ref={ref} id='esims'>
      <Container maxWidth='lg'>
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            pb: 6,
            mt: 7,
            minHeight: '50vh'
          }}
        >
          <Box sx={{ textAlign: 'center', py: 6 }}>
            {/* Heading */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                px: { xs: 2, md: 0 }
              }}
            >
              <Box sx={{ display: 'inline-block' }}>
                <Typography
                  variant='h2'
                  component='span'
                  fontWeight='600'
                  sx={{
                    color: 'text.main',
                    fontSize: { xs: '1.5rem', md: 'h4.fontSize' }
                  }}
                >
                  {t('esim.titleLine1')}
                </Typography>
                <Typography
                  variant='h5'
                  component='span'
                  fontWeight='300'
                  sx={{
                    color: 'text.main',
                    fontSize: { xs: '1.6rem', md: 'h5.fontSize' }
                  }}
                >
                  {t('esim.titleLine2')}{' '}
                </Typography>
              </Box>
              <Typography
                variant='h5'
                sx={{
                  color: 'gray',
                  mt: 1,
                  ml: { xs: 0, md: 30 }
                }}
              >
                <Typography
                  variant='h3'
                  component='span'
                  fontWeight='normal'
                  sx={{
                    color: 'text.main',
                    fontSize: { xs: '1.8rem', md: 'h3.fontSize' }
                  }}
                >
                  {t('esim.subtitlePart1')}{' '}
                </Typography>
                <Typography
                  variant='h3'
                  component='span'
                  fontWeight='bold'
                  sx={{
                    color: 'primary.main',
                    fontSize: { xs: '1.8rem', md: 'h3.fontSize' }
                  }}
                >
                  <strong>{t('esim.subtitlePart2')}</strong>
                </Typography>
              </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  flexWrap: { xs: 'wrap', md: 'nowrap' },
                  justifyContent: 'center',
                  gap: { xs: 4, sm: 3 },
                  borderBottom: '1px solid #ddd',
                  pb: 0,
                  mx: 'auto'
                }}
              >
                {tabs.map((tabItem, index) => (
                  <Box
                    key={`${index}-${tabItem.label}`}
                    onClick={() => setActiveTab(index)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      backgroundColor: activeTab === index ? 'customColors.secondary' : 'transparent',
                      color: activeTab === index ? '#fff' : 'text.main',
                      borderRadius: activeTab === index ? '7.5px' : 0,
                      px: activeTab === index ? 3 : 1.5,
                      py: 1.5,
                      transition: 'background-color 0.2s',
                      '&::after': {
                        content: activeTab === index ? '""' : 'none',
                        position: 'absolute',
                        bottom: '-7px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid #004B48'
                      }
                    }}
                  >
                    {tabItem.icon && (
                      <Box component='span' sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                        {tabItem.icon}
                      </Box>
                    )}
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontWeight: activeTab === index ? 'bold' : 'normal',
                        color: activeTab === index ? 'white' : 'text.main'
                      }}
                    >
                      {tabItem.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Search Input and Live Search Dropdown */}
            <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  my: 4,
                  width: { xs: '90%', sm: '70%', md: '50%' },
                  mx: 'auto',
                  position: 'relative'
                }}
              >
                {activeTab === globalTabNbr
                  ? isGlobalTagActive && (
                      <Chip
                        label='Global'
                        onDelete={() => setIsGlobalTagActive(false)}
                        color='secondary'
                        sx={{
                          mr: 1,
                          backgroundColor: 'customColors.secondary',
                          color: 'white'
                        }}
                      />
                    )
                  : selectedCountry && (
                      <Chip
                        label={selectedCountry.name}
                        onDelete={() => {
                          setSelectedCountry(null)
                          setCountryPlans([])
                        }}
                        color='secondary'
                        sx={{
                          mr: 1,
                          backgroundColor: 'customColors.secondary',
                          color: 'white'
                        }}
                      />
                    )}
                <Box sx={{ width: '100%', position: 'relative' }}>
                  <TextField
                    fullWidth
                    variant='outlined'
                    placeholder={
                      activeTab === globalTabNbr
                        ? t('esim.search.globalPlaceholder')
                        : selectedCountry
                          ? t('esim.search.countryPlaceholder', { country: selectedCountry.name })
                          : t('esim.search.defaultPlaceholder')
                    }
                    value={searchText}
                    onChange={e => {
                      setSearchText(e.target.value)
                      setShowDropdown(true)
                    }}
                    onFocus={e => {
                      if (searchText) {
                        e.target.select()
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon color='action' />
                        </InputAdornment>
                      ),
                      endAdornment: searchText && (
                        <InputAdornment position='end' onClick={clearSearch} sx={{ cursor: 'pointer' }}>
                          <ClearIcon color='action' />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      backgroundColor: 'background.paper',
                      borderRadius: '4px'
                    }}
                  />
                  {showDropdown && searchText.trim() && filteredSearchResults.length > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        borderRadius: 1,
                        maxHeight: 300,
                        overflowY: 'auto',
                        zIndex: 10
                      }}
                    >
                      {filteredSearchResults.map(result => (
                        <Box
                          key={`dropdown-${result.isRegion ? result.name : result.code}`}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 1,
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor:
                                theme.palette.mode === 'dark' ? theme.palette.customColors.chatBg : 'grey.100'
                            }
                          }}
                          onClick={() => {
                            if ((activeTab === globalTabNbr && isGlobalTagActive) || selectedCountry) {
                              clearSearch()
                              return
                            }
                            const targetTab = result.isRegion ? regionsTabNbr : 0
                            if (activeTab !== targetTab) {
                              setActiveTab(targetTab)
                              setTimeout(() => {
                                handleLocalCardClick(result)
                              }, 0)
                            } else {
                              handleLocalCardClick(result)
                            }
                            clearSearch()
                          }}
                        >
                          {activeTab === globalTabNbr && isGlobalTagActive ? (
                            <Box sx={{ ml: 2, textAlign: 'left' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Image src='/images/flags/Global.svg' alt='Global plan icon' width={16} height={16} />
                                <Typography variant='body2' sx={{ ml: 1 }}>
                                  {result.planName}
                                </Typography>
                              </Box>
                              <Typography variant='caption' color='text.secondary'>
                                {result.currency} {result.price.toFixed(2)}
                              </Typography>
                            </Box>
                          ) : (
                            <>
                              {(result.isRegion || result.code) && (
                                <Box sx={{ position: 'relative', width: 30, height: 20 }}>
                                  <FlagImage country={result} width={30} height={20} isRegion={result.isRegion} />
                                </Box>
                              )}
                              <Box sx={{ ml: 2, textAlign: 'left' }}>
                                <Typography variant='body2'>
                                  {selectedCountry ? result.planName : result.name}
                                </Typography>
                                {result.minPrice && (
                                  <Typography variant='caption' color='text.secondary'>
                                    from ${formatPrice(result.minPrice)}
                                  </Typography>
                                )}
                              </Box>
                            </>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </ClickAwayListener>

            {/* Content Area */}
            {content}
          </Box>
        </Box>
      </Container>
    </section>
  )
}

export default Esim
