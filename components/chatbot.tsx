"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactElement } from "react"
import dynamic from "next/dynamic"
import "./CrystalizedBall.css"
import { Lottie } from "lottie-react"
import { FaRobot, FaPaperPlane, FaTimes, FaSmile, FaVolumeUp, FaVolumeOff, FaMicrophone } from "react-icons/fa"

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
// Free voice features powered by the browser's built-in Web Speech API.
// No API keys, no paid services, no extra dependencies.
// ---------------------------------------------------------------------------

type SpeechRecognitionAlternativeLike = { transcript: string; confidence?: number }
type SpeechRecognitionResultLike = {
  0: SpeechRecognitionAlternativeLike
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternativeLike | boolean
}
type SpeechRecognitionResultListLike = {
  length: number
  [index: number]: SpeechRecognitionResultLike
}
type SpeechRecognitionErrorLike = { error?: string }
type SpeechRecognitionEventLike = { results: SpeechRecognitionResultListLike }

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionCtorLike = new () => SpeechRecognitionLike

function getSpeechRecognition(): SpeechRecognitionCtorLike | undefined {
  if (typeof window === "undefined") return undefined
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtorLike
    webkitSpeechRecognition?: SpeechRecognitionCtorLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
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

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return null
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("en") && v.localService) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    null
  )
}

