"use client"

import { useTemplate } from "@/components/template-provider"
import { PixelPortfolio } from "@/components/pixel-portfolio"
import { ModernPortfolio } from "@/components/modern-portfolio"

export default function Home() {
  const { mode } = useTemplate()

  if (mode === "modern") {
    return <ModernPortfolio />
  }

  return <PixelPortfolio />
}