"use client"

import { useEffect, useRef, useState } from "react"
import { FaRobot, FaTimes, FaPaperPlane, FaCommentDots } from "react-icons/fa"

type Message = {
  from: "user" | "bot"
  text: string
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
  "GRAPHIC ILLUSTRATOR — 80%",
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
    keywords: ["hi", "hello", "hey", "kamusta", "kumusta"],
    answer:
      "HELLO, HUMAN! I'M KENT'S PERSONAL ASSISTANT BOT. ASK ME ABOUT HIS SKILLS, PROJECTS, TECHNOLOGIES, OR HOW TO CONTACT HIM. TYPE A QUESTION BELOW OR TAP A QUICK QUESTION.",
  },
  {
    keywords: ["name", "who", "kent", "daryl", "gilo", "about", "you"],
    priority: 1,
    answer:
      "THIS PORTFOLIO BELONGS TO KENT DARYL M. GILO — A FULL STACK DEVELOPER. HE'S A TECHNOLOGIST WEARING MANY HATS: DEVELOPER, SYSADMIN, CLOUD ENGINEER, GRAPHIC DESIGNER, AND MULTIMEDIA EDITOR.",
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
      "KENT IS A PWD (PERSON WITH DISABILITY) AND BELIEVES DIVERSITY AND INCLUSION MAKE US STRONGER. HIS MANTRA: \"TECHNOLOGY IS MY WEAPON — DISABILITY IS NOT INABILITY. THROUGH CODE, I CAN BUILD BRIDGES, CREATE SOLUTIONS, AND MOVE MOUNTAINS.\"",
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
      text: "HELLO! I'M THE PORTFOLIO ASSISTANT BOT. ASK ME ANYTHING ABOUT KENT!",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing, open])

  function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    setMessages((prev) => [...prev, { from: "user", text: trimmed }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: findAnswer(trimmed) }])
      setTyping(false)
    }, 600)
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="pixel-btn w-14 h-14 flex items-center justify-center text-xl"
        style={{ backgroundColor: "var(--background)", position: "fixed", bottom: "1.5rem", right: "1.5rem" }}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
      >
        {open ? <FaTimes /> : <FaCommentDots />}
      </button>

      {open && (
        <div
          className="w-[calc(100vw-3rem)] max-w-sm flex flex-col pixel-border"
          style={{ backgroundColor: "var(--background)", height: "60vh", maxHeight: "480px", position: "fixed", bottom: "6rem", right: "1.5rem", zIndex: 50 }}
        >
          <div className="p-4 flex items-center gap-3 border-b-4" style={{ borderColor: "currentColor" }}>
            <div className="text-xl"><FaRobot /></div>
            <div>
              <div className="text-xs md:text-sm font-semibold">PORTFOLIO BOT</div>
              <div className="text-[10px]" style={{ opacity: 0.6 }}>ONLINE_ ASK ME ANYTHING</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {messages.map((msg, i) => (
              <div key={i} className={msg.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className="px-3 py-2 max-w-[85%] whitespace-pre-line break-words"
                  style={{
                    border: "3px solid currentColor",
                    backgroundColor: msg.from === "user" ? "var(--progress)" : "var(--background)",
                    color: msg.from === "user" ? "var(--background)" : "var(--foreground)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 animate-blink" style={{ border: "3px solid currentColor" }}>
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
                  className="pixel-btn px-3 py-2 text-left w-full text-[11px]"
                  style={{ backgroundColor: "var(--background)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex gap-2 p-4 border-t-4"
            style={{ borderColor: "currentColor" }}
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(input)
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="TYPE A QUESTION..."
              className="flex-1 min-w-0 px-3 py-2 text-xs outline-none"
              style={{ border: "3px solid currentColor", backgroundColor: "var(--background)", color: "var(--foreground)" }}
            />
            <button
              type="submit"
              className="pixel-btn px-3 py-2 text-sm"
              style={{ backgroundColor: "var(--background)" }}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