function speak(text: string) {
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
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? "en-US"
  activeUtterance = utterance
  utterance.onstart = () => {
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
  activeUtterance = null
  stopPremiumAudio()
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
  notifyPremiumChange()
}

/**
 * Try the premium ElevenLabs voice via our server proxy.
 * Returns true when audio actually started playing, false when the
 * caller should fall back to the free browser voice (no key, quota
 * used up, network issue, or autoplay blocked).
 */
async function speakPremium(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false
  const clean = stripForSpeech(text).slice(0, 600)
  if (!clean) return false
  let audio: HTMLAudioElement | null = null
  try {
    stopSpeaking()
    const res = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean }),
    })
    if (!res.ok) return false
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    audio = new Audio(url)
    premiumAudio = audio
    notifyPremiumChange()
    attachPremiumAnalyser(audio)
    const release = () => {
      URL.revokeObjectURL(url)
      if (premiumAudio === audio) premiumAudio = null
      teardownPremiumAnalyser()
      notifyPremiumChange()
    }
    audio.onended = release
    audio.onerror = release
    await audio.play()
    signalReplyStarted()
    return true
  } catch {
    // play() rejected (e.g. autoplay blocked): clear the leaked handle or
    // isPremiumPlaying() stays true forever and SCORPI strands at READY.
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

async function speakReply(text: string) {
  // Always prefer the ElevenLabs AI voice when it's configured;
  // otherwise fall back to the free built-in browser voice.
  const played = await speakPremium(text)
  if (played) return
  speak(text)
}

const PROJECTS = [
  "GEOLOCATION APP — Location tracking and mapping application",
  "CPMDWORKSPACE APP — Workspace management system",
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
    answer: "I AM SCORPI.",
  },
  {
    keywords: ["who made", "who created", "who built", "who developed", "creator", "maker", "made you", "created you", "built you", "sino gumawa", "gumawa sayo", "gumawa sa", "lumikha", "nag gawa", "nag-gawa", "gumawa"],
    priority: 5,
    answer:
      "MY CREATOR IS BOSS KENT DARYL GILO CREATED ME FOR HIS PERSONAL ASSISTANCE FOR HIS PORTFOLIO.",
  },
  {
    keywords: ["where", "from", "live", "lives", "location", "address", "taga saan", "taga-saan", "taga", "saan", "lugar", "capul", "samar"],
    priority: 4,
    answer: "HE LIVES IN ISLAND OF CAPUL, NORTHERN SAMAR.",
  },
  {
    keywords: ["hi", "hello", "hey", "kamusta", "kumusta"],
    answer:
      "HELLO,! I AM SCORPI, BOSS KENT DARYL GILO'S PERSONAL AI ASSISTANT. ASK ME ABOUT HIS SKILLS, PROJECTS, TECHNOLOGIES, OR HOW TO CONTACT HIM. TYPE A QUESTION BELOW OR TAP A QUICK QUESTION.",
  },
  {
    keywords: ["name", "who", "kent", "daryl", "gilo", "about", "you"],
    priority: 1,
    answer:
      "THIS PORTFOLIO BELONGS TO MY CREATOR, MY BOSS, KENT DARYL M. GILO — A FULL STACK DEVELOPER. HE'S A TECHNOLOGIST WEARING MANY HATS AS A DEVOPS, CLOUD ENGINEER, AND MOBILE DEVELOPER.",
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
    keywords: ["game", "snake", "play"],
    answer:
      "YES! THERE'S A SNAKE GAME IN THE CONTACT SECTION BELOW. SCROLL DOWN TO CONTACT AND USE THE ARROW KEYS OR WASD TO PLAY. HOW MANY POINTS CAN YOU SCORE?",
  },
  {
    keywords: ["thank", "thanks", "salamat", "ty"],
    answer: "YOU'RE WELCOME! KENT APPRECIATES YOU VISITING. HAVE MORE QUESTIONS? JUST ASK.",
  },
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
      if (text.includes(keyword)) {
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

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "HELLO,! I AM SCORPI. ASK ME ANYTHING ABOUT BOSS KENT!",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
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
  const [listening, setListening] = useState(false)
  /** SCORPI overlay: opened from the mic button; hides robot + chatbox. */
  const [scorpiOpen, setJarvisOpen] = useState(false)
  /** Live transcript text shown under the ball. */
  const [scorpiText, setJarvisText] = useState("")
  /** AI answer line shown below the user's speech (reset per exchange). */
  const [aiReplyText, setAiReplyText] = useState("")
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
  // SpeechRecognition only exists in some browsers (Chrome/Edge/Safari).
  const [micSupported] = useState(() => getSpeechRecognition() !== undefined)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const discardTranscriptRef = useRef(false)
  // Mirrors scorpiOpen for use inside recognition timeouts/callbacks.
  const scorpiOpenRef = useRef(false)
  const meterRafRef = useRef<number | null>(null)
  const meterCleanupRef = useRef<(() => void) | null>(null)
  const talkRafRef = useRef<number | null>(null)
  // Latest-value mirrors so the ring-smoothing loop (mounted once per
  // session) always chases fresh levels without restarting.
  const speakingRef = useRef(false)
  const talkLevelRef = useRef(0)
  const micLevelRef = useRef(0)
  const ringCurRef = useRef(0.18)
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
      recognitionRef.current?.abort()
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
    recognitionRef.current?.abort()
    teardownMeter()
    stopSpeaking()
  }, [open])

  // Lock page scroll while the SCORPI overlay is open; Esc closes it.
  useEffect(() => {
    if (!scorpiOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        discardTranscriptRef.current = true
        recognitionRef.current?.abort()
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
      document.body.style.overflow = prev
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

  /** Start a voice session; auto-restarts so SCORPI keeps listening. */
  function startListening() {
    const SpeechRecognition = getSpeechRecognition()
    if (!SpeechRecognition || recognitionRef.current || !scorpiOpenRef.current) return
    // Never open the mic while the AI is still talking — its own voice
    // would echo back into recognition and cause an answer loop.
    // Retry shortly instead so listening resumes right after talking ends.
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

    const recognition = new SpeechRecognition()
    let finalTranscript = ""
    // Filipino-accented English is recognized far better with en-PH first;
    // the browser falls back to plain en if the locale isn't available.
    recognition.lang = "en-PH"
    recognition.interimResults = true
    // Non-continuous so the browser finalizes fast after the user pauses;
    // we restart ourselves for the always-listening feel.
    recognition.continuous = false
    // Instant submit: once the user stops talking for ~1.2s after real
    // speech arrived, stop now instead of waiting for the browser's own
    // (often 5s+) end-of-speech timeout.
    let submitted = false
    let silenceTimer: number | null = null
    const clearSilenceTimer = () => {
      if (silenceTimer !== null) {
        window.clearTimeout(silenceTimer)
        silenceTimer = null
      }
    }
    const submitNow = () => {
      if (submitted) return
      submitted = true
      clearSilenceTimer()
      try {
        recognition.stop()
      } catch {
        // already stopped — onend will handle the submit path
      }
    }

    recognition.onresult = (event) => {
      let interim = ""
      for (let i = 0; i < event.results.length; i++) {
        const raw = event.results[i] as unknown as {
          isFinal: boolean
          length: number
          [index: number]: { transcript: string; confidence?: number }
        }
        // Take the highest-confidence alternative for final results.
        let best = raw[0]?.transcript ?? ""
        let bestConf =
          typeof raw[0]?.confidence === "number" ? (raw[0].confidence as number) : -1
        for (let a = 1; a < raw.length; a++) {
          const alt = raw[a]
          if (!alt) continue
          const altConf = typeof alt.confidence === "number" ? alt.confidence : -1
          if (altConf > bestConf) {
            bestConf = altConf
            best = alt.transcript
          }
        }
        if (raw.isFinal) finalTranscript += best + " "
        else interim += raw[0]?.transcript ?? ""
      }
      const text = (finalTranscript + interim).trim()
      setInput(text)
      setJarvisText(text)
      // New round's live line — flips the seesaw (previous answer rides on
      // top) as soon as real words arrive. Empty interim events never flip.
      if (text) setLiveTranscribing(true)
      // Instant endpointing: the user paused ~1s after real speech —
      // stop now instead of waiting for the browser's own (often 5s+)
      // end-of-speech timeout. Each new result re-arms the timer.
      clearSilenceTimer()
      if (text) {
        silenceTimer = window.setTimeout(submitNow, 1100)
      }
    }
    recognition.onend = () => {
      clearSilenceTimer()
      setListening(false)
      recognitionRef.current = null
      const spoken = finalTranscript.trim()
      if (discardTranscriptRef.current || !scorpiOpenRef.current) {
        stopMeter()
        return
      }
      if (spoken) {
        // Keep the meter + levels alive while the bot answers — this is the
        // 400ms-ish silent gap where the rings used to snap off. The meter
        // loop keeps feeding frames until listening resumes.
        // Mute the mic while the reply plays (discard flag): the session
        // already ended here, so the bot's own voice can't echo back in.
        handleSend(spoken)
        discardTranscriptRef.current = true
      } else {
        stopMeter()
        // No speech captured (timeout/silence) — keep listening.
        window.setTimeout(() => startListening(), 300)
      }
    }
    recognition.onerror = (event) => {
      setListening(false)
      recognitionRef.current = null
      if (discardTranscriptRef.current || !scorpiOpenRef.current) {
        stopMeter()
        return
      }
      // "aborted" comes from our own mute-abort while the AI talks —
      // never restart the mic from here, the resume poll owns that.
      if (event.error === "aborted") {
        stopMeter()
        return
      }
      stopMeter()
      // The bot's own voice echoing into the mic causes capture flaps —
      // brief cooldown so we don't hot-loop. Other transient errors retry fast.
      const cooldown = event.error === "not-allowed" || event.error === "audio-capture" ? 1200 : 500
      window.setTimeout(() => startListening(), cooldown)
    }

    recognitionRef.current = recognition
    setListening(true)
    startMeter()
    try {
      recognition.start()
    } catch {
      recognitionRef.current = null
      setListening(false)
      stopMeter()
    }
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
    recognitionRef.current?.abort()
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
    // Voice transcripts from the SCORPI overlay arrive via recognitionRef;
    // otherwise block double-submits while a reply is being generated.
    if (!recognitionRef.current && typing) return
    const trimmed = text.trim()
    if (!trimmed || typing) return
    const newMessages: Message[] = [...messages, { from: "user", text: trimmed }]
    setMessages(newMessages)
    setInput("")
    // New exchange: clear the previous AI answer line right away and flip
    // the dialogue back to You-on-top while Scorpi's new reply loads.
    setAiReplyText("")
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
      if (ttsEnabled) void speakReply(replyText)
    } catch {
      const fallbackReply = findAnswer(trimmed)
      setMessages((prev) => [...prev, { from: "bot", text: fallbackReply }])
      setAiReplyText(fallbackReply)
      if (ttsEnabled) void speakReply(fallbackReply)
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
          // Mic unmutes HERE — after talking fully ends.
          discardTranscriptRef.current = false
          startListening()
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

  // Shared level driving the HUD rings in all states — smoothed every
  // frame by the session loop above, so the rings glide (never snap)
  // across listening -> speaking -> gap -> listening transitions.
  // Rings stay mounted the whole SCORPI session, so rotation never
  // restarts and the level never drops below a calm idle baseline.
  const ringDisplay = Math.max(ringSmooth, 0.18)
  // Dialogue order: normally You on top, Scorpi below. While the user speaks
  // a NEW round (live transcript + previous answer both on screen) the pair
  // swaps — Scorpi's last answer rides on top, the live line under it — then
  // flips back the moment the user stops and the reply starts loading.
  const dialogueFlipped = liveTranscribing && aiReplyText !== ""

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
              <span>Hi</span>
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
              }}
            >
              <FaTimes />
            </button>

            <div className="flex w-full max-w-md flex-col items-center text-center">
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
                {speaking ? "Talking" : listening ? "Listening" : typing ? "Thinking" : "Ready"}
              </div>

              <div
                className={`relative mt-4 h-72 w-72 sm:h-80 sm:w-80 ${speaking ? "scorpi-orb-talking" : ""}`}
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
                    }}
                  >
                    {/* HUD rings — constant rotation speed; voice only drives
                        glow, thickness & a gentle "hover" lift. Orb stays still. */}
                    {/* Outer segmented arcs, slow clockwise */}
                    <g
                      className="scorpi-ring-spin-slow"
                      style={{
                        transformOrigin: "100px 100px",
                        opacity: 0.55 + ringDisplay * 0.45,
                        // Gentle "hover" lift that grows with voice level.
                        scale: `${1 + ringDisplay * 0.035}`,
                      }}
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="96"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth={3 + ringDisplay * 2.5}
                        strokeLinecap="round"
                        strokeDasharray="55 40 15 40"
                      />
                      {/* Orbiting glow dot pinned to the outer arc — grows with voice */}
                      <circle cx="100" cy="4" r={3 + ringDisplay * 2.5} fill="#bfdbfe">
                        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </g>
                    {/* Long elegant arcs, medium clockwise */}
                    <g
                      className="scorpi-ring-spin"
                      style={{
                        transformOrigin: "100px 100px",
                        opacity: 0.7 + ringDisplay * 0.3,
                        scale: `${1 + ringDisplay * 0.025}`,
                      }}
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="88"
                        fill="none"
                        stroke="#93c5fd"
                        strokeWidth={2.5 + ringDisplay * 2}
                        strokeLinecap="round"
                        strokeDasharray="90 35 30 35"
                      />
                    </g>
                    {/* Tick-mark ring, counter-clockwise */}
                    <g
                      className="scorpi-ring-spin-reverse"
                      style={{
                        transformOrigin: "100px 100px",
                        opacity: 0.5 + ringDisplay * 0.5,
                        scale: `${1 + ringDisplay * 0.02}`,
                      }}
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth={1.5 + ringDisplay * 1.5}
                        strokeLinecap="round"
                        strokeDasharray="3 7"
                        opacity="0.8"
                      />
                      {/* Orbiting glow dot on the tick ring — grows with voice */}
                      <circle cx="180" cy="100" r={2.2 + ringDisplay * 2} fill="#93c5fd">
                        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                    </g>
                    {/* Inner accent dashes, fast counter-clockwise */}
                    <g
                      className="scorpi-ring-spin-reverse"
                      style={{
                        transformOrigin: "100px 100px",
                        animationDuration: "12s",
                        opacity: 0.6 + ringDisplay * 0.4,
                        scale: `${1 + ringDisplay * 0.015}`,
                      }}
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="72"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={1.5 + ringDisplay * 1.5}
                        strokeLinecap="round"
                        strokeDasharray="22 18 6 18"
                        opacity="0.9"
                      />
                    </g>
                  </svg>
                )}
              </div>

              <div className="mt-4 w-full space-y-1.5 text-center text-sm leading-relaxed">
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
                        {scorpiText || (listening ? "Speak now — I'm listening..." : "I'm listening...")}
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
