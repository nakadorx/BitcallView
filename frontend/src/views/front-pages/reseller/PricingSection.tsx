'use server'

import Pricing from '@/components/common/pricing'
import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

const PricingSection = async () => {
  const locale = getLocale()
  const t = await getT(locale, 'resellerPage')

  // TODO: make the currency a global comp
  const pricingData = [
    {
      title: t('pricingSection.basic_plan.title'),
      imgSrc: '/images/pricing/basic-plan.png',
      subtitle: t('pricingSection.basic_plan.discount'),
      currentPlan: false,
      popularPlan: false,
      monthlyPrice: parseInt(t('pricingSection.basic_plan.price').replace('$', '')),
      planBenefits: t('pricingSection.basic_plan.features', { returnObjects: true }) as string[],
      yearlyPlan: {
        monthly: Math.round(parseInt(t('pricingSection.basic_plan.price').replace('$', '')) * 0.9),
        annually: Math.round(parseInt(t('pricingSection.basic_plan.price').replace('$', '')) * 0.9 * 12)
      },
      popularLabel: t('pricingSection.common.popularLabel'),
      currencySymbol: t('pricingSection.common.currencySymbol'),
      periodText: t('pricingSection.common.periodText'),
      discountText: t('pricingSection.common.discountText'),
      currentPlanText: t('pricingSection.common.currentPlanText'),
      upgradeText: t('pricingSection.common.upgradeText')
    },
    {
      title: t('pricingSection.favourite_plan.title'),
      imgSrc: '/images/pricing/favourite-plan.png',
      subtitle: t('pricingSection.favourite_plan.discount'),
      currentPlan: false,
      popularPlan: true,
      monthlyPrice: parseInt(t('pricingSection.favourite_plan.price').replace('$', '')),
      planBenefits: t('pricingSection.favourite_plan.features', { returnObjects: true }) as string[],
      yearlyPlan: {
        monthly: Math.round(parseInt(t('pricingSection.favourite_plan.price').replace('$', '')) * 0.9),
        annually: Math.round(parseInt(t('pricingSection.favourite_plan.price').replace('$', '')) * 0.9 * 12)
      },
      popularLabel: t('pricingSection.common.popularLabel'),
      currencySymbol: t('pricingSection.common.currencySymbol'),
      periodText: t('pricingSection.common.periodText'),
      discountText: t('pricingSection.common.discountText'),
      currentPlanText: t('pricingSection.common.currentPlanText'),
      upgradeText: t('pricingSection.common.upgradeText')
    },
    {
      title: t('pricingSection.standard_plan.title'),
      imgSrc: '/images/pricing/standard-plan.png',
      subtitle: t('pricingSection.standard_plan.discount'),
      currentPlan: false,
      popularPlan: false,
      monthlyPrice: parseInt(t('pricingSection.standard_plan.price').replace('$', '')),
      planBenefits: t('pricingSection.standard_plan.features', { returnObjects: true }) as string[],
      yearlyPlan: {
        monthly: Math.round(parseInt(t('pricingSection.standard_plan.price').replace('$', '')) * 0.9),
        annually: Math.round(parseInt(t('pricingSection.standard_plan.price').replace('$', '')) * 0.9 * 12)
      },
      popularLabel: t('pricingSection.common.popularLabel'),
      currencySymbol: t('pricingSection.common.currencySymbol'),
      periodText: t('pricingSection.common.periodText'),
      discountText: t('pricingSection.common.discountText'),
      currentPlanText: t('pricingSection.common.currentPlanText'),
      upgradeText: t('pricingSection.common.upgradeText')
    }
  ]
  return (
    <SectionContainer
      title={['', t('pricingSection.title1'), t('pricingSection.title2')]}
      containerClassName='lg:mb-[2rem] bg-gradient-to-br from-blue-50 to-blue-100 dark:bg-none'
      bgClass='plans-bg'
    >
      <Pricing data={pricingData} />
    </SectionContainer>
  )
}

export default PricingSection
