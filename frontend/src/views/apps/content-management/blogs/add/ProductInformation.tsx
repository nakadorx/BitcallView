'use client'

import { useState, useEffect } from 'react'
import { Grid, Card, CardHeader, CardContent, TextField, Typography, Button, Alert, Tabs, Tab } from '@mui/material'
import Subsections from '../../articles/add/Subsections'
import ProductImage from './ProductImage'
import ImageUploader, { LightDarkImage } from './ImagesUploader'
import BlogStatus from '@views/apps/content-management/blogs/add/ProductPricing'
import ProductOrganize from '@/views/apps/content-management/blogs/add/ProductOrganize'
import { customLog } from '@/utils/commons'
import '@/libs/styles/tiptapEditor.css'
import api from '@/utils/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { languageData } from '@/components/layout/shared/LanguageDropdown'

const ProductInformation = ({ initData }: any) => {
  const [activeLang, setActiveLang] = useState('en')

  const [blogTitle, setBlogTitle] = useState<Record<string, string>>(
    Object.fromEntries(languageData.map(l => [l.langCode, initData?.title?.[l.langCode] || '']))
  )
  const [description, setDescription] = useState<Record<string, string>>(
    Object.fromEntries(languageData.map(l => [l.langCode, initData?.description?.[l.langCode] || '']))
  )

  const makeInitialSubs = () => {
    const raw = initData?.sections || []

    return raw.map(sub => ({
      id: crypto.randomUUID(),
      title: languageData.reduce(
        (acc, { langCode }) => ({ ...acc, [langCode]: sub.title?.[langCode] || '' }),
        {} as Record<string, string>
      ),
      description: languageData.reduce(
        (acc, { langCode }) => ({ ...acc, [langCode]: sub.description?.[langCode] || '' }),
        {} as Record<string, string>
      )
    }))
  }

  const [subsections, setSubsections] = useState<
    {
      id: string
      title: Record<string, string>
      description: Record<string, string>
    }[]
  >(makeInitialSubs())

  const [blogTags, setBlogTags] = useState<Record<string, string[]>>(
    Object.fromEntries(languageData.map(l => [l.langCode, initData?.tags?.[l.langCode] || []]))
  )

  const [mainImage, setMainImage] = useState<{ light: string; dark?: string }>(initData?.mainImage || { light: '' })
  const [blogImages, setBlogImages] = useState<LightDarkImage[]>(
    initData?.images?.map((img: any) => ({
      id: crypto.randomUUID(),
      light: { preview: img.light, publicUrl: img.light, storagePath: undefined },
      dark: img.dark ? { preview: img.dark, publicUrl: img.dark, storagePath: undefined } : undefined
    })) || []
  )

  const [blogStatus, setBlogStatus] = useState(initData?.status || { status: 'Published' })
  const [errorMessage, setErrorMessage] = useState('')
  const [processing, setProcessing] = useState(false)

  const validateInputs = () => {
    if (!blogTitle[activeLang].trim()) return 'Blog title is required.'
    if (!description[activeLang].trim()) return 'Blog description is required.'
    if (!mainImage.light) return 'A main light image is required.'
    if (subsections.length === 0) return 'At least one subsection is required.'
    for (const s of subsections) {
      if (!s.title[activeLang]?.trim()) return 'Each subsection must have a title.'
      if (!s.description[activeLang]?.trim()) return 'Each subsection must have a description.'
    }
    if (!blogImages.length || blogImages.some(img => !img.light?.publicUrl)) return 'At least one image is required.'
    if (!blogTags[activeLang].length) return 'At least one tag is required.'
    if (blogStatus.status === 'Scheduled') {
      const t = new Date(blogStatus.scheduledDateTime)
      if (!blogStatus.scheduledDateTime || t <= new Date()) return 'Scheduled time must be in the future.'
    }
    return ''
  }

  const handlePublish = async () => {
    const err = validateInputs()
    if (err) return setErrorMessage(err)
    setErrorMessage('')
    setProcessing(true)

    const titles = languageData.reduce(
      (acc, { langCode }) => {
        acc[langCode] = blogTitle[langCode].trim() || blogTitle.en.trim()
        return acc
      },
      {} as Record<string, string>
    )

    const descriptions = languageData.reduce(
      (acc, { langCode }) => {
        acc[langCode] = description[langCode].trim() || description.en.trim()
        return acc
      },
      {} as Record<string, string>
    )

    const sections = languageData.reduce(
      (acc, { langCode }) => {
        acc[langCode] = subsections.map(sub => ({
          title: sub.title[langCode].trim() || sub.title.en.trim(),
          description: sub.description[langCode].trim() || sub.description.en.trim()
        }))
        return acc
      },
      {} as Record<string, { title: string; description: string }[]>
    )

    const tags = languageData.reduce(
      (acc, { langCode }) => {
        acc[langCode] = blogTags[langCode].length ? blogTags[langCode] : blogTags.en
        return acc
      },
      {} as Record<string, string[]>
    )

    const payload = {
      title: titles,
      description: descriptions,
      sections,
      tags,
      mainImage,
      images: blogImages.map(img => ({ light: img.light.publicUrl, dark: img.dark?.publicUrl })),
      status: blogStatus
    }

    customLog('submitting...')
    customLog('initData: ', initData)
    try {
      if (initData?._id) {
        customLog('updating new blog.. data', payload)
        await api.put(`/blogs/${initData._id}`, payload)
        toast.success('Blog updated')
      } else {
        customLog(' creating new blog :', payload)
        await api.post('/blogs', payload)
        toast.success('Blog created')
      }
    } catch {
      toast.error('An error occurred')
      setErrorMessage('Error saving blog post.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <Tabs value={activeLang} onChange={(_, v) => setActiveLang(v)} sx={{ mb: 4 }}>
        {languageData.map(l => (
          <Tab key={l.langCode} label={l.langName} value={l.langCode} />
        ))}
      </Tabs>

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Typography variant='h4'>{initData ? 'Update Blog Post' : 'Add a new Blog Post'}</Typography>
          <Button onClick={handlePublish} disabled={processing} variant='contained'>
            {processing ? 'Processing...' : initData ? 'Update' : 'Publish'}
          </Button>
          {!!errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardHeader title='Post Information' />
            <CardContent>
              <TextField
                fullWidth
                label={`Blog Title (${activeLang})`}
                placeholder={`Enter blog title in ${languageData.find(l => l.langCode === activeLang)?.langName || activeLang}`}
                value={blogTitle[activeLang]}
                onChange={e => setBlogTitle(prev => ({ ...prev, [activeLang]: e.target.value }))}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label={`Description (${activeLang})`}
                placeholder={`Enter description in ${languageData.find(l => l.langCode === activeLang)?.langName || activeLang}`}
                multiline
                rows={4}
                value={description[activeLang]}
                onChange={e => setDescription(prev => ({ ...prev, [activeLang]: e.target.value }))}
              />
            </CardContent>
          </Card>

          <Subsections
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
            onTitleChange={(id, t) =>
              setSubsections(prev =>
                prev.map(s => (s.id === id ? { ...s, title: { ...s.title, [activeLang]: t } } : s))
              )
            }
            onContentChange={(id, d) =>
              setSubsections(prev =>
                prev.map(s => (s.id === id ? { ...s, description: { ...s.description, [activeLang]: d } } : s))
              )
            }
          />

          <ProductImage
            initialLightImage={initData?.mainImage?.light || ''}
            initialDarkImage={initData?.mainImage?.dark || ''}
            onChange={setMainImage}
          />

          <ImageUploader initialImages={blogImages} onChange={setBlogImages} />
        </Grid>

        <Grid item xs={12} md={5}>
          <BlogStatus onChange={setBlogStatus} initialStatus={initData?.status} />
          <ProductOrganize
            activeLang={activeLang}
            languageData={languageData}
            onChange={tags => setBlogTags(prev => ({ ...prev, [activeLang]: tags }))}
            initialTags={blogTags[activeLang]}
            blogTags={blogTags}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default ProductInformation
