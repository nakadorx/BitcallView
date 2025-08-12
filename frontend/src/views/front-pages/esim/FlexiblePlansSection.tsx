import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

import Image from 'next/image'
import { Text } from '@/components/common/text'

const PlanCard = ({ name, items, price }: { name: string; items: string[]; price: string }) => {
  return (
    <li key={name} className='cursor-pointer hover:scale-110 transition-all duration-300 h-[13rem]'>
      <div className=' bg-primary bg-opacity-5 p-4 rounded-4xl  w-[25rem] shadow-lg'>
        <Text value={name} className='text-white text-2xl font-bold mb-4' as='h3' />
        {items.map(item => (
          <Text key={item} value={item} className='text-lg text-white pl-3' />
        ))}
      </div>
      <div className='relative left-[21rem] top-[-3.5rem]'>
        <div className='shadow-sm bg-white border-primary border-4 rounded-full h-[5rem] w-[5rem] flex items-center justify-center'>
          <Text value={price} className='text-lg font-bold' as='span' textColor='primary' />
        </div>
      </div>
    </li>
  )
}

const FlexiblePlansSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

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
      <div className='grid grid-cols-6 mt-10'>
        <Image
          src='/images/assets/esimPageAsserts/16.png'
          className='col-span-3 rounded-3xl border-2 border-primary shadow-lg'
          alt='Flexible Plans'
          width={600}
          height={600}
        />
        <ul className='flex flex-col  items-center justify-start my-auto h-full col-span-3'>
          {plans.map(plan => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </ul>
      </div>
      <Text value={t('plans.description')} className='text-2xl lg:w-[70rem] text-center' />
    </SectionContainer>
  )
}
export default FlexiblePlansSection
