import { ReactElement } from 'react'

type WaveCardProps = {
  children?: ReactElement | ReactElement[] | string | null
  ariaLabel?: string
  waveColor?: {
    Container?: string
    Svg?: string
  }
}

export const WaveCard = ({ children, ariaLabel, waveColor }: WaveCardProps) => {
  return (
    <section
      aria-label={ariaLabel}
      className={`shadow-lg  audience-section
      lg:dark:border-2 lg:dark:border-solid
      lg:dark:border-primary relative z-[5]
      overflow-hidden ${waveColor?.Container}
      lg:w-[70rem] mx-auto lg:rounded-4xl mb-[10rem]`}
    >
      <div>
        <div className='relative z-[2] text-textPrimary flex flex-col items-center py-2 px-4 '>{children}</div>

        <svg
          viewBox='0 0 500 200'
          preserveAspectRatio='none'
          className={`absolute bottom-0 left-0 w-full h-full ${waveColor?.Svg} dark:fill-primary/20 border rotate-180`}
          aria-hidden='true'
        >
          <path d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z' />
        </svg>
      </div>
    </section>
  )
}
