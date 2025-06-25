'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, TextField, Button, Stack, Divider, Typography } from '@mui/material'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import CustomIconButton from '@core/components/mui/IconButton'
import classnames from 'classnames'
import { supabase } from '@/utils/supabaseClient'
import { customLog } from '@/utils/commons'

/* --------------------------------------------------------
   EditorToolbar Component
   - Provides formatting buttons and an image insert button.
--------------------------------------------------------- */
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const handleInsertImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (file) {
        console.log('Uploading image:', file)
        const fileName = `${Date.now()}-${file.name}`
        const bucketName = 'blog-images'
        const filePath = `subsections/${fileName}`
        const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file)
        if (error) {
          console.error('Error uploading file:', error.message)
          return
        }
        const { data: urlData, error: urlError } = supabase.storage.from(bucketName).getPublicUrl(data.path)
        if (urlError) {
          console.error('Error getting public URL:', urlError.message)
          return
        }
        editor.chain().focus().setImage({ src: urlData.publicUrl }).run()
      }
    }
    input.click()
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('ri-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('ri-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('ri-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton variant='outlined' size='small' onClick={handleInsertImage}>
        <i className='ri-image-line' />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('ri-align-left', {
            'text-textSecondary': !editor.isActive({ textAlign: 'left' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('ri-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('ri-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('ri-align-justify', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

/* --------------------------------------------------------
   SubsectionEditor Component
   - Renders an input for the subsection title and a rich text editor.
   - Uses passed initialTitle and initialContent for pre-filled values.
--------------------------------------------------------- */
interface SubsectionEditorProps {
  id: string
  onRemove: (id: string) => void
  onTitleChange: (id: string, newTitle: string) => void
  onContentChange: (id: string, newContent: string) => void
  initialTitle?: string
  initialContent?: string
}

const SubsectionEditor = ({
  id,
  onRemove,
  onTitleChange,
  onContentChange,
  initialTitle = '',
  initialContent = ''
}: SubsectionEditorProps) => {
  const [title, setTitle] = useState(initialTitle)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({ placeholder: 'Write subsection content here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline
    ],
    content: initialContent || `<p></p>`,
    onUpdate({ editor }) {
      onContentChange(id, editor.getHTML())
    }
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onTitleChange(id, e.target.value)
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <TextField
            label='Subsection Title'
            fullWidth
            value={title}
            onChange={handleTitleChange}
            placeholder='Enter subsection title'
          />
        }
        action={
          <Button sx={{ ml: 2 }} onClick={() => onRemove(id)} color='error' variant='outlined'>
            Remove
          </Button>
        }
      />
      <CardContent>
        <EditorToolbar editor={editor} />
        <Divider sx={{ my: 2 }} />
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  )
}

/* --------------------------------------------------------
   BlogSubsections Component
   - Manages an array of subsections.
   - Accepts an initialSubsections prop to pre-fill data.
--------------------------------------------------------- */
interface Subsection {
  id: string
  title: string
  description: string
}

interface BlogSubsectionsProps {
  onChange: (subs: Subsection[]) => void
  initialSubsections?: Subsection[]
}

const BlogSubsections = ({ onChange, initialSubsections = [] }: BlogSubsectionsProps) => {
  const [subsections, setSubsections] = useState<Subsection[]>(initialSubsections)

  const addSubsection = () => {
    const newSub: Subsection = { id: crypto.randomUUID(), title: '', description: '' }
    const updated = [...subsections, newSub]
    setSubsections(updated)
    onChange(updated)
  }

  const removeSubsection = (id: string) => {
    const updated = subsections.filter(sub => sub.id !== id)
    setSubsections(updated)
    onChange(updated)
  }

  const handleTitleChange = (id: string, newTitle: string) => {
    const updated = subsections.map(sub => (sub.id === id ? { ...sub, title: newTitle } : sub))
    setSubsections(updated)
    onChange(updated)
  }

  const handleContentChange = (id: string, newContent: string) => {
    const updated = subsections.map(sub => (sub.id === id ? { ...sub, description: newContent } : sub))
    setSubsections(updated)
    onChange(updated)
  }

  useEffect(() => {
    customLog('Subsections updated:', subsections)
    onChange(subsections)
  }, [subsections, onChange])

  return (
    <div className='mt-10'>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Typography variant='h5'>Subsections Information</Typography>
        <Button onClick={addSubsection} variant='contained' color='primary'>
          + Add Subsection
        </Button>
      </Stack>
      {subsections.map(sub => (
        <SubsectionEditor
          key={sub.id}
          id={sub.id}
          onRemove={removeSubsection}
          onTitleChange={handleTitleChange}
          onContentChange={handleContentChange}
          initialTitle={sub.title}
          initialContent={sub.description}
        />
      ))}
    </div>
  )
}

export default BlogSubsections
