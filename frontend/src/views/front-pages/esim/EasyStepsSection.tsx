import React from 'react'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { Text } from '@/components/common/text'
import { SButton } from '@/components/common/button/SButton'
import Image from 'next/image'

const SetpsCard = ({
  title,
  description,
  index,
  children
}: {
  title: string
  description: string
  index: string
  children: React.ReactNode
}) => {
  return (
    <li
      className='hover:scale-105 transition-all duration-300 
    w-[23rem] h-[30rem] rounded-4xl p-5
    border border-primary shadow-md cursor-pointer'
    >
      <Text
        as='span'
        value={index}
        className='font-bold bg-primary text-white
        rounded-full
        w-8 h-8 flex
        items-center 
        justify-center mb-4'
      />
      <Text as='h3' value={title} className='text-xl font-bold mb-2' />
      <Text as='p' value={description} />
      {children}
    </li>
  )
}

const EasyStepsSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')
  const Data = [
    {
      title: t('howItWorks.steps.step1.title') + ':',
      description: t('howItWorks.steps.step1.description'),
      children: (
        <div className='flex flex-col gap-4 mt-[3rem]'>
          <SButton label={t('howItWorks.examples.one')} variant='contained' />
          <SButton label={t('howItWorks.examples.two')} variant='contained' />
          <SButton label={t('howItWorks.examples.three')} variant='contained' />
        </div>
      )
    },
    {
      title: t('howItWorks.steps.step2.title') + ':',
      description: t('howItWorks.steps.step2.description'),
      children: (
        <Image
          src={'/images/assets/esimPageAsserts/15-B.png'}
          alt='step2'
          width={320}
          height={200}
          className='mt-[3rem]'
        />
      )
    },
    {
      title: t('howItWorks.steps.step3.title') + ':',
      description: t('howItWorks.steps.step3.description'),
      children: (
        <Image
          src={'/images/assets/esimPageAsserts/15.png'}
          alt='step3'
          width={320}
          height={200}
          className='mt-[1rem]'
        />
      )
    }
  ]

  return (
    <SectionContainer title={[t('howItWorks.title')]}>
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10'>
        {Data.map((item, index) => (
          <SetpsCard key={item.title} title={item.title} description={item.description} index={(index + 1).toString()}>
            {item.children}
          </SetpsCard>
        ))}
      </ul>
    </SectionContainer>
  )
}

export default EasyStepsSection
