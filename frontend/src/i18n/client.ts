'use client'

import i18next from './i18next'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const runsOnServerSide = typeof window === 'undefined'

// TODO : check whats in here
export function useT(ns?: string, options?: any) {
  const lng = useParams()?.lang as string

  if (runsOnServerSide && i18next.resolvedLanguage !== lng) {
    i18next.changeLanguage(lng)
  } else {
    const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage)
    useEffect(() => {
      if (!lng || i18next.resolvedLanguage === lng) return
      i18next.changeLanguage(lng)
    }, [lng])
    useEffect(() => {
      if (activeLng === i18next.resolvedLanguage) return
      setActiveLng(i18next.resolvedLanguage)
    }, [activeLng])
  }

  return useTranslation(ns, options)
}
