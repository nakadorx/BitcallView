'use client'

import { Text } from '@/components/common/text'
import { PricingPlanType } from '@/types/pages/pricingTypes'
import { SButton } from '../button/SButton'

type Props = {
  pricingPlan: 'monthly' | 'annually'
  data?: PricingPlanType & {
    popularLabel?: string
    currencySymbol?: string
    periodText?: string
    discountText?: string
    currentPlanText?: string
    upgradeText?: string
  }
}

export const PlanDetails = ({ data, pricingPlan }: Props) => {
  return (
    <article
      className={`
        relative rounded border flex flex-col gap-10 pt-8 p-6 shadow-xl
        ${data?.popularPlan ? 'border-primary shadow-lg' : 'border-gray-300 dark:border-gray-600'}
      `}
      itemScope
      itemType='https://schema.org/Product'
    >
      {/* Popular Badge */}
      {data?.popularPlan && (
        <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
          <span className='bg-primary text-white px-4 py-1 rounded-full text-sm font-medium' role='badge'>
            {data?.popularLabel || 'Popular'}
          </span>
        </div>
      )}

      {/* Header Section */}
      <header className='text-center flex flex-col gap-4'>
        <Text as='h3' className='text-2xl font-bold' itemProp='name'>
          {data?.title}
        </Text>
        <meta itemProp='category' content='Subscription Plan' />
        <meta itemProp='brand' content='BitCall' />
      </header>

      {/* Pricing Section with Offer */}
      <div className='relative mb-1 flex justify-center'>
        <div className='flex items-start gap-8' itemProp='offers' itemScope itemType='https://schema.org/Offer'>
          <div className='flex items-center flex-none'>
            <Text as='span' className='text-2xl font-medium' itemProp='priceCurrency'>
              {data?.currencySymbol}
            </Text>
            <Text as='span' className='text-5xl font-bold text-primary' itemProp='price'>
              {pricingPlan === 'monthly' ? data?.monthlyPrice : data?.yearlyPlan.monthly}
            </Text>
          </div>
          <div className='flex flex-col flex-1'>
            <Text as='span' className='font-medium text-base'>
              {data?.periodText}
            </Text>
            {pricingPlan !== 'monthly' && data?.monthlyPrice !== 0 && (
              <Text as='span' className='text-sm mt-2' textColor='textSecondary'>
                {data?.discountText}
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* Features List */}
      <ul className='flex flex-col gap-3' role='list'>
        {data?.planBenefits.map((item: string, index: number) => (
          <li key={index} className='flex items-center gap-3' role='listitem'>
            <svg
              className='w-4 h-4 text-primary flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
              aria-hidden='true'
            >
              <circle cx='10' cy='10' r='8' stroke='currentColor' strokeWidth='2' fill='none' />
            </svg>
            <Text className='flex-1' itemProp='description'>
              {item}
            </Text>
          </li>
        ))}
      </ul>

      <SButton
        variant={data?.popularPlan ? 'contained' : 'outlined'}
        aria-label={`${data?.currentPlan ? data?.currentPlanText : data?.upgradeText} - ${data?.title}`}
        className='w-full mt-10'
      >
        {data?.currentPlan ? data?.currentPlanText : data?.upgradeText}
      </SButton>
    </article>
  )
}
