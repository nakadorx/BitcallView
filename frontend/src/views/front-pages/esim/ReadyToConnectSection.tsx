import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { Text } from '@/components/common/text'
import { Button } from '@mui/material'
import Image from 'next/image'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'

export const ReadyToConnectSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  return (
    <SectionContainer containerClassName='lg:px-[20rem]'>
      <div
        className='flex flex-col gap-4 bg-green-500
        bg-opacity-20
      h-full w-full
      justify-center
      items-center p-5 rounded-4xl'
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            <Image
              src='/images/assets/esimPageAsserts/19-B.png'
              alt='Ready to Connect'
              width={550}
              height={500}
              className='rounded-4xl'
            />
          </div>
          <div className=''>
            <Text value={t('ctaFinal.title')} className='text-2xl font-bold' as='h2' />
            <Text value={t('ctaFinal.text')} className='text-lg' />
            <Button variant='contained' color='primary'>
              {t('ctaFinal.button')}
            </Button>
            <Text value={t('ctaFinal.active')} className='text-lg ' />
          </div>
        </div>
        <Text value={t('ctaFinal.footer')} className='text-lg text-center max-w-[50rem]' />
      </div>
    </SectionContainer>
  )
}
