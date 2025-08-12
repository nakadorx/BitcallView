import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { Text } from '@/components/common/text'
import Image from 'next/image'
import { getT } from '@/i18n/server'
import { getLocale } from '@/utils/commons'
import { SButton } from '@/components/common/button/SButton'

export const ReadyToConnectSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

  return (
    <SectionContainer containerClassName='lg:px-[20rem]' bgClass='esim-choose-Bitcall-esim-data-bg'>
      <div
        className='flex flex-col gap-4 bg-white
        bg-opacity-40
        shadow-lg
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
          <div className='flex flex-col gap-4 p-5'>
            <Text className='text-4xl font-bold font-["Open_Sans_Extra_Bold"]' as='h2'>
              <span>{t('ctaFinal.title1')}</span>
              <span className='text-primary'>{t('ctaFinal.title2')}</span>
            </Text>
            <Text value={t('ctaFinal.text')} className='text-lg mt-2 italic' />
            <div className='mt-5'>
              <SButton variant='contained' color='primary' bold fontSize='xl'>
                {t('ctaFinal.button')}
              </SButton>
              <Text value={t('ctaFinal.active')} className='text-lg  mt-10 w-[20rem] font-bold' />
            </div>
          </div>
        </div>
        <Text value={t('ctaFinal.footer')} className='text-lg text-center max-w-[50rem] mt-5' />
      </div>
    </SectionContainer>
  )
}
