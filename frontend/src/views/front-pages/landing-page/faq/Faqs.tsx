import React, { useEffect, useRef } from 'react'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import classnames from 'classnames'
import { useIntersection } from '@/hooks/useIntersection'
import frontCommonStyles from '@views/front-pages/styles.module.css'
import { useTheme } from '@mui/material'
import { useImageVariant } from '@/@core/hooks/useImageVariant'
import { useT } from '@/i18n/client'

const Faqs = props => {
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
  const bgLight = '/images/front-pages/landing-page/faq-bg.png'
  const bgDark = '/images/front-pages/landing-page/faq-bg-dark.png'
  const bgImage = useImageVariant(theme.palette.mode, bgLight, bgDark)
  const skipIntersection = useRef(true)
  const ref = useRef(null)
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false
          return
        }
        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    if (ref.current) observer.observe(ref.current)
  }, [updateIntersections])

  return (
    <section
      id='faq'
      ref={ref}
      className={classnames('flex flex-col gap-8 plb-[80px] my-9 px-12')}
      style={{
        width: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginBottom: 'var(--section-margin-bottom)'
      }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12} lg={5} className='text-center'>
          <img
            src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
            alt='girl with laptop'
            className='is-[80%] max-is-[320px]'
          />
        </Grid>
        <Grid item xs={12} lg={7}>
          {FaqsData.map((data, index) => (
            <Accordion key={index} defaultExpanded={data.active}>
              <AccordionSummary aria-controls={`${data.id}-content`} id={`${data.id}-header`} className='font-medium'>
                {data.question}
              </AccordionSummary>
              <AccordionDetails>{data.answer}</AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </section>
  )
}

export default Faqs
