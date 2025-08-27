'use client'

import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 p-0 flex-shrink-0"
    >
      {theme === 'dark' ? (
        <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
      ) : (
        <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
      )}
    </Button>
  )
}
