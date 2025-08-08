import { EsimTabTypeEnum } from '../type'
import { useRef, useEffect, useState } from 'react'

interface TabData {
  label: string
  value: EsimTabTypeEnum
}

interface HeaderTabsViewProps {
  tabsData: TabData[]
  activeTab: EsimTabTypeEnum
  handleTabChange: (tab: EsimTabTypeEnum) => void
}

export const HeaderTabsView = ({ tabsData, activeTab, handleTabChange }: HeaderTabsViewProps) => {
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

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

  return (
    <div className='flex justify-center items-center'>
      <div
        className='relative'
        style={
          {
            '--underline-width': `${underlineStyle.width}px`,
            '--underline-left': `${underlineStyle.left}px`
          } as React.CSSProperties
        }
      >
        <ul className='flex gap-8'>
          {tabsData.map((tab, index) => (
            <li key={tab.value}>
              <button
                ref={el => {
                  buttonsRef.current[index] = el
                }}
                className={`bg-backgroundPaper cursor-pointer
                  hover:scale-110
                  text-xl py-2 px-1 transition-all duration-200 hover:text-primary ${
                    activeTab === tab.value ? 'text-primary font-bold' : 'text-gray-600 hover:text-primary font-normal'
                  }`}
                onClick={() => handleTabChange(tab.value)}
              >
                {tab.label}
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
