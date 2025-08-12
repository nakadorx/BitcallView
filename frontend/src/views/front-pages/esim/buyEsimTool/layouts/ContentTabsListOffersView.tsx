'use client'

import { useState, useEffect } from 'react'
import { PlanListSkeleton } from '@/components/common/Skeletons'
import { EsimTabTypeEnum, PlanInformationApiResponse } from '../type'
import { useT } from '@/i18n/client'
import { SButton } from '@/components/common/button/SButton'
import { getCurrencySymbol, fetchPlanInformation } from '../utils'

export const ContentTabsListOffersView = ({
  selectedItemPayload,
  activeTab
}: {
  selectedItemPayload: { data: string | string[] }
  activeTab: EsimTabTypeEnum
}) => {
  const { t } = useT('esim')
  const [planData, setPlanData] = useState<PlanInformationApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set())
  const [visibleCount, setVisibleCount] = useState<number>(12)

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

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12)
  }
  const loadPlanInformation = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchPlanInformation({ data: selectedItemPayload?.data || '', activeTab })

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

  useEffect(() => {
    loadPlanInformation()
  }, [selectedItemPayload?.data, activeTab])

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
            const firstCountryName = planData.getInformation[0]?.countryName || ''
            const dataValue = selectedItemPayload?.data
            const regionName = Array.isArray(dataValue)
              ? dataValue[0]
              : typeof dataValue === 'string'
                ? dataValue.replace(/^REGION:/, '')
                : ''

            const countryCode = Array.isArray(dataValue) ? '' : dataValue || ''
            const toFlagEmoji = (code: string) => {
              if (!code || code.length !== 2) return '🏳️'
              const base = 127397
              const upper = code.toUpperCase()
              const first = upper.codePointAt(0)
              const second = upper.codePointAt(1)
              if (!first || !second) return '🏳️'
              return String.fromCodePoint(base + first) + String.fromCodePoint(base + second)
            }

            const isRegional = activeTab === EsimTabTypeEnum.REGIONAL
            const isGlobal = activeTab === EsimTabTypeEnum.GLOBAL
            const icon = isRegional || isGlobal ? '🌐' : toFlagEmoji(countryCode)
            const titleName = isGlobal ? t('buy.global') : isRegional ? regionName : firstCountryName

            return (
              <h3 className='text-4xl  mb-10 text-center font-semibold  font-["Open_Sans_Extra_Bold"]  flex justify-center items-center gap-2'>
                <span aria-hidden>{icon}</span>
                <span>
                  {titleName} <span className='text-primary'>({planCount})</span> {t('buy.plansExist')}
                </span>
              </h3>
            )
          })()}
          <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center'>
            {planData.getInformation.slice(0, visibleCount).map(plan => {
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
                      <span className='text-[10px] uppercase tracking-wide text-gray-500'>{t('buy.data')}</span>
                      <span className='text-xl font-extrabold text-gray-900'>
                        {plan.capacity}
                        {plan.capacityUnit}
                      </span>
                    </div>

                    <div className='text-right'>
                      <span className='text-[10px] text-gray-500'>{t('buy.validity')}</span>
                      <div className='text-xs font-medium text-gray-800'>
                        {plan.vaildity} {plan.validityType}
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-[10px] text-secondary'>{t('buy.from')}</span>
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

          <div className='mt-6 flex justify-center gap-4'>
            {planData.getInformation.length > visibleCount && (
              <SButton label={t('buy.loadMore')} variant='outlined' onClick={handleLoadMore} />
            )}
            <SButton
              label={t('buy.buyNow', { count: selectedPlans.size })}
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
