'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Box
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import BlockIcon from '@mui/icons-material/Block'
import ScheduleIcon from '@mui/icons-material/Schedule'
import TodayIcon from '@mui/icons-material/Today'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

interface BlogStatusProps {
  onChange: (data: { status: string; scheduledDateTime?: string }) => void
  initialStatus?: { status: string; scheduledDateTime?: string }
}

const ArticleStatus = ({ onChange, initialStatus }: BlogStatusProps) => {
  // If initialStatus.scheduledDateTime exists, split it into date and time parts.
  let initialScheduledDate = ''
  let initialScheduledTime = ''
  if (initialStatus?.scheduledDateTime) {
    const parts = initialStatus.scheduledDateTime.split('T')
    initialScheduledDate = parts[0]
    initialScheduledTime = parts[1] || ''
  }

  // Helper to format status with first letter uppercase.
  const formatStatus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

  // Initialize local state with formatted initialStatus if available.
  const initialStatusValue = initialStatus?.status ? formatStatus(initialStatus.status) : 'Published'
  const [status, setStatus] = useState<string>(initialStatusValue)
  const [scheduleDate, setScheduleDate] = useState<string>(initialScheduledDate)
  const [scheduleTime, setScheduleTime] = useState<string>(initialScheduledTime)

  // Update local state if initialStatus changes.
  useEffect(() => {
    if (initialStatus?.status) {
      setStatus(formatStatus(initialStatus.status))
    }
    if (initialStatus?.scheduledDateTime) {
      const parts = initialStatus.scheduledDateTime.split('T')
      setScheduleDate(parts[0])
      setScheduleTime(parts[1] || '')
    }
  }, [initialStatus])

  const handleStatusChange = (event: React.MouseEvent<HTMLElement>, newStatus: string | null) => {
    if (newStatus !== null) {
      setStatus(newStatus)
    }
  }

  // Combine date and time if both are set.
  const scheduledDateTime = scheduleDate && scheduleTime ? `${scheduleDate}T${scheduleTime}` : ''

  // Whenever status or scheduled date/time changes, update the parent.
  useEffect(() => {
    if (status === 'Scheduled') {
      onChange({ status, scheduledDateTime })
    } else {
      onChange({ status })
    }
  }, [status, scheduleDate, scheduleTime, scheduledDateTime, onChange])

  return (
    <Card>
      <CardHeader title='Post Status' />
      <CardContent>
        <ToggleButtonGroup
          color='primary'
          value={status}
          exclusive
          onChange={handleStatusChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value='Published'>
            <PublicIcon sx={{ mr: 1 }} />
            Published
          </ToggleButton>
          <ToggleButton value='Inactive'>
            <BlockIcon sx={{ mr: 1 }} />
            Inactive
          </ToggleButton>
          <ToggleButton value='Scheduled'>
            <ScheduleIcon sx={{ mr: 1 }} />
            Scheduled
          </ToggleButton>
        </ToggleButtonGroup>
        {status === 'Scheduled' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TodayIcon sx={{ mr: 1 }} />
              <Typography variant='subtitle1'>Pick Date:</Typography>
            </Box>
            <TextField
              fullWidth
              type='date'
              value={scheduleDate}
              onChange={e => setScheduleDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              <Typography variant='subtitle1'>Pick Time:</Typography>
            </Box>
            <TextField
              fullWidth
              type='time'
              value={scheduleTime}
              onChange={e => setScheduleTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            {scheduledDateTime && (
              <Typography variant='body2' sx={{ mt: 1 }}>
                Scheduled for: {scheduledDateTime}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ArticleStatus
