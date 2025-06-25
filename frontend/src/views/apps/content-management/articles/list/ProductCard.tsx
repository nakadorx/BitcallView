'use client'

import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'
import classnames from 'classnames'
import CustomAvatar from '@core/components/mui/Avatar'
import api from '@/utils/api'
import { customLog } from '@/utils/commons'

// Define the expected statistics type from backend
interface BlogStats {
  totalBlogs: number
  totalComments: number
  totalViews: number
  totalLastMonth: number
  // add other fields if needed (e.g., totalScheduled, totalInactive)
}

// Define a DataType for card display
type DataType = {
  title: string
  value: string
  icon: string
  desc: string
  change?: number
}

const ProductCard = () => {
  // Local state for statistics, loading and error
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Media queries for responsive layout
  const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  // Fetch statistics from backend on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/blogs/statistics')
        // Assuming stats are in res.data.result; adjust if needed.
        const statData: BlogStats = res.data.result || res.data
        customLog('Statistics received:', statData)
        setStats(statData)
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching statistics:', err)
        setError('Failed to load statistics.')
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Map stats to card data; if stats is null, this will be an empty array.
  const data: DataType[] = stats
    ? [
        {
          title: 'Total Blogs',
          value: stats.totalBlogs.toLocaleString(),
          icon: 'ri-file-list-line',
          desc: 'All blog posts'
        },
        {
          title: 'Total Comments',
          value: stats.totalComments.toLocaleString(),
          icon: 'ri-chat-3-line',
          desc: 'Comments'
        },
        {
          title: 'Total Views',
          value: stats.totalViews.toLocaleString(),
          icon: 'ri-eye-line',
          desc: 'Views'
        },
        {
          title: 'Blogs Created Last Month',
          value: stats.totalLastMonth.toLocaleString(),
          icon: 'ri-calendar-line',
          desc: 'Posts last month'
        }
      ]
    : []

  return (
    <Card>
      <CardContent>
        {loading ? (
          // Show 4 Skeleton cards while loading
          <Grid container spacing={6}>
            {Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant='rectangular' height={100} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          // Display error message if error occurred
          <Typography color='error' align='center'>
            {error}
          </Typography>
        ) : (
          // Display statistics cards once data is loaded
          <Grid container spacing={6}>
            {data.map((item, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                className={classnames({
                  '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                    isBelowMdScreen && !isSmallScreen,
                  '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
                })}
              >
                <div className='flex flex-col gap-1'>
                  <div className='flex justify-between'>
                    <div className='flex flex-col gap-1'>
                      <Typography>{item.title}</Typography>
                      <Typography variant='h4'>{item.value}</Typography>
                    </div>
                    <CustomAvatar variant='rounded' size={44}>
                      <i className={classnames(item.icon, 'text-[28px]')} />
                    </CustomAvatar>
                  </div>
                  <Typography>{item.desc}</Typography>
                </div>
                {isBelowMdScreen && !isSmallScreen && index < data.length - 2 && (
                  <Divider
                    className={classnames('mbs-6', {
                      'mie-6': index % 2 === 0
                    })}
                  />
                )}
                {isSmallScreen && index < data.length - 1 && <Divider className='mbs-6' />}
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductCard
