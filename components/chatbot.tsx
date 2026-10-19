"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactElement } from "react"
import dynamic from "next/dynamic"
import "./CrystalizedBall.css"
import ScorpioBackground from "./ScorpioBackground"
import { Lottie } from "lottie-react"
import { FaRobot, FaPaperPlane, FaTimes, FaSmile, FaVolumeUp, FaVolumeOff, FaMicrophone, FaRedo } from "react-icons/fa"

type CrystalizedBallProps = {
  preset?: string
  theme?: "dark" | "light"
  size?: number
  glow?: number
  sparks?: number
  crackle?: number
  speed?: number
  dustSpeed?: number
  sway?: number
  twinkle?: number
  haze?: number
  interactive?: boolean
  hoverStrength?: number
  className?: string
  style?: CSSProperties
}

// WebGL ball is client-only; lazy-load so the first paint stays light.
const CrystalizedBall = dynamic(() => import("./CrystalizedBall"), {
  ssr: false,
}) as unknown as (props: CrystalizedBallProps) => ReactElement

function LottiePlayer({
  animationData,
  className,
}: {
  animationData: object
  className?: string
}) {
  return <Lottie src={animationData} loop={true} autoplay={true} className={className} />
}

function ChatBotIcon() {
  const [animationData, setAnimationData] = useState<object | null>(null)
  useEffect(() => {
    fetch("/lottie/robot.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setAnimationData(data))
      .catch(() => {})
  }, [])
  if (!animationData) {
    return <span className="text-xl text-white"><FaRobot /></span>
  }
  return (
    <LottiePlayer animationData={animationData} className="h-24 w-24" />
  )
}

type Message = {
  from: "user" | "bot"
  text: string
}

// ---------------------------------------------------------------------------
// Voice input: record the mic with MediaRecorder, then transcribe server-side
// with Groq Whisper (see /api/transcribe). The Web Speech API's tiny server
// models mangled Filipino/Taglish speech — Whisper handles both natively.
// ---------------------------------------------------------------------------

/** Recorder MIME types, best first — MediaRecorder picks the first supported. */
const RECORDER_MIME_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]

function pickRecorderMime(): string | undefined {
  if (typeof window === "undefined" || !("MediaRecorder" in window)) return undefined
  return RECORDER_MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t))
}

/** ISO 639-1 language Whisper detected for the latest clip ("tl"/"en"). */
type DetectedLang = "tl" | "en"

/** Bars in the circular audio visualizer around the SCORPI orb. Dense,
 *  needle-like, with a stable random amplitude/phase per bar so the ring
 *  takes on an organic flower silhouette while the AI speaks. */
const VIS_BAR_COUNT = 120

/** Bar color — the original soft blue of the HUD, one shade brighter. */
const VIS_BAR_COLOR = "#bfdbfe"

/** Deterministic pseudo-random helpers (same result every render). */
function visRand(i: number, seed: number): number {
  const r = Math.abs(Math.sin(i * seed) * 43758.5453)
  return r - Math.floor(r)
}

/** Per-bar length hierarchy: some needles are long, most mid, some short. */
const VIS_BAR_AMP = Array.from({ length: VIS_BAR_COUNT }, (_, i) => 0.3 + 0.7 * visRand(i + 1, 12.9898))
/** Per-bar motion phase so each needle bobs out of sync with its neighbours. */
const VIS_BAR_PHASE = Array.from(
  { length: VIS_BAR_COUNT },
  (_, i) => visRand(i + 1, 78.233) * Math.PI * 2
)

/** Point on a circle centered at (100,100) — angle in degrees, 0 = right. */
function hudPoint(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]
}

/** SVG arc path from angle a1 to a2 (degrees) on radius r around (100,100). */
function hudArc(a1: number, a2: number, r: number): string {
  const [x1, y1] = hudPoint(a1, r)
  const [x2, y2] = hudPoint(a2, r)
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

/** Turn chat text ("> " bullets, ALL CAPS, newlines) into speakable sentences. */
function stripForSpeech(text: string): string {
  return text
    .replace(/^>\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
}

let premiumAudio: HTMLAudioElement | null = null
let activeUtterance: SpeechSynthesisUtterance | null = null
// Monotonic token for "who may currently make sound". Every new reply (or
// explicit stop) bumps it; async TTS steps compare their captured value
// and bail when superseded — two voices can never overlap or follow each
// other from stale requests.
let ttsGeneration = 0

/** Subscribers notified when free (browser) TTS starts/stops. Used for SCORPI visuals. */
const ttsBoundaryListeners = new Set<() => void>()
const premiumListeners = new Set<() => void>()

function notifyTtsStart() {
  ttsBoundaryListeners.forEach((fn) => fn())
}
function notifyPremiumChange() {
  premiumListeners.forEach((fn) => fn())
}

/** True while an ElevenLabs reply is currently playing. */
function isPremiumPlaying(): boolean {
  return premiumAudio !== null
}

/**
 * Live 0..1 level of the ElevenLabs reply, sampled from the actual
 * playback audio via an AnalyserNode. Null when no analyser is attached
 * (browser TTS path or audio not started yet).
 */
let premiumAnalyser: AnalyserNode | null = null
let premiumAudioCtx: AudioContext | null = null
let premiumTimeData: Uint8Array<ArrayBuffer> | null = null

function samplePremiumLevel(): number | null {
  if (!premiumAnalyser || !premiumTimeData) return null
  premiumAnalyser.getByteTimeDomainData(premiumTimeData)
  let sum = 0
  for (let i = 0; i < premiumTimeData.length; i++) {
    const v = (premiumTimeData[i] - 128) / 128
    sum += v * v
  }
  const rms = Math.sqrt(sum / premiumTimeData.length)
  // ElevenLabs speech RMS typically lands around 0.02-0.25.
  return Math.max(0, Math.min(1, (rms - 0.015) / 0.235))
}

function teardownPremiumAnalyser() {
  premiumAnalyser = null
  premiumTimeData = null
  if (premiumAudioCtx) {
    void premiumAudioCtx.close().catch(() => {})
    premiumAudioCtx = null
  }
}

/** Attach a Web Audio analyser to the reply so the orb can react to real voice. */
function attachPremiumAnalyser(audio: HTMLAudioElement) {
  teardownPremiumAnalyser()
  try {
    const w = window as unknown as {
      AudioContext?: typeof AudioContext
      webkitAudioContext?: typeof AudioContext
    }
    const Ctx = w.AudioContext ?? w.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const src = ctx.createMediaElementSource(audio)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    src.connect(analyser)
    analyser.connect(ctx.destination)
    premiumAudioCtx = ctx
    premiumAnalyser = analyser
    premiumTimeData = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
    void ctx.resume().catch(() => {})
  } catch {
    teardownPremiumAnalyser()
  }
}

/**
 * Resolves when audible reply playback has actually started (or
 * definitively failed). Lets SCORPI wait for real audio instead of
 * guessing with a fixed timer — the old race left it stranded at READY.
 */
let replyResolve: (() => void) | null = null

function waitForReplyStart(): Promise<void> {
  // Guard against the race where playback began before this promise was
  // created — resolve immediately instead of losing the signal forever.
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    window.speechSynthesis.speaking
  ) {
    return Promise.resolve()
  }
  if (isPremiumPlaying()) return Promise.resolve()
  return new Promise((resolve) => {
    replyResolve = resolve
  })
}

function signalReplyStarted() {
  replyResolve?.()
  replyResolve = null
}

/** React hook: true while the bot is audibly speaking (browser or premium voice). */
function useSpeaking(): boolean {
  const [speaking, setSpeaking] = useState(false)
  useEffect(() => {
    const sync = () => setSpeaking(window.speechSynthesis.speaking || isPremiumPlaying())
    const id = window.setInterval(sync, 250)
    const onBoundary = () => setSpeaking(true)
    ttsBoundaryListeners.add(onBoundary)
    premiumListeners.add(sync)
    return () => {
      window.clearInterval(id)
      ttsBoundaryListeners.delete(onBoundary)
      premiumListeners.delete(sync)
    }
  }, [])
  return speaking
}

function pickVoice(preferredPrefix = "en"): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null
  // Prefer a local voice for the requested language ("fil" for Filipino),
  // then any voice for it, then fall back to English.
  return (
    voices.find(
      (v) => v.lang.toLowerCase().startsWith(preferredPrefix) && v.localService
    ) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(preferredPrefix)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en") && v.localService) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    null
  )
}

function speak(text: string, gen: number, lang: DetectedLang = "en") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    signalReplyStarted()
    return
  }
  const clean = stripForSpeech(text)
  if (!clean) {
    signalReplyStarted()
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(clean)
  // Match the reply voice to the DETECTED mic language — a Filipino voice
  // reads Tagalog text far better than an English one (and vice versa).
  const voice = pickVoice(lang === "tl" ? "fil" : "en")
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? (lang === "tl" ? "fil-PH" : "en-PH")
  activeUtterance = utterance
  utterance.onstart = () => {
    // A newer reply superseded this one — never let two voices overlap.
    if (gen !== ttsGeneration) {
      window.speechSynthesis.cancel()
      return
    }
    notifyTtsStart()
    signalReplyStarted()
  }
  utterance.onend = () => {
    if (activeUtterance === utterance) activeUtterance = null
  }
  utterance.onerror = () => {
    if (activeUtterance === utterance) activeUtterance = null
    // TTS definitively failed — unblock the resume poll instead of
    // leaving SCORPI stranded at READY.
    signalReplyStarted()
  }
  window.speechSynthesis.speak(utterance)
}

function stopPremiumAudio() {
  try {
    premiumAudio?.pause()
  } catch {
    // ignore
  }
  premiumAudio = null
}

function stopSpeaking() {
  ttsGeneration++
  activeUtterance = null
  stopPremiumAudio()
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
  notifyPremiumChange()
}

/**
 * Try the premium AI voice via our server proxy (ElevenLabs, falling back
 * to Fish Audio server-side). The clip is played PROGRESSIVELY through
 * MediaSource so speech starts as soon as the first audio chunk arrives
 * instead of waiting for the whole file to download.
 * Returns true when audio actually started playing, false when the
 * caller should fall back to the free browser voice (no key, quota
 * used up, network issue, or autoplay blocked).
 */
async function speakPremium(text: string, gen: number): Promise<boolean> {
  if (typeof window === "undefined") return false
  const clean = stripForSpeech(text).slice(0, 600)
  if (!clean) return false
  let audio: HTMLAudioElement | null = null
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  try {
    const res = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean }),
    })
    // Superseded while the clip was generating — a newer reply owns the
    // speakers now; bail before this stale voice can join in.
    if (gen !== ttsGeneration) return false
    if (!res.ok || !res.body) return false

    const canStream =
      typeof MediaSource !== "undefined" && MediaSource.isTypeSupported("audio/mpeg")

    let url: string
    if (canStream) {
      // Progressive path: feed incoming chunks into a MediaSource so
      // playback starts with the first ~seconds of audio.
      const ms = new MediaSource()
      url = URL.createObjectURL(ms)
      audio = new Audio(url)
      reader = res.body.getReader()
      ms.addEventListener(
        "sourceopen",
        () => {
          try {
            const sb = ms.addSourceBuffer("audio/mpeg")
            const pump = async () => {
              try {
                for (;;) {
                  const { done, value } = await reader?.read() ?? { done: true, value: undefined }
                  if (done) {
                    if (sb.updating) {
                      await new Promise<void>((r) =>
                        sb.addEventListener("updateend", () => r(), { once: true })
                      )
                    }
                    if (ms.readyState === "open") ms.endOfStream()
                    return
                  }
                  if (!value) continue
                  sb.appendBuffer(value as BufferSource)
                  await new Promise<void>((r) =>
                    sb.addEventListener("updateend", () => r(), { once: true })
                  )
                }
              } catch {
                // Stream cancelled or append failed — close what we have so
                // playback can finish the already-buffered portion cleanly.
                try {
                  if (ms.readyState === "open") ms.endOfStream()
                } catch {
                  // ignore
                }
              }
            }
            void pump()
          } catch {
            try {
              if (ms.readyState === "open") ms.endOfStream()
            } catch {
              // ignore
            }
          }
        },
        { once: true }
      )
    } else {
      // Older browsers without MediaSource: buffer the whole clip first.
      const blob = await res.blob()
      if (gen !== ttsGeneration) return false
      url = URL.createObjectURL(blob)
      audio = new Audio(url)
    }

    premiumAudio = audio
    notifyPremiumChange()
    attachPremiumAnalyser(audio)
    const release = () => {
      void reader?.cancel().catch(() => {})
      URL.revokeObjectURL(url)
      if (premiumAudio === audio) premiumAudio = null
      teardownPremiumAnalyser()
      notifyPremiumChange()
    }
    audio.onended = release
    audio.onerror = release
    await audio.play()
    if (gen !== ttsGeneration) {
      // Superseded as playback was starting — cut this voice off so only
      // the newest reply is ever heard.
      try {
        audio.pause()
      } catch {
        // ignore
      }
      release()
      return false
    }
    signalReplyStarted()
    return true
  } catch {
    // play() rejected (e.g. autoplay blocked): clear the leaked handle or
    // isPremiumPlaying() stays true forever and SCORPI strands at READY.
    void reader?.cancel().catch(() => {})
    if (audio && premiumAudio === audio) {
      try {
        audio.pause()
      } catch {
        // ignore
      }
      premiumAudio = null
    }
    teardownPremiumAnalyser()
    notifyPremiumChange()
    // Definitive failure — unblock the resume poll; caller falls back to
    // the browser voice which signals its own start.
    signalReplyStarted()
    return false
  }
}

async function speakReply(text: string, lang: DetectedLang = "en") {
  // Exactly ONE voice may ever be audible: stop whatever is playing, claim
  // the latest-generation token, and let every async step check it. This
  // kills the double-voice race where a stale ElevenLabs clip and the
  // browser fallback (or two clips) played over each other.
  stopSpeaking()
  const gen = ++ttsGeneration
  // Prefer the ElevenLabs AI voice when it's configured; fall back to the
  // free built-in browser voice only on genuine failure — never when this
  // reply was simply superseded by a newer one.
  const played = await speakPremium(text, gen)
  if (played) return
  if (gen !== ttsGeneration) return
  speak(text, gen, lang)
}

const PROJECTS = [
  "GEOLOCATION APP — Location tracking and mapping application",
  "TASKBOARD SYSTEM APP — Task and project management board",
  "INVENTORY APP — Stock and inventory tracking system",
  "WRITEUP APP — Document writing and editing tool",
  "BUDGET MANAGEMENT APP — Financial planning and budget tracking",
  "NOTICEBOARD APP — Digital announcement and notice system",
  "WHEREABOUTS APP — Attendance and location tracking system",
  "AI RESEARCH ASSISTANT APP — AI-powered research and information assistant",
]

const SKILLS = [
  "FULL STACK WEB DEVELOPER — 85%",
  "GRAPHIC DESIGNER — 85%",
  "SYSADMIN — 80%",
  "CLOUD ENGINEER — 80%",
  "UI/UX DESIGNER — 80%",
  "MULTIMEDIA EDITOR — 80%",
]

const TECHNOLOGIES = [
  "Frameworks: LARAVEL, REACT NATIVE, NEXT JS, TAILWIND CSS",
  "Languages: JAVASCRIPT, TYPESCRIPT, PHP, SQL",
  "Libraries: REACT JS",
  "Databases: POSTGRESQL, SQL",
  "Servers: WINDOWS SERVER, LINUX SERVER",
  "Platforms: VERCEL, LARAVEL CLOUD, FIREBASE, AWS, GIT/GITHUB, CLOUDFLARE",
  "DevOps: DOCKER",
  "Also: AI/ML",
]

type Intent = {
  keywords: string[]
  answer: string
  priority?: number
}

