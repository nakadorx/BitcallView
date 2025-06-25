'use client'

import { useState, useEffect } from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Button,
  Alert,
  FormControl,
  FormControlLabel,
  Switch,
  Tabs,
  Tab
} from '@mui/material'
import ArticleSubsections from '@/views/apps/content-management/articles/add/Subsections'
import ArticleStatus from '@/views/apps/content-management/articles/add/ArticleStatus'
import ArticleImage from './ArticleImage'
import CategoryPicker from './CategoryPicker'
import IconPicker from '../category/IconPicker'
import api from '@/utils/api'
import { toast } from 'react-toastify'
import { customLog } from '@/utils/commons'
import { languageData } from '@/components/layout/shared/LanguageDropdown'
import '@/libs/styles/tiptapEditor.css'
import 'react-toastify/dist/ReactToastify.css'

const ArticleInformation = ({ initData }: { initData?: any }) => {
  const [activeLang, setActiveLang] = useState('en')

  const [articleTitle, setArticleTitle] = useState<Record<string, string>>(
    Object.fromEntries(languageData.map(l => [l.langCode, initData?.title?.[l.langCode] || '']))
  )
  const [description, setDescription] = useState<Record<string, string>>(
    Object.fromEntries(languageData.map(l => [l.langCode, initData?.description?.[l.langCode] || '']))
  )

  const makeInitialSubs = () => {
    const raw = initData?.sections || []
    return raw.map((section: any) => ({
      id: section.id || crypto.randomUUID(),
      title: languageData.reduce(
        (acc, { langCode }) => ({ ...acc, [langCode]: section.title?.[langCode] || '' }),
        {} as Record<string, string>
      ),
      description: languageData.reduce(
        (acc, { langCode }) => ({ ...acc, [langCode]: section.description?.[langCode] || '' }),
        {} as Record<string, string>
      )
    }))
  }

  const [subsections, setSubsections] =
    useState<{ id: string; title: Record<string, string>; description: Record<string, string> }[]>(makeInitialSubs())

  const [mainImageUrl, setMainImageUrl] = useState(initData?.mainImage || '')
  const [icon, setIcon] = useState(initData?.icon || '')
  const [useImage, setUseImage] = useState(!!initData?.mainImage)
  const [status, setStatus] = useState(initData?.status || { status: 'Published' })
  const [selectedCategory, setSelectedCategory] = useState(initData?.category?._id || initData?.category || '')
  const [isPopular, setIsPopular] = useState(initData?.isPopular ?? false)

  const [errorMessage, setErrorMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  const validateInputs = () => {
    if (!articleTitle[activeLang].trim()) return 'Title is required.'
    if (!description[activeLang].trim()) return 'Description is required.'
    if (!useImage && !icon) return 'Icon is required if no image is used.'
    if (useImage && !mainImageUrl) return 'Image URL is required.'
    if (subsections.length === 0) return 'At least one section is required.'
    for (const s of subsections) {
      if (!s.title[activeLang]?.trim()) return 'Each section must have a title.'
      if (!s.description[activeLang]?.trim()) return 'Each section must have a description.'
    }
    if (!selectedCategory) return 'Category is required.'
    if (status.status === 'Scheduled') {
      const t = new Date(status.scheduledDateTime)
      if (!status.scheduledDateTime || t <= new Date()) return 'Scheduled time must be in the future.'
    }
    return ''
  }

  const handlePublish = async () => {
    const error = validateInputs()
    if (error) {
      setErrorMessage(error)
      return
    }

    setErrorMessage('')
    setProcessing(true)

    const payload = {
      title: languageData.reduce(
        (acc, { langCode }) => {
          acc[langCode] = articleTitle[langCode].trim() || articleTitle.en.trim()
          return acc
        },
        {} as Record<string, string>
      ),

      description: languageData.reduce(
        (acc, { langCode }) => {
          acc[langCode] = description[langCode].trim() || description.en.trim()
          return acc
        },
        {} as Record<string, string>
      ),

      sections: languageData.reduce(
        (acc, { langCode }) => {
          acc[langCode] = subsections.map(sub => ({
            title: sub.title[langCode].trim() || sub.title.en.trim(),
            description: sub.description[langCode].trim() || sub.description.en.trim()
          }))
          return acc
        },
        {} as Record<string, { title: string; description: string }[]>
      ),

      mainImage: useImage ? mainImageUrl : '',
      icon: useImage ? '' : icon,
      status,
      category: selectedCategory,
      isPopular
    }
    customLog('submiting... : payload: ', payload)

    try {
      if (initData?._id) {
        await api.put(`/help-center/articles/${initData._id}`, payload)
        toast.success('Article updated successfully.')
      } else {
        await api.post('/help-center/articles', payload)
        toast.success('Article created successfully.')
      }
    } catch (err: any) {
      console.error('Error:', err)
      toast.error('An error occurred while saving the article.')
      setErrorMessage('Error: ' + err.message)
    } finally {
      setProcessing(false)
    }
  }

  useEffect(() => {
    customLog('initData:', initData)
  }, [initData])

  return (
    <>
      <Tabs value={activeLang} onChange={(_, val) => setActiveLang(val)} sx={{ mb: 4 }}>
        {languageData.map(lang => (
          <Tab key={lang.langCode} value={lang.langCode} label={lang.langName} />
        ))}
      </Tabs>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h4'>{initData ? 'Update Article' : 'Create New Article'}</Typography>
          <Button onClick={handlePublish} disabled={processing} variant='contained'>
            {processing ? 'Processing...' : initData ? 'Update' : 'Publish'}
          </Button>
          {errorMessage && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardHeader title='Article Details' />
            <CardContent>
              <TextField
                fullWidth
                label={`Title (${activeLang})`}
                value={articleTitle[activeLang]}
                onChange={e => setArticleTitle(prev => ({ ...prev, [activeLang]: e.target.value }))}
                sx={{ mb: 4 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label={`Description (${activeLang})`}
                value={description[activeLang]}
                onChange={e => setDescription(prev => ({ ...prev, [activeLang]: e.target.value }))}
              />
            </CardContent>
          </Card>

          <ArticleSubsections
            activeLang={activeLang}
            languageData={languageData}
            subsections={subsections}
            onAdd={() =>
              setSubsections(prev => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  title: Object.fromEntries(languageData.map(l => [l.langCode, ''])),
                  description: Object.fromEntries(languageData.map(l => [l.langCode, '']))
                }
              ])
            }
            onRemove={id => setSubsections(prev => prev.filter(s => s.id !== id))}
            onTitleChange={(id, val) =>
              setSubsections(prev =>
                prev.map(s => (s.id === id ? { ...s, title: { ...s.title, [activeLang]: val } } : s))
              )
            }
            onContentChange={(id, val) =>
              setSubsections(prev =>
                prev.map(s => (s.id === id ? { ...s, description: { ...s.description, [activeLang]: val } } : s))
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <ArticleStatus onChange={setStatus} initialStatus={initData?.status} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={useImage} onChange={() => setUseImage(p => !p)} />}
                label={useImage ? 'Using Image' : 'Using Icon'}
              />
              {useImage ? (
                <ArticleImage initialImageUrl={mainImageUrl} onChange={setMainImageUrl} />
              ) : (
                <IconPicker value={icon} onChange={setIcon} />
              )}
            </Grid>
            <Grid item xs={12}>
              <CategoryPicker selectedCategory={selectedCategory} onChange={setSelectedCategory} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={isPopular} onChange={e => setIsPopular(e.target.checked)} />}
                label='Popular Article'
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ArticleInformation
