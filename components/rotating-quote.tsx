"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { QUOTES } from "@/lib/portfolio-data"

type RotatingQuoteProps = {
  variant?: "pixel" | "modern"
}

export function RotatingQuote({ variant = "modern" }: RotatingQuoteProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const isPixel = variant === "pixel"

  return (
    <div className={`absolute z-10 ${isPixel ? "-top-24 -right-32 md:-top-20 md:-right-48" : "-top-14 -right-18 md:-top-10 md:-right-32"}`}>
      <div
        className={isPixel ? "pixel-border px-3 py-2" : "rounded-2xl border px-4 py-3 shadow-lg"}
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border-color)" }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="max-w-[130px] text-[9px] leading-snug md:max-w-[190px] md:text-[11px]"
            style={{ color: "var(--foreground)", opacity: 0.9 }}
          >
            “{QUOTES[index]}”
          </motion.p>
        </AnimatePresence>
      </div>
      <div
        className={isPixel ? "-ml-1 h-3 w-3 rotate-45" : "-ml-1 h-3 w-3 rotate-45 rounded-[2px]"}
        style={{
          backgroundColor: "var(--background)",
          borderLeft: isPixel ? "4px solid var(--border-color)" : "1px solid var(--border-color)",
          borderBottom: isPixel ? "4px solid var(--border-color)" : "1px solid var(--border-color)",
          marginTop: isPixel ? "-8px" : "-7px",
        }}
      />
    </div>
  )
}