const INTENTS: Intent[] = [
  {
    keywords: ["your name", "who are you", "are you", "what is your name", "scorpi"],
    priority: 5,
    answer: "I AM SCORPI, THE PERSONAL AI ASSISTANT OF MY MASTER, KENT DARYL GILO.",
  },
  {
    keywords: ["who made", "who created", "who built", "who developed", "creator", "maker", "made you", "created you", "built you", "sino gumawa", "gumawa sayo", "gumawa sa", "lumikha", "nag gawa", "nag-gawa", "gumawa"],
    priority: 5,
    answer:
      "MY MASTER IS KENT DARYL GILO. HE CREATED ME AS HIS PERSONAL AI ASSISTANT FOR HIS PORTFOLIO.",
  },
  {
    keywords: ["where", "from", "live", "lives", "location", "address", "taga saan", "taga-saan", "taga", "saan", "lugar", "capul", "samar"],
    priority: 4,
    answer: "HE LIVES IN ISLAND OF CAPUL, NORTHERN SAMAR PHILLIPINES.",
  },
  {
    keywords: ["hi", "hello", "hey", "kamusta", "kumusta"],
    answer:
      "HELLO,! I AM SCORPI, DARYL GILO'S PERSONAL AI ASSISTANT. ASK ME ABOUT HIS SKILLS, PROJECTS, TECHNOLOGIES, OR HOW TO CONTACT HIM.",
  },
  {
    keywords: ["name", "who", "kent", "daryl", "gilo", "about", "you"],
    priority: 1,
    answer:
      "THIS PORTFOLIO BELONGS TO MY MASTER, KENT DARYL M. GILO — A FULL STACK DEVELOPER. HE'S A TECHNOLOGIST WEARING MANY HATS AS A DEVOPS, CLOUD ENGINEER, AND MOBILE DEVELOPER.",
  },
  {
    keywords: ["skill", "expertise", "expert", "stack", "what can"],
    answer: `HERE ARE KENT'S SKILLS:\n${SKILLS.map((s) => "> " + s).join("\n")}`,
  },
  {
    keywords: ["technology", "tech", "tools", "language", "framework", "stack", "database"],
    answer: `HERE ARE THE TECHNOLOGIES KENT WORKS WITH:\n${TECHNOLOGIES.map((t) => "> " + t).join("\n")}`,
  },
  {
    keywords: ["project", "portfolio", "work", "apps", "application", "built", "made", "create", "created"],
    answer: `HERE ARE SOME PROJECTS BY KENT:\n${PROJECTS.map((p) => "> " + p).join("\n")}`,
  },
  {
    keywords: ["geolocation", "location", "tracking", "map"],
    answer:
      "THE GEOLOCATION APP IS A LOCATION TRACKING AND MAPPING APPLICATION BUILT BY KENT. IT'S GREAT FOR FOLLOWING WHEREABOUTS AND PLOTTING POSITIONS ON A MAP.",
  },
  {
    keywords: ["taskboard", "task", "board", "kanban"],
    answer:
      "THE TASKBOARD SYSTEM APP IS A TASK AND PROJECT MANAGEMENT BOARD — PERFECT FOR ORGANIZING TASKS, TEAM WORKFLOWS, AND PROJECT PROGRESS.",
  },
  {
    keywords: ["inventory"],
    answer:
      "THE INVENTORY APP IS A STOCK AND INVENTORY TRACKING SYSTEM — IT HELPS KEEP TRACK OF PRODUCTS, QUANTITIES, AND SUPPLY LEVELS.",
  },
  {
    keywords: ["budget", "finance", "financial", "money"],
    answer:
      "THE BUDGET MANAGEMENT APP HANDLES FINANCIAL PLANNING AND BUDGET TRACKING — IDEAL FOR MANAGING INCOME, EXPENSES, AND SAVINGS GOALS.",
  },
  {
    keywords: ["ai", "research", "assistant", "ml"],
    answer:
      "KENT BUILT AN AI RESEARCH ASSISTANT APP — AN AI-POWERED TOOL THAT HELPS WITH RESEARCH AND INFORMATION GATHERING. HE ALSO LISTS AI/ML AMONG HIS TECHNOLOGIES.",
  },
  {
    keywords: ["disability", "pwd", "inclusion", "diversity", "inspir", "quote"],
    answer:
      "KENT IS A PWD (PERSON WITH DISABILITY) AND BELIEVES DIVERSITY AND INCLUSION MAKE US STRONGER. HIS MANTRA: \"MY DISABILITY MAY SHAPE MY JOURNEY, BUT IT DOES NOT DEFINE MY DESTINATION. WITH TECHNOLOGY AS MY TOOL AND DETERMINATION AS MY STRENGTH, I CAN TURN CHALLENGES INTO POSSIBILITIES AND DREAMS INTO REALITY.\"",
  },
  {
    keywords: ["contact", "email", "reach", "hire", "connect", "message", "work with"],
    priority: 3,
    answer:
      "YOU CAN REACH KENT AT:\n> EMAIL: kentdarylgilowrk@gmail.com\n> GITHUB: https://github.com/darylgilo\n> LINKEDIN: https://linkedin.com/in/daryl-gilo-23b727427\n> FACEBOOK: https://facebook.com/darylgilo",
  },
  {
    keywords: ["github"],
    answer: "KENT'S GITHUB IS AT https://github.com/darylgilo — CHECK OUT HIS REPOS AND CODE.",
  },
  {
    keywords: ["linkedin"],
    answer: "KENT'S LINKEDIN PROFILE IS AT https://linkedin.com/in/daryl-gilo-23b727427",
  },
  {
    keywords: ["facebook", "fb"],
    answer: "KENT'S FACEBOOK PROFILE IS AT https://facebook.com/darylgilo",
  },
  {
    keywords: ["thank", "thanks", "salamat", "ty"],
    answer: "YOU'RE WELCOME! MY MASTER APPRECIATES YOU VISITING. HAVE MORE QUESTIONS? JUST ASK.",
  },
  {
    keywords: ["bye", "goodbye", "see you later", "see you soon", "see you again"],
    answer: "SEE YOU LATER! MY MASTER APPRECIATES YOUR VISIT. HAVE MORE QUESTIONS? JUST ASK.",
  },
  {
    keywords: ["help", "assist", "support", "guide", "how to", "troubleshoot"],
    answer:
      "I CAN HELP WITH QUESTIONS ABOUT KENT'S PORTFOLIO, SKILLS, PROJECTS, TECHNOLOGIES, AND CONTACT INFO. I CAN ALSO EXPLAIN TECH CONCEPTS OR GUIDE YOU ON WHAT TO LEARN. ASK ME ANYTHING!",
  },
  {
    // "wake up" alone covers every variant via substring matching
    // ("wake up", "wake up scorpi", "wake up!", ...). "hey scorpi" is
    // separate because it doesn't contain "wake up".
    keywords: ["wake up", "hey scorpi","hello scorpi", "hi scorpi", "scorpi wake up", "scorpi hello", "scorpi hi"],
    answer: "HELLO! I AM AWAKE AND READY TO ASSIST YOU. ASK ME ANYTHING ABOUT MY MASTER PORTFOLIO OR ABOUT TECHNOLOGY.",
  }
]

const QUICK_QUESTIONS = [
  "Who is Kent?",
  "What are your skills?",
  "What projects have you built?",
  "How can I contact you?",
]

const FALLBACK =
  "SORRY, I DON'T HAVE THAT IN MY DATABASE YET. I'M JUST A SIMPLE RULES-BASED BOT. TRY ASKING ABOUT SKILLS, PROJECTS, TECHNOLOGIES, OR CONTACT INFO."

function findAnswer(input: string): string {
  const text = input.toLowerCase()
  let best: Intent | null = null
  let bestScore = 0
  let bestKeywordLen = 0
  let bestPriority = 0
  for (const intent of INTENTS) {
    let score = 0
    let keywordLen = 0
    for (const keyword of intent.keywords) {
      // Lowercase both sides — the input is already lowercased, but a
      // mixed-case keyword entry would silently never match otherwise.
      if (text.includes(keyword.toLowerCase())) {
        score++
        keywordLen = Math.max(keywordLen, keyword.length)
      }
    }
    if (score === 0) continue
    const priority = intent.priority ?? 0
    if (
      score > bestScore ||
      (score === bestScore && keywordLen > bestKeywordLen) ||
      (score === bestScore && keywordLen === bestKeywordLen && priority > bestPriority)
    ) {
      bestScore = score
      bestKeywordLen = keywordLen
      bestPriority = priority
      best = intent
    }
  }
  return best ? best.answer : FALLBACK
}

