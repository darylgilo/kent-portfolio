"use client"

import { useRef, useState, type ReactNode } from "react"
import type {
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
} from "react"
import type { Certificate } from "@/lib/portfolio-data"

type CertificateCarouselProps = {
  certificates: Certificate[]
  renderCard: (certificate: Certificate) => ReactNode
  className?: string
}

const DRAG_THRESHOLD = 6
const IDLE_MS = 120
const BASE_SPEED = 900
const MAX_SPEED = 3200
const ACCELERATION = 1400

type DragState = {
  active: boolean
  startX: number
  baseOffset: number
  offset: number
  maxDrag: number
  animStart: number
  moved: boolean
  suppressClick: boolean
  dir: -1 | 0 | 1
  holdTime: number
  lastMoveTime: number
}

export function CertificateCarousel({ certificates, renderCard, className = "" }: CertificateCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState>({
    active: false,
    startX: 0,
    baseOffset: 0,
    offset: 0,
    maxDrag: 0,
    animStart: 0,
    moved: false,
    suppressClick: false,
    dir: 0,
    holdTime: 0,
    lastMoveTime: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  function clampOffset(state: DragState, value: number) {
    if (state.maxDrag <= 0) return value
    let v = value
    while (v < -state.maxDrag) v += state.maxDrag
    while (v > -state.animStart) v -= state.maxDrag
    return v
  }

  function applyOffset(state: DragState) {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(${state.offset}px)`
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return
    const track = trackRef.current
    if (!track) return

    const state = drag.current
    state.active = true
    state.moved = false
    state.suppressClick = false
    state.startX = e.clientX
    state.baseOffset = state.offset
    state.maxDrag = track.scrollWidth / 2
    state.dir = 0
    state.holdTime = 0
    state.lastMoveTime = 0
    const transform = getComputedStyle(track).transform
    state.animStart = transform && transform !== "none" ? new DOMMatrix(transform).m41 : 0

    let lastFrame = 0
    let rafId = 0

    const tick = (now: number) => {
      if (!state.active || !state.moved) return
      const dt = Math.min(0.05, (now - lastFrame) / 1000)
      lastFrame = now
      if (now - state.lastMoveTime > IDLE_MS && state.dir !== 0) {
        state.holdTime += dt
        const speed = Math.min(MAX_SPEED, BASE_SPEED + state.holdTime * ACCELERATION)
        state.offset = clampOffset(state, state.offset + state.dir * speed * dt)
        applyOffset(state)
      }
      rafId = requestAnimationFrame(tick)
    }

    const onMove = (ev: PointerEvent) => {
      if (!state.active) return
      const dx = ev.clientX - state.startX
      if (!state.moved && Math.abs(dx) > DRAG_THRESHOLD) {
        state.moved = true
        setIsDragging(true)
        lastFrame = performance.now()
        rafId = requestAnimationFrame(tick)
      }
      if (!state.moved) return
      state.lastMoveTime = performance.now()
      if (Math.abs(dx) > 2) state.dir = dx > 0 ? 1 : -1
      state.offset = clampOffset(state, state.baseOffset + dx)
      applyOffset(state)
    }

    const onUp = () => {
      state.active = false
      cancelAnimationFrame(rafId)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      if (state.moved) {
        state.suppressClick = true
        setIsDragging(false)
      }
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  function handleClickCapture(e: ReactMouseEvent<HTMLDivElement>) {
    if (drag.current.suppressClick) {
      drag.current.suppressClick = false
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div
      ref={containerRef}
      className={`cert-carousel ${isDragging ? "is-dragging" : ""} ${className}`}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
    >
      <div ref={wrapperRef} className="cert-carousel-drag">
        <div ref={trackRef} className="cert-carousel-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="cert-carousel-group" aria-hidden={copy === 1}>
              {certificates.map((certificate) => (
                <div key={`${copy}-${certificate.name}`} className="h-full flex">{renderCard(certificate)}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}