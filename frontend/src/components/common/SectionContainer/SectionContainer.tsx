'use client'

import { Text } from '../text'
import './sectionContainer.styles.css'

export type SectionContainerProps = {
  title?: string[]
  description?: string
  children: React.ReactNode
  bgClass?: 'bg-bleu-2' | 'bg-bleu-1' | 'bg-bleu-3'
  containerClassName?: string
  ariaLabel?: string
}

export const SectionContainer = ({
  title,
  description,
  ariaLabel,
  children,
  bgClass,
  containerClassName
}: SectionContainerProps) => {
  return (
    <section
      aria-label={ariaLabel || title?.join(' ')}
      className={`p-2 relative flex flex-col items-center pt-5 sm:pt-8 mb-16 gap-5 bg-no-repeat bg-scroll hero-float transition-transform duration-100 ease-out ${
        bgClass || ''
      } ${containerClassName || ''}`}
    >
      {title && (
        <Text as='h2' className='text-3xl md:text-4xl font-extrabold font-open-sans-extra-bold text-center'>
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
          className='text-lg sm:text-xl leading-7 text-center mb-8 max-w-2xl mx-auto whitespace-pre-line'
        />
      )}

      {children}
    </section>
  )
}
