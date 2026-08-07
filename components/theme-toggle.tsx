"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaSun, FaMoon } from "react-icons/fa"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        className="w-16 h-8 border-2 pixel-corners" 
        style={{ borderColor: 'var(--foreground)' }}
      />
    )
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-16 h-8 border-2 pixel-corners flex items-center justify-center gap-2 transition-colors"
      style={{ 
        borderColor: 'var(--foreground)',
        backgroundColor: 'var(--background)'
      }}
      aria-label="Toggle theme"
    >
      <span className="text-xl pixel-text flex items-center justify-center" style={{ color: 'var(--foreground)' }}>
        {isDark ? <FaSun /> : <FaMoon />}
      </span>
    </button>
  )
}