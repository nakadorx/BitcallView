// BootstrapIconPicker.tsx
import React from 'react'
import { Autocomplete, TextField, Box } from '@mui/material'

export type IconOption = {
  label: string
  value: string
}

// For illustration, this array includes some common icons.
// Extend this list with all available Bootstrap icons as needed.
const bootstrapIcons: IconOption[] = [
  { label: 'Shopping Cart', value: 'ri-shopping-cart-line' },
  { label: 'Question', value: 'ri-question-line' },
  { label: 'File Text', value: 'ri-file-text-line' },
  { label: 'Palette', value: 'ri-palette-line' },
  { label: 'Lock', value: 'ri-lock-line' },
  { label: 'User', value: 'ri-user-line' }
  // ... Add more bootstrap icon options here.
]

interface BootstrapIconPickerProps {
  value: string
  onChange: (newValue: string) => void
  label?: string
}

const BootstrapIconPicker: React.FC<BootstrapIconPickerProps> = ({ value, onChange, label = 'Icon' }) => {
  const selectedOption = bootstrapIcons.find(icon => icon.value === value) || null

  return (
    <Autocomplete
      options={bootstrapIcons}
      value={selectedOption}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.value : '')
      }}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option) => (
        <Box component='li' {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className={option.value} style={{ fontSize: '1.5rem' }} />
          {option.label}
        </Box>
      )}
      renderInput={params => <TextField {...params} label={label} variant='outlined' />}
      fullWidth
      clearOnEscape
    />
  )
}

export default BootstrapIconPicker
