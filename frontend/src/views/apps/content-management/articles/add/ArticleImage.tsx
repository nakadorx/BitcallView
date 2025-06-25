'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import CustomAvatar from '@core/components/mui/Avatar'
import { supabase } from '@/utils/supabaseClient'
import { customLog } from '@/utils/commons'

const DropzoneContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(12),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5)
  }
}))

interface ProductImageProps {
  onChange: (url: string) => void
  initialImageUrl?: string
}

const ArticleImage = ({ onChange, initialImageUrl = '' }: ProductImageProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(initialImageUrl)
  const [publicUrl, setPublicUrl] = useState<string>(initialImageUrl)

  // Update preview when initialImageUrl changes
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl)
      setPublicUrl(initialImageUrl)
    }
  }, [initialImageUrl])

  const handleUpload = async (selectedFile: File) => {
    customLog('handleUpload...')
    if (!selectedFile) return
    customLog('Uploading image:', selectedFile)
    const fileName = `${Date.now()}-${selectedFile.name}`
    const bucketName = 'help-center'
    const filePath = `articles/${fileName}`
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, selectedFile)
    if (error) {
      console.error('Error uploading file:', error.message)
      return
    }
    customLog('Upload data:', data)
    const { data: urlData, error: urlError } = supabase.storage.from(bucketName).getPublicUrl(data.path)
    if (urlError) {
      console.error('Error getting public URL:', urlError.message)
      return
    }
    customLog('Received image URL:', urlData.publicUrl)
    setPublicUrl(urlData.publicUrl)
    setPreview(urlData.publicUrl)
    // Lift the public URL to the parent component
    onChange(urlData.publicUrl)
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/*',
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0]
        setFile(selectedFile)
        setPreview(URL.createObjectURL(selectedFile))
        // Immediately upload the file after selection
        await handleUpload(selectedFile)
      }
    }
  })

  return (
    <Card>
      <CardHeader title='Article Main Image' sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }} />
      <CardContent>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {!preview ? (
            <DropzoneContainer>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='ri-upload-2-line' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your Image Here.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='outlined' size='small'>
                Browse Image
              </Button>
            </DropzoneContainer>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <img src={preview} alt='Preview' style={{ maxWidth: '100%', maxHeight: '300px' }} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ArticleImage
