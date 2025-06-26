// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// MUI Imports
import Button from '@mui/material/Button'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import ScrollToTop from '@core/components/scroll-to-top'
import Wrapper from '@/components/NestedWrapper'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { customLog } from '@/utils/commons'
import { I18nLang } from '@/i18n/conts'
import { ScrollUp } from '@/components/common/ScrollUp'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'demo-bc.site'

type RootLayoutProps = {
  children: React.ReactNode
  params: {
    lang: I18nLang
  }
}

const RootLayout = ({ children, params }: RootLayoutProps) => {
  // Vars
  const headersList = headers()
  const direction = i18n.langDirection[params.lang]
  const systemMode = getSystemMode()

  const pathname = headersList.get('x-next-url') || ''

  // TODO: check what is pathname for & customLog
  customLog('RootLayout params', params)
  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <Wrapper dir={direction}>
        <Providers direction={direction}>
          <BlankLayout systemMode={systemMode}>
            <IntersectionProvider>
              <FrontLayout>
                {children}
                <ScrollUp />
              </FrontLayout>
            </IntersectionProvider>
          </BlankLayout>
        </Providers>
      </Wrapper>
    </TranslationWrapper>
  )
}

export default RootLayout
