// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ThemeColor } from '@/@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Updated Type – "value" is now a string for our benefit copy.
type StatData = {
  title: string
  value: string
  icon: string
  color: ThemeColor
  isHover: boolean
}

// Simplified benefit data with marketing friendly, short texts.
const statData: StatData[] = [
  {
    title: 'All-in-One Hub',
    value: 'Streamline your call center with unbeatable rates.',
    icon: 'ri-layout-line',
    color: 'primary',
    isHover: false
  },
  {
    title: 'Quick & Easy Setup',
    value: 'Get live in 1 minute—claim numbers & configure SIP effortlessly.',
    icon: 'ri-time-line',
    color: 'success',
    isHover: false
  },
  {
    title: 'Smart Analytics',
    value: 'Boost growth with real-time insights and advanced data.',
    icon: 'ri-user-smile-line',
    color: 'warning',
    isHover: false
  },
  {
    title: 'Flexible Payments',
    value: 'Pay via BTC, USDT, ETH, SOL, or BNB—zero hassle.',
    icon: 'ri-award-line',
    color: 'info',
    isHover: false
  }
]

const ProductStat = props => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  return (
    <section className='plb-[84px] bg-backgroundPaper'>
      <div className={frontCommonStyles.layoutSpacing}>
        <Typography variant='h2' className='font-extrabold text-center mb-8' color='primary.main'>
          Benefits
        </Typography>
        <Grid container spacing={6}>
          {statData.map((stat, index) => (
            <Grid item key={index} xs={12} md={3}>
              <div className='flex flex-col items-center justify-center gap-6'>
                <CustomAvatar
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  skin={hoverIndex === index ? 'filled' : 'light'}
                  color={stat.color}
                  size={82}
                  className='cursor-pointer'
                >
                  <i className={classnames(stat.icon, 'text-[2.625rem]')} />
                </CustomAvatar>
                <div className='text-center'>
                  <Typography variant='h5' className='font-bold'>
                    {stat.title}
                  </Typography>
                  <Typography variant='body2' className='mt-2'>
                    {stat.value}
                  </Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}

export default ProductStat
