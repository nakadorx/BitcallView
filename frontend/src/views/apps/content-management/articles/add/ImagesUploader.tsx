'use client'

import { useState, useEffect } from 'react'
import { Box, Button, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Close'
import { supabase } from '@/utils/supabaseClient'
import { customLog } from '@/utils/commons'

export type UploadedImage = {
  id?: string // optional if only a public URL exists
  file?: File // file might be undefined for pre-uploaded images
  preview: string
  publicUrl: string
  storagePath?: string
}

interface ImageUploaderProps {
  onChange: (images: UploadedImage[]) => void
  initialImages?: UploadedImage[]
}

const ImageUploader = ({ onChange, initialImages = [] }: ImageUploaderProps) => {
  // Ensure that every image has an id; if not, use the publicUrl as an id.
  const assignId = (img: UploadedImage) => ({ ...img, id: img.id || img.publicUrl })
  const [images, setImages] = useState<UploadedImage[]>(initialImages.map(assignId))

  // Update state if initialImages changes and assign ids to pre-uploaded images
  useEffect(() => {
    setImages(initialImages.map(assignId))
  }, [initialImages])

  // Function to upload an image to Supabase Storage
  const uploadImage = async (file: File): Promise<{ publicUrl: string; storagePath: string }> => {
    const fileName = `${Date.now()}-${file.name}`
    const bucketName = 'blog-images'
    const filePath = `images/${fileName}`
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file)
    if (error) {
      throw new Error(error.message)
    }
    const { data: urlData, error: urlError } = supabase.storage.from(bucketName).getPublicUrl(data.path)
    if (urlError) {
      throw new Error(urlError.message)
    }
    return { publicUrl: urlData.publicUrl, storagePath: data.path }
  }

  // Handle file input change: upload each file immediately
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    try {
      const uploadedImages = await Promise.all(
        newFiles.map(async file => {
          const { publicUrl, storagePath } = await uploadImage(file)
          return {
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
            publicUrl,
            storagePath
          } as UploadedImage
        })
      )
      const updatedImages = [...images, ...uploadedImages]
      setImages(updatedImages)
      onChange(updatedImages)
    } catch (error) {
      console.error('Error uploading images:', error)
    }
  }

  // Clean up created object URLs
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [images])

  // Delete image from Supabase Storage
  const deleteImageFromSupabase = async (storagePath: string) => {
    const bucketName = 'blog-images'
    const { error } = await supabase.storage.from(bucketName).remove([storagePath])
    if (error) {
      console.error('Error removing file from Supabase:', error.message)
    }
  }

  const handleDelete = async (id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    if (imageToRemove && imageToRemove.storagePath) {
      await deleteImageFromSupabase(imageToRemove.storagePath)
    }
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onChange(updatedImages)
  }

  return (
    <Box>
      <Button variant='contained' component='label'>
        Upload Images
        <input type='file' hidden multiple onChange={handleFileChange} />
      </Button>
      <Typography variant='subtitle1' sx={{ mt: 2 }}>
        Uploaded Images:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
        {images.map(img => (
          <Box
            key={img.id || img.publicUrl}
            sx={{
              width: 120,
              height: 120,
              border: '1px solid #ccc',
              borderRadius: 1,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img
              src={img.preview || img.publicUrl}
              alt='Uploaded preview'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              size='small'
              onClick={() => handleDelete(img.id!)}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ImageUploader
