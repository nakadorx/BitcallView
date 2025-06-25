'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

// Component Imports
import HelpCenterHeader from '@/views/front-pages/help-center/HelpCenterHeader'
import KnowledgeBase from '@/views/front-pages/help-center/KnowledgeBase'
import KeepLearning from '@/views/front-pages/help-center/KeepLearning'
import NeedHelp from '@/views/front-pages/help-center/NeedHelp'
import Articles from '@/views/front-pages/help-center/Articles'

// Hooks & Utils
import { useSettings } from '@core/hooks/useSettings'
import api from '@/utils/api'
import { customLog } from '@/utils/commons'

const KnowledgeBaseWrapper = () => {
  const { updatePageSettings } = useSettings()
  const params = useParams()
  const locale = typeof params?.lang === 'string' ? params.lang : 'en'

  const [searchValue, setSearchValue] = useState('')
  const [articles, setArticles] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    return updatePageSettings({ skin: 'default' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          api.get('/help-center/articles'),
          api.get('/help-center/categories')
        ])
        customLog('Fetched articles in help-center wrapper:', articlesRes.data)
        setArticles(articlesRes.data)
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error('Error fetching help center data:', error)
      }
    }
    fetchData()
  }, [])

  // 🌍 Locale-aware filtering for "Keep Learning"
  const keepLearningArticles = articles.filter(article => {
    const titleObj = article?.category?.title
    const localizedTitle = typeof titleObj === 'object' ? titleObj?.[locale] || titleObj?.en : titleObj
    return localizedTitle?.toLowerCase() === 'keep learning'
  })

  const generalArticles = articles.filter(article => {
    const titleObj = article?.category?.title
    const localizedTitle = typeof titleObj === 'object' ? titleObj?.[locale] || titleObj?.en : titleObj
    return localizedTitle?.toLowerCase() !== 'keep learning'
  })

  customLog('generalArticles (in parent kb wrapper):', generalArticles)

  return (
    <>
      <HelpCenterHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <Articles articles={articles} />
      <KnowledgeBase articles={generalArticles} categories={categories} />
      <KeepLearning articles={keepLearningArticles} />
      <NeedHelp />
    </>
  )
}

export default KnowledgeBaseWrapper
