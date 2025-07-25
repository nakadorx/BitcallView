'use server'

import type { PricingPlanType } from '@/types/pages/pricingTypes'

import { PlanDetails } from './PlanDetails'

const Pricing = ({ data }: { data?: PricingPlanType[] }) => {
  // States

  return (
    <div className='flex flex-col gap-6 max-w-sm sm:max-w-none lg:mt-[5rem] mt-[2rem] mb-[2rem]'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center' role='group' aria-label='Pricing plans'>
        {data?.map((plan, index) => (
          <div key={index}>
            <PlanDetails data={plan} pricingPlan={'annually'} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pricing
