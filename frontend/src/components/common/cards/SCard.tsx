'use client'
import React, { useState } from 'react'
import { Text } from '../text'
import { SCardProps } from './types'
import './sCard.styles.css'

export const SCard = ({
  index,
  handleClick,
  activeIndex,
  children,
  itemRefs,
  title,
  description,
  iconContent,
  activeOnHover = false,
  cardContainerClassName,
  enableFloatingAnimation = false
}: SCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const cardIsActive = (activeOnHover && isHovered) || (activeIndex === index && !activeOnHover)

  return (
    <div
      key={index}
      ref={(el: HTMLDivElement | null) => {
        if (el && itemRefs.current) itemRefs.current[index || 0] = el as HTMLDivElement
      }}
      onClick={() => handleClick?.(index || 0)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        cursor-pointer px-4 py-4 min-w-fit w-auto rounded-4xl
        transition-all duration-300 ease-in-out
        hover:bg-gray-50 dark:hover:bg-backgroundPaper 
        shadow-xs
        hover:-translate-y-1 hover:shadow-md
        ${enableFloatingAnimation ? 'hover:card-float hover:shadow-2xl hover:-translate-y-2 hover:scale-105' : ''}
        ${cardIsActive ? 'bg-primary/10 dark:bg-gray-800' : 'bg-transparent'}
        ${enableFloatingAnimation && isHovered ? 'card-glow' : ''}
        ${cardContainerClassName || ''}
        hover:border-primary hover:border-2 hover:border-solid
        
      `}
    >
      {!children && (
        <div className='grid grid-cols-12 gap-2'>
          {iconContent && (
            <div className='col-span-2'>
              <div className='flex justify-center items-center w-full h-full'>{iconContent}</div>
            </div>
          )}
          <div className={`${iconContent ? 'col-span-10' : 'col-span-12'} pl-2 pr-4`}>
            <div>
              {title && (
                <Text
                  value={title}
                  as='h3'
                  // TODO: refactor Card Title to handle prrmary color on hover
                  className={`text-[1.39rem] md:text-[1.2rem] font-coolvetica transition-all duration-300 ${
                    cardIsActive || isHovered ? 'text-primary' : 'text-gray-900 dark:text-gray-100'
                  }`}
                  textColor={cardIsActive || isHovered ? 'primary' : 'textPrimary'}
                />
              )}
              {description && (
                <Text
                  value={description}
                  as='p'
                  className='text-[0.98rem] md:text-[1.15rem] font-roboto leading-relaxed text-gray-700 dark:text-gray-300'
                />
              )}
            </div>
          </div>
        </div>
      )}

      {children && children}
    </div>
  )
}
