'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import { Box, useTheme } from '@mui/material'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import { useT } from '@/i18n/client'

const Faqs = () => {
  const theme = useTheme()
  const { t } = useT('common')
  const FaqsData = [
    {
      id: 'panel1',
      question: t('faq.questions.q1'),
      answer: t('faq.answers.a1')
    },
    {
      id: 'panel2',
      question: t('faq.questions.q2'),
      answer: t('faq.answers.a2'),
      active: true
    },
    {
      id: 'panel3',
      question: t('faq.questions.q3'),
      answer: t('faq.answers.a3')
    },
    {
      id: 'panel4',
      question: t('faq.questions.q4'),
      answer: t('faq.answers.a4')
    },
    {
      id: 'panel5',
      question: t('faq.questions.q5'),
      answer: t('faq.answers.a5')
    }
  ]
  const bgLight = '/images/BGs/resseller/FAQ.png'
  const bgDark = '/images/BGs/resseller/FAQ-BG.png'
  const bgImage = useImageVariant(theme.palette.mode, bgLight, bgDark)
  const ref = useRef(null)

  return (
    <Box
      className='lg:relative lg:top-[-2rem]'
      component='section'
      id='faq'
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        paddingBlock: '80px',
        marginBottom: 9,
        paddingX: 12,
        width: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} lg={5} sx={{ textAlign: 'center' }}>
          <Image
            src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
            alt='girl with laptop'
            width={320}
            height={240}
            style={{
              width: '80%',
              maxWidth: '320px',
              height: 'auto'
            }}
          />
        </Grid>
        <Grid item xs={12} lg={7}>
          {FaqsData.map((data, index) => (
            <Accordion key={index} defaultExpanded={data.active}>
              <AccordionSummary
                aria-controls={`${data.id}-content`}
                id={`${data.id}-header`}
                sx={{ fontWeight: 'medium' }}
              >
                {data.question}
              </AccordionSummary>
              <AccordionDetails>{data.answer}</AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Faqs
