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
        className="w-9 h-9 rounded-full border-2"
        style={{ borderColor: 'var(--foreground)' }}
      />
    )
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === 'dark'

  return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all hover:scale-105"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--card)',
          color: 'var(--foreground)',
        }}
        aria-label="Toggle theme"
      >
        <span className="text-sm">
          {isDark ? <FaSun /> : <FaMoon />}
        </span>
      </button>
  )
}