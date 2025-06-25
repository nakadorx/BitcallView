'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Checkout from '@views/pages/wizard-examples/checkout/index'
import { useSettings } from '@core/hooks/useSettings'

// Styles Imports
import frontCommonStyles from './styles.module.css'

import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'

// Utils
import { customLog, getLocale } from '@/utils/commons'

const CheckoutPage = props => {
  // Hooks
  const { updatePageSettings } = useSettings()
  const locale = getLocale()

  const router = useRouter()

  const cart = useSelector((state: RootState) => state.cartReducer.plans)

  // If the cart is empty, redirect to the esim page.
  useEffect(() => {
    if (!cart || cart.length === 0) {
      customLog('locale: ', locale)
      router.push(`/${locale}/esim`)
    }
  }, [cart, router])

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={classnames('md:pb-[50px] pb-6', frontCommonStyles.layoutSpacing)}>
      <Checkout />
    </section>
  )
}

export default CheckoutPage
