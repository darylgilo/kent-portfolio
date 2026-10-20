"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { FaArrowLeft, FaPlay, FaRedo, FaTerminal, FaEye, FaCode, FaBookOpen, FaFlask, FaChevronRight } from "react-icons/fa"
import {
  MODULE_CATEGORIES,
  PLAYGROUND_MODULES,
  lessonsForModule,
  modulesForCategory,
  type Lesson,
} from "@/lib/playground-data"

function ConsoleLine({ text, kind }: { text: string; kind: "log" | "error" }) {
  return (
    <div
      className="px-3 py-1.5 font-mono text-xs break-words"
      style={{ color: kind === "error" ? "#f87171" : "var(--foreground)" }}
    >
      <span style={{ color: "var(--muted)" }}>{"> "}</span>
      {text}
    </div>
  )
}

function ReactStateDemo() {
  const [count, setCount] = useState(0)
  return (
    <div
      className="flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 p-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <p className="font-mono text-sm" style={{ color: "var(--muted)" }}>
        Count: <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{count}</span>
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
      >
        Count: {count}
      </button>
      <p className="text-[11px]" style={{ color: "var(--muted)" }}>
        Click the button — setCount triggers a re-render.
      </p>
    </div>
  )
}

function buildPreviewDoc(code: string, captureConsole: boolean, inject?: string): string {
  const hook = captureConsole
    ? "<script>(function(){function s(k,a){try{var t=a.map(function(x){if(typeof x==='object'){try{return JSON.stringify(x)}catch(e){return String(x)}}return String(x)}).join(' ');parent.postMessage({type:'playground-console',kind:k,text:t},'*')}catch(e){}}var l=console.log,e=console.error;console.log=function(){s('log',Array.prototype.slice.call(arguments));return l.apply(console,arguments)};console.error=function(){s('error',Array.prototype.slice.call(arguments));return e.apply(console,arguments)};window.addEventListener('error',function(ev){s('error',[ev.message])})})();</script>"
    : ""
  // Optional stand-in for a CDN library (e.g. axios) injected before the lesson code.
  const lib = inject ?? ""
  if (/<html|<!doctype/i.test(code)) {
    return code.replace(/<head[^>]*>/i, (m) => m + hook + lib)
  }
  return "<!DOCTYPE html><html><head><meta charset=\"utf-8\" />" + hook + lib + "</head><body>" + code + "</body></html>"
}

type SidebarNode =
  | { kind: "lesson"; lesson: Lesson }
  | { kind: "group"; label: string; lessons: Lesson[] }

/**
 * Flattens a module's lessons into sidebar rows: plain lessons stay as-is, and
 * lessons sharing a `group` field become ONE group row (rendered as a collapsible
 * dropdown) placed at the position of the first member.
 */
function buildSidebarNodes(lessons: Lesson[]): SidebarNode[] {
  const nodes: SidebarNode[] = []
  const groupIndex = new Map<string, number>()
  for (const lesson of lessons) {
    if (!lesson.group) {
      nodes.push({ kind: "lesson", lesson })
      continue
    }
    const existing = groupIndex.get(lesson.group)
    if (existing !== undefined) {
      const node = nodes[existing]
      if (node.kind === "group") node.lessons.push(lesson)
    } else {
      groupIndex.set(lesson.group, nodes.length)
      nodes.push({ kind: "group", label: lesson.group, lessons: [lesson] })
    }
  }
  return nodes
}

