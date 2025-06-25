'use client'

import { useState, useEffect } from 'react'
import HelpCenterHeader from '@/views/front-pages/help-center/HelpCenterHeader'
import Articles from '@/views/front-pages/help-center/Articles'
import KnowledgeBase from '@/views/front-pages/help-center/KnowledgeBase'
import KeepLearning from '@/views/front-pages/help-center/KeepLearning'
import NeedHelp from '@/views/front-pages/help-center/NeedHelp'
import { useSettings } from '@core/hooks/useSettings'
import api from '@/utils/api'
import { customLog } from '@/utils/commons'

const HelpCenterWrapper = () => {
  const [searchValue, setSearchValue] = useState('')
  const [articles, setArticles] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const { updatePageSettings } = useSettings()

  useEffect(() => {
    updatePageSettings({ skin: 'default' })
  }, [updatePageSettings])

  // Fetch both articles and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesRes = await api.get('/help-center/articles')
        customLog('Fetched articles:', articlesRes.data)
        setArticles(articlesRes.data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      }
      try {
        const categoriesRes = await api.get('/help-center/categories')
        customLog('Fetched categories:', categoriesRes.data)
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <HelpCenterHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <Articles articles={articles} />
      <KnowledgeBase articles={articles} categories={categories} />
      <KeepLearning />
      <NeedHelp />
    </>
  )
}

export default HelpCenterWrapper
