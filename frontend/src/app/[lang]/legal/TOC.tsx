'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

export interface TOCItem {
  id: string
  label: string
}

export interface TOCProps {
  items: TOCItem[]
}

// A simple scroll spy hook to highlight the active section.
function useScrollSpy(ids: string[], offset: number = 150) {
  const [activeId, setActiveId] = useState('')
  useEffect(() => {
    const handleScroll = () => {
      let currentId = ''
      ids.forEach(id => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= offset) {
            currentId = id
          }
        }
      })
      setActiveId(currentId)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ids, offset])
  return activeId
}

export default function TOC({ items }: TOCProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const activeId = useScrollSpy(items.map(item => item.id))

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Calculate position offset by navbar height (75px)
      const yOffset = -75
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      if (isMobile) {
        setDrawerOpen(false)
      }
    }
  }

  const tocList = (
    <List>
      {items.map(item => (
        <ListItem key={item.id} disablePadding>
          <ListItemButton onClick={() => handleItemClick(item.id)} selected={activeId === item.id}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )

  if (isMobile) {
    return (
      <Box sx={{ mb: 2 }}>
        <Button variant='outlined' onClick={handleToggleDrawer}>
          Table of Contents
        </Button>
        <Drawer anchor='left' open={drawerOpen} onClose={handleToggleDrawer}>
          <Box sx={{ width: 250, p: 2 }} role='presentation'>
            <Typography variant='h6' gutterBottom>
              Table of Contents
            </Typography>
            {tocList}
          </Box>
        </Drawer>
      </Box>
    )
  }

  // On desktop, we assume the parent layout has two columns.
  // This TOC appears in a sticky sidebar inside its own column.
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'sticky',
        top: 80,
        p: 2
      }}
    >
      <Typography variant='h6' gutterBottom>
        Table of Contents
      </Typography>
      {tocList}
    </Paper>
  )
}
