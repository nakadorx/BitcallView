'use client'

export {} // treat this file as an ES module

import React, { useEffect, useRef, useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Stack,
  Divider,
  Typography,
  Box,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Close'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Node, mergeAttributes } from '@tiptap/core'
import CustomIconButton from '@core/components/mui/IconButton'
import classnames from 'classnames'
import { supabase } from '@/utils/supabaseClient'
import { customLog } from '@/utils/commons'
import { useTheme } from '@mui/material'
import { languageData } from '@/components/layout/shared/LanguageDropdown'

// ——— Types ————————————————————————————————————————

export type SubsectionType = {
  id: string
  title: Record<string, string>
  description: Record<string, string>
}

interface SubsectionsProps {
  activeLang: string
  languageData: { langCode: string; langName: string }[]
  subsections: any[]
  onAdd: () => void
  onRemove: (id: string) => void
  onTitleChange: (id: string, title: string, lang: string) => void
  onContentChange: (id: string, content: string, lang: string) => void
}

// ——— Dark/Light Image Extension + Sync Hook —————————

const useDarkLightSyncEffect = (selector = '.ProseMirror') => {
  const theme = useTheme()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const update = () => {
      const container = document.querySelector(selector)
      if (!container) return
      container.querySelectorAll('img.dark-light-img').forEach(img => {
        const light = img.getAttribute('data-light')!
        const dark = img.getAttribute('data-dark')
        const src = theme.palette.mode === 'dark' ? dark || light : light
        if (src && img.getAttribute('src') !== src) img.setAttribute('src', src)
      })
    }
    const timers = [50, 100, 250, 500].map(ms => setTimeout(update, ms))
    const c = document.querySelector(selector)
    const obs = new MutationObserver(update)
    if (c) obs.observe(c, { childList: true, subtree: true })
    update()
    return () => {
      obs.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [theme.palette.mode, hydrated, selector])
}

const DarkLightImage = Node.create({
  name: 'darkLightImage',
  group: 'inline',
  inline: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: '' },
      light: { default: '' },
      dark: { default: '' },
      alt: { default: '' },
      title: { default: '' }
    }
  },
  parseHTML() {
    return [
      {
        tag: 'img[data-light][data-dark]',
        getAttrs: node => {
          const el = node as HTMLImageElement
          return {
            src: el.getAttribute('src'),
            light: el.getAttribute('data-light'),
            dark: el.getAttribute('data-dark'),
            alt: el.getAttribute('alt'),
            title: el.getAttribute('title')
          }
        }
      }
    ]
  },
  renderHTML({ HTMLAttributes }) {
    const theme =
      typeof document !== 'undefined'
        ? document.documentElement.getAttribute('data-mui-color-scheme') || 'light'
        : 'light'
    const src = theme === 'dark' ? HTMLAttributes.dark || HTMLAttributes.light : HTMLAttributes.light
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        src,
        'data-light': HTMLAttributes.light,
        'data-dark': HTMLAttributes.dark,
        class: 'dark-light-img'
      })
    ]
  },
  addCommands() {
    return {
      setDarkLightImage:
        options =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options })
    }
  }
})

// ——— Image Modal & Toolbar ——————————————————————————

const InsertImageModal = ({
  open,
  onClose,
  onInsert
}: {
  open: boolean
  onClose: () => void
  onInsert: (attrs: { src: string; light: string; dark?: string }) => void
}) => {
  const [lightFile, setLightFile] = useState<File | null>(null)
  const [darkFile, setDarkFile] = useState<File | null>(null)
  const [lightPr, setLightPr] = useState<string | null>(null)
  const [darkPr, setDarkPr] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const lref = useRef<HTMLInputElement | null>(null)
  const dref = useRef<HTMLInputElement | null>(null)

  const upload = async (f: File) => {
    const path = `subsections/${Date.now()}-${f.name}`
    const { error } = await supabase.storage.from('help-center').upload(path, f)
    if (error) throw error
    const { data } = supabase.storage.from('help-center').getPublicUrl(path)
    return data.publicUrl
  }

  const handleInsert = async () => {
    if (!lightFile) return
    setUploading(true)
    try {
      const lightUrl = await upload(lightFile)
      const darkUrl = darkFile ? await upload(darkFile) : undefined
      onInsert({ src: lightUrl, light: lightUrl, dark: darkUrl })
      onClose()
      setLightFile(null)
      setDarkFile(null)
      setLightPr(null)
      setDarkPr(null)
    } catch (e) {
      console.error(e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <DialogTitle>Insert Light/Dark Image</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant='body2' mb={1}>
              Light Mode Image *
            </Typography>
            <input
              ref={lref}
              type='file'
              accept='image/*'
              hidden
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) {
                  setLightFile(f)
                  setLightPr(URL.createObjectURL(f))
                }
              }}
            />
            {lightPr ? (
              <Box position='relative'>
                <img
                  src={lightPr}
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4 }}
                  onClick={() => lref.current?.click()}
                />
                <IconButton
                  size='small'
                  onClick={() => {
                    setLightFile(null)
                    setLightPr(null)
                  }}
                  sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'white' }}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Box>
            ) : (
              <Button fullWidth variant='outlined' onClick={() => lref.current?.click()}>
                Upload Light Image
              </Button>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2' mb={1}>
              Dark Mode Image (optional)
            </Typography>
            <input
              ref={dref}
              type='file'
              accept='image/*'
              hidden
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) {
                  setDarkFile(f)
                  setDarkPr(URL.createObjectURL(f))
                }
              }}
            />
            {darkPr ? (
              <Box position='relative'>
                <img
                  src={darkPr}
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 4 }}
                  onClick={() => dref.current?.click()}
                />
                <IconButton
                  size='small'
                  onClick={() => {
                    setDarkFile(null)
                    setDarkPr(null)
                  }}
                  sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'white' }}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Box>
            ) : (
              <Button fullWidth variant='outlined' onClick={() => dref.current?.click()}>
                Upload Dark Image
              </Button>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleInsert} disabled={!lightFile || uploading} variant='contained'>
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const EditorToolbar = ({ editor }: { editor: any }) => {
  const [imgOpen, setImgOpen] = useState(false)
  if (!editor) return null
  const cmds = [
    () => editor.chain().focus().toggleBold().run(),
    () => editor.chain().focus().toggleItalic().run(),
    () => editor.chain().focus().toggleUnderline().run(),
    () => setImgOpen(true),
    () => editor.chain().focus().setTextAlign('left').run(),
    () => editor.chain().focus().setTextAlign('center').run(),
    () => editor.chain().focus().setTextAlign('right').run(),
    () => editor.chain().focus().setTextAlign('justify').run()
  ]
  const icons = [
    'ri-bold',
    'ri-italic',
    'ri-underline',
    'ri-image-line',
    'ri-align-left',
    'ri-align-center',
    'ri-align-right',
    'ri-align-justify'
  ]
  return (
    <>
      <InsertImageModal
        open={imgOpen}
        onClose={() => setImgOpen(false)}
        onInsert={data => editor.chain().focus().setDarkLightImage(data).run()}
      />
      <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
        {cmds.map((fn, i) => (
          <CustomIconButton key={i} onClick={fn} variant='outlined' size='small'>
            <i className={classnames(icons[i])} />
          </CustomIconButton>
        ))}
      </div>
    </>
  )
}

