import { HandlePrimaryColorWrapper } from '@/components/common/handlePrimaryColorWrapper'
import { PrimaryColorNames } from '@/configs/primaryColorConfig'
import LandingPageWrapper from '@/views/front-pages/landing-page'

export const revalidate = 60 // Regenerate the page every 60 seconds

const HomePage = async () => {
  return <LandingPageWrapper />
}

export default HomePage
