'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Text } from '../text'
import { RenderCardListCore } from './CardList'
import { VideoCardListProps } from '.'

export const VideoCardList = ({ data, title, withContent = false }: VideoCardListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoScrollRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVideoVisible, setIsVideoVisible] = useState(true)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 })
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
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

  const scrollToVideo = (index: number) => {
    if (!userIsMobile || !videoScrollRef.current) return

    const videoContainer = videoScrollRef.current
    const videoWidth = videoContainer.children[0]?.clientWidth || 0
    const gap = 16 // 1rem gap in pixels
    const scrollPosition = index * (videoWidth + gap)

    videoContainer.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    })
  }

  const startAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % data.length
        return nextIndex
      })
    }, 2000)
  }

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }

  useEffect(() => {
    setIsVideoVisible(true)
    updateIndicatorPosition()
    scrollToVideo(activeIndex)
  }, [activeIndex, userIsMobile])

  useEffect(() => {
    if (isAutoPlaying && userIsMobile) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }

    return () => stopAutoPlay()
  }, [isAutoPlaying, userIsMobile, data.length])

  const handleClick = (index: number) => {
    setActiveIndex(index)
    scrollToVideo(index)
    // Stop auto-play for 5 seconds when user manually clicks
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const handleVideoClick = (index: number) => {
    setActiveIndex(index)
    // Stop auto-play for 5 seconds when user manually clicks on video
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  return (
    <div ref={containerRef} className='container mx-auto h-auto lg:px-[11rem] mt-2'>
      {title && <Text value={title} as='h2' className='text-2xl font-bold mb-4' />}
      <div
        className='max-w-7xl mx-auto
        bg-backgroundPaper shadow-xl
       rounded-3xl grid grid-cols-1
       lg:grid-cols-12 gap-4 lg:px-[2rem] py-5'
      >
        <RenderCardListCore
          indicatorStyle={indicatorStyle}
          data={data}
          handleClick={handleClick}
          activeIndexCard={activeIndex}
          itemRefs={itemRefs}
          hideSelector={userIsMobile}
          containerClassName='order-2 lg:order-1 col-span-5 '
          isForVideoCardList
        />

        {withContent && (
          <RenderVideoCardListCore
            activeIndex={activeIndex}
            data={data}
            isVideoVisible={isVideoVisible}
            setIsVideoVisible={setIsVideoVisible}
            userIsMobile={userIsMobile}
            handleClick={handleClick}
            handleVideoClick={handleVideoClick}
            videoScrollRef={videoScrollRef}
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
  setIsVideoVisible,
  userIsMobile = false,
  handleClick,
  handleVideoClick,
  videoScrollRef
}: {
  activeIndex: number
  data: any
  isVideoVisible: boolean
  setIsVideoVisible: (visible: boolean) => void
  userIsMobile?: boolean
  handleClick?: (index: number) => void
  handleVideoClick?: (index: number) => void
  videoScrollRef?: React.RefObject<HTMLDivElement>
}) => {
  if (userIsMobile) {
    // Mobile: Show horizontal scrollable video list
    return (
      <div className='order-1 lg:order-2 col-span-7 overflow-hidden'>
        <div ref={videoScrollRef} className='flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4'>
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className='flex-shrink-0 w-full max-w-sm snap-center'
              onClick={() => handleVideoClick?.(index)}
            >
              <video
                role='presentation'
                aria-hidden='true'
                autoPlay={index === activeIndex}
                aria-label={`Bitcall OS feature walkthrough ${index + 1}`}
                loop
                muted
                playsInline
                preload='auto'
                title={`Bitcall OS feature walkthrough ${index + 1}`}
                poster={item?.poster}
                onCanPlay={() => index === activeIndex && setIsVideoVisible(true)}
                className={`w-full h-full object-cover rounded-lg
                  relative overflow-hidden aspect-square
                  transition-opacity duration-500 ease-in-out cursor-pointer
                  ${index === activeIndex && isVideoVisible ? 'opacity-100' : 'opacity-80'}
                  ${index === activeIndex ? 'dark:ring-2 dark:ring-primary' : ''}`}
              >
                <source src={item?.video} type='video/mp4' />
              </video>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Desktop: Show single video (original behavior)
  return (
    <div className='flex items-center justify-center h-full order-1 lg:order-2 col-span-7 '>
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
        className={`w-full h-full object-cover rounded-lg
          relative overflow-hidden  aspect-square
          transition-opacity duration-500 ease-in-out ${isVideoVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <source src={data[activeIndex]?.video} type='video/mp4' />
      </video>
    </div>
  )
}

export default RenderVideoCardListCore
