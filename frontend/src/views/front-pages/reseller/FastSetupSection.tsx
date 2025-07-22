'use server'

import React from 'react'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { CardList } from '@/components/common/cards'
import Image from 'next/image'
import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'
import './fastSetupSection.styles.css'

export type cardItem = {
  title: string
  subtitle: string
  imgSrc: string
}

export const FastSetup = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'resellerPage')

  const data = [
    {
      title: t('fastSetupSection.features.oneClickProvisioning.title'),
      description: t('fastSetupSection.features.oneClickProvisioning.description'),
      iconContent: (
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184307/1_2_wbzmnu.png'
          alt={'One-click provisioning icon for telecom reseller setup'}
          width={70}
          height={70}
        />
      )
    },
    {
      title: t('fastSetupSection.features.noHardware.title'),
      description: t('fastSetupSection.features.noHardware.description'),
      iconContent: (
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184307/2_2_atk6sq.png'
          alt={'No hardware required icon - cloud-based VOIP solution'}
          width={70}
          height={70}
        />
      )
    },
    {
      title: t('fastSetupSection.features.acceptPayments.title'),
      description: t('fastSetupSection.features.acceptPayments.description'),
      iconContent: (
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184308/5_awevmx.png'
          alt={'Payment processing icon - Credit Card, PayPal, Crypto accepted'}
          width={70}
          height={70}
        />
      )
    },
    {
      title: t('fastSetupSection.features.scalablePlatform.title'),
      description: t('fastSetupSection.features.scalablePlatform.description'),
      iconContent: (
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184308/3_2_mre1s7.png'
          alt={'fast-setup'}
          width={70}
          height={70}
        />
      )
    },
    {
      title: t('fastSetupSection.features.monthToMonth.title'),
      description: t('fastSetupSection.features.monthToMonth.description'),
      iconContent: (
        <Image
          src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184308/4_2_qgnxap.png'
          alt={'Month-to-month plans icon - flexible telecom billing'}
          width={70}
          height={70}
        />
      )
    }
  ]

  return (
    <SectionContainer
      title={['', t('fastSetupSection.title1'), t('fastSetupSection.title2')]}
      description={t('fastSetupSection.subtitle')}
      bgClass='fast-setup-bg'
      containerClassName='lg:mb-[2rem] lg:mt-[3rem]'
    >
      <div className='w-full grid grid-cols-1 lg:grid-cols-5 items-center md:px-10 relative left-31  lg:ml-[15rem] '>
        <div className='w-full h-full flex justify-center lg:justify-end md:justify-center items-center md:col-span-2'>
          <div className='float-animation'>
            <Image
              src='https://res.cloudinary.com/dat6ipt7d/image/upload/v1753184310/21_tvjtlh.png'
              alt={'Bitcall OS fast setup dashboard - telecom reseller platform interface'}
              width={550}
              height={500}
              className='max-w-full h-auto'
              priority
            />
          </div>
        </div>
        <div className='w-full h-full flex lg:justify-start justify-center items-center md:col-span-2'>
          <CardList
            containerClassName='lg:h-[38rem] h-auto '
            data={data}
            cardContainerClassName='bg-white dark:bg-gray-800  transition-all duration-300 ease-in-out hover:shadow-lg hover:transform hover:scale-105'
            hideSelector
            listIsInclined
          />
        </div>
      </div>
    </SectionContainer>
  )
}
