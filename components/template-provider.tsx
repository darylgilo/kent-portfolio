"use client"

import { createContext, useContext, useState } from "react"

export type TemplateMode = "pixel" | "modern"

type TemplateContextValue = {
  mode: TemplateMode
  setMode: (mode: TemplateMode) => void
}

const TemplateContext = createContext<TemplateContextValue>({
  mode: "pixel",
  setMode: () => {},
})

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<TemplateMode>("pixel")
  return (
    <TemplateContext.Provider value={{ mode, setMode }}>
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  return useContext(TemplateContext)
}