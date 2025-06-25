'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, Button, Typography, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import CustomAvatar from '@core/components/mui/Avatar'
import { supabase } from '@/utils/supabaseClient'
import { customLog } from '@/utils/commons'

const DropzoneContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer'
}))

interface BlogImageProps {
  onChange: (images: { light: string; dark?: string }) => void
  initialLightImage?: string
  initialDarkImage?: string
}

const ProductImage = ({ onChange, initialLightImage = '', initialDarkImage = '' }: BlogImageProps) => {
  const [lightFile, setLightFile] = useState<File | null>(null)
  const [darkFile, setDarkFile] = useState<File | null>(null)
  const [lightPreview, setLightPreview] = useState(initialLightImage)
  const [darkPreview, setDarkPreview] = useState(initialDarkImage)

  const handleUpload = async (file: File, type: 'light' | 'dark') => {
    const path = `main/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from('blog-images').upload(path, file)
    if (error) throw error
    const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(data.path)
    return urlData.publicUrl
  }

  const uploadImage = async (file: File, type: 'light' | 'dark') => {
    const url = await handleUpload(file, type)
    if (type === 'light') {
      setLightPreview(url)
      onChange({ light: url, dark: darkPreview })
    } else {
      setDarkPreview(url)
      onChange({ light: lightPreview, dark: url })
    }
  }

  const getDropzoneProps = (type: 'light' | 'dark') =>
    useDropzone({
      multiple: false,
      accept: 'image/*',
      onDrop: async accepted => {
        const file = accepted[0]
        if (!file) return
        type === 'light' ? setLightFile(file) : setDarkFile(file)
        type === 'light' ? setLightPreview(URL.createObjectURL(file)) : setDarkPreview(URL.createObjectURL(file))
        await uploadImage(file, type)
      }
    })

  const { getRootProps: getLightRootProps, getInputProps: getLightInputProps } = getDropzoneProps('light')
  const { getRootProps: getDarkRootProps, getInputProps: getDarkInputProps } = getDropzoneProps('dark')

  return (
    <Card>
      <CardHeader title='Main Blog Image (Light + Dark)' />
      <CardContent>
        <Grid container spacing={4}>
          {/* Light Mode Image */}
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' mb={2}>
              Light Mode Image *
            </Typography>
            <div {...getLightRootProps()}>
              <input {...getLightInputProps()} />
              {!lightPreview ? (
                <DropzoneContainer>
                  <CustomAvatar variant='rounded' skin='light' color='primary'>
                    <i className='ri-upload-2-line' />
                  </CustomAvatar>
                  <Typography>Upload light image</Typography>
                  <Button variant='outlined' size='small'>
                    Browse
                  </Button>
                </DropzoneContainer>
              ) : (
                <img src={lightPreview} alt='Light Preview' style={{ maxWidth: '100%', maxHeight: 240 }} />
              )}
            </div>
          </Grid>

          {/* Dark Mode Image */}
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' mb={2}>
              Dark Mode Image (optional)
            </Typography>
            <div {...getDarkRootProps()}>
              <input {...getDarkInputProps()} />
              {!darkPreview ? (
                <DropzoneContainer>
                  <CustomAvatar variant='rounded' skin='light' color='secondary'>
                    <i className='ri-upload-2-line' />
                  </CustomAvatar>
                  <Typography>Upload dark image</Typography>
                  <Button variant='outlined' size='small'>
                    Browse
                  </Button>
                </DropzoneContainer>
              ) : (
                <img src={darkPreview} alt='Dark Preview' style={{ maxWidth: '100%', maxHeight: 240 }} />
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ProductImage
