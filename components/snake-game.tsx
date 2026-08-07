"use client"

import { useEffect, useRef, useState } from "react"

const GRID = 20

type Point = { x: number; y: number }

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
]

function randomFood(snake: Point[]): Point {
  let p: Point
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
  } while (snake.some((s) => s.x === p.x && s.y === p.y))
  return p
}

const KEY_DIRS: Record<string, Point> = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Point>({ x: 14, y: 10 })
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [running, setRunning] = useState(false)
  const dirRef = useRef<Point>(dir)
  const foodRef = useRef<Point>(food)
  const snakeRef = useRef<Point[]>(snake)
  dirRef.current = dir
  foodRef.current = food
  snakeRef.current = snake

  useEffect(() => {
    if (!running || gameOver) return
    const id = setInterval(() => {
      const prev = snakeRef.current
      const head = {
        x: prev[0].x + dirRef.current.x,
        y: prev[0].y + dirRef.current.y,
      }
      if (
        head.x < 0 || head.x >= GRID ||
        head.y < 0 || head.y >= GRID ||
        prev.some((s) => s.x === head.x && s.y === head.y)
      ) {
        setGameOver(true)
        return
      }
      const ate = head.x === foodRef.current.x && head.y === foodRef.current.y
      const next = [head, ...prev]
      if (ate) {
        setScore((s) => s + 1)
        const newFood = randomFood(next)
        foodRef.current = newFood
        setFood(newFood)
      } else {
        next.pop()
      }
      snakeRef.current = next
      setSnake(next)
    }, 140)
    return () => clearInterval(id)
  }, [running, gameOver])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const next = KEY_DIRS[e.key.toLowerCase()]
      if (!next) return
      e.preventDefault()
      const cur = dirRef.current
      if (next.x === -cur.x && next.y === -cur.y) return
      dirRef.current = next
      setDir(next)
      if (!running && !gameOver) setRunning(true)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [running, gameOver])

  const start = () => {
    setSnake(INITIAL_SNAKE)
    snakeRef.current = INITIAL_SNAKE
    const f = { x: 14, y: 10 }
    setFood(f)
    foodRef.current = f
    setDir({ x: 1, y: 0 })
    dirRef.current = { x: 1, y: 0 }
    setScore(0)
    setGameOver(false)
    setRunning(true)
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm md:text-base">SNG</h3>
        <div className="text-xs md:text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          SCORE: {score}
        </div>
      </div>

      <div
        className="w-full max-w-[320px] mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID}, 1fr)`,
          border: '4px solid var(--foreground)',
          backgroundColor: 'var(--background)',
        }}
      >
        {Array.from({ length: GRID * GRID }).map((_, i) => {
          const x = i % GRID
          const y = Math.floor(i / GRID)
          const isSnake = snake.some((s) => s.x === x && s.y === y)
          const isHead = snake.length > 0 && snake[0].x === x && snake[0].y === y
          const isFood = food.x === x && food.y === y
          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                backgroundColor: isSnake
                  ? 'var(--foreground)'
                  : isFood
                    ? '#ff0000'
                    : 'transparent',
                opacity: isHead ? 1 : isSnake ? 0.8 : 1,
              }}
            />
          )
        })}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        {gameOver && (
          <div className="text-sm md:text-base" style={{ color: '#ff0000' }}>
            GAME OVER_
          </div>
        )}
        <button
          onClick={start}
          className="pixel-btn px-6 py-3 text-xs md:text-sm"
        >
          {gameOver ? "PLAY AGAIN_" : running ? "RESTART_" : "START_"}
        </button>
        <p className="text-xs text-center" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
          ARROWS / WASD TO MOVE
        </p>
      </div>
    </div>
  )
}
