import { Metadata } from 'next'
import Head from 'next/head'
import { notFound } from 'next/navigation'
import { iso3toIso2 } from '@/views/front-pages/landing-page/rates/utils'
import { countryList } from '@/data/countries'
import { customLog } from '@/utils/commons'
import api from '@/utils/api'

// MUI Components
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Breadcrumbs,
  Grid,
  Fade,
  Slide,
  Button
} from '@mui/material'

// MUI Icons
import PhoneIcon from '@mui/icons-material/Phone'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import PublicIcon from '@mui/icons-material/Public'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

// Next.js Link & Image
import Link from 'next/link'
import Image from 'next/image'

// Define the expected URL parameters.
type PageParams = {
  lang: string
  country: string
}

// List of supported languages (adjust as needed)
const supportedLangs = ['en', 'fr', 'es']

/**
 * Pre-generate all country pages.
 */
export async function generateStaticParams() {
  const paramsArray = []
  // Loop through each supported language and country combination.
  for (const lang of supportedLangs) {
    for (const country of countryList) {
      paramsArray.push({
        lang,
        country: country.code.toLowerCase()
      })
    }
  }
  customLog('Static params:', paramsArray)
  return paramsArray
}

/**
 * Generates dynamic metadata for each country page.
 */
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const currentCountry = countryList.find(c => c.code.toLowerCase() === params.country.toLowerCase())
  if (!currentCountry) return {}

  const title = `Rates for ${currentCountry.name} | Bitcall`
  const description = `Discover the calling and data rates in ${currentCountry.name} along with key info and benefits offered by Bitcall – your international calling partner offering unparalleled quality, direct sourcing, and competitive prices.`
  // TODO make website url from env (instead of hardcode (ex: bitcall.io))
  const canonical = `https://bitcall.io/${params.lang}/rates/countries/${params.country}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  }
}

/**
 * Helper function to fetch general country information using the Rest Countries API.
 * We perform a full text search by country name.
 */
async function fetchCountryInfo(countryName: string) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
    if (!res.ok) {
      throw new Error(`Error fetching info for ${countryName}`)
    }
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return data[0] // Return the first match
    }
  } catch (error) {
    customLog('Error fetching country info:', error)
  }
  return null
}

/**
 * Helper to determine the flag source.
 *
 * If the enriched record includes a countryIso (expected as ISO3),
 * it is converted to ISO2. Otherwise, it falls back to using the first
 * two letters of the country name.
 */
const getFlagSrc = (countryIso?: string, countryName?: string): string => {
  if (countryIso && countryIso.trim().length > 0) {
    customLog('Country ISO:', countryIso)
    return `/flags/${iso3toIso2(countryIso.toLowerCase())}.png`
  }
  if (countryName) {
    return `/flags/${countryName.slice(0, 2).toLowerCase()}.png`
  }
  return '/flags/global.png'
}

/**
 * Main country rate page.
 *
 * This version is organized in semantic sections with additional headers,
 * icons, animations, and rich descriptive text for enhanced SEO and improved UX.
 */
export default async function CountryRatePage({ params }: { params: PageParams }) {
  const { country, lang } = params
  customLog("'Country Rate Page Params:'", params)
  customLog('lang:', lang)

  // Lookup the requested country using our local country list.
  const currentCountry = countryList.find(c => c.code.toLowerCase() === country.toLowerCase())
  customLog('Matched currentCountry:', currentCountry)
  if (!currentCountry) {
    notFound()
  }

  // --- Fetch general country information from Rest Countries API.
  const countryInfo = await fetchCountryInfo(currentCountry.name)
  // Extract key details if available.
  const capital = countryInfo?.capital ? countryInfo.capital[0] : 'N/A'
  const region = countryInfo?.region || 'N/A'
  const subregion = countryInfo?.subregion || 'N/A'
  const population = countryInfo?.population?.toLocaleString() || 'N/A'
  const area = countryInfo?.area ? `${countryInfo.area.toLocaleString()} km²` : 'N/A'

  // For this example, 4 = CC, 5 = Retail, 6 = Low Cost.
  const suffixMapping = {
    CC: 5,
    Retail: 6,
    'Low Cost': 7
  }

  let allRates: any[] = []
  try {
    const rateRequests = await Promise.all(
      Object.entries(suffixMapping).map(async ([plan, suffix]) => {
        const res = await api.get(`/rates/saved/${suffix}`)
        const saved = res?.data?.rates || []
        return saved.map((record: any) => ({ ...record, plan }))
      })
    )
    allRates = rateRequests.flat()
  } catch (error) {
    customLog('Error fetching saved backend rates:', error)
  }

  // --- Filter the combined results for the current country.
  const filteredRates = allRates.filter(
    rate => rate.country && rate.country.toLowerCase() === currentCountry.name.toLowerCase()
  )
  customLog('Filtered rates for', currentCountry.name, filteredRates)

  // --- Group the filtered results by plan.
  const groupedRates = filteredRates.reduce((acc: Record<string, any[]>, record: any) => {
    const plan = record.plan || 'Other'
    if (!acc[plan]) acc[plan] = []
    acc[plan].push(record)
    return acc
  }, {})

  // Helper to render each rates table group with animation.
  const renderTableGroup = (plan: string, rates: any[]) => (
    <Slide in timeout={600} direction='up' key={plan}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h2' component='h2' sx={{ mb: 2, color: 'primary.main', fontSize: '1.75rem' }}>
          {plan} Rates
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Flag</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Prefix</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Starting Price (USD)</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rates.map((rate, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Image
                      src={getFlagSrc(rate.countryIso, rate.country)}
                      alt={`${rate.country} flag`}
                      width={24}
                      height={18}
                    />
                  </TableCell>
                  <TableCell>{rate.prefix}</TableCell>
                  <TableCell>{rate.price_1}</TableCell>
                  <TableCell>{rate.description || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Slide>
  )

  return (
    <>
      <Head>
        <meta name='robots' content='index, follow' />
      </Head>
      <Container maxWidth='lg' sx={{ py: 4 }}>
        {/* Breadcrumb Navigation */}
        <header>
          <Box sx={{ mb: 3 }}>
            <Breadcrumbs aria-label='breadcrumb'>
              <Link href={`/${lang}`} style={{ textDecoration: 'none' }}>
                <Typography
                  component='a'
                  sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                >
                  Home
                </Typography>
              </Link>
              <Link href={`/${lang}/rates/countries`} style={{ textDecoration: 'none' }}>
                <Typography
                  component='a'
                  sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                >
                  Countries
                </Typography>
              </Link>
              <Typography color='text.primary'>Rates for {currentCountry.name}</Typography>
            </Breadcrumbs>
          </Box>
        </header>

        {/* Page Title */}
        <Fade in timeout={600}>
          <Typography variant='h1' component='h1' align='center' sx={{ mb: 4, fontWeight: 'bold', fontSize: '2rem' }}>
            Rates for {currentCountry.name}
          </Typography>
        </Fade>

        {/* Country General Information */}
        {countryInfo && (
          <Fade in timeout={600}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
              <header>
                <Typography variant='h2' component='h2' sx={{ mb: 2, fontSize: '1.5rem' }}>
                  General Information
                </Typography>
              </header>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Image
                    src={getFlagSrc(countryInfo.cca3, countryInfo.name.common)}
                    alt={`${countryInfo.name.common} flag`}
                    width={120}
                    height={90}
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Typography variant='h3' component='h3' sx={{ fontSize: '1.25rem', mb: 1 }}>
                    {countryInfo.name.common}
                  </Typography>
                  <Typography variant='body1'>Capital: {capital}</Typography>
                  <Typography variant='body1'>Region: {region}</Typography>
                  <Typography variant='body1'>Subregion: {subregion}</Typography>
                  <Typography variant='body1'>Population: {population}</Typography>
                  <Typography variant='body1'>Area: {area}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        )}

        {/* Rates Table Section */}
        <section>
          {filteredRates.length > 0 ? (
            <>{Object.keys(groupedRates).map(plan => renderTableGroup(plan, groupedRates[plan]))}</>
          ) : (
            <Fade in timeout={600}>
              <Typography variant='body1' align='center'>
                No rate information available for {currentCountry.name} at the moment.
              </Typography>
            </Fade>
          )}
        </section>

        {/* Marketing & SEO Enhancements Section */}
        <section>
          <Fade in timeout={800}>
            <Paper elevation={3} sx={{ p: 4, my: 4 }}>
              <header>
                <Typography variant='h2' component='h2' gutterBottom sx={{ fontSize: '2rem' }}>
                  Experience Bitcall – International Calling Redefined
                </Typography>
              </header>
              <Box sx={{ mb: 3 }}>
                <Typography variant='body1' sx={{ mb: 2, lineHeight: 1.6 }}>
                  Bitcall is your dedicated international calling partner, offering tailor-made solutions for both
                  personal and business communications. We combine direct carrier sourcing, advanced quality monitoring,
                  and an aggressive pricing strategy to give you the best rates available. Our focus on customer service
                  ensures that you receive 24/7 technical support, making your communication experience seamless and
                  reliable.
                </Typography>
                <Typography variant='body1' sx={{ mb: 2, lineHeight: 1.6 }}>
                  Whether you’re connecting with loved ones overseas or managing global business calls, our
                  comprehensive range of services is designed to meet your every need. From SIP trunking and DID numbers
                  to SMS services and competitive international call rates, Bitcall stands ready to empower your
                  connectivity.
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant='h3' component='h3' sx={{ fontSize: '1.5rem', mb: 2 }}>
                  Our Key Advantages
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      icon: <PhoneIcon />,
                      title: 'Direct Supplier',
                      text: `We work directly with carriers in ${currentCountry.name}, ensuring the best connection quality and lowest rates.`
                    },
                    {
                      icon: <AccessTimeIcon />,
                      title: '24/7 Quality Monitoring',
                      text: 'Our advanced monitoring systems guarantee uninterrupted and superior call quality at all times.'
                    },
                    {
                      icon: <PriceChangeIcon />,
                      title: 'Competitive Prices',
                      text: 'Our aggressive pricing policy combines quality with cost efficiency, saving you money on every call.'
                    },
                    {
                      icon: <PublicIcon />,
                      title: 'Global Coverage',
                      text: `Not only in ${currentCountry.name} – Bitcall connects you to nearly every corner of the globe.`
                    },
                    {
                      icon: <SupportAgentIcon />,
                      title: 'Expert Support',
                      text: 'Our dedicated account managers and round-the-clock technical support ensure your issues are resolved promptly.'
                    },
                    {
                      icon: <EmojiEventsIcon />,
                      title: 'Award-Winning Service',
                      text: 'Recognized for excellence in communication, Bitcall brings unmatched reliability and innovation.'
                    }
                  ].map((benefit, idx) => (
                    <Slide key={idx} in timeout={600} direction='up'>
                      <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {benefit.icon}
                            <Typography variant='subtitle1' sx={{ fontWeight: 'bold', ml: 1 }}>
                              {benefit.title}
                            </Typography>
                          </Box>
                          <Typography variant='body2' sx={{ lineHeight: 1.5 }}>
                            {benefit.text}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Slide>
                  ))}
                </Grid>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                  Choose Bitcall for unbeatable international calling rates, outstanding service, and a commitment to
                  quality. Join the thousands of customers worldwide who trust us for their connectivity needs.
                </Typography>
                <Typography variant='h3' component='h3' sx={{ fontSize: '1.5rem', mt: 3 }}>
                  Connect with Us Today!
                </Typography>
                <Typography variant='body1' sx={{ lineHeight: 1.6 }}>
                  Visit our Contact page, call us directly, or drop us an email – our team is always ready to assist
                  you.
                </Typography>
              </Box>
              {/* CTA Section */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  href='#'
                  sx={{ textTransform: 'none', fontSize: '1.125rem' }}
                >
                  Get Started
                </Button>
              </Box>
            </Paper>
          </Fade>
        </section>
      </Container>
    </>
  )
}
