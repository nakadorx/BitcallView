import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

import Image from 'next/image'
import { Text } from '@/components/common/text'

const PlanCard = ({ name, items, price }: { name: string; items: string[]; price: string }) => {
  return (
    <li key={name} className='cursor-pointer hover:scale-105 transition-all duration-300'>
      <div className='relative bg-primary bg-opacity-5 p-4 rounded-3xl sm:rounded-4xl  lg:w-[25rem] w-[20rem] shadow-lg'>
        <Text value={name} className='text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4' as='h3' />
        <ul className='space-y-1'>
          {items.map(item => (
            <li key={item}>
              <Text value={item} className='text-sm sm:text-lg text-white pl-3' />
            </li>
          ))}
        </ul>

        {/* Price badge */}
        <div className='absolute rtl:right-[22rem] right-3 top-3 sm:-right-4 sm:-top-4'>
          <div
            className='shadow-sm bg-backgroundPaper border-primary border-4 rounded-full lg:h-[5rem] lg:w-[5rem]
           h-[4rem] w-[4rem] flex items-center justify-center  '
          >
            <Text value={price} className='text-sm sm:text-base font-bold' as='span' textColor='primary' />
          </div>
        </div>
      </div>
    </li>
  )
}

const FlexiblePlansSection = async ({ lang }: { lang: string }) => {
  const t = await getT(lang, 'esim')

  const plans = [
    {
      name: t('plans.list.local.name'),
      items: [t('plans.list.local.region'), t('plans.list.local.use'), t('plans.list.local.coverage')],
      price: t('plans.list.local.price')
    },
    {
      name: t('plans.list.regional.name'),
      items: [t('plans.list.regional.region'), t('plans.list.regional.use'), t('plans.list.regional.coverage')],
      price: t('plans.list.regional.price')
    },
    {
      name: t('plans.list.global.name'),
      items: [t('plans.list.global.region'), t('plans.list.global.use'), t('plans.list.global.coverage')],
      price: t('plans.list.global.price')
    }
  ]
  return (
    <SectionContainer
      title={['', t('plans.title1'), t('plans.title2'), t('plans.title3')]}
      bgClass='esim-choose-Bitcall-esim-data-bg'
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mt-8'>
        <div className='col-span-1 sm:col-span-2 lg:col-span-3 lg:w-[35rem]'>
          <Image
            src='/images/assets/esimPageAsserts/16.png'
            className='rounded-[1.5rem] sm:rounded-[2rem] border-2 border-primary shadow-lg w-full h-auto'
            alt='Flexible Plans'
            width={700}
            height={700}
          />
        </div>
        <ul className=' col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col items-center sm:items-start gap-4 sm:gap-6'>
          {plans.map(plan => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </ul>
      </div>
      <Text
        value={t('plans.description')}
        className='text-base sm:text-xl lg:w-[70rem] text-center mt-6 sm:mt-10 px-4'
      />
    </SectionContainer>
  )
}
export default FlexiblePlansSection
