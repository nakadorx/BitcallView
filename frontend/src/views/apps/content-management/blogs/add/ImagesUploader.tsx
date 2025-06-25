'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Button, IconButton, Typography, Grid } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Close'
import { supabase } from '@/utils/supabaseClient'

export type LightDarkImage = {
  id: string
  light: {
    preview: string
    publicUrl: string
    storagePath?: string
  }
  dark?: {
    preview: string
    publicUrl: string
    storagePath?: string
  }
}

interface ImageUploaderProps {
  onChange: (images: LightDarkImage[]) => void
  initialImages?: LightDarkImage[]
}

const ImageUploader = ({ onChange, initialImages = [] }: ImageUploaderProps) => {
  const [images, setImages] = useState<LightDarkImage[]>(initialImages)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    setImages(initialImages)
  }, [initialImages])

  const uploadToSupabase = async (file: File): Promise<{ publicUrl: string; storagePath: string }> => {
    const fileName = `${Date.now()}-${file.name}`
    const path = `images/${fileName}`
    const { data, error } = await supabase.storage.from('blog-images').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(path)
    return { publicUrl: urlData.publicUrl, storagePath: path }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, mode: 'light' | 'dark') => {
    const file = e.target.files?.[0]
    if (!file) return
    const { publicUrl, storagePath } = await uploadToSupabase(file)
    const preview = URL.createObjectURL(file)

    const updated = images.map(img => {
      if (img.id !== id) return img
      return {
        ...img,
        [mode]: { preview, publicUrl, storagePath }
      }
    })

    setImages(updated)
    onChange(updated)
  }

  const addNewImage = () => {
    const newEntry: LightDarkImage = {
      id: crypto.randomUUID(),
      light: { preview: '', publicUrl: '' }
    }
    const updated = [...images, newEntry]
    setImages(updated)
    onChange(updated)
  }

  const deleteFromSupabase = async (storagePath?: string) => {
    if (storagePath) {
      const { error } = await supabase.storage.from('blog-images').remove([storagePath])
      if (error) console.error('Delete error:', error.message)
    }
  }

  const handleDelete = async (id: string) => {
    const toDelete = images.find(img => img.id === id)
    await deleteFromSupabase(toDelete?.light.storagePath)
    if (toDelete?.dark) await deleteFromSupabase(toDelete.dark.storagePath)
    const updated = images.filter(img => img.id !== id)
    setImages(updated)
    onChange(updated)
  }

  const triggerFileInput = (id: string, mode: 'light' | 'dark') => {
    const inputKey = `${id}-${mode}`
    fileInputRefs.current[inputKey]?.click()
  }

  return (
    <Box>
      <Button variant='contained' onClick={addNewImage}>
        Add Light/Dark Image Pair
      </Button>
      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        Uploaded Image Pairs:
      </Typography>
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {images.map(img => (
          <Grid item xs={12} md={6} key={img.id}>
            <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2, position: 'relative' }}>
              <Grid container spacing={2}>
                {/* Light Mode */}
                <Grid item xs={6}>
                  <Typography variant='body2'>Light</Typography>
                  <input
                    ref={ref => (fileInputRefs.current[`${img.id}-light`] = ref)}
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={e => handleUpload(e, img.id, 'light')}
                  />
                  {img.light.preview || img.light.publicUrl ? (
                    <img
                      src={img.light.preview || img.light.publicUrl}
                      alt='Light Preview'
                      onClick={() => triggerFileInput(img.id, 'light')}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                      title='Click to replace'
                    />
                  ) : (
                    <Button variant='outlined' component='label' fullWidth>
                      Upload Light
                      <input hidden type='file' accept='image/*' onChange={e => handleUpload(e, img.id, 'light')} />
                    </Button>
                  )}
                </Grid>

                {/* Dark Mode */}
                <Grid item xs={6}>
                  <Typography variant='body2'>Dark</Typography>
                  <input
                    ref={ref => (fileInputRefs.current[`${img.id}-dark`] = ref)}
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={e => handleUpload(e, img.id, 'dark')}
                  />
                  {img.dark?.preview || img.dark?.publicUrl ? (
                    <img
                      src={img.dark.preview || img.dark.publicUrl}
                      alt='Dark Preview'
                      onClick={() => triggerFileInput(img.id, 'dark')}
                      style={{
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                      title='Click to replace'
                    />
                  ) : (
                    <Button variant='outlined' component='label' fullWidth>
                      Upload Dark
                      <input hidden type='file' accept='image/*' onChange={e => handleUpload(e, img.id, 'dark')} />
                    </Button>
                  )}
                </Grid>
              </Grid>
              <IconButton
                onClick={() => handleDelete(img.id)}
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ImageUploader
