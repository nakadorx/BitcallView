'use client'

import React from 'react'

export const TitleSkeleton: React.FC = () => {
  return (
    <div className='mb-10 flex justify-center'>
      <div className='flex items-center gap-3 animate-pulse'>
        <div className='h-9 w-9 rounded-full bg-gray-200' />
        <div className='h-8 w-[260px] md:w-[340px] rounded-md bg-gray-200' />
      </div>
    </div>
  )
}

export const CountryCardSkeleton: React.FC = () => {
  return (
    <li className='group relative z-5 w-[16rem] overflow-hidden rounded-2xl border-2 border-primary bg-backgroundPaper p-4 shadow-md'>
      <div className='animate-pulse'>
        <div className='flex items-center gap-3'>
          <div className='h-16 w-16 rounded-full border-2 border-primary/40 ring-2 ring-primary/5 bg-gray-200' />
          <div className='h-6 w-40 rounded bg-gray-200' />
        </div>
        <div className='mt-4 flex items-end justify-between'>
          <div>
            <div className='mb-2 h-2.5 w-12 rounded bg-gray-200' />
            <div className='h-7 w-24 rounded bg-gray-200' />
          </div>
          <div className='h-4 w-20 rounded bg-gray-200' />
        </div>
      </div>
      <div className='mt-4 h-[3px] w-full rounded bg-gray-200/70' />
    </li>
  )
}

export const CountryCardSkeletonList: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <ul className='flex gap-10 flex-col'>
      <div className='flex flex-wrap gap-6 justify-center'>
        {Array.from({ length: count }).map((_, index) => (
          <CountryCardSkeleton key={index} />
        ))}
      </div>
    </ul>
  )
}

export const PlanCardSkeleton: React.FC = () => {
  return (
    <li className='relative rounded-xl border border-gray-200 bg-backgroundPaper p-4 shadow-sm animate-pulse'>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='h-2.5 w-12 rounded bg-gray-200' />
          <div className='h-6 w-16 rounded bg-gray-200' />
        </div>
        <div className='text-right'>
          <div className='h-2.5 w-16 rounded bg-gray-200' />
          <div className='mt-2 h-4 w-24 rounded bg-gray-200' />
        </div>
      </div>
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <div className='h-2.5 w-10 rounded bg-gray-200' />
          <div className='h-6 w-24 rounded bg-gray-200' />
        </div>
        <div className='h-7 w-7 rounded-full bg-gray-200' />
      </div>
      <div className='pointer-events-none absolute -top-2 -right-2 h-5 w-20 rounded-full bg-gray-200' />
    </li>
  )
}

export const PlanListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div>
      <TitleSkeleton />
      <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center'>
        {Array.from({ length: count }).map((_, index) => (
          <PlanCardSkeleton key={index} />
        ))}
      </ul>
    </div>
  )
}
