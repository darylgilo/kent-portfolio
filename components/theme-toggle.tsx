"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaSun, FaMoon } from "react-icons/fa"

export function ThemeToggle({ variant = "pixel" }: { variant?: "pixel" | "modern" }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className={variant === "pixel" ? "w-16 h-8 border-2 pixel-corners" : "w-9 h-9 rounded-full border-2"}
        style={{ borderColor: 'var(--foreground)' }}
      />
    )
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme
  const isDark = currentTheme === 'dark'

  if (variant === "modern") {
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