"use client"

import { FaGamepad, FaPalette } from "react-icons/fa"
import { useTemplate } from "./template-provider"

export function TemplateToggle({ variant = "pixel" }: { variant?: "pixel" | "modern" }) {
  const { mode, setMode } = useTemplate()

  if (variant === "modern") {
    return (
      <div
        className="flex items-center gap-1 rounded-full border p-1"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={() => setMode("pixel")}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] transition-colors"
          style={{
            backgroundColor: mode === "pixel" ? "var(--accent)" : "transparent",
            color: mode === "pixel" ? "#ffffff" : "var(--foreground)",
          }}
          aria-label="Switch to pixel template"
        >
          <FaGamepad />
          PIXEL
        </button>
        <button
          onClick={() => setMode("modern")}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] transition-colors"
          style={{
            backgroundColor: mode === "modern" ? "var(--accent)" : "transparent",
            color: mode === "modern" ? "#ffffff" : "var(--foreground)",
          }}
          aria-label="Switch to modern template"
        >
          <FaPalette />
          MODERN
        </button>
      </div>
    )
  }

  return (
    <div className="pixel-border flex items-center">
      <button
        onClick={() => setMode("pixel")}
        className="flex items-center gap-1 px-2 py-1 text-[9px] transition-colors"
        style={{
          backgroundColor: mode === "pixel" ? "var(--progress)" : "transparent",
          color: mode === "pixel" ? "var(--background)" : "var(--foreground)",
        }}
        aria-label="Switch to pixel template"
      >
        <FaGamepad />
        PIXEL
      </button>
      <button
        onClick={() => setMode("modern")}
        className="flex items-center gap-1 px-2 py-1 text-[9px] transition-colors"
        style={{
          backgroundColor: mode === "modern" ? "var(--progress)" : "transparent",
          color: mode === "modern" ? "var(--background)" : "var(--foreground)",
        }}
        aria-label="Switch to modern template"
      >
        <FaPalette />
        MODERN
      </button>
    </div>
  )
}