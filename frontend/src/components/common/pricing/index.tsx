'use server'
// TODO: check for server side rendering need

import type { PricingPlanType } from '@/types/pages/pricingTypes'

import { PlanDetails } from './PlanDetails'

const Pricing = ({ data }: { data?: PricingPlanType[] }) => {
  // States

  return (
    <div className='flex flex-col gap-6 max-w-sm sm:max-w-none'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6' role='group' aria-label='Pricing plans'>
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
