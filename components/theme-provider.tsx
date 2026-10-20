"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
}: {
  children: ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const stored = localStorage.getItem("theme") as Theme | null
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    const resolved = stored || (enableSystem ? systemTheme : defaultTheme)

    setThemeState(resolved)

    if (attribute === "class") {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(
        resolved === "system" ? systemTheme : resolved
      )
    }
  }, [])

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      localStorage.setItem("theme", newTheme)

      if (attribute === "class") {
        if (newTheme === "system") {
          const systemTheme = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches
            ? "dark"
            : "light"
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(systemTheme)
        } else {
          document.documentElement.classList.remove("light", "dark")
          document.documentElement.classList.add(newTheme)
        }
      }
    },
    [attribute]
  )

  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}