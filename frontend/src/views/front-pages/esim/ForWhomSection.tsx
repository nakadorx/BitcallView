import { SectionContainer } from '@/components/common/SectionContainer/SectionContainer'
import { getLocale } from '@/utils/commons'
import { getT } from '@/i18n/server'
import { Text } from '@/components/common/text'
import Image from 'next/image'

const ForWhomCard = ({ title, description, imgSrc }: { title: string; description: string; imgSrc: string }) => {
  return (
    <li
      className='hover:scale-105 transition-all duration-300 
    w-[50rem]
    h-[12rem]
    overflow-hidden
    rounded-[4rem] p-5
    shadow-md cursor-pointer
    flex items-center gap-4
    hover:border-primary hover:border
    dark:bg-gray-800
    '
    >
      <div className='w-[30%] flex-shrink-0'>
        <Image src={imgSrc} alt={title} width={50} height={30} className='w-full h-auto object-cover rounded-2xl' />
      </div>
      <div className='flex flex-col gap-4 w-[70%]'>
        <Text as='h3' value={title} className='hover:text-primary transition-all duration-300' />
        <Text as='p' value={description} />
      </div>
    </li>
  )
}

const ForWhomSection = async () => {
  const locale = await getLocale()
  const t = await getT(locale, 'esim')

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
    <SectionContainer title={[t('forWhom.title')]}>
      <ul className='flex flex-col gap-10 mt-10'>
        {data.map((item, index) => (
          <ForWhomCard key={index} {...item} />
        ))}
      </ul>
    </SectionContainer>
  )
}

export default ForWhomSection