// ——— Single Subsection Editor ——————————————————————————

interface SubsectionEditorProps {
  id: string
  title: Record<string, string>
  description: Record<string, string>
  activeLang: string
  languageData: { langCode: string; langName: string }[]
  onTitleChange: (id: string, title: string, lang: string) => void
  onContentChange: (id: string, content: string, lang: string) => void
  onRemove: () => void
}

const SubsectionEditor = ({
  id,
  title,
  description,
  activeLang,
  languageData,
  onTitleChange,
  onContentChange,
  onRemove
}: SubsectionEditorProps) => {
  const [currentLang, setCurrentLang] = useState(activeLang)
  const [localTitle, setLocalTitle] = useState(title[activeLang] || '')
  const [showCode, setShowCode] = useState(false)
  const [source, setSource] = useState(description[activeLang] || '')

  const editor = useEditor({
    extensions: [
      StarterKit,
      DarkLightImage,
      Underline,
      Placeholder.configure({ placeholder: 'Write subsection content here…' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: source,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      setSource(html)
      onContentChange(id, html, currentLang)
    }
  })

  useEffect(() => {
    setCurrentLang(activeLang)
    setLocalTitle(title[activeLang] || '')
    const newContent = description[activeLang] || '<p></p>'
    setSource(newContent)
    if (editor && editor.getHTML() !== newContent) {
      editor.commands.setContent(newContent)
    }
  }, [activeLang])

  useEffect(() => {
    setLocalTitle(title[currentLang] || '')
  }, [title, currentLang])

  useEffect(() => {
    const html = description[currentLang] || '<p></p>'
    setSource(html)
    if (editor && editor.getHTML() !== html) {
      editor.commands.setContent(html)
    }
  }, [description, currentLang])

  useEffect(() => {
    customLog('Editor switched to lang:', currentLang)
    customLog('Title:', title)
    customLog('Description:', description)
  }, [currentLang, title, description])

  const handleTitleChange = (val: string) => {
    setLocalTitle(val)
    onTitleChange(id, val, currentLang)
  }

  const handleSourceChange = (val: string) => {
    setSource(val)
    editor?.commands.setContent(val)

    onContentChange(id, val, currentLang)
  }
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <TextField
            fullWidth
            label={`Subsection Title (${currentLang})`}
            value={localTitle}
            onChange={e => handleTitleChange(e.target.value)}
          />
        }
        action={
          <Button onClick={onRemove} color='error' variant='outlined'>
            Remove
          </Button>
        }
      />
      <CardContent>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <EditorToolbar editor={editor} />
          <FormControlLabel
            control={<Switch size='small' checked={showCode} onChange={(_, v) => setShowCode(v)} />}
            label={showCode ? 'Code' : 'Preview'}
          />
        </Stack>
        <Divider sx={{ my: 2 }} />
        {showCode ? (
          <TextField
            label='Source HTML'
            multiline
            fullWidth
            minRows={10}
            value={source}
            onChange={e => handleSourceChange(e.target.value)}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </CardContent>
    </Card>
  )
}

// ——— Root Subsections Component ——————————————————————————

export default function Subsections({
  activeLang,
  subsections,
  onAdd,
  onRemove,
  onTitleChange,
  onContentChange
}: SubsectionsProps) {
  return (
    <div className='mt-10'>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Typography variant='h5'>Subsections Information</Typography>
        <Button variant='contained' onClick={onAdd}>
          + Add Subsection
        </Button>
      </Stack>
      {subsections.map(sub => (
        <SubsectionEditor
          key={sub.id}
          id={sub.id}
          title={sub.title}
          description={sub.description}
          activeLang={activeLang}
          languageData={languageData}
          onRemove={() => onRemove(sub.id)}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
        />
      ))}
    </div>
  )
}
