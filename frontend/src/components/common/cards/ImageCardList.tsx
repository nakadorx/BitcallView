'use client'
import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Text } from '../text'
import { RenderCardListCore } from './CardList'
import { ImageCardListProps } from './types'

export const ImageCardList = ({ data, title, withContent = false }: ImageCardListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isImageVisible, setIsImageVisible] = useState(true)
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
    setIsImageVisible(true)
    updateIndicatorPosition()
  }, [activeIndex])

  const handleClick = (index: number) => {
    setActiveIndex(index)
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
          containerClassName='order-2 lg:order-1 col-span-6'
          isForVideoCardList
        />

        <RenderImageCardListCore
          activeIndex={activeIndex}
          data={data}
          isImageVisible={isImageVisible}
          setIsImageVisible={setIsImageVisible}
        />
      </div>
    </div>
  )
}

const RenderImageCardListCore = ({
  activeIndex,
  data,
  isImageVisible,
  setIsImageVisible
}: {
  activeIndex: number
  data: any
  isImageVisible: boolean
  setIsImageVisible: (visible: boolean) => void
}) => (
  <div className='flex items-center justify-center h-full order-1 lg:order-2 col-span-6 '>
    <Image
      role='presentation'
      aria-hidden='true'
      key={activeIndex}
      aria-label='Bitcall OS feature showcase'
      title='Bitcall OS feature showcase'
      src={data[activeIndex]?.imgSrc}
      alt={data[activeIndex]?.title || 'Bitcall OS feature'}
      width={800}
      height={800}
      onLoad={() => setIsImageVisible(true)}
      className={`w-full h-full object-cover rounded-lg
        relative overflow-hidden  aspect-square
        transition-opacity duration-500 ease-in-out ${isImageVisible ? 'opacity-100' : 'opacity-0'}`}
    />
  </div>
)

export default RenderImageCardListCore
