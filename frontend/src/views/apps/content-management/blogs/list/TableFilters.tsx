'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// Define a BlogPost type based on your API response
type BlogPost = {
  _id: string
  title: string
  slug: string
  date: string
  mainImage: string
  status: {
    status: string
    scheduledDateTime?: string
  }
  author?: {
    name: string
  }
  actions?: string
}

const TableFilters = ({ setData, blogData }: { setData: (data: BlogPost[]) => void; blogData?: BlogPost[] }) => {
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    const filteredData = blogData?.filter(blog => {
      // Retrieve the blog's status safely (default to empty string if not available)
      const blogStatus = blog.status?.status ?? ''
      // If a filter is set and it does not match, filter out this blog
      if (status && blogStatus.toLowerCase() !== status.toLowerCase()) return false
      return true
    })
    setData(filteredData ?? [])
  }, [status, blogData, setData])

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              labelId='status-select'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='scheduled'>Scheduled</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
