'use client'

import { SButtonProps } from '@/components/common/button/SButton'
import { customCtaBtnSx, customCtaBtnWCSx } from '@/app/globalStyles'
import { Text } from '../text'
import { SButton } from '../button/SButton'
import './heroSection.styles.css'

type heroSectionProps = {
  title: string[]
  description: string
  buttons?: (SButtonProps & { label: string })[]
  children?: React.ReactNode
}

export const HeroSection = ({ title, description, buttons = [], children }: heroSectionProps) => {
  return (
    <section
      role='banner'
      className="text-center relative z-10 flex flex-col items-center pt-12 sm:pt-8 mb-16 bg-[url('/images/assets/HeroSectionBG.png')] bg-no-repeat bg-scroll hero-float transition-transform duration-100 ease-out"
    >
      {title && (
        <Text as='h1' className='mt-7 mb-9 sm:text-5xl md:text-6xl font-extrabold font-["Open_Sans_Extra_Bold"]'>
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
          className='text-lg sm:text-xl leading-7 text-center  mb-10 max-w-2xl mx-auto whitespace-pre-line'
        />
      )}

      {buttons.map((button, index) => {
        const { label, ...buttonProps } = button
        return (
          <SButton
            href='https://bitcall.io/index.html'
            key={index}
            label={label}
            {...buttonProps}
            className='text-xl font-medium mb-10'
          />
        )
      })}

      {children}
    </section>
  )
}
