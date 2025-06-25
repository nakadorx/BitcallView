'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, TextField, Box, Chip } from '@mui/material'
import CustomIconButton from '@core/components/mui/IconButton'
import AddIcon from '@mui/icons-material/Add'

interface ProductOrganizeProps {
  onChange: (tags: string[]) => void
  initialTags?: string[]
}

const ArticleOrganize = ({ onChange, initialTags = [] }: ProductOrganizeProps) => {
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialTags)

  // Update local state if initialTags prop changes.
  useEffect(() => {
    setTags(initialTags)
  }, [initialTags])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      const updated = [...tags, newTag]
      setTags(updated)
      onChange(updated)
    }
    setTagInput('')
  }

  const handleDeleteTag = (tagToDelete: string) => {
    const updated = tags.filter(tag => tag !== tagToDelete)
    setTags(updated)
    onChange(updated)
  }

  return (
    <Card>
      <CardHeader title='Tags' />
      <CardContent>
        <Box display='flex' flexDirection='column' gap={2}>
          <Box display='flex' alignItems='center' gap={1}>
            <TextField
              fullWidth
              label='Add Tag'
              variant='outlined'
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <CustomIconButton color='primary' onClick={addTag}>
              <AddIcon />
            </CustomIconButton>
          </Box>
          <Box display='flex' flexWrap='wrap' gap={1}>
            {tags.map((tag, index) => (
              <Chip key={index} label={tag} onDelete={() => handleDeleteTag(tag)} color='primary' />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ArticleOrganize
