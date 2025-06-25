'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Text } from '../text'
import { RenderCardListCore } from './CardList'
import { VideoCardListProps } from '.'

export const VideoCardList = ({ data, title, withContent = false }: VideoCardListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVideoVisible, setIsVideoVisible] = useState(true)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 })
  const itemRefs = useRef<HTMLDivElement[]>([])

  // Use CSS media query instead of MUI useMediaQuery
  const [userIsMobile, setUserIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setUserIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const updateIndicatorPosition = () => {
    const currentItem = itemRefs.current?.[activeIndex]
    if (!currentItem) return

    setIndicatorStyle({
      top: currentItem.offsetTop,
      height: currentItem.offsetHeight
    })
  }

  useEffect(() => {
    setIsVideoVisible(true)
    updateIndicatorPosition()
  }, [activeIndex])

  const handleClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div ref={containerRef} className='container mx-auto h-auto lg:px-[11rem]'>
      {title && <Text value={title} as='h2' className='text-2xl font-bold mb-4' />}
      <div className='max-w-7xl mx-auto bg-backgroundPaper shadow-xl rounded-3xl grid grid-cols-1 lg:grid-cols-2 gap-4 px-[2rem] py-5'>
        <RenderCardListCore
          indicatorStyle={indicatorStyle}
          data={data}
          handleClick={handleClick}
          activeIndexCard={activeIndex}
          itemRefs={itemRefs}
          hideSelector={userIsMobile}
          containerClassName='order-2 lg:order-1'
        />

        {withContent && (
          <RenderVideoCardListCore
            activeIndex={activeIndex}
            data={data}
            isVideoVisible={isVideoVisible}
            setIsVideoVisible={setIsVideoVisible}
          />
        )}
      </div>
    </div>
  )
}

const RenderVideoCardListCore = ({
  activeIndex,
  data,
  isVideoVisible,
  setIsVideoVisible
}: {
  activeIndex: number
  data: any
  isVideoVisible: boolean
  setIsVideoVisible: (visible: boolean) => void
}) => (
  <div className='flex items-center justify-center h-full order-1 lg:order-2 '>
    <video
      role='presentation'
      aria-hidden='true'
      key={activeIndex}
      autoPlay
      aria-label='Bitcall OS feature walkthrough'
      loop
      muted
      playsInline
      preload='auto'
      title='Bitcall OS feature walkthrough'
      poster={data[activeIndex]?.poster}
      onCanPlay={() => setIsVideoVisible(true)}
      className={`w-full h-full object-cover rounded-lg relative overflow-hidden max-w-lg aspect-square transition-opacity duration-500 ease-in-out ${isVideoVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* TODO: optimize this maybe to youtube video */}
      {/* nice to have: add poster attribute to the video */}
      <source src={data[activeIndex]?.video} type='video/mp4' />
    </video>
  </div>
)

export default RenderVideoCardListCore
