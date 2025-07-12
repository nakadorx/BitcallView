'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'

// MUI Imports
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'

// Type Imports
import type { Mode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Unified Theme Imports
import {
  getUnifiedTheme,
  setUnifiedTheme,
  applyThemeToDOM,
  migrateFromOldSystem,
  listenForSystemThemeChanges
} from '@/utils/unifiedTheme'

const ModeDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [currentMode, setCurrentMode] = useState<Mode>('system')

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings, updateSettings } = useSettings()

  // Initialize unified theme system
  useEffect(() => {
    // Migrate from old system on first load
    migrateFromOldSystem()

    // Get current theme
    const themeData = getUnifiedTheme()
    setCurrentMode(themeData.mode)

    // Apply theme to DOM
    applyThemeToDOM()

    // Listen for system theme changes
    const cleanup = listenForSystemThemeChanges(systemTheme => {
      console.log('System theme changed to:', systemTheme)
    })

    return cleanup
  }, [])

  const handleClose = () => {
    setOpen(false)
    setTooltipOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleModeSwitch = (mode: Mode) => {
    // ✅ Use unified theme system - no more conflicts!
    setUnifiedTheme(mode)
    applyThemeToDOM()

    // Update local state
    setCurrentMode(mode)

    // Update settings context (for compatibility)
    updateSettings({ mode: mode })

    // ✅ No more location.reload() needed!
    handleClose()
  }

  const getModeIcon = () => {
    if (currentMode === 'system') {
      return 'ri-macbook-line'
    } else if (currentMode === 'dark') {
      return 'ri-moon-clear-line'
    } else {
      return 'ri-sun-line'
    }
  }

  return (
    <>
      <Tooltip
        title={currentMode + ' Mode'}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : tooltipOpen ? true : false}
        PopperProps={{ className: 'capitalize' }}
      >
        <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary'>
          <i className={getModeIcon()} />
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-start'
        anchorEl={anchorRef.current}
        className='min-is-[160px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'right top' }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList onKeyDown={handleClose}>
                  <MenuItem
                    className='gap-3 pli-4'
                    onClick={() => handleModeSwitch('light')}
                    selected={currentMode === 'light'}
                  >
                    <i className='ri-sun-line' />
                    Light
                  </MenuItem>
                  <MenuItem
                    className='gap-3 pli-4'
                    onClick={() => handleModeSwitch('dark')}
                    selected={currentMode === 'dark'}
                  >
                    <i className='ri-moon-clear-line' />
                    Dark
                  </MenuItem>
                  <MenuItem
                    className='gap-3 pli-4'
                    onClick={() => handleModeSwitch('system')}
                    selected={currentMode === 'system'}
                  >
                    <i className='ri-computer-line' />
                    System
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default ModeDropdown
