'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Text } from '../text'
import { SCard } from './SCard'
import { CardListProps, RenderCardListProps, CardListData } from '.'
import { Box } from '@mui/material'

export const CardList = ({
  data,
  title,
  subtitle,
  activeIndexCard,
  setActiveIndexCard,
  hideSelector = false,
  listIsInclined = false,
  cardContainerClassName,
  containerClassName,
  headerExtraContent,
  isForVideoCardList
}: CardListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 })
  const itemRefs = useRef<HTMLDivElement[]>([])

  // Use CSS media query instead of MUI useMediaQuery
  const [userIsMobile, setUserIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setUserIsMobile(window.innerWidth < 600) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentListIsInclined = !userIsMobile && listIsInclined

  const updateIndicatorPosition = () => {
    if (activeIndexCard === undefined) return
    const currentItem = itemRefs.current?.[activeIndexCard]
    if (!currentItem) return

    setIndicatorStyle({
      top: currentItem.offsetTop,
      height: currentItem.offsetHeight
    })
  }

  useEffect(() => {
    updateIndicatorPosition()
  }, [activeIndexCard])

  const handleClick = (index: number) => {
    if (!setActiveIndexCard) return
    setActiveIndexCard(index)
  }

  return (
    <div ref={containerRef} className='relative h-auto p-5 lg:p-0'>
      {title && (
        <Text
          value={title}
          as='h2'
          className='text-3xl font-bold mb-4 text-center md:text-left  md:mx-auto sm:mx-auto lg:mx-0 sm:text-center rtl:text-right '
        />
      )}
      {subtitle && (
        <Text
          value={subtitle}
          as='p'
          className='text-base font-normal mb-4 lg:text-start md:text-center md:mx-auto sm:mx-auto lg:mx-0 sm:text-center  lg:w-full sm:max-w-md text-gray-600 dark:text-gray-400'
        />
      )}
      {headerExtraContent && headerExtraContent}
      <RenderCardListCore
        indicatorStyle={indicatorStyle}
        data={data}
        handleClick={handleClick}
        activeIndexCard={activeIndexCard}
        itemRefs={itemRefs}
        hideSelector={hideSelector}
        listIsInclined={currentListIsInclined}
        cardContainerClassName={cardContainerClassName}
        containerClassName={containerClassName}
        isForVideoCardList={isForVideoCardList}
      />
    </div>
  )
}

export const RenderCardListCore = ({
  indicatorStyle,
  data,
  handleClick,
  activeIndexCard,
  itemRefs,
  hideSelector,
  cardContainerClassName,
  containerClassName,
  listIsInclined,
  isForVideoCardList = false
}: RenderCardListProps) => {
  return (
    <div className={`relative ${containerClassName || ''} my-auto`}>
      {!hideSelector && (
        <Box
          // this should be done as SX or inline styles Don't Change
          component='div'
          sx={{
            position: 'absolute',
            left: -16,
            width: 8,
            backgroundColor: 'primary.main',
            borderRadius: 3,
            transition: 'all 0.3s ease-out',
            top: indicatorStyle.top,
            height: indicatorStyle.height
          }}
        />
      )}
      <ul
        className={`flex flex-col gap-3 ${
          isForVideoCardList
            ? 'rtl:lg:left-[0rem] lg:left-[0] left-[1rem] items-center  justify-center relative  rtl:left-[-1rem]'
            : ''
        }`}
        role='list'
      >
        {data.map((item: CardListData, index: number) => {
          return (
            <Box
              component='li'
              role='listitem'
              key={index}
              // this should be done as SX or inline styles Dont Change
              sx={{
                marginLeft: listIsInclined ? { lg: index * 10, xs: 0 } : 0,
                width: listIsInclined ? { md: '33rem', xs: 'auto' } : 'auto'
              }}
            >
              <SCard
                isForVideoCardList={isForVideoCardList}
                index={index}
                handleClick={handleClick}
                activeIndex={activeIndexCard}
                itemRefs={itemRefs}
                title={item.title}
                description={item.description}
                iconContent={item.iconContent}
                activeOnHover={hideSelector}
                cardContainerClassName={cardContainerClassName}
                children={item.CardCustomContent}
              />
            </Box>
          )
        })}
      </ul>
    </div>
  )
}
