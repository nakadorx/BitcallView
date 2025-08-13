'use client'

import Image from 'next/image'
import { SButton } from '@/components/common/button/SButton'
import { useT } from '@/i18n/client'
import styles from './ContentTabRegionCardsView.module.css'

export const ContentTabRegionCardsView = ({
  setSelectedItemPayload
}: {
  setSelectedItemPayload: (payload: { data: string }) => void
}) => {
  const { t } = useT('esim')
  // TODO: data should be import from API
  const data = [
    {
      name: 'North America',
      code: 'north-america',
      flag: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1754992398/NorthAmerica_njnqbn.png',
      minPrice: 4.675
    },
    {
      name: 'Asia Pacific',
      code: 'asia-pacific',
      flag: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1754992398/Asia_aga3kd.png',
      minPrice: 8.075
    },
    {
      name: 'Europe',
      code: 'europe',
      flag: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1754992399/eurpe_rknj3x.png',
      minPrice: 2.3375
    },
    {
      name: 'Latin America',
      code: 'latin-america',
      flag: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1754992398/latinAmerica_rtpemq.png',
      minPrice: 7.225
    },
    {
      name: 'Middle East',
      code: 'middle-east',
      flag: 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1754992398/middleEast_vvzbbr.png',
      minPrice: 7.65
    }
  ]

  return (
    <div className='w-full'>
      <ul className='flex flex-wrap gap-4 sm:gap-6 justify-center'>
        {data.map(region => (
          <li
            key={region.code}
            onClick={() => setSelectedItemPayload({ data: region.code })}
            className={`w-[16rem] sm:w-[18rem] h-[9.5rem] sm:h-[10.5rem] rounded-xl cursor-pointer select-none
              shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 border overflow-hidden bg-cover bg-center ${styles.regionCardBg}`}
          >
            <div className='h-full w-full p-4 relative'>
              <div className='relative z-10 h-full flex flex-col justify-between'>
                <div className='absolute top-0 right-0 inline-block bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-full px-2 sm:px-3 py-1'>
                  {region.name}
                </div>
                <div className='flex-1 flex items-center justify-center relative right-[3rem] sm:right-[4rem]'>
                  <Image src={region.flag} alt={region.name} fill className='object-contain' />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {data?.length > 6 && (
        <div className='mt-6 flex justify-center'>
          <SButton label={t('buy.viewMore')} variant='outlined' onClick={() => {}} />
        </div>
      )}
    </div>
  )
}
