'use client'

import React from 'react'
import Image from 'next/image'
import { Box, Container, Grid, Typography, useTheme, Button, Paper } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { customCtaBtnWCSx2 } from '@/app/globalStyles'
import AnimatedHeadline from '@/components/layout/shared/AnimatedHeadline'
import { useT } from '@/i18n/client'
import AnimatedIcon from '@/components/common/AnimatedIcons'

const AllInOne = () => {
  const theme = useTheme()
  const { t } = useT('common')

  return (
    <Box sx={{ pb: 6, mb: 'var(--section-margin-bottom)' }}>
      <Container>
        {/* -- Top Title & Subtitle -- */}
        <Box sx={{ textAlign: 'center', mb: { xs: 1.5, md: 3 } }}>
          <AnimatedHeadline variant='scaleIn'>{t('allInOne.headline')}</AnimatedHeadline>

          <Typography
            variant='h2'
            sx={{
              fontWeight: 300,
              fontSize: { xs: '1.25rem', md: '1.8rem' }
            }}
          >
            {t('allInOne.subheadline')}
          </Typography>
        </Box>

        {/* -- Two Columns -- */}
        <Grid container spacing={4}>
          {[0, 1].map(index => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  px: { xs: 2, md: 4 },
                  py: { xs: 2, md: 5.5 },
                  mb: 4,
                  backgroundColor: 'transparent'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 120, md: 180 },
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <AnimatedIcon
                    src={`${index === 0 ? 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753879507/connecting_nexdgs.gif' : 'https://res.cloudinary.com/dat6ipt7d/image/upload/v1753879042/Voice_Chat_Ongoing_-_Retro_Light_1_adgryw.gif'}`}
                    width={200}
                    alt='animated icon'
                    className='lg:w-[200px] lg:h-[200px] w-[8rem] h-[8rem]'
                    height={200}
                  />
                </Box>

                <Box sx={{ textAlign: 'center', px: { xs: 1, md: 0 } }}>
                  <Typography variant='h4' sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.4rem', md: '2rem' } }}>
                    {t(`allInOne.columns.${index}.title`)}
                  </Typography>

                  <Typography variant='body1' sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                    {t(`allInOne.columns.${index}.description`)}
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(auto-fill, minmax(140px, 1fr))', sm: '1fr 1fr' },
                      gap: 1.5,
                      textAlign: 'left',
                      justifyItems: 'left',
                      mb: 2
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'left' }}>
                        <CheckCircleIcon
                          sx={{
                            fontSize: { xs: '1rem', sm: '1.5rem' },
                            color: theme.palette.primary.main
                          }}
                        />
                        <Typography variant='body2' sx={{ fontSize: { xs: '0.78rem', md: '1.05rem' } }}>
                          {t(`allInOne.columns.${index}.list.${i}`)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button variant='contained' sx={{ ...customCtaBtnWCSx2, mt: 3.5 }}>
                    {t('allInOne.cta')}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default AllInOne
