'use client'

// React Imports
import { useState, useEffect } from 'react'

// Component Imports
import HelpCenterHeader from './HelpCenterHeader'
import Articles from './Articles'
import KnowledgeBase from './KnowledgeBase'
import KeepLearning from './KeepLearning'
import NeedHelp from './NeedHelp'
import { useSettings } from '@core/hooks/useSettings'

//  Destructure

const BlogWrapper1 = ({ blogs }: { blogs: any }) => {
  // States
  const [searchValue, setSearchValue] = useState('')

  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HelpCenterHeader searchValue={searchValue} setSearchValue={setSearchValue} blogs={blogs} />
      <Articles blogs={blogs} searchValue={searchValue} />
      <KeepLearning />
      <NeedHelp />
    </>
  )
}

export default BlogWrapper1
