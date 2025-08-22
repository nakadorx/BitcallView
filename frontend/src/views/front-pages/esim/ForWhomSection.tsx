import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'
import { Text } from '@/components/common/text'
import Image from 'next/image'

const ForWhomCard = ({
  title,
  description,
  imgSrc,
  index
}: {
  title: string
  description: string
  imgSrc: string
  index: number
}) => {
  return (
    <li
      className={`hover:scale-105 transition-all duration-300
        w-full max-w-[50rem]
        h-auto lg:h-[12rem]
        overflow-hidden
        rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] p-4 sm:p-5
        shadow-md cursor-pointer
        flex flex-col lg:flex-row items-stretch gap-4
        hover:border-primary hover:border
        bg-gray-200/50
        dark:bg-backgroundPaper
        ${index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:relative lg:left-[4rem]'}
      `}
    >
      <div className='relative w-full lg:w-[30%] h-40 sm:h-56 lg:h-auto flex-shrink-0'>
        <Image src={imgSrc} alt={title} fill className='w-full h-full object-cover rounded-2xl' />
      </div>
      <div className='flex flex-col gap-3 sm:gap-4 w-full lg:w-[70%] px-2 sm:px-4 pb-2'>
        <Text
          textColor='primary'
          as='h3'
          value={title}
          className='text-lg sm:text-xl text-primary hover:text-primary transition-all duration-300'
        />
        <Text as='p' value={description} className='text-sm sm:text-base' />
      </div>
    </li>
  )
}

const ForWhomSection = async ({ lang }: { lang: string }) => {
  const t = await getT(lang, 'esim')

  const data = [
    {
      title: t('forWhom.users.nomads.title'),
      description: t('forWhom.users.nomads.description'),
      imgSrc: '/images/assets/esimPageAsserts/17.png'
    },
    {
      title: t('forWhom.users.remoteWorkers.title'),
      description: t('forWhom.users.remoteWorkers.description'),
      imgSrc: '/images/assets/esimPageAsserts/17-B.png'
    },
    {
      title: t('forWhom.users.teams.title'),
      description: t('forWhom.users.teams.description'),
      imgSrc: '/images/assets/esimPageAsserts/18.png'
    }
  ]
  return (
    <SectionContainer title={['', t('forWhom.title1'), t('forWhom.title2')]} bgClass='esim-for-whom-bg'>
      <ul className='flex flex-col gap-10 mt-10'>
        {data.map((item, index) => (
          <ForWhomCard key={index} {...item} index={index} />
        ))}
      </ul>
      <div aria-hidden='true' className='hidden lg:block'>
        <Image
          src={'/images/assets/Arrows/4.png'}
          alt='arrow button'
          className=' float-animation
          absolute
          lg:top-[17rem] lg:left-[24rem]
          md:top-[9rem] md:left-[12rem]
          top-[12rem] left-[0rem]'
          width={100}
          aria-hidden='true'
          height={100}
        />
        <Image
          src={'/images/assets/Arrows/2.png'}
          alt='arrow right'
          className=' float-animation absolute
          lg:top-[7rem] lg:right-[25rem]
          md:top-[10rem] md:right-[12rem]
          top-[12rem] right-[0rem]'
          width={80}
          aria-hidden='true'
          height={80}
        />
        <Image
          src={'/images/assets/Arrows/3.png'}
          alt='arrow right'
          className=' float-animation absolute
          lg:top-[37rem] lg:right-[23rem]
          md:top-[37rem] md:right-[10rem]
          top-[30rem] right-[0rem]'
          width={100}
          aria-hidden='true'
          height={100}
        />
        <Image
          src={'/images/assets/Arrows/5.png'}
          alt='arrow button'
          className=' float-animation
          absolute
          lg:top-[37rem] lg:left-[24rem]
          md:top-[9rem] md:left-[12rem]
          top-[12rem] left-[0rem]'
          width={100}
          aria-hidden='true'
          height={100}
        />
      </div>
    </SectionContainer>
  )
}

export default ForWhomSection
