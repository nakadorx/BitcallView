'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Box,
  useTheme,
  ButtonBase
} from '@mui/material'
import { Icon } from '@iconify/react'
import bundledIcons from '@/assets/iconify-icons/bundled-icons.json'

export default function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredIcons = bundledIcons.filter(icon => icon.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      {/* Bigger clickable button styled like MUI large button/input */}
      <ButtonBase
        onClick={() => setOpen(true)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          px: 2.5,
          py: 2,
          width: 'fit-content',
          color: 'text.primary',
          bgcolor: 'background.paper',
          typography: 'body1',
          fontWeight: 500,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        <Icon icon={value || 'ri:question-line'} style={{ fontSize: 24 }} />
        <span>{value || 'Pick an icon'}</span>
      </ButtonBase>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Select an Icon</DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            fullWidth
            placeholder='Search icons...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ mt: 2, mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line text-xl' />
                </InputAdornment>
              )
            }}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
              gap: 2,
              maxHeight: 400,
              overflowY: 'auto',
              px: 1,
              pb: 2
            }}
          >
            {filteredIcons.slice(0, 500).map(icon => (
              <Tooltip title={icon} key={icon} arrow>
                <IconButton
                  onClick={() => {
                    onChange(icon)
                    setOpen(false)
                  }}
                  sx={{
                    borderRadius: 2,
                    width: '100%',
                    height: '48px',
                    ...(value === icon && {
                      color: theme.palette.primary.main,
                      bgcolor: theme.palette.action.selected
                    })
                  }}
                >
                  <Icon icon={icon} width={24} height={24} />
                </IconButton>
              </Tooltip>
            ))}

            {filteredIcons.length === 0 && (
              <Box sx={{ textAlign: 'center', gridColumn: '1/-1', py: 4, color: 'text.secondary' }}>No icons found</Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}
