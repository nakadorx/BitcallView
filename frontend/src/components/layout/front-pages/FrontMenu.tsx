'use client'

import { useEffect, useCallback, startTransition, memo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import primaryColorConfig from '@configs/primaryColorConfig'

// Utils / Hooks / Components
import { useT } from '@/i18n/client'
import { useIntersection } from '@/hooks/useIntersection'
import { getLocale } from '@/utils/commons'
import Logo from '../shared/Logo'
import { Mode } from '@/@core/types'

// Dynamically load icons so they don't bloat the main bundle
const DashboardIcon = dynamic(() => import('@mui/icons-material/Dashboard'))
const AttachMoneyIcon = dynamic(() => import('@mui/icons-material/AttachMoney'))
const SimCardIcon = dynamic(() => import('@mui/icons-material/SimCard'))
const ContactSupportIcon = dynamic(() => import('@mui/icons-material/ContactSupport'))
const ArticleIcon = dynamic(() => import('@mui/icons-material/Article'))
const HelpOutlineIcon = dynamic(() => import('@mui/icons-material/HelpOutline'))

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
  const [isBelowLg, setIsBelowLg] = useState(false)
  const { intersections } = useIntersection()

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsBelowLg(window.innerWidth < 1024) // lg breakpoint is 1024px
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
      activeColor: 'text-[#06b999]',
      hoverColor: 'hover:text-[#06b999]',
      prefetchOnHover: true
    },
    {
      key: 'reseller',
      href: `/${locale}/reseller`,
      Icon: AttachMoneyIcon,
      label: t('navigation.frontMenu2'),
      isActive: pathname === `/${locale}/reseller`,
      activeColor: 'text-[#3c82f5]',
      hoverColor: 'hover:text-[#3c82f5]',
      prefetchOnHover: true
    },
    {
      key: 'esim',
      href: `/${locale}/esim`,
      Icon: SimCardIcon,
      label: t('navigation.frontMenu3'),
      isActive: pathname === `/${locale}/esim`,
      activeColor: 'text-customColors-fifth',
      hoverColor: 'hover:text-customColors-fifth',
      prefetchOnHover: true,
      disabled: true
    },
    {
      key: 'contact',
      href: `/${locale}/#contact`,
      Icon: ContactSupportIcon,
      label: t('navigation.frontMenu4'),
      isActive: false, // you could use intersections.contact here if you like
      activeColor: 'text-textPrimary',
      hoverColor: 'hover:text-primary'
    },
    {
      key: 'blog',
      href: `/${locale}/blog`,
      Icon: ArticleIcon,
      label: t('navigation.frontMenu5'),
      isActive: pathname?.startsWith(`/${locale}/blog`),
      activeColor: 'text-primary',
      hoverColor: 'hover:text-primary'
    },
    {
      key: 'help',
      href: `/${locale}/help-center`,
      Icon: HelpOutlineIcon,
      label: t('navigation.frontMenu6'),
      isActive: pathname === `/${locale}/help-center`,
      activeColor: 'text-primary',
      hoverColor: 'hover:text-primary'
    }
  ]

  // Render all links
  const renderLinks = () =>
    items.map(({ key, href, Icon, label, isActive, activeColor, hoverColor, prefetchOnHover, disabled }) => (
      <div key={key} className='relative group'>
        <button
          type='button'
          disabled={disabled}
          className={`
            font-fellix text-[1.035rem] py-3 px-6 flex items-center
            bg-transparent border-none outline-none cursor-pointer
            transition-colors duration-200 rounded-md
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-action-hover/10 focus:bg-action-hover/20
            ${isActive ? activeColor : 'text-textPrimary'}
            ${!isActive && !disabled ? hoverColor : ''}
            !px-0
            mr-6
          `}
          onClick={e => {
            e.preventDefault()
            if (!disabled) navigate(href)
          }}
          onMouseEnter={() => {
            if (prefetchOnHover && !disabled) router.prefetch(href)
          }}
        >
          <span className='mr-[.1rem] flex items-center'>
            <Icon style={{ fontSize: '1.125rem' }} />
          </span>
          {label}
        </button>

        {/* Tooltip for disabled button */}
        {disabled && (
          <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none'>
            Coming Soon
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900'></div>
          </div>
        )}
      </div>
    ))

  // Mobile: Drawer
  if (isBelowLg) {
    return (
      <>
        {/* Backdrop */}
        {isDrawerOpen && (
          <div className='fixed inset-0 bg-black/50 z-[1200] lg:hidden' onClick={() => setIsDrawerOpen(false)} />
        )}

        {/* Drawer */}
        <div
          className={`
          fixed top-0 left-0 h-full z-[1300] transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
          w-4/5 sm:w-[300px] bg-background shadow-xl
          pt-[26px] pl-4 p-5 lg:hidden
          bg-backgroundPaper
        `}
        >
          <div className='flex flex-col'>
            <div className='mb-4 relative'>
              <Link
                href={`/${locale}/`}
                onClick={e => {
                  e.preventDefault()
                  navigate(`/${locale}`)
                }}
                className='block no-underline'
              >
                <Logo mode={mode} />
              </Link>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className='absolute top-0 right-0 p-2 rounded-full hover:bg-action-hover/10 transition-colors'
                aria-label='Close menu'
              >
                <i className='ri-close-line text-xl' />
              </button>
            </div>
            <div className='flex flex-col'>{renderLinks()}</div>
          </div>
        </div>
      </>
    )
  }

  // Desktop: Inline bar
  return <div className='flex items-center flex-wrap gap-x-1 gap-y-3'>{renderLinks()}</div>
})

export default FrontMenu
