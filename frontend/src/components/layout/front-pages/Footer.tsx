'use client'
// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { Box } from '@mui/material'

// Third-party Imports
import classnames from 'classnames'
import { useT } from '@/i18n/client'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/front-pages/styles.module.css'
import { customLog, getLocale } from '@/utils/commons'
// Type Imports
import type { Mode } from '@core/types'

const Footer = ({ mode }: { mode: Mode }) => {
  const locale = getLocale()
  const { t } = useT('common')

  customLog('Footer mode: ', mode)
  var backgroundStyle = {
    backgroundColor: '#0f131e',

    borderTopLeftRadius: '64.5px',
    borderTopRightRadius: '64.5px'
  }
  return (
    <footer className={`${frontLayoutClasses.footer}   `}>
      <div className='relative mt-40' style={backgroundStyle}>
        <div className={classnames('pb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12} sx={{ pl: 0 }}>
            {/* Logo & Newsletter Column */}
            <Grid item xs={12} md={4.5} lg={4.5} sx={{ textAlign: 'left' }}>
              <div className='flex flex-col items-center md:items-left gap-6'>
                <Link href='/'>
                  <Logo customMode='dark' />
                </Link>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  {t('footer.tagline')}
                </Typography>
                <div className='flex gap-4'>
                  <TextField
                    size='small'
                    className={styles.inputBorder}
                    label='Subscribe to newsletter'
                    placeholder='Your email'
                    sx={{
                      '& .MuiInputBase-root:hover:not(.Mui-focused) fieldset': {
                        borderColor: 'rgb(var(--mui-mainColorChannels-dark) / 0.6) !important'
                      },
                      '& .MuiInputBase-root.Mui-focused fieldset': {
                        borderColor: 'var(--mui-palette-primary-main)!important'
                      },
                      '& .MuiFormLabel-root.Mui-focused': {
                        color: 'var(--mui-palette-primary-main) !important'
                      }
                    }}
                  />
                  <Button variant='contained' color='primary'>
                    {t('footer.subscribeButton')}
                  </Button>
                </div>
              </div>
            </Grid>

            {/* Explore Column */}
            <Grid item xs={6} sm={6} md={3.5} lg={3} sx={{ textAlign: 'center' }}>
              <Typography
                color='white'
                className='mbe-6 opacity-[0.92]'
                sx={{ fontSize: '1.3rem', color: 'customColors.fifth' }}
              >
                {t('footer.sections.explore')}{' '}
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography
                  component={Link}
                  href='/'
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.exploreLinks.home')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href={`/${locale}/esim`}
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.exploreLinks.esims')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href={`/${locale}/reseller`}
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.exploreLinks.reseller')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href={`/${locale}/blog`}
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.exploreLinks.blog')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href={`/${locale}/help-center`}
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.exploreLinks.helpCenter')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href={`/${locale}/landing-page#contact`}
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.exploreLinks.contact')}{' '}
                </Typography>
              </div>
            </Grid>

            {/* Get Started Column */}
            <Grid item xs={6} sm={6} md={3.5} lg={3} sx={{ textAlign: 'center' }}>
              <Typography className='mbe-6 opacity-[0.92]' sx={{ fontSize: '1.3rem', color: 'customColors.fifth' }}>
                {t('footer.sections.getStarted')}{' '}
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography
                  component={Link}
                  href='#'
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.getStartedLinks.demo')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href={`/${locale}/reseller`}
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.getStartedLinks.startReselling')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href='#'
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.getStartedLinks.pricing')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href='#'
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.getStartedLinks.activateEsim')}{' '}
                </Typography>
                <Typography
                  component={Link}
                  href='#'
                  color='white'
                  sx={{
                    transition: 'color 0.3s ease',
                    '&:hover': { color: 'primary.main' }
                  }}
                  className='opacity-[0.78]'
                >
                  {t('footer.getStartedLinks.reviews')}{' '}
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Copyright and Social Links */}
      <Box
        sx={{
          backgroundColor: '#0f131e',
          py: 1
        }}
      >
        <Box
          className={frontCommonStyles.layoutSpacing}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'space-between' },
            gap: 1
          }}
        >
          {/* Left side: Made with and Legal link */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography className='text-white opacity-[0.92]' variant='body2'>
              © {new Date().getFullYear()}, {t('footer.copyright.madeWith')}{' '}
            </Typography>
            <Link
              href='https://bitcall.com'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium text-white'
              sx={{
                transition: 'color 0.3s ease',
                '&:hover': { color: 'primary.main' }
              }}
            >
              Bitcall
            </Link>
            <Typography className='text-white opacity-[0.92]' variant='body2'>
              |
            </Typography>
            <Link
              href={`/${locale}/legal`}
              className='font-medium text-white'
              sx={{
                transition: 'color 0.3s ease',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {t('footer.legal')}{' '}
            </Link>
          </Box>

          {/* Right side: Social icons */}
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              opacity: 0.78
            }}
          >
            <IconButton
              component={Link}
              size='small'
              href='https://github.com/bitcall'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
            >
              <i className='ri-github-fill text-white text-xl' />
            </IconButton>
            <IconButton
              component={Link}
              size='small'
              href='#'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <i className='ri-facebook-fill text-white text-xl' />
            </IconButton>
            <IconButton
              component={Link}
              size='small'
              href='https://twitter.com/bitcall'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Twitter'
            >
              <i className='ri-twitter-fill text-white text-xl' />
            </IconButton>
            <IconButton
              component={Link}
              size='small'
              href='https://linkedin.com/company/bitcall'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
            >
              <i className='ri-linkedin-fill text-white text-xl' />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </footer>
  )
}

export default Footer