/** Opening line shown when there is no stored conversation yet. */
const WELCOME_MESSAGE: Message = {
  from: "bot",
  text: "HELLO! I AM SCORPI. ASK ME ANYTHING ABOUT MY MASTER KENT!",
}

/** localStorage key + cap for the persisted chat history (conversation memory). */
const CHAT_HISTORY_KEY = "chatbot-history"
const CHAT_HISTORY_LIMIT = 40

/**
 * Restore the previous conversation so SCORPI remembers what was said even
 * after a page reload or a new visit. Malformed entries are dropped.
 */
function loadStoredHistory(): Message[] {
  if (typeof window === "undefined") return [WELCOME_MESSAGE]
  try {
    const raw = localStorage.getItem(CHAT_HISTORY_KEY)
    if (!raw) return [WELCOME_MESSAGE]
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return [WELCOME_MESSAGE]
    const valid = parsed.filter(
      (m): m is Message =>
        !!m &&
        (m.from === "user" || m.from === "bot") &&
        typeof m.text === "string" &&
        m.text.trim() !== ""
    )
    return valid.length > 0 ? valid.slice(-CHAT_HISTORY_LIMIT) : [WELCOME_MESSAGE]
  } catch {
    return [WELCOME_MESSAGE]
  }
}

/** Persist the conversation (newest turns only) after every exchange. */
function saveStoredHistory(msgs: Message[]) {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(msgs.slice(-CHAT_HISTORY_LIMIT)))
  } catch {
    // Storage full or unavailable (private mode) — memory just won't persist.
  }
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(loadStoredHistory)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  /** Start a fresh conversation: clear display, memory, and persisted history. */
  function clearHistory() {
    stopSpeaking()
    setMessages([WELCOME_MESSAGE])
    setAiReplyText("")
    setAiOutline([])
    setJarvisText("")
    try {
      localStorage.removeItem(CHAT_HISTORY_KEY)
    } catch {
      // storage unavailable — in-memory state is already cleared
    }
  }
  // Restore the saved TTS preference (default: on). Reading storage in a lazy
  // initializer avoids setState-in-effect and matches SSR output because the
  // panel is closed during hydration.
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    if (typeof window === "undefined") return true
    try {
      return localStorage.getItem("chatbot-tts") !== "off"
    } catch {
      return true
    }
  })
  // Language Whisper detected on the latest clip — no manual EN/FIL toggle.
  // Whisper auto-detects every clip, so Tagalog, English and Taglish all
  // work as-is; this only drives the matching prompt text and the
  // browser-TTS fallback voice.
  const [detectedLang, setDetectedLang] = useState<DetectedLang>("en")
  const [listening, setListening] = useState(false)
  /** SCORPI overlay: opened from the mic button; hides robot + chatbox. */
  const [scorpiOpen, setJarvisOpen] = useState(false)
  /** Live transcript text shown under the ball. */
  const [scorpiText, setJarvisText] = useState("")
  /** AI answer line shown below the user's speech (reset per exchange). */
  const [aiReplyText, setAiReplyText] = useState("")
  /** Structured list from the AI (fundamentals/steps) for the left HUD panel. */
  const [aiOutline, setAiOutline] = useState<string[]>([])
  /** True while the mic is transcribing a NEW round's live line. Drives the
   *  You/Scorpi seesaw: while it's on and a previous answer is still shown,
   *  that answer rides on top and the live transcript sits under it. */
  const [liveTranscribing, setLiveTranscribing] = useState(false)
  const speaking = useSpeaking()
  // Live mic level 0..1 driving the in-textbox voice wave. Set from a
  // requestAnimationFrame loop while listening (real mic or fake wave).
  const [micLevel, setMicLevel] = useState(0)
  // Synthetic "talking" level 0..1 driving the orb core while the AI
  // speaks — layered syllable-rate sines so the particles "talk".
  const [talkLevel, setTalkLevel] = useState(0)
  // Voice capture needs mic access + MediaRecorder (all modern browsers).
  const [micSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      "MediaRecorder" in window
  )
  /** True while Whisper is processing the recorded clip (mic is closed). */
  const [transcribing, setTranscribing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  // Guards the async getUserMedia gap so two rapid restarts can't double-start.
  const startingRef = useRef(false)
  const vadRafRef = useRef<number | null>(null)
  const discardTranscriptRef = useRef(false)
  // Mirrors scorpiOpen for use inside recognition timeouts/callbacks.
  const scorpiOpenRef = useRef(false)
  // Mirrors detectedLang for use inside async transcription callbacks.
  const detectedLangRef = useRef<DetectedLang>(detectedLang)
  useEffect(() => {
    detectedLangRef.current = detectedLang
  }, [detectedLang])
  // Conversation memory: persist every exchange so SCORPI still knows what
  // was said in earlier sessions (page reloads, panel closes).
  useEffect(() => {
    saveStoredHistory(messages)
  }, [messages])
  const meterRafRef = useRef<number | null>(null)
  const meterCleanupRef = useRef<(() => void) | null>(null)
  const talkRafRef = useRef<number | null>(null)
  // Latest-value mirrors so the ring-smoothing loop (mounted once per
  // session) always chases fresh levels without restarting.
  const speakingRef = useRef(false)
  const talkLevelRef = useRef(0)
  const micLevelRef = useRef(0)
  const ringCurRef = useRef(0.18)
  // Bar elements of the circular audio visualizer, mutated directly by a
  // 60fps loop (no React re-renders per frame).
  const visBarRefs = useRef<(SVGLineElement | null)[]>([])
  // Smoothed ring level — eases toward the live voice level so the HUD
  // rings glide instead of snapping when states flip (speaking end ->
  // listening gap, meter restarts). Never drops below the calm baseline.
  const [ringSmooth, setRingSmooth] = useState(0.18)
  useEffect(() => {
    speakingRef.current = speaking
    talkLevelRef.current = talkLevel
    micLevelRef.current = micLevel
  }, [speaking, talkLevel, micLevel])

  /** Drive talkLevel while the AI speaks. Prefers the real ElevenLabs
   * playback level (so the pulse reacts to the actual voice: pauses stay
   * calm, loud syllables swell). Falls back to a slow, calm breathing
   * wave for the browser voice — no fast throbbing. */
  useEffect(() => {
    if (!speaking) return
    let start: number | null = null
    let lastSent = -1
    let smooth = 0
    const tick = (now: number) => {
      if (start === null) start = now
      const t = (now - start) / 1000
      const real = samplePremiumLevel()
      let level: number
      if (real !== null) {
        // Follow the real voice with light smoothing. When the voice
        // pauses (level ~0), the orb settles instead of pulsing.
        smooth += (real - smooth) * 0.3
        level = smooth
      } else {
        // Slow breathing: ~7s per cycle, gentle range — never frantic.
        level =
          0.32 +
          0.2 * (0.5 - 0.5 * Math.cos((t * 2 * Math.PI) / 7)) +
          0.08 * Math.abs(Math.sin(t * 2 * Math.PI * 0.9 + 0.8))
      }
      const clamped = Math.max(0, Math.min(1, level))
      if (Math.abs(clamped - lastSent) > 0.02) {
        lastSent = clamped
        setTalkLevel(clamped)
      }
      talkRafRef.current = requestAnimationFrame(tick)
    }
    talkRafRef.current = requestAnimationFrame(tick)
    return () => {
      if (talkRafRef.current !== null) cancelAnimationFrame(talkRafRef.current)
      talkRafRef.current = null
    }
  }, [speaking])

  // Ring smoothing loop: runs once per SCORPI session and eases
  // ringSmooth toward the live target (talk level while speaking, mic
  // level while listening, calm baseline otherwise) so no state flip
  // ever snaps the rings — they glide instead.
  useEffect(() => {
    if (!scorpiOpen) return
    let lastSent = -1
    let raf = 0
    ringCurRef.current = Math.max(ringCurRef.current, 0.18)
    const tick = () => {
      const target = speakingRef.current
        ? talkLevelRef.current
        : micLevelRef.current > 0.05
          ? micLevelRef.current
          : 0.18
      const cur = ringCurRef.current
      const next = cur + (Math.max(target, 0.18) - cur) * 0.12
      ringCurRef.current = next
      if (Math.abs(next - lastSent) > 0.005) {
        lastSent = next
        setRingSmooth(next)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scorpiOpen])

  // Circular audio visualizer loop: runs while the SCORPI overlay is open
  // and mutates the radial bar lengths directly at 60fps. Bars swell with
  // the AI's real voice level while it speaks (traveling wave around the
  // ring), follow the mic gently while listening, and breathe subtly when
  // idle — no React state churn per frame.
  useEffect(() => {
    if (!scorpiOpen) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const level = speakingRef.current
        ? talkLevelRef.current
        : micLevelRef.current > 0.05
          ? micLevelRef.current * 0.5
          : 0
      const bars = visBarRefs.current
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i]
        if (!bar) continue
        // Per-needle bob: each bar swings on its own phase, scaled by its
        // stable amplitude so long needles reach far and short ones ripple.
        const wobble = 0.35 + 0.65 * Math.abs(Math.sin(t * 2.4 + VIS_BAR_PHASE[i]))
        // Slow "petal" banding — travelling clumps of long needles that
        // give the ring its flower silhouette.
        const petal = 0.55 + 0.45 * Math.abs(Math.sin(t * 0.9 + i * 0.1))
        // Slow idle breathing keeps the ring alive between replies.
        const idle = 0.05 * (1 + Math.sin(t * 1.2 + i * 0.3))
        const len = 1.5 + 15.5 * Math.min(1, level * VIS_BAR_AMP[i] * wobble * petal + idle)
        // y1 is pinned at 18 (inner radius 82 — leaves a clear gap between
        // the orb edge at ~72 and the needles); grow the bar outward.
        bar.setAttribute("y2", (18 - len).toFixed(2))
        // Longer needles glow brighter — reinforces the petal outline.
        bar.setAttribute("opacity", (0.55 + 0.45 * Math.min(1, len / 17)).toFixed(2))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scorpiOpen])

  /** Stop the mic meter loop + release mic tracks and audio context. */
  function teardownMeter() {
    if (meterRafRef.current !== null) {
      cancelAnimationFrame(meterRafRef.current)
      meterRafRef.current = null
    }
    meterCleanupRef.current?.()
    meterCleanupRef.current = null
  }

  /** Teardown + reset the level (event-handler paths only, never effects). */
  function stopMeter() {
    teardownMeter()
    setMicLevel(0)
  }

  /**
   * Drive micLevel from the real microphone via Web Audio API.
   * Falls back to a fake wave when the mic stream isn't available
   * (e.g. permission denied) — the wave still animates.
   */
  function startMeter() {
    stopMeter()
    const w = window as unknown as {
      AudioContext?: typeof AudioContext
      webkitAudioContext?: typeof AudioContext
    }
    const Ctx = w.AudioContext ?? w.webkitAudioContext
    if (!navigator.mediaDevices?.getUserMedia || !Ctx) {
      startFakeMeter()
      return
    }
    let cancelled = false
    let stream: MediaStream | null = null
    let ctx: AudioContext | null = null
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        stream = s
        ctx = new Ctx()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        ctx.createMediaStreamSource(s).connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)
        let smooth = 0
        let lastSent = -1
        const tick = () => {
          if (cancelled) return
          analyser.getByteTimeDomainData(data)
          let sum = 0
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128
            sum += v * v
          }
          const rms = Math.sqrt(sum / data.length)
          // Normalize: typical speech RMS lands around 0.02-0.2.
          const target = Math.max(0, Math.min(1, (rms - 0.015) / 0.185))
          smooth += (target - smooth) * 0.35
          // Throttle re-renders: only update on visible changes.
          if (Math.abs(smooth - lastSent) > 0.03) {
            lastSent = smooth
            setMicLevel(smooth)
          }
          meterRafRef.current = requestAnimationFrame(tick)
        }
        meterRafRef.current = requestAnimationFrame(tick)
        void ctx.resume().catch(() => {})
      })
      .catch(() => {
        if (!cancelled) startFakeMeter()
      })
    meterCleanupRef.current = () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
      void ctx?.close().catch(() => {})
    }
  }

  /** Fake pulsing wave shown when the real mic meter isn't available. */
  function startFakeMeter() {
    stopMeter()
    let start: number | null = null
    let cancelled = false
    let lastSent = -1
    const tick = (now: number) => {
      if (cancelled) return
      // Use the rAF timestamp (no performance.now — keeps render pure).
      if (start === null) start = now
      const t = (now - start) / 1000
      // Layered sines so it looks organic, never fully flat.
      const level = 0.35 + 0.3 * Math.abs(Math.sin(t * 3.1)) + 0.18 * Math.abs(Math.sin(t * 7.3 + 1.2))
      if (Math.abs(level - lastSent) > 0.03) {
        lastSent = level
        setMicLevel(level)
      }
      meterRafRef.current = requestAnimationFrame(tick)
    }
    meterRafRef.current = requestAnimationFrame(tick)
    meterCleanupRef.current = () => {
      cancelled = true
    }
  }

  /** Stop any live recorder session without sending its clip. */
  function abortVoiceSession() {
    if (!mediaRecorderRef.current) return
    try {
      mediaRecorderRef.current.stop()
    } catch {
      // already stopped
    }
    mediaRecorderRef.current = null
  }

  // Warm up the TTS voice list (Chrome loads voices asynchronously)
  // and release speech resources on unmount.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    window.speechSynthesis.getVoices()
    const onLoad = () => window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener("voiceschanged", onLoad)
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onLoad)
      discardTranscriptRef.current = true
      abortVoiceSession()
      window.speechSynthesis.cancel()
      teardownMeter()
    }
  }, [])

  // Stop listening/speaking when the chat is closed.
  // SCORPI hides the chatbox itself via openScorpi, so only clean up
  // recognition/audio here — no setState (avoids cascading renders).
  useEffect(() => {
    if (open) return
    discardTranscriptRef.current = true
    abortVoiceSession()
    teardownMeter()
    stopSpeaking()
  }, [open])

  // Lock page scroll while the SCORPI overlay is open; Esc closes it.
  // Lock BOTH html and body: globals.css sets `overflow-x: hidden` on html,
  // so per overflow-propagation rules the body's overflow never reaches the
  // viewport — locking only body left the page scrollbar visible/scrollable
  // behind the overlay.
  useEffect(() => {
    if (!scorpiOpen) return
    const prevBody = document.body.style.overflow
    const prevHtml = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        discardTranscriptRef.current = true
        abortVoiceSession()
        teardownMeter()
        setListening(false)
        stopSpeaking()
        setJarvisOpen(false)
        setJarvisText("")
        setLiveTranscribing(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prevBody
      document.documentElement.style.overflow = prevHtml
      window.removeEventListener("keydown", onKey)
    }
  }, [scorpiOpen])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing, open])

  function toggleTts() {
    const next = !ttsEnabled
    setTtsEnabled(next)
    try {
      localStorage.setItem("chatbot-tts", next ? "on" : "off")
    } catch {
      // ignore
    }
    if (!next) stopSpeaking()
  }

  /** Upload the recorded clip to our Groq Whisper proxy, then send it. */
  async function transcribeAndSend(blob: Blob, isMp4: boolean) {
    setTranscribing(true)
    // "…" shows in the You line while Whisper thinks — there are no live
    // words anymore now that transcription happens after the clip ends.
    setJarvisText("…")
    setLiveTranscribing(true)
    try {
      const fd = new FormData()
      fd.append("audio", blob, isMp4 ? "speech.mp4" : "speech.webm")
      // No language hint — Whisper auto-detects every clip, so Tagalog,
      // English and Taglish all transcribe correctly without a toggle.
      const res = await fetch("/api/transcribe", { method: "POST", body: fd })
      const data = (await res.json()) as { text?: string; language?: string }
      const text = (data.text ?? "").trim()
      // Remember what language Whisper heard so the listening prompt and
      // the browser-TTS fallback voice adapt automatically.
      const lang: DetectedLang = data.language === "tl" ? "tl" : "en"
      setDetectedLang(lang)
      detectedLangRef.current = lang
      if (!scorpiOpenRef.current) return
      if (!text) {
        // Nothing intelligible in the clip — keep listening.
        setJarvisText("")
        setLiveTranscribing(false)
        window.setTimeout(() => startListening(), 250)
        return
      }
      setInput(text)
      setJarvisText(text)
      handleSend(text)
      // Mute while the reply plays — the resume poll unmutes after talking.
      discardTranscriptRef.current = true
    } catch {
      if (scorpiOpenRef.current) window.setTimeout(() => startListening(), 400)
    } finally {
      setTranscribing(false)
    }
  }

  /**
   * Start a voice session: record the mic, auto-stop after a real pause
   * (voice-activity detection), then transcribe via Groq Whisper.
   * Auto-restarts so SCORPI keeps listening.
   */
  function startListening() {
    if (startingRef.current || mediaRecorderRef.current || !scorpiOpenRef.current) return
    // Never open the mic while the AI is still talking — its own voice would
    // be recorded into the clip and echo back as an answer loop. Retry
    // shortly so listening resumes right after talking ends.
    if (
      (typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        window.speechSynthesis.speaking) ||
      isPremiumPlaying()
    ) {
      window.setTimeout(() => startListening(), 500)
      return
    }
    // Silence the bot so the microphone can hear the user.
    stopSpeaking()
    discardTranscriptRef.current = false
    startingRef.current = true

    const mime = pickRecorderMime()
    const isMp4 = (mime ?? "").includes("mp4")
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      .then((stream) => {
        // Overlay closed (or a newer session started) while the permission
        // prompt was open — release the stream and bail.
        if (!scorpiOpenRef.current || mediaRecorderRef.current) {
          startingRef.current = false
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
        const chunks: BlobPart[] = []
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data)
        }
        recorder.onstop = () => {
          if (vadRafRef.current !== null) {
            cancelAnimationFrame(vadRafRef.current)
            vadRafRef.current = null
          }
          stream.getTracks().forEach((t) => t.stop())
          void audioCtx.close().catch(() => {})
          startingRef.current = false
          if (mediaRecorderRef.current === recorder) mediaRecorderRef.current = null
          setListening(false)

          if (discardTranscriptRef.current || !scorpiOpenRef.current) {
            stopMeter()
            return
          }
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" })
          if (blob.size < 4000) {
            // ~empty clip (a cough or a tap) — nothing worth transcribing.
            stopMeter()
            setJarvisText("")
            setLiveTranscribing(false)
            window.setTimeout(() => startListening(), 250)
            return
          }
          // Keep the meter + levels alive while Whisper runs and the bot
          // answers — the rings used to snap off in this gap.
          void transcribeAndSend(blob, isMp4)
        }

        mediaRecorderRef.current = recorder
        setListening(true)
        startMeter()
        recorder.start()

        // --- Voice-activity detection on the same mic stream --------------
        // Recording starts immediately, but the clip only "counts" once the
        // level rises above the threshold; a 1.8s silence after real speech
        // stops the recorder (matching the old endpointing feel).
        const audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)
        const buf = new Float32Array(analyser.fftSize)
        const LEVEL_THRESHOLD = 0.035
        const SILENCE_MS = 1800
        const MAX_RECORD_MS = 30_000
        // Onset gate: sound must stay above the threshold CONTINUOUSLY for
        // ONSET_MS before the clip counts as speech — rejects echo tails,
        // coughs, and keyboard blips that a bare RMS check would trigger.
        const ONSET_MS = 300
        let speechStarted = false
        let speechStartedAt = 0
        let lastLoudAt = 0
        let loudSince = 0
        const finish = () => {
          if (vadRafRef.current !== null) {
            cancelAnimationFrame(vadRafRef.current)
            vadRafRef.current = null
          }
          if (recorder.state !== "inactive") {
            try {
              recorder.stop()
            } catch {
              // already stopped — onstop handles the rest
            }
          }
        }
        const tick = () => {
          vadRafRef.current = requestAnimationFrame(tick)
          analyser.getFloatTimeDomainData(buf)
          let sum = 0
          for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i]
          const rms = Math.sqrt(sum / buf.length)
          const now = performance.now()
          if (speechStarted && now - speechStartedAt > MAX_RECORD_MS) {
            finish()
            return
          }
          if (rms > LEVEL_THRESHOLD) {
            if (!speechStarted) {
              if (loudSince === 0) loudSince = now
              if (now - loudSince < ONSET_MS) return
              speechStarted = true
              speechStartedAt = now
              // Flip the seesaw to the "You" line while the clip records.
              setJarvisText("…")
              setLiveTranscribing(true)
            }
            lastLoudAt = now
          } else {
            loudSince = 0
            if (speechStarted && now - lastLoudAt > SILENCE_MS) {
              finish()
              return
            }
          }
        }
        tick()
      })
      .catch(() => {
        // Mic permission denied or no device — cool down, then retry so a
        // later grant (or device plug-in) recovers without a reload.
        startingRef.current = false
        setListening(false)
        stopMeter()
        if (scorpiOpenRef.current) window.setTimeout(() => startListening(), 1200)
      })
  }

  /** Mic button: hide robot + chatbox, open the SCORPI overlay. */
  function openScorpi() {
    stopSpeaking()
    setOpen(false)
    setJarvisText("")
    setAiReplyText("")
    setLiveTranscribing(false)
    scorpiOpenRef.current = true
    setJarvisOpen(true)
    // Let the overlay paint before asking for mic permission.
    window.setTimeout(() => startListening(), 60)
  }

  /** Close the SCORPI overlay and stop any voice activity. */
  function handleScorpiClose() {
    discardTranscriptRef.current = true
    scorpiOpenRef.current = false
    // Unblock any pending waitForReplyStart() so handleSend can finish.
    signalReplyStarted()
    // Stop the recorder (if any); its onstop sees the discard flag and
    // releases the mic stream without sending anything.
    abortVoiceSession()
    teardownMeter()
    setMicLevel(0)
    setListening(false)
    stopSpeaking()
    setJarvisOpen(false)
    setJarvisText("")
    setAiReplyText("")
    setLiveTranscribing(false)
  }

  async function handleSend(text: string) {
    // Voice transcripts from the SCORPI overlay arrive via the recorder
    // pipeline; otherwise block double-submits while a reply is generated.
    if (!mediaRecorderRef.current && typing) return
    const trimmed = text.trim()
    if (!trimmed || typing) return
    const newMessages: Message[] = [...messages, { from: "user", text: trimmed }]
    setMessages(newMessages)
    setInput("")
    // New exchange: clear the previous AI answer line right away and flip
    // the dialogue back to You-on-top while Scorpi's new reply loads.
    setAiReplyText("")
    setAiOutline([])
    setLiveTranscribing(false)
    setTyping(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })
      const data = await res.json()
      const replyText =
        data?.reply && typeof data.reply === "string"
          ? data.reply
          : findAnswer(trimmed)
      setMessages((prev) => [...prev, { from: "bot", text: replyText }])
      setAiReplyText(replyText)
      setAiOutline(Array.isArray(data.outline) ? data.outline : [])
      if (ttsEnabled) void speakReply(replyText, detectedLangRef.current)
    } catch {
      const fallbackReply = findAnswer(trimmed)
      setMessages((prev) => [...prev, { from: "bot", text: fallbackReply }])
      setAiReplyText(fallbackReply)
      if (ttsEnabled) void speakReply(fallbackReply, detectedLangRef.current)
    } finally {
      setTyping(false)
      // SCORPI mode: after the bot answers, go straight back to listening —
      // but only once reply playback has ACTUALLY STARTED and fully ENDED,
      // so the mic never hears the bot's own voice. Waiting on the real TTS
      // start signal (not a fixed timer) removes the READY stall.
      if (scorpiOpenRef.current) {
        let replyStarted = false
        let resumed = false
        const resume = () => {
          if (resumed) return
          resumed = true
          window.clearInterval(timer)
          window.clearTimeout(failsafe)
          // Mic unmutes HERE — after talking fully ends. The extra 900ms
          // lets the reply's room echo die first; otherwise the VAD can
          // catch the tail of the bot's own voice, transcribe it, and
          // answer itself (the "double response" loop).
          discardTranscriptRef.current = false
          window.setTimeout(() => startListening(), 900)
        }
        const timer = window.setInterval(() => {
          // NOTE: do NOT bail on discardTranscriptRef here — it is
          // intentionally true (mic muted) while the reply plays.
          // Only stop if the SCORPI overlay itself was closed.
          if (!scorpiOpenRef.current) {
            window.clearInterval(timer)
            window.clearTimeout(failsafe)
            return
          }
          if (!replyStarted) return
          const busy =
            (typeof window !== "undefined" &&
              "speechSynthesis" in window &&
              window.speechSynthesis.speaking) ||
            isPremiumPlaying()
          if (!busy) resume()
        }, 200)
        // Failsafe: never leave SCORPI silent for more than 20s even if a
        // TTS start signal is somehow lost.
        const failsafe = window.setTimeout(resume, 20000)
        if (ttsEnabled) {
          await waitForReplyStart()
        }
        replyStarted = true
      }
    }
  }

  // Shared level driving the HUD glow & orb bob in all states — smoothed
  // every frame by the session loop above, so visuals glide (never snap)
  // across listening -> speaking -> gap -> listening transitions. The
  // visualizer bars read the live level refs directly at 60fps instead.
  const ringDisplay = Math.max(ringSmooth, 0.18)
  // Dialogue order: normally You on top, Scorpi below. While the user speaks
  // a NEW round (live transcript + previous answer both on screen) the pair
  // swaps — Scorpi's last answer rides on top, the live line under it — then
  // flips back the moment the user stops and the reply starts loading.
  const dialogueFlipped = liveTranscribing && aiReplyText !== ""
  // Long answers (tutorials, multi-sentence explanations) get their own
  // side HUD data panel — the small line under the orb can't hold them.
  const longReply = aiReplyText.length > 180 || aiReplyText.includes("\n")

  return (
      <>
        {!scorpiOpen && (
        <div
          className="animate-float"
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open chatbot"
              className="px-4 py-2 text-xs font-semibold rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-1.5 text-center"
              style={{
                backgroundColor: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              <FaSmile aria-hidden="true" />
              <span>HI I&apos;m Scorpi</span>
            </button>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-24 w-24 items-center justify-center transition-transform hover:scale-110"
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
            }}
            aria-label={open ? "Close chatbot" : "Open chatbot"}
          >
            <ChatBotIcon />
          </button>
        </div>
        )}

        {open && !scorpiOpen && (
          <div
            className="w-[calc(100vw-3rem)] max-w-sm flex flex-col overflow-hidden rounded-2xl shadow-2xl"
            style={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border-color)",
              height: "60vh",
              maxHeight: "480px",
              position: "fixed",
              bottom: "8.5rem",
              right: "1.5rem",
              zIndex: 50,
            }}
          >
            <div
              className="p-4 flex items-center gap-3 text-white"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
            >
              <div className="text-xl"><FaRobot /></div>
              <div className="flex-1">
                <div className="text-xs md:text-sm font-semibold">SCORPI AI ASSISTANT</div>
                <div className="text-[10px]" style={{ opacity: 0.7 }}>ASK ME ANYTHING</div>
              </div>
              <button
                type="button"
                onClick={toggleTts}
                aria-label={ttsEnabled ? "Turn voice replies off" : "Turn voice replies on"}
                aria-pressed={ttsEnabled}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {ttsEnabled ? <FaVolumeUp /> : <FaVolumeOff />}
              </button>
              <button
                type="button"
                onClick={clearHistory}
                aria-label="Clear conversation"
                title="Clear conversation"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <FaRedo />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chatbot"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
              {messages.map((msg, i) => (
                <div key={i} className={msg.from === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className="px-4 py-2.5 max-w-[85%] whitespace-pre-line break-words rounded-2xl"
                    style={{
                      backgroundColor: msg.from === "user" ? "var(--accent)" : "var(--background)",
                      color: msg.from === "user" ? "#ffffff" : "var(--foreground)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-2.5 rounded-2xl animate-type-bar"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)" }}
                  >
                    THINKING_
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-4 pb-3 space-y-2">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="w-full rounded-full px-4 py-2.5 text-left text-[11px] transition-colors hover:opacity-80"
                    style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              className="flex gap-2 p-4"
              style={{ borderTop: "1px solid var(--border-color)" }}
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(input)
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="TYPE A QUESTION..."
                className="flex-1 min-w-0 rounded-full px-4 py-2.5 text-xs outline-none"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)", color: "var(--foreground)" }}
              />
              {micSupported && (
                <button
                  type="button"
                  onClick={openScorpi}
                  aria-label="Talk to SCORPI AI"
                  title="Talk to SCORPI AI"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm transition-transform hover:scale-110"
                  style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <FaMicrophone />
                </button>
              )}
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm text-white transition-transform hover:scale-110"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}

        {scorpiOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="SCORPI AI voice assistant"
            className="flex items-center justify-center p-4"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "radial-gradient(ellipse at center, #0a1628 0%, #04070f 70%)",
            }}
          >
            {/* Scorpio constellation + starfield — the overlay's backdrop.
                Absolutely positioned so it never joins the flex layout,
                and pointer-free so clicks pass straight through. */}
            <div
              aria-hidden="true"
              className="pointer-events-none"
              style={{ position: "absolute", inset: 0, zIndex: 0 }}
            >
              <ScorpioBackground animated scale={1.75} />
            </div>
            <button
              type="button"
              onClick={handleScorpiClose}
              aria-label="Close SCORPI AI"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform hover:scale-110"
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.25)",
                zIndex: 2,
              }}
            >
              <FaTimes />
            </button>

            {/* Left reference panel — when the AI returns a related list
                (fundamentals, steps, key points) it renders as a numbered
                HUD readout on the LEFT, pairing with the answer panel on
                the right. Wide screens only. */}
            {scorpiOpen && aiOutline.length > 0 && (
              <aside
                aria-label="SCORPI reference list"
                className="absolute left-4 top-1/2 z-[2] hidden w-[min(320px,26vw)] -translate-y-1/2 lg:block"
              >
                <div
                  className="scorpi-panel-in-left max-h-[60vh] overflow-y-auto p-4 text-left"
                  style={{
                    background: "rgba(6, 16, 32, 0.82)",
                    border: "1px solid rgba(96, 165, 250, 0.45)",
                    backdropFilter: "blur(6px)",
                    clipPath:
                      "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                    boxShadow: "0 0 24px rgba(59, 130, 246, 0.25)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#7dd3fc",
                      borderBottom: "1px solid rgba(96, 165, 250, 0.35)",
                      paddingBottom: 8,
                      marginBottom: 10,
                    }}
                  >
                    SCORPI // KEY POINTS
                  </div>
                  <ol className="space-y-2 text-sm leading-relaxed text-slate-200">
                    {aiOutline.map((item, i) => (
                      <li key={`${i}-${item}`} className="flex gap-2.5">
                        <span
                          className="shrink-0 font-bold text-sky-300"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </aside>
            )}

            {/* Long-answer data panel — tutorials and long explanations
                surface in a side HUD readout like a real AI machine, instead
                of only the clamped line under the orb. Wide screens only
                (narrow ones have no side room next to the centered column). */}
            {scorpiOpen && longReply && (
              <aside
                aria-label="SCORPI data output"
                className="absolute right-4 top-1/2 z-[2] hidden w-[min(340px,28vw)] -translate-y-1/2 lg:block"
              >
                <div
                  className="scorpi-panel-in max-h-[60vh] overflow-y-auto p-4 text-left"
                  style={{
                    background: "rgba(6, 16, 32, 0.82)",
                    border: "1px solid rgba(96, 165, 250, 0.45)",
                    backdropFilter: "blur(6px)",
                    clipPath:
                      "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                    boxShadow: "0 0 24px rgba(59, 130, 246, 0.25)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "#7dd3fc",
                      borderBottom: "1px solid rgba(96, 165, 250, 0.35)",
                      paddingBottom: 8,
                      marginBottom: 10,
                    }}
                  >
                    SCORPI // DATA OUTPUT
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                    {aiReplyText}
                    <span className="ml-1 inline-block animate-pulse text-sky-300">▌</span>
                  </p>
                </div>
              </aside>
            )}

            <div className="relative z-[1] flex w-full max-w-md flex-col items-center text-center">
              <div
                className="text-xs font-semibold uppercase"
                style={{ color: "#7dd3fc", letterSpacing: "0.45em", textIndent: "0.45em" }}
              >
                SCORPI AI
              </div>
              <div
                className="mt-2 text-2xl font-bold uppercase text-white"
                style={{ letterSpacing: "0.12em" }}
              >
                {speaking
                  ? "Talking"
                  : listening
                    ? "Listening"
                    : transcribing
                      ? "Transcribing"
                      : typing
                        ? "Thinking"
                        : "Ready"}
              </div>

              <div
                className={`relative mt-10 h-72 w-72 sm:h-80 sm:w-80 ${speaking ? "scorpi-orb-talking" : ""}`}
                style={{
                  // Breathing glow eases via CSS transition (no snap when the
                  // talk level jumps frame to frame).
                  filter: speaking
                    ? `drop-shadow(0 0 ${28 + ringDisplay * 32}px rgba(63,123,255,${0.55 + ringDisplay * 0.4}))`
                    : "drop-shadow(0 0 28px rgba(63,123,255,0.55))",
                  transition: "filter 160ms ease-out",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={
                    speaking
                      ? {
                          // Hover-like bob glides via transition instead of
                          // snapping with each talkLevel frame.
                          transform: `translateY(${-ringDisplay * 8}px) scale(${1 + ringDisplay * 0.06})`,
                          transition: "transform 160ms ease-out",
                        }
                      : { transition: "transform 300ms ease-out" }
                  }
                >
                  <CrystalizedBall
                    preset="abyss"
                    theme="dark"
                    size={speaking ? 0.72 + talkLevel * 0.06 : 0.72}
                    glow={speaking ? 1.15 + talkLevel * 0.9 : listening ? 1.15 : 0.9}
                    sparks={speaking ? 0.75 + talkLevel * 0.25 : 0.4}
                    crackle={speaking ? 0.55 + talkLevel * 0.45 : 0.55}
                    // The core "dances" while the AI talks: speed + drift swell
                    // with the syllable-rate talkLevel so particles surge instead
                    // of idling. Ranges pushed high so the motion is obvious.
                    speed={speaking ? 0.6 + talkLevel * 2.4 : 0.6}
                    dustSpeed={speaking ? 0.9 + talkLevel * 7 : listening ? 0.9 + micLevel * 1.5 : 0.9}
                    sway={speaking ? 0.8 + talkLevel * 0.2 : 0.8}
                    twinkle={speaking ? 0.5 + talkLevel * 0.5 : 0.5}
                    haze={speaking ? 0.6 + talkLevel * 0.4 : 0.6}
                    interactive={true}
                    hoverStrength={0.7}
                    className="h-full w-full"
                  />
                </div>
                {scorpiOpen && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 200"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{
                      // Glow follows whichever voice is active — smooth handoff
                      // listening -> speaking with no sudden on/off snap.
                      filter: `drop-shadow(0 0 ${8 + ringDisplay * 14}px rgba(96,165,250,${0.7 + ringDisplay * 0.3}))`,
                      // The outer HUD interface arcs sit just past the
                      // viewBox edge — let them draw outside the SVG box.
                      overflow: "visible",
                    }}
                  >
                    {/* Circular audio visualizer — a radial equalizer ring
                        that swells with the AI's real voice level while it
                        speaks, follows the mic while listening, and breathes
                        subtly when idle. Bars are mutated at 60fps by the
                        visualizer loop above (no re-renders). */}
                    {Array.from({ length: VIS_BAR_COUNT }, (_, i) => (
                      <line
                        key={i}
                        ref={(el) => {
                          visBarRefs.current[i] = el
                        }}
                        x1="100"
                        y1="18"
                        x2="100"
                        y2="16.5"
                        stroke={VIS_BAR_COLOR}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.55"
                        transform={`rotate(${(360 / VIS_BAR_COUNT) * i} 100 100)`}
                      />
                    ))}
                    {/* Outer HUD interface — ruler ticks + dashed guide ring
                        with accent blocks, rotating at different speeds like
                        a scanner. Brightness follows the voice level so the
                        rings flare while the AI talks. */}
                    {/* Ruler ticks — every 6th tick longer, slow counter-rotation */}
                    <g
                      className="scorpi-hud-spin-rev"
                      style={{
                        transformOrigin: "100px 100px",
                        opacity: 0.7 + ringDisplay * 0.3,
                      }}
                    >
                      {Array.from({ length: 72 }, (_, i) => {
                        const major = i % 6 === 0
                        const [x1, y1] = hudPoint(i * 5, 112)
                        const [x2, y2] = hudPoint(i * 5, major ? 118 : 115.5)
                        return (
                          <line
                            key={`hud-tick-${i}`}
                            x1={x1.toFixed(2)}
                            y1={y1.toFixed(2)}
                            x2={x2.toFixed(2)}
                            y2={y2.toFixed(2)}
                            stroke={major ? "#dbeafe" : "#93c5fd"}
                            strokeWidth={major ? 2 : 1.2}
                            strokeLinecap="round"
                          />
                        )
                      })}
                    </g>
                    {/* Dashed guide ring + accent blocks, fastest clockwise */}
                    <g
                      className="scorpi-hud-spin-fast"
                      style={{
                        transformOrigin: "100px 100px",
                        opacity: 0.6 + ringDisplay * 0.4,
                      }}
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="101"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="1.4"
                        strokeDasharray="16 5"
                      />
                      {Array.from({ length: 3 }, (_, i) => {
                        const start = i * 120 + 20
                        return (
                          <path
                            key={`hud-blk-${i}`}
                            d={hudArc(start, start + 8, 101)}
                            fill="none"
                            stroke="#e0f2fe"
                            strokeWidth={3}
                          />
                        )
                      })}
                    </g>
                  </svg>
                )}
              </div>

              <div className="mt-10 w-full space-y-1.5 text-center text-sm leading-relaxed">
                {/* Seesaw dialogue — You on top / Scorpi below, EXCEPT while the
                    user speaks a new round: the previous answer rides on top and
                    the live transcript sits under it. Remounting on each swap
                    replays the slide so the change reads as a physical flip. */}
                <div
                  key={dialogueFlipped ? "flipped" : "settled"}
                  className={`space-y-1.5 ${dialogueFlipped ? "scorpi-lines-swap-up" : "scorpi-lines-swap-down"}`}
                >
                  {dialogueFlipped ? (
                    <>
                      {/* Scorpi's previous answer — moved to the top. */}
                      <p
                        aria-live="polite"
                        className="min-h-5 whitespace-pre-line font-medium text-sky-300 line-clamp-6"
                      >
                        <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Scorpi
                        </span>
                        {aiReplyText}
                      </p>
                      {/* The user's live transcript — now below the answer. */}
                      <p aria-live="polite" className="min-h-5 text-slate-300">
                        <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          You
                        </span>
                        {scorpiText}
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Line 1 — the user's live speech transcript (label hidden until text) */}
                      <p aria-live="polite" className="min-h-5 text-slate-300">
                        {scorpiText && (
                          <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            You
                          </span>
                        )}
                        {scorpiText ||
                          (listening
                            ? detectedLang === "tl"
                              ? "Magsalita na — nakikinig ako..."
                              : "Speak now — I'm listening..."
                            : detectedLang === "tl"
                              ? "Nakikinig ako..."
                              : "I'm listening...")}
                      </p>
                      {/* Line 2 — Scorpi's answer for that speech (reset each round) */}
                      <p
                        aria-live="polite"
                        className="min-h-5 whitespace-pre-line font-medium text-sky-300 line-clamp-6"
                      >
                        {aiReplyText && (
                          <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Scorpi
                          </span>
                        )}
                        {aiReplyText || (typing ? "…" : "")}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {!micSupported && (
                <p className="mt-4 text-xs text-slate-400">
                  Voice input isn&apos;t supported in this browser — try Chrome or Edge.
                </p>
              )}
            </div>
          </div>
        )}
      </>
  )
}
