'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Divider,
  FormControlLabel
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CategoryImgUploader from './CategoryImage'
import { customLog } from '@/utils/commons'
import api from '@/utils/api'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import IconPicker from './IconPicker'

export type categoryType = {
  _id?: string
  title: string
  description: string
  image: string
  comment: string
  status: string
  icon?: string
}

type FormValues = {
  title: string
  description: string
}

type Props = {
  open: boolean
  handleClose: () => void
  refreshCategories: () => void
  initData?: categoryType
}

const AddCategoryDrawer = ({ open, handleClose, refreshCategories, initData }: Props) => {
  const [categoryImage, setCategoryImage] = useState(initData?.image || '')
  const [comment, setComment] = useState(initData?.comment || '')
  const [status, setStatus] = useState(initData?.status || '')
  const [icon, setIcon] = useState(initData?.icon || '')
  const [useImage, setUseImage] = useState(!!initData?.image) // 👈 Switch between icon or image

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: initData?.title || '',
      description: initData?.description || ''
    }
  })

  useEffect(() => {
    resetForm({
      title: initData?.title || '',
      description: initData?.description || ''
    })
    setCategoryImage(initData?.image || '')
    setComment(initData?.comment || '')
    setStatus(initData?.status || '')
    setIcon(initData?.icon || '')
    setUseImage(!!initData?.image)
  }, [initData, resetForm])

  const handleFormSubmit = async (data: FormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      image: useImage ? categoryImage : '',
      comment,
      status,
      icon: useImage ? '' : icon
    }

    customLog('Submitting category data:', payload)
    try {
      if (initData && initData._id) {
        await api.put(`/help-center/categories/${initData._id}`, payload)
        toast.success('Category updated successfully')
      } else {
        await api.post('/help-center/categories', payload)
        toast.success('Category created successfully')
      }
      refreshCategories()
      handleReset()
    } catch (error: any) {
      customLog('Error saving category: ' + error.message)
      toast.error('Error saving category: ' + error.message)
    }
  }

  const handleReset = () => {
    handleClose()
    resetForm({ title: '', description: '' })
    setCategoryImage('')
    setComment('')
    setStatus('')
    setIcon('')
    setUseImage(false)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between p-5 pb-4'>
        <Typography variant='h5'>{initData ? 'Update Category' : 'Add Category'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='flex flex-col gap-5'>
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Title'
                placeholder='Fashion'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Description'
                placeholder='Enter a description...'
                {...(errors.description && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />

          {/* MUI Switch between icon and image */}
          <FormControlLabel
            control={<Switch checked={useImage} onChange={() => setUseImage(prev => !prev)} color='primary' />}
            label={useImage ? 'Using Image' : 'Using Icon'}
            sx={{ mt: -1 }}
          />

          {useImage ? (
            <>
              <Typography variant='body2' sx={{ mb: 1 }}>
                Upload an Image
              </Typography>
              <CategoryImgUploader onChange={setCategoryImage} initialImageUrl={categoryImage} />
            </>
          ) : (
            <>
              <Typography variant='body2' sx={{ mb: 1 }}>
                Pick an Icon
              </Typography>
              <IconPicker value={icon} onChange={setIcon} />
            </>
          )}

          <TextField
            fullWidth
            label='Comment'
            value={comment}
            onChange={e => setComment(e.target.value)}
            multiline
            rows={4}
            placeholder='Write a Comment...'
          />

          <FormControl fullWidth>
            <InputLabel id='plan-select'>Category Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              label='Category Status'
              labelId='status-select'
            >
              <MenuItem value='Published'>Published</MenuItem>
              <MenuItem value='Inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>

          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              {initData ? 'Update' : 'Add'}
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Discard
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default AddCategoryDrawer
