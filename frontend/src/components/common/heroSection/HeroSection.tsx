'use server'

import { SButtonProps } from '@/components/common/button/SButton'
import { Text } from '../text'
import { SButton } from '../button/SButton'
import './heroSection.styles.css'

type heroSectionProps = {
  title: string[]
  description: string
  buttons?: (SButtonProps & { label: string })[]
  children?: React.ReactNode
  bgSection?: 'bg-sectionEsim-1' | 'bg-section-1'
}

export const HeroSection = ({
  title,
  description,
  buttons = [],
  children,
  bgSection = 'bg-section-1'
}: heroSectionProps) => {
  return (
    <section
      role='banner'
      className={`text-center relative z-10 flex flex-col items-center pt-12 sm:pt-8 mb-16
       bg-no-repeat bg-scroll hero-float transition-transform duration-100 ease-out
       ${bgSection}
       `}
    >
      {title && (
        <Text
          as='h1'
          className='lg:mt-0 mb-9 px-4 text-[2rem] md:text-6xl lg:text-6xl  font-extrabold font-["Open_Sans_Extra_Bold"]
          lg:max-w-[75rem]'
        >
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
          className='text-lg px-4 sm:text-xl leading-7 text-center  mb-10 lg:max-w-[60rem] mx-auto whitespace-pre-line'
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
