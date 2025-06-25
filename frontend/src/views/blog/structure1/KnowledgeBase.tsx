// Next Imports
import { useEffect, useState } from 'react'

import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import DirectionalIcon from '@components/DirectionalIcon'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Utils Imports
import { getLocale } from '@/utils/commons'
// ✅ Dummy Data (Restored)
const allArticles = [
  {
    title: 'Buying',
    icon: 'ri-shopping-cart-line',
    image: '/images/cards/8.jpg',
    articles: [
      { title: 'What are Favourites?' },
      { title: 'How do I purchase an item?' },
      { title: 'How do I add or change my details?' },
      { title: 'How do refunds work?' },
      { title: 'Can I Get A Refund?' },
      { title: "I'm trying to find a specific item" }
    ]
  },
  {
    title: 'Item Support',
    icon: 'ri-question-line',
    image: '/images/cards/8.jpg',
    articles: [
      { title: 'What is Item Support?' },
      { title: 'How to contact an author?' },
      { title: 'Where Is My Purchase Code?' },
      { title: 'Extend or renew Item Support' },
      { title: 'Item Support FAQ' },
      { title: 'Why has my item been removed?' }
    ]
  },
  {
    title: 'Licenses',
    icon: 'ri-file-text-line',
    image: '/images/cards/8.jpg',
    articles: [
      { title: 'Can I use the same license for the...' },
      { title: 'How to contact an author?' },
      { title: "I'm making a test site - it's not for ..." },
      { title: 'Which license do I need?' },
      { title: 'I want to make multiple end prod ...' },
      { title: 'For logo what license do I need?' }
    ]
  }
]

const KnowledgeBase = () => {
  const locale = getLocale()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 300) // Simulated loading effect
  }, [])

  return (
    <section className={classnames('flex flex-col gap-6 md:plb-[100px] plb-[50px]', frontCommonStyles.layoutSpacing)}>
      <Grid container spacing={6}>
        {loading
          ? // ✅ Show Skeleton Loader
            Array.from(new Array(3)).map((_, index) => (
              <Grid item xs={12} lg={4} key={index}>
                <Card>
                  <Skeleton variant='rectangular' height={180} width='100%' />
                  <CardContent className='flex flex-col items-start gap-6 text-center'>
                    <Skeleton variant='text' width='50%' height={30} />
                    <Skeleton variant='text' width='80%' height={20} />
                    <Skeleton variant='rectangular' width='60%' height={40} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : // ✅ Show actual dummy data when loading is complete
            allArticles.map((article, index) => (
              <Grid item xs={12} lg={4} key={index}>
                <Card>
                  <CardMedia
                    component='img'
                    height='180'
                    image={article.image}
                    alt={article.title}
                    sx={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                  />
                  <CardContent className='flex flex-col items-start gap-6 text-center'>
                    <div className='flex gap-3 items-center'>
                      <CustomAvatar skin='light' variant='rounded' color='primary' size={32}>
                        <i className={classnames('text-xl', article.icon)} />
                      </CustomAvatar>
                      <Typography variant='h5'>{article.title}</Typography>
                    </div>
                    <div className='flex flex-col gap-2 is-full'>
                      {article.articles.map((data, index) => (
                        <div key={index} className='flex justify-between items-center gap-2'>
                          <Typography
                            component={Link}
                            href={`/${locale}/help-center/article/how-to-add-product-in-cart`}
                            color='text.primary'
                          >
                            {data.title}
                          </Typography>
                          <DirectionalIcon
                            className='text-textDisabled text-xl'
                            ltrIconClass='ri-arrow-right-s-line'
                            rtlIconClass='ri-arrow-left-s-line'
                          />
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/${locale}/blog/polygon-price-prediction-can-pol-reach-1-000-1`}
                      className='flex items-center gap-x-2 text-primary'
                    >
                      <span className='font-medium'>See all 6 articles</span>
                      <DirectionalIcon
                        className='text-lg'
                        ltrIconClass='ri-arrow-right-line'
                        rtlIconClass='ri-arrow-left-line'
                      />
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </section>
  )
}

export default KnowledgeBase
