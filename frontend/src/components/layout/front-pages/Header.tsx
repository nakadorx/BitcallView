'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Container from '@mui/material/Container'
import type { Theme } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import classnames from 'classnames'
import { useSelector } from 'react-redux'

import type { Mode } from '@core/types'
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import FrontMenu from './FrontMenu'
import CartSidebar from './CartSideBar'
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'
import styles from './styles.module.css'
import type { RootState } from '@/redux-store'
import { customLog, getLocale } from '@/utils/commons'
import LanguageDropdown from '../shared/LanguageDropdown'
import { useT } from '@/i18n/client'

const Header = ({ mode }: { mode: Mode }) => {
  // Locale
  const locale = getLocale()

  // Hooks - Always at the top
  const pathname = usePathname()
  const { t } = useT('common')
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const cartItemCount = useSelector((state: RootState) =>
    state.cartReducer.plans.reduce((total, plan) => total + plan.quantity, 0)
  )
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isAdminRoute =
    pathname.startsWith('/apps') ||
    pathname.startsWith(`/${locale}/apps`) ||
    pathname.startsWith(`/${locale}/dashboards`)

  // 🛑 Now we check AFTER all hooks
  if (isAdminRoute) {
    customLog('admin route')
    return null
  }

  const isBlogPage = pathname.includes('/blog')

  return (
    <>
      {/* Topbar */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          py: 2.7,
          height: 'auto'
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <>
            {/* For small screens and up: full text */}
            <Typography
              variant='body2'
              align='left'
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                textDecoration: 'underline'
              }}
            >
              <Link href={mounted ? `/${locale}#rates` : `#rates`} style={{ color: 'white' }}>
                {t('topbar.announcementParagraph')}
              </Link>
            </Typography>

            {/* For xs: show only the "Cheapest" link */}
            <Typography
              variant='body2'
              align='left'
              sx={{
                display: { xs: 'block', sm: 'none' },
                color: 'white',
                fontWeight: 300,
                fontSize: '0.81rem'
              }}
            >
              <Link
                href='#rates'
                suppressHydrationWarning
                style={{
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'white'
                }}
              >
                {t('topbar.announcementParagraphMobile')}
              </Link>
            </Typography>
          </>

          <Button
            component={Link}
            variant='outlined'
            href={mounted ? `/${locale}/login` : `/login`}
            sx={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              '&:hover': {
                color: '#FF6F59',
                borderColor: '#FF6F59'
              },
              borderRadius: 'var(--btn-border-radius)'
            }}
          >
            {t('navigation.login')}
          </Button>
        </Container>
      </Box>

      {/* Header */}
      <header
        className={classnames(frontLayoutClasses.header, styles.header, {
          [styles.stickyHeader]: !isBlogPage
        })}
      >
        <div
          className={classnames(frontLayoutClasses.navbar, styles.navbar, {
            [styles.headerScrolled]: trigger
          })}
          style={{
            boxShadow: !isBelowLgScreen ? '0px 4px 10px rgba(0, 0, 0, 0.15)' : 'none'
          }}
        >
          <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
            {isBelowLgScreen ? (
              <div className='flex items-center gap-2 sm:gap-4'>
                <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                  <i className='ri-menu-line' />
                </IconButton>
                <Link href='/'>
                  <Logo mode={mode} />
                </Link>
                <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              </div>
            ) : (
              <div className='flex items-center gap-14'>
                <Link href='/'>
                  <Logo mode={mode} />
                </Link>
                <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
              </div>
            )}
            <div className='flex items-center gap-2 sm:gap-4'>
              {mounted && (
                <IconButton onClick={() => setIsCartOpen(true)} color='inherit'>
                  <Badge badgeContent={cartItemCount} color='error'>
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              )}
              <ModeDropdown />
              <LanguageDropdown />

              {/* CartSidebar is now rendered on all screen sizes */}
              <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />

              {isBelowLgScreen ? null : (
                <div
                  onMouseEnter={handleMenuOpen}
                  onMouseLeave={handleMenuClose}
                  style={{ position: 'relative', display: 'inline-block' }}
                >
                  {/* Future language dropdown */}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
