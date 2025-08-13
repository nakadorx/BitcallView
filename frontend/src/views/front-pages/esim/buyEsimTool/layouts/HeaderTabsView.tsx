import { EsimTabTypeEnum } from '../type'
import { useRef, useEffect, useState } from 'react'

interface TabData {
  label: string
  value: EsimTabTypeEnum
  icon?: React.ReactNode
}

interface HeaderTabsViewProps {
  tabsData: TabData[]
  activeTab: EsimTabTypeEnum
  handleTabChange: (tab: EsimTabTypeEnum) => void
}

export const HeaderTabsView = ({ tabsData, activeTab, handleTabChange }: HeaderTabsViewProps) => {
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
  const mobileListRef = useRef<HTMLUListElement | null>(null)
  const mobileScrollTimeout = useRef<number | null>(null)

  useEffect(() => {
    const updateUnderlinePosition = () => {
      const activeIndex = tabsData.findIndex(tab => tab.value === activeTab)
      const activeButton = buttonsRef.current[activeIndex]

      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton
        setUnderlineStyle({
          width: offsetWidth,
          left: offsetLeft
        })
      }
    }

    // Use requestAnimationFrame for smoother updates
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(updateUnderlinePosition)
    }, 5)

    return () => clearTimeout(timeoutId)
  }, [activeTab, tabsData])

  // Sync mobile scroller position when the active tab changes (e.g., from desktop click)
  useEffect(() => {
    const el = mobileListRef.current
    if (!el) return
    const firstItem = el.firstElementChild as HTMLElement | null
    const itemWidth = firstItem?.clientWidth || el.clientWidth
    const targetIndex = Math.max(
      0,
      tabsData.findIndex(tab => tab.value === activeTab)
    )
    const left = targetIndex * itemWidth
    el.scrollTo({ left, behavior: 'smooth' })
  }, [activeTab, tabsData])

  // When user swipes on mobile, select the item that appears
  useEffect(() => {
    const el = mobileListRef.current
    if (!el) return

    const onScroll = () => {
      if (mobileScrollTimeout.current) window.clearTimeout(mobileScrollTimeout.current)
      mobileScrollTimeout.current = window.setTimeout(() => {
        const firstItem = el.firstElementChild as HTMLElement | null
        const itemWidth = firstItem?.clientWidth || el.clientWidth
        if (!itemWidth) return
        const rawIndex = el.scrollLeft / itemWidth
        const index = Math.round(rawIndex)
        const bounded = Math.max(0, Math.min(index, tabsData.length - 1))
        const value = tabsData[bounded]?.value
        if (value && value !== activeTab) handleTabChange(value)
      }, 120)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      if (mobileScrollTimeout.current) window.clearTimeout(mobileScrollTimeout.current)
    }
  }, [activeTab, tabsData, handleTabChange])

  return (
    <div className='flex justify-center items-center overflow-x-auto px-2'>
      {/* Mobile swipeable list: one item per view with arrows */}
      <div className='relative w-full sm:hidden'>
        {activeTab !== EsimTabTypeEnum.LOCAL && (
          <button
            className='absolute left-1 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 flex items-center justify-center
             bg-backgroundPaper'
            aria-label='Scroll left'
            onClick={() => {
              const el = mobileListRef.current
              if (!el) return
              const step = (el.firstElementChild as HTMLElement | null)?.clientWidth || el.clientWidth
              el.scrollBy({ left: -step, behavior: 'smooth' })
            }}
          >
            <span className='text-3xl'>‹</span>
          </button>
        )}

        {activeTab !== EsimTabTypeEnum.GLOBAL && (
          <button
            className='absolute right-1 top-1/2 -translate-y-1/2 z-10 rounded-full w-8 h-8 flex items-center justify-center
            bg-backgroundPaper'
            aria-label='Scroll right'
            onClick={() => {
              const el = mobileListRef.current
              if (!el) return
              const step = (el.firstElementChild as HTMLElement | null)?.clientWidth || el.clientWidth
              el.scrollBy({ left: step, behavior: 'smooth' })
            }}
          >
            <span className='text-3xl'>›</span>
          </button>
        )}
        <ul
          ref={mobileListRef}
          className='flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hidden gap-2 px-10'
        >
          {tabsData.map(tab => (
            <li key={`m-${tab.value}`} className='w-full shrink-0 snap-center flex justify-center px-1'>
              <button
                className={`bg-backgroundPaper cursor-pointer w-full max-w-[18rem] whitespace-nowrap hover:scale-105 text-base py-2 px-3 rounded-xl transition-all duration-200 hover:text-primary ${
                  activeTab === tab.value
                    ? 'text-primary font-bold border border-primary'
                    : 'text-gray-600 hover:text-primary border border-transparent'
                }`}
                onClick={() => handleTabChange(tab.value)}
              >
                <span className='inline-flex items-center gap-2 justify-center w-full'>
                  {tab.icon ? <span className='inline-flex items-center'>{tab.icon}</span> : null}
                  <span>{tab.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className='relative'
        style={
          {
            '--underline-width': `${underlineStyle.width}px`,
            '--underline-left': `${underlineStyle.left}px`
          } as React.CSSProperties
        }
      >
        <ul className='hidden sm:flex gap-4 sm:gap-6 md:gap-8'>
          {tabsData.map((tab, index) => (
            <li key={tab.value}>
              <button
                ref={el => {
                  buttonsRef.current[index] = el
                }}
                className={`bg-backgroundPaper cursor-pointer
                  hover:scale-110 whitespace-nowrap
                  text-base sm:text-lg md:text-xl py-2 px-2 transition-all duration-200 hover:text-primary ${
                    activeTab === tab.value ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary font-normal'
                  }`}
                onClick={() => handleTabChange(tab.value)}
              >
                <span className='inline-flex items-center gap-2'>
                  {tab.icon ? <span className='inline-flex items-center'>{tab.icon}</span> : null}
                  <span>{tab.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {/* Sliding underline */}
        <div className='absolute bottom-0 rounded-4xl h-1 bg-primary transition-all duration-150 ease-out w-[var(--underline-width)] translate-x-[var(--underline-left)]' />
      </div>
    </div>
  )
}
