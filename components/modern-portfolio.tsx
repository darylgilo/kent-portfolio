"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"
import { TemplateToggle } from "./template-toggle"
import { ChatBot } from "./chatbot"
import {
  PORTFOLIO_OWNER,
  ROLE_LABEL,
  SKILLS,
  TYPED_SKILLS,
  TECHNOLOGIES,
  PROJECTS,
  SOCIALS,
  PROFILE_IMAGE,
  ABOUT_PARAGRAPHS,
  ABOUT_QUOTE,
} from "@/lib/portfolio-data"
import {
  FaLaptopCode,
  FaServer,
  FaCloud,
  FaLayerGroup,
  FaPen,
  FaFilm,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaArrowRight,
  FaTimes,
  FaCode,
  FaDatabase,
  FaTerminal,
  FaCogs,
} from "react-icons/fa"
import type { Project } from "@/lib/portfolio-data"

const skillIcons: Record<string, React.ReactNode> = {
  "Full Stack Web Developer": <FaLaptopCode />,
  "DevOps Engineer": <FaCogs />,
  "Cloud Engineer": <FaCloud />,
  "UI/UX Designer": <FaLayerGroup />,
  "Graphic Designer": <FaPen />,
  "Multimedia Editor": <FaFilm />,
}

function titleCaseRole(role: string) {
  return role
    .split(" ")
    .map((w) => {
      const cased = w.charAt(0) + w.slice(1).toLowerCase()
      return cased === "Ui/ux" ? "UI/UX" : cased
    })
    .join(" ")
}

function Typewriter() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = titleCaseRole(TYPED_SKILLS[index])
    const speed = deleting ? 30 : 80
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)
        if (next === current) {
          setTimeout(() => setDeleting(true), 1600)
        }
      } else {
        const next = current.slice(0, text.length - 1)
        setText(next)
        if (!next) {
          setDeleting(false)
          setIndex((i) => (i + 1) % TYPED_SKILLS.length)
        }
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [text, deleting, index])

  return (
    <span>
      {text}
      <span className="animate-type-bar">|</span>
    </span>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-14">
      <p
        className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-3"
        style={{ color: "var(--accent)" }}
      >
        {eyebrow}
      </p>
      <h2 className="text-2xl md:text-4xl font-bold">{title}</h2>
      <div
        className="mx-auto mt-4 h-1 w-16 rounded-full"
        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
      />
    </div>
  )
}

function ModernProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [loaded, setLoaded] = useState(true)
  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        transition={{ type: "spring", duration: 0.45 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: "var(--card)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <h3 className="font-bold text-sm md:text-lg">{project.name}</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-70"
            style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
            aria-label="Close project preview"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
        <div className="p-6">
          {loaded ? (
            <img
              src={project.image}
              alt={project.name}
              onError={() => setLoaded(false)}
              className="w-full max-h-[70vh] object-contain rounded-xl mb-5"
            />
          ) : (
            <div
              className="flex h-48 md:h-64 w-full flex-col items-center justify-center gap-3 rounded-xl text-center px-4 mb-5"
              style={{ backgroundColor: "var(--card-hover)", border: "1px dashed var(--border-color)" }}
            >
              <span className="font-semibold">No screenshot available</span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Add an image like {project.image} in the public/projects/ folder
              </span>
            </div>
          )}
          <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--muted)" }}>
            {project.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

export function ModernPortfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div
      className="modern-root min-h-screen transition-colors duration-300"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ backgroundColor: "var(--background)", borderBottom: "1px solid var(--border-color)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center">
            <span
              className="flex h-9 items-center justify-center rounded-lg px-2 text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
            >
              KDMG
            </span>
          </a>
          <div className="hidden items-center gap-7 text-xs font-medium md:flex" style={{ color: "var(--muted)" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-[var(--accent)]">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <TemplateToggle variant="modern" />
            <ThemeToggle variant="modern" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden px-4 pt-32 pb-20 md:pt-40">
        <div
          className="animate-blob absolute -top-20 right-10 h-80 w-80 rounded-full opacity-[var(--blob-opacity)] blur-3xl"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div
          className="animate-blob absolute -bottom-24 left-0 h-96 w-96 rounded-full opacity-[var(--blob-opacity)] blur-3xl"
          style={{ backgroundColor: "var(--accent-2)", animationDelay: "-6s" }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-sm md:text-base"
              style={{ color: "var(--accent)" }}
            >
              HELLO, I'M
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold leading-tight md:text-5xl"
            >
              {PORTFOLIO_OWNER}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg font-semibold md:text-2xl"
              style={{
                background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <Typewriter />
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-md text-sm leading-relaxed md:text-base"
              style={{ color: "var(--muted)" }}
            >
              Full Stack Developer, DevOps Engineer, Cloud Engineer, and Graphic Designer — I blend engineering
              with creativity to build elegant, reliable, and beautiful digital experiences.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
                style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
              >
                VIEW PROJECTS
                <FaArrowRight className="text-xs" />
              </a>
              <a
                href="#contact"
                className="rounded-full border-2 px-7 py-3.5 text-sm font-semibold transition-all hover:scale-105"
                style={{ borderColor: "var(--border-color)" }}
              >
                CONTACT ME
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center gap-4"
              style={{ color: "var(--muted)" }}
            >
              <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="GitHub"><FaGithub className="text-xl" /></a>
              <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="LinkedIn"><FaLinkedin className="text-xl" /></a>
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Facebook"><FaFacebook className="text-xl" /></a>
              <a href={`mailto:${SOCIALS.email}`} className="transition-transform hover:scale-110" aria-label="Email"><FaEnvelope className="text-xl" /></a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="relative mx-auto"
          >
            <div
              className="absolute inset-0 rounded-full opacity-40 blur-2xl"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))", transform: "scale(1.1)" }}
            />
            <img
              src={PROFILE_IMAGE}
              alt={PORTFOLIO_OWNER}
              className="relative h-48 w-48 rounded-full object-cover md:h-64 md:w-64"
              style={{
                border: "6px solid var(--background)",
                boxShadow: "0 0 0 4px var(--accent), 0 0 0 9px var(--accent-2), 0 25px 60px rgba(0,0,0,0.35)",
              }}
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="relative mx-auto mt-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 rounded-2xl p-6 md:gap-8 md:p-8"
            style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}
          >
            {[
              { value: "9+", label: "PROJECTS BUILT" },
              { value: "20+", label: "TECHNOLOGIES" },
              { value: "6", label: "SKILL SETS" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className="text-2xl font-extrabold md:text-4xl"
                  style={{
                    background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-[9px] font-medium tracking-widest md:text-[11px]" style={{ color: "var(--muted)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="What I do" title="My Skills" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-6 shadow-sm transition-shadow hover:shadow-lg"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
                >
                  {skillIcons[skill.name]}
                </div>
                <h3 className="text-sm font-bold md:text-base">{skill.name}</h3>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--card-hover)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
                  />
                </div>
                <p className="mt-2 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                  {skill.percentage}%
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section id="technologies" className="px-4 py-24" style={{ backgroundColor: "var(--card)" }}>
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="My arsenal" title="Technologies" />
          <div className="flex flex-wrap justify-center gap-3">
            {TECHNOLOGIES.map((tech, index) => (
              <motion.span
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 10) * 0.04 }}
                whileHover={{ scale: 1.06 }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-sm md:text-sm"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)" }}
              >
                {tech.category === "Database" ? (
                  <FaDatabase className="text-[var(--accent)] text-xs" />
                ) : tech.category === "Server" ? (
                  <FaTerminal className="text-[var(--accent)] text-xs" />
                ) : (
                  <FaCode className="text-[var(--accent)] text-xs" />
                )}
                {tech.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="My work" title="Projects" />
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, index) => (
              <motion.button
                key={project.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedProject(project)}
                className="overflow-hidden rounded-2xl text-left shadow-sm transition-shadow hover:shadow-xl"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)", cursor: "pointer" }}
              >
                <div className="relative overflow-hidden" style={{ backgroundColor: "var(--card-hover)" }}>
                  <img
                    src={project.image}
                    alt={project.name}
                    className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span
                    className="absolute right-3 top-3 rounded-full px-3 py-1 text-[9px] font-bold text-white"
                    style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-2))" }}
                  >
                    VIEW APP →
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold md:text-base">{project.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {project.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-4 py-24" style={{ backgroundColor: "var(--card)" }}>
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Get to know me" title="About" />
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative mx-auto"
            >
              <div
                className="absolute -inset-3 rounded-3xl opacity-25 blur-xl"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
              />
              <img
                src={PROFILE_IMAGE}
                alt={PORTFOLIO_OWNER}
                className="relative h-56 w-56 rounded-3xl object-cover md:h-64 md:w-64"
                style={{ border: "4px solid var(--background)", boxShadow: "0 0 0 3px var(--accent), 0 30px 60px rgba(0,0,0,0.3)" }}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mb-5 text-sm leading-relaxed md:text-base" style={{ color: "var(--muted)" }}>
                  {paragraph}
                </p>
              ))}
              <blockquote
                className="rounded-2xl p-6 text-sm font-semibold italic leading-relaxed"
                style={{ backgroundColor: "var(--background)", borderLeft: "4px solid var(--accent)" }}
              >
                {ABOUT_QUOTE}
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading eyebrow="Let's talk" title="Contact" />
          <p className="-mt-6 mb-10 text-center text-sm md:text-base" style={{ color: "var(--muted)" }}>
            {ROLE_LABEL} available for projects, collaborations, and new opportunities.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { label: "EMAIL", value: SOCIALS.email, href: `mailto:${SOCIALS.email}`, icon: <FaEnvelope /> },
              { label: "GITHUB", value: "@darylgilo", href: SOCIALS.github, icon: <FaGithub /> },
              { label: "LINKEDIN", value: "daryl-gilo", href: SOCIALS.linkedin, icon: <FaLinkedin /> },
              { label: "FACEBOOK", value: "@darylgilo", href: SOCIALS.facebook, icon: <FaFacebook /> },
            ].map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="flex items-center gap-5 rounded-2xl p-6 transition-shadow hover:shadow-lg"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border-color)" }}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
                >
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold tracking-widest" style={{ color: "var(--accent)" }}>
                    {item.label}
                  </span>
                  <span className="block truncate text-sm font-semibold">{item.value}</span>
                </span>
                <FaArrowRight className="ml-auto text-xs transition-transform group-hover:translate-x-1" style={{ color: "var(--muted)" }} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-4 py-10 text-center text-xs"
        style={{ color: "var(--muted)", borderTop: "1px solid var(--border-color)" }}
      >
        <p>© 2026 {PORTFOLIO_OWNER}. All rights reserved.</p>
      </footer>

      <AnimatePresence>
        {selectedProject && (
          <ModernProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      <ChatBot variant="modern" />
    </div>
  )
}