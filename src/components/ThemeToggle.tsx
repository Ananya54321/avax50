'use client'

import { useTheme } from './ThemeProvider'
import { Switch } from '@mui/material'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Switch 
      checked={theme === 'dark'}
      onChange={toggleTheme}
      color="warning" 
    />
  )
}
