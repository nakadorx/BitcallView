'use client'

import { Text } from '../text'
import './sectionContainer.styles.css'

export type SectionContainerProps = {
  title?: string[]
  description?: string
  children: React.ReactNode
  bgClass?:
    | 'fast-setup-bg'
    | 'everything-you-need-bg'
    | 'control-label-bg'
    | 'plans-bg'
    | 'FAQ-bg'
    | 'real-time-insights-bg'
  containerClassName?: string
  ariaLabel?: string
  id?: string
}

export const SectionContainer = ({
  title,
  description,
  ariaLabel,
  children,
  bgClass,
  id,
  containerClassName
}: SectionContainerProps) => {
  return (
    <section
      id={id}
      aria-label={ariaLabel || title?.join(' ')}
      className={`float p-2 relative flex flex-col
         items-center pt-5 sm:pt-8 lg:mb-16 gap-5 bg-no-repeat bg-scroll
         transition-transform duration-100 ease-out ${bgClass || ''} ${containerClassName || ''}`}
    >
      {title && (
        <Text as='h2' className='text-3xl md:text-4xl z-[5] font-extrabold font-open-sans-extra-bold text-center'>
          {title?.map((t, index) => (
            <span key={index} className={`${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
              {t}
            </span>
          ))}
        </Text>
      )}

      {description && (
        <Text
          value={description}
          className='lg:text-lg md:text-base font-roboto leading-7  px-4 text-center lg:mb-8 max-w-2xl mx-auto whitespace-pre-line'
        />
      )}

      {children}
    </section>
  )
}
