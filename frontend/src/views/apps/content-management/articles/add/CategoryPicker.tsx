// CategoryPicker.tsx
'use client'

import { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import RefreshIcon from '@mui/icons-material/Refresh'
import api from '@/utils/api'

export type categoryType = {
  _id: string
  title: string
  description: string
  image: string
}

const CategoryPicker = ({
  selectedCategory,
  onChange
}: {
  selectedCategory: string
  onChange: (id: string) => void
}) => {
  const [categories, setCategories] = useState<categoryType[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await api.get('/help-center/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Autocomplete
        options={categories.filter(cat => cat.title.toLowerCase().includes(search.toLowerCase()))}
        getOptionLabel={option => option.title}
        renderOption={(props, option) => (
          <li {...props}>
            <Avatar src={option.image} alt={option.title} sx={{ width: 24, height: 24, marginRight: 1 }} />
            {option.title}
          </li>
        )}
        value={categories.find(cat => cat._id === selectedCategory) || null}
        onChange={(event, value) => {
          onChange(value ? value._id : '')
        }}
        renderInput={params => (
          <TextField {...params} label='Category' variant='outlined' onChange={e => setSearch(e.target.value)} />
        )}
        style={{ flex: 1 }}
      />
      <IconButton onClick={fetchCategories} disabled={loading}>
        <RefreshIcon />
      </IconButton>
    </div>
  )
}

export default CategoryPicker