export function PlaygroundPage() {
  const [moduleId, setModuleId] = useState("html")
  const lessons = useMemo(() => lessonsForModule(moduleId), [moduleId])
  const [lessonId, setLessonId] = useState<string>(lessons[0]?.id ?? "")
  const lesson: Lesson | undefined =
    lessons.find((l) => l.id === lessonId) ?? lessons[0]

  const [code, setCode] = useState(lesson?.code ?? "")
  const [runToken, setRunToken] = useState(0)
  const [logs, setLogs] = useState<{ text: string; kind: "log" | "error" }[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const renderLessonBtn = (l: Lesson, nested: boolean) => (
    <button
      key={l.id}
      onClick={() => selectLesson(l.id)}
      className={`block w-full py-3 text-left text-sm ${nested ? "pl-8 pr-4" : "px-4"}`}
      style={{
        borderLeft: l.id === lessonId ? "3px solid var(--accent)" : "3px solid transparent",
        backgroundColor: l.id === lessonId ? "var(--card-hover)" : "transparent",
      }}
    >
      <span className="font-semibold">{l.title}</span>
      <span className="block text-xs" style={{ color: "var(--muted)" }}>{l.description}</span>
    </button>
  )

  const renderNode = (node: SidebarNode) => {
    if (node.kind === "lesson") return renderLessonBtn(node.lesson, false)
    const gkey = `${moduleId}:${node.label}`
    const isOpen = openGroups[gkey] ?? true
    const activeInside = node.lessons.some((l) => l.id === lessonId)
    return (
      <div key={gkey} className="pt-1">
        <button
          onClick={() => setOpenGroups((prev) => ({ ...prev, [gkey]: !(prev[gkey] ?? true) }))}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold tracking-widest transition-colors hover:bg-white/5"
          style={{ color: "var(--accent)" }}
          aria-expanded={isOpen}
        >
          <FaChevronRight className="transition-transform" style={{ transform: isOpen ? "rotate(90deg)" : "none" }} />
          <span>{node.label.toUpperCase()}</span>
          {activeInside && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />}
          <span className="ml-auto font-mono text-[10px]" style={{ color: "var(--muted)" }}>
            {node.lessons.length}
          </span>
        </button>
        {isOpen && (
          <div className="ml-3 space-y-1 border-l pl-2" style={{ borderColor: "var(--border-color)" }}>
            {node.lessons.map((l) => (
              <div key={l.id}>{renderLessonBtn(l, true)}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  useEffect(() => {
    const first = lessonsForModule(moduleId)[0]
    setLessonId(first?.id ?? "")
    setCode(first?.code ?? "")
    setLogs([])
  }, [moduleId])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { type?: string; kind?: "log" | "error"; text?: string }
      if (data?.type === "playground-console" && typeof data.text === "string") {
        setLogs((prev) => [...prev, { text: data.text as string, kind: data.kind ?? "log" }])
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  useEffect(() => {
    if (!lesson) return
    if (lesson.previewType === "html" || lesson.previewType === "css") {
      setRunToken((t) => t + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, lesson?.id])

  const activeModule = PLAYGROUND_MODULES.find((m) => m.id === moduleId)
  const activeCategoryId = activeModule?.category ?? MODULE_CATEGORIES[0].id
  const isLive = lesson?.previewType === "html" || lesson?.previewType === "css"
  const isJS = lesson?.previewType === "javascript"
  const isReactDemo = lesson?.previewType === "react"

  const previewDoc = useMemo(() => {
    if (!lesson || (!isLive && !isJS)) return ""
    return buildPreviewDoc(code, isJS, lesson.previewInject)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, lesson?.id, runToken])

  function selectLesson(id: string) {
    const next = lessons.find((l) => l.id === id)
    if (!next) return
    setLessonId(id)
    setCode(next.code)
    setLogs([])
    setSidebarOpen(false)
  }

  function handleRun() {
    setLogs([])
    setRunToken((t) => t + 1)
  }

  function handleReset() {
    if (!lesson) return
    setCode(lesson.code)
    setLogs([])
    setRunToken((t) => t + 1)
  }

  function handleTabKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return
    e.preventDefault()
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = code.slice(0, start) + "  " + code.slice(end)
    setCode(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2
    })
  }

  const lineCount = code.split("\n").length


  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            aria-label="Back to portfolio"
            className="flex items-center justify-center rounded-full p-2 transition-transform hover:scale-105"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <FaArrowLeft className="text-[10px]" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold md:text-base">DEV Playground</h1>
            <p className="hidden text-[11px] sm:block" style={{ color: "var(--muted)" }}>
              Explanation - Code - Live Preview - Experiment - Reset
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {MODULE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (c.id === activeCategoryId) return
                  const first = modulesForCategory(c.id)[0]
                  if (first) setModuleId(first.id)
                }}
                className="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-widest transition-all hover:scale-105"
                style={
                  c.id === activeCategoryId
                    ? { backgroundColor: "var(--card-hover)", border: "1px solid transparent", color: "var(--accent)" }
                    : { backgroundColor: "var(--card)", border: "1px solid var(--border-color)", color: "var(--muted)" }
                }
              >
                {c.label.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {modulesForCategory(activeCategoryId).map((m) => (
              <button
                key={m.id}
                onClick={() => setModuleId(m.id)}
                className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                style={
                  m.id === moduleId
                    ? { background: "linear-gradient(90deg, var(--accent), var(--accent-2))", color: "#fff" }
                    : { backgroundColor: "var(--card)", border: "1px solid var(--border-color)", color: "var(--muted)" }
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}
          >
            <span className="flex items-center gap-2">
              <FaBookOpen style={{ color: "var(--accent)" }} />
              {lesson?.title ?? "Lessons"}
            </span>
            <span style={{ color: "var(--muted)" }}>{sidebarOpen ? "hide" : "show"}</span>
          </button>
          {sidebarOpen && (
            <div className="mt-2 overflow-hidden rounded-xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}>
              <div className="max-h-[70vh] overflow-y-auto py-1">
                {buildSidebarNodes(lessons).map((node) => renderNode(node))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="hidden self-start overflow-hidden rounded-2xl lg:block" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
              <p className="text-[10px] font-bold tracking-widest" style={{ color: "var(--accent)" }}>
                {activeModule?.label.toUpperCase()} LESSONS
              </p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto py-1">
              {buildSidebarNodes(lessons).map((node) => renderNode(node))}
            </div>
          </aside>

          <div className="min-w-0 space-y-4">
            {lesson && (
              <section className="rounded-2xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}>
                    {activeModule?.label.toUpperCase()}
                  </span>
                  {lesson.topics.map((t) => (
                    <span key={t} className="rounded-full px-2.5 py-1 font-mono text-[10px]" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)", color: "var(--muted)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-bold md:text-xl">{lesson.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {lesson.explanation}
                </p>
                {lesson.sections && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] font-bold tracking-widest" style={{ color: "var(--accent)" }}>
                      CORE CONCEPTS
                    </p>
                    {lesson.sections.map((s) => (
                      <details
                        key={s.title}
                        className="group overflow-hidden rounded-xl"
                        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)" }}
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                          <span>{s.title}</span>
                          <span
                            className="transition-transform group-open:rotate-180"
                            style={{ color: "var(--accent)" }}
                            aria-hidden="true"
                          >
                            ▾
                          </span>
                        </summary>
                        <p
                          className="whitespace-pre-line px-4 pb-3 pt-1 text-xs leading-relaxed"
                          style={{ color: "var(--muted)" }}
                        >
                          {s.content}
                        </p>
                      </details>
                    ))}
                  </div>
                )}
              </section>
            )}


            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <section className="flex flex-col overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <FaCode className="text-xs" style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold">CODE EDITOR</span>
                  <span className="ml-1 rounded px-2 py-0.5 font-mono text-[10px]" style={{ backgroundColor: "var(--background)", color: "var(--muted)" }}>
                    {lesson?.language}
                  </span>
                  <div className="ml-auto flex gap-2">
                    {isJS && (
                      <button
                        onClick={handleRun}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white transition-transform hover:scale-105"
                        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
                      >
                        <FaPlay className="text-[9px]" /> Run
                      </button>
                    )}
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-transform hover:scale-105"
                      style={{ border: "1px solid var(--border-color)", color: "var(--muted)" }}
                    >
                      <FaRedo className="text-[9px]" /> Reset
                    </button>
                  </div>
                </div>
                <div className="flex flex-1">
                  <div className="select-none px-3 py-3 text-right font-mono text-[11px] leading-6" style={{ color: "var(--muted)", backgroundColor: "var(--background)" }} aria-hidden="true">
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleTabKey}
                    spellCheck={false}
                    className="min-h-[320px] w-full flex-1 resize-y bg-transparent p-3 font-mono text-xs leading-6 outline-none"
                    style={{ color: "var(--foreground)" }}
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 text-[11px]" style={{ borderTop: "1px solid var(--border-color)", color: "var(--muted)" }}>
                  <FaFlask className="text-[10px]" />
                  {isLive ? "Live — preview updates as you type." : isJS ? "Press Run to execute." : "Study lesson — reset restores the example."}
                </div>
              </section>


              <section className="flex flex-col overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <FaEye className="text-xs" style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold">LIVE PREVIEW</span>
                </div>
                {isReactDemo ? (
                  <ReactStateDemo />
                ) : lesson?.previewType === "static" ? (
                  <div className="flex-1 space-y-4 p-5">
                    {lesson?.sampleTable && (
                      <div>
                        <p className="mb-2 text-[11px] font-bold tracking-widest" style={{ color: "var(--muted)" }}>SAMPLE TABLE</p>
                        <table className="w-full text-xs" style={{ border: "1px solid var(--border-color)" }}>
                          <thead>
                            <tr style={{ backgroundColor: "var(--background)" }}>
                              {lesson.sampleTable.headers.map((h) => (
                                <th key={h} className="px-3 py-2 text-left font-bold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {lesson.sampleTable.rows.map((row, i) => (
                              <tr key={i} style={{ borderTop: "1px solid var(--border-color)" }}>
                                {row.map((cell, j) => (
                                  <td key={j} className="px-3 py-2 font-mono">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {lesson?.expectedOutput && (
                      <div>
                        <p className="mb-2 text-[11px] font-bold tracking-widest" style={{ color: "var(--muted)" }}>EXPECTED OUTPUT</p>
                        <pre className="whitespace-pre-wrap rounded-lg p-4 font-mono text-xs leading-relaxed" style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)" }}>
                          {lesson.expectedOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[320px] flex-1">
                    <iframe
                      key={(lesson?.id ?? "none") + "-" + runToken}
                      title="Live preview"
                      sandbox="allow-scripts"
                      srcDoc={previewDoc}
                      className="h-full w-full"
                      style={{ backgroundColor: "#ffffff" }}
                    />
                  </div>
                )}
              </section>
            </div>


            {isJS && (
              <section className="overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}>
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <FaTerminal className="text-xs" style={{ color: "var(--accent)" }} />
                  <span className="text-xs font-bold">CONSOLE / OUTPUT</span>
                  {logs.length > 0 && (
                    <button onClick={() => setLogs([])} className="ml-auto text-[11px] font-semibold hover:opacity-70" style={{ color: "var(--muted)" }}>
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-40 min-h-[64px] overflow-y-auto py-1">
                  {logs.length === 0 ? (
                    <p className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted)" }}>
                      No output yet — press Run, or click the button in the preview.
                    </p>
                  ) : (
                    logs.map((log, i) => <ConsoleLine key={i} text={log.text} kind={log.kind} />)
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

