'use client'

import { useEffect, useCallback, startTransition, memo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// MUI
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// Utils / Hooks / Components
import { useT } from '@/i18n/client'
import { useIntersection } from '@/hooks/useIntersection'
import { getLocale } from '@/utils/commons'
import Logo from '../shared/Logo'
import { Mode } from '@/@core/types'

// Dynamically load icons so they don’t bloat the main bundle
const DashboardIcon = dynamic(() => import('@mui/icons-material/Dashboard'))
const AttachMoneyIcon = dynamic(() => import('@mui/icons-material/AttachMoney'))
const SimCardIcon = dynamic(() => import('@mui/icons-material/SimCard'))
const ContactSupportIcon = dynamic(() => import('@mui/icons-material/ContactSupport'))
const ArticleIcon = dynamic(() => import('@mui/icons-material/Article'))
const HelpOutlineIcon = dynamic(() => import('@mui/icons-material/HelpOutline'))

// Shared link styles
const linkSx = {
  fontFamily: 'Fellix, sans-serif',
  fontSize: '1.035rem',
  py: 1,
  px: 1.5,
  display: 'flex',
  alignItems: 'center'
}

type FrontMenuProps = {
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  mode: Mode
}

const FrontMenu = memo(function FrontMenu({ isDrawerOpen, setIsDrawerOpen, mode }: FrontMenuProps) {
  const locale = getLocale()
  const { t } = useT()
  const pathname = usePathname()
  const router = useRouter()
  const isBelowLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'), {
    defaultMatches: true
  })
  const { intersections } = useIntersection()

  // If you resize up, auto-close the mobile drawer
  useEffect(() => {
    if (!isBelowLg && isDrawerOpen) {
      setIsDrawerOpen(false)
    }
  }, [isBelowLg, isDrawerOpen, setIsDrawerOpen])

  // Wrap navigation + drawer-close in startTransition for snappy updates
  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        setIsDrawerOpen(false)
        router.push(href)
      })
    },
    [router, setIsDrawerOpen]
  )

  // Define each menu item's href, icon, label, active & hover colors
  const items = [
    {
      key: 'home',
      href: `/${locale}`,
      Icon: DashboardIcon,
      label: t('navigation.frontMenu1'),
      isActive: pathname === `/${locale}` || (pathname === `/${locale}/` && !intersections.contact),
      activeColor: 'primary.main',
      hoverColor: 'primary.main'
    },
    {
      key: 'reseller',
      href: `/${locale}/reseller`,
      Icon: AttachMoneyIcon,
      label: t('navigation.frontMenu2'),
      isActive: pathname === `/${locale}/reseller`,
      activeColor: 'customColors.fourth',
      hoverColor: 'customColors.fourth',
      prefetchOnHover: true
    },
    {
      key: 'esim',
      href: `/${locale}/esim`,
      Icon: SimCardIcon,
      label: t('navigation.frontMenu3'),
      isActive: pathname === `/${locale}/esim`,
      activeColor: 'customColors.fifth',
      hoverColor: 'customColors.fifth',
      prefetchOnHover: true
    },
    {
      key: 'contact',
      href: `/${locale}/#contact`,
      Icon: ContactSupportIcon,
      label: t('navigation.frontMenu4'),
      isActive: false, // you could use intersections.contact here if you like
      activeColor: 'text.primary',
      hoverColor: 'primary.main'
    },
    {
      key: 'blog',
      href: `/${locale}/blog`,
      Icon: ArticleIcon,
      label: t('navigation.frontMenu5'),
      isActive: pathname?.startsWith(`/${locale}/blog`),
      activeColor: 'primary.main',
      hoverColor: 'primary.main'
    },
    {
      key: 'help',
      href: `/${locale}/help-center`,
      Icon: HelpOutlineIcon,
      label: t('navigation.frontMenu6'),
      isActive: pathname === `/${locale}/help-center`,
      activeColor: 'primary.main',
      hoverColor: 'primary.main'
    }
  ]

  // Render all links
  const renderLinks = () =>
    items.map(({ key, href, Icon, label, isActive, activeColor, hoverColor, prefetchOnHover }) => (
      <Typography
        key={key}
        component='a'
        href={href}
        sx={{
          ...linkSx,
          color: isActive ? activeColor : 'text.primary',
          '&:hover': {
            color: isActive ? undefined : hoverColor
          }
        }}
        className='plb-3 pli-1.5'
        onClick={e => {
          e.preventDefault()
          navigate(href)
        }}
        onMouseEnter={() => {
          if (prefetchOnHover) router.prefetch(href)
        }}
      >
        <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          <Icon fontSize='small' />
        </Box>
        {label}
      </Typography>
    ))

  // Mobile: Drawer
  if (isBelowLg) {
    return (
      <Drawer
        variant='temporary'
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '80%', sm: 300 },
            pt: 6.5,
            pl: 4
          }
        }}
        className='p-5'
      >
        <Box className='flex flex-col'>
          <Box sx={{ mb: 4, position: 'relative' }}>
            <Link
              href={`/${locale}/`}
              onClick={e => {
                e.preventDefault()
                navigate(`/${locale}`)
              }}
              style={{ textDecoration: 'none' }}
            >
              <Logo mode={mode} />
            </Link>
            <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ position: 'absolute', top: 0, right: 0 }}>
              <i className='ri-close-line' />
            </IconButton>
          </Box>
          <Box className='flex flex-col gap-3'>{renderLinks()}</Box>
        </Box>
      </Drawer>
    )
  }

  // Desktop: Inline bar
  return <Box className='flex items-center flex-wrap gap-x-1 gap-y-3'>{renderLinks()}</Box>
})

export default FrontMenu
