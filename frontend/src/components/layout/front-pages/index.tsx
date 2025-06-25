// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import Footer from '@components/layout/front-pages/Footer'
import Header from '@components/layout/front-pages/Header'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

type FrontLayoutProps = {
  children: React.ReactNode
}

const FrontLayout = async ({ children }: FrontLayoutProps) => {
  // Vars
  const mode = getServerMode()

  // const dictionary = await getDictionary(params.lang)
  return (
    <div className={frontLayoutClasses.root}>
      <Header mode={mode} />
      {children}
      <Footer mode={mode} />
    </div>
  )
}

export default FrontLayout
