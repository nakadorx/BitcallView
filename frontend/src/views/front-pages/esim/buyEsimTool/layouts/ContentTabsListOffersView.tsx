'use client'

import { useState, useEffect } from 'react'
import { PlanListSkeleton } from '@/components/common/Skeletons'
import { PlanInformationApiResponse } from '../type'
import { SButton } from '@/components/common/button/SButton'
import { getCurrencySymbol } from '../utils'

export const ContentTabsListOffersView = ({ selectedItemPayload }: { selectedItemPayload: { data: string } }) => {
  const [planData, setPlanData] = useState<PlanInformationApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set())

  const toggleSelect = (planCode: string) => {
    setSelectedPlans(prev => {
      const next = new Set(prev)
      if (next.has(planCode)) {
        next.delete(planCode)
      } else {
        next.add(planCode)
      }
      return next
    })
  }

  const handleBuyNow = () => {
    const selectedArray = Array.from(selectedPlans)
    console.log('Selected plans:', selectedArray)
  }

  useEffect(() => {
    const fetchPlanInformation = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('https://api.demo-bc.site/esim/plan-information-countrywise', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 1,
            countryCode: selectedItemPayload?.data
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = (await response.json()) as PlanInformationApiResponse
        setPlanData(data)
        try {
          const popularPlanCodes = (data.getInformation || [])
            .filter(plan => plan.capacity === '3')
            .map(plan => plan.planCode)
          if (popularPlanCodes.length > 0) {
            setSelectedPlans(new Set(popularPlanCodes))
          }
        } catch {
          // no-op: default selection is optional
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching plan information')
        console.error('Error fetching plan information:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlanInformation()
  }, [])

  if (loading) {
    return <PlanListSkeleton />
  }

  if (error) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='text-red-500'>Error: {error}</div>
      </div>
    )
  }

  return (
    <div>
      {planData && planData.isSuccess && (
        <div>
          {(() => {
            const planCount = planData.getInformation.length
            const countryName = planData.getInformation[0]?.countryName || ''
            const countryCode = selectedItemPayload?.data || ''
            const countryCodeToEmoji = (code: string) => {
              if (!code || code.length !== 2) return '🏳️'
              const base = 127397
              const upper = code.toUpperCase()
              const first = upper.codePointAt(0)
              const second = upper.codePointAt(1)
              if (!first || !second) return '🏳️'
              return String.fromCodePoint(base + first) + String.fromCodePoint(base + second)
            }
            const flagEmoji = countryCodeToEmoji(countryCode)
            return (
              <h3 className='text-4xl  mb-10 text-center font-semibold  font-["Open_Sans_Extra_Bold"]  flex justify-center items-center gap-2'>
                <span aria-hidden>{flagEmoji}</span>
                <span>
                  {countryName} <span className='text-primary'>({planCount})</span> plans exist
                </span>
              </h3>
            )
          })()}
          <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center'>
            {planData.getInformation.map(plan => {
              const currencySymbol = getCurrencySymbol(plan.currency)
              const isPopular = plan.capacity === '3'

              return (
                <li
                  key={plan.planCode}
                  onClick={() => toggleSelect(plan.planCode)}
                  className={`relative rounded-xl bg-backgroundPaper shadow-sm hover:shadow-md transition-transform duration-150 ease-out hover:scale-105 p-4 cursor-pointer select-none
                    ${selectedPlans.has(plan.planCode) ? 'border-2 border-primary' : 'border border-gray-200'}`}
                >
                  {isPopular && (
                    <div className='absolute -top-3 -right-3 pointer-events-none'>
                      <div className='flex items-center gap-1 bg-primary text-white text-[10px] px-2 py-1 rounded-full shadow-md'>
                        <span aria-hidden>🔥</span>
                        <span className='font-semibold'>Most popular</span>
                      </div>
                    </div>
                  )}
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex flex-col'>
                      <span className='text-[10px] uppercase tracking-wide text-gray-500'>Data</span>
                      <span className='text-xl font-extrabold text-gray-900'>
                        {plan.capacity}
                        {plan.capacityUnit}
                      </span>
                    </div>

                    <div className='text-right'>
                      <span className='text-[10px] text-gray-500'>Validity</span>
                      <div className='text-xs font-medium text-gray-800'>
                        {plan.vaildity} {plan.validityType}
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-[10px] text-secondary'>from</span>
                      <span className='text-xl font-bold text-primary'>
                        {currencySymbol}
                        {plan.price.toFixed(2)}
                      </span>
                    </div>
                    {selectedPlans.has(plan.planCode) ? (
                      <div className='w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow'>
                        <svg viewBox='0 0 24 24' className='w-4 h-4 fill-current'>
                          <path d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z' />
                        </svg>
                      </div>
                    ) : (
                      <div className='w-7 h-7' />
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <div className='mt-6 flex justify-center'>
            <SButton
              label={`Buy Now (${selectedPlans.size})`}
              variant='contained'
              disabled={selectedPlans.size === 0}
              onClick={handleBuyNow}
            />
          </div>
        </div>
      )}
    </div>
  )
}
