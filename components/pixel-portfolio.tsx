"use client"

import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { TemplateToggle } from "@/components/template-toggle"
import { ChatBot } from "@/components/chatbot"
import { AnimatePresence, motion } from "framer-motion"
import {
  PORTFOLIO_OWNER,
  SKILLS,
  TYPED_SKILLS,
  TECHNOLOGIES,
  PROJECTS,
  SOCIALS,
  PROFILE_IMAGE,
} from "@/lib/portfolio-data"
import {
  FaLaptopCode,
  FaServer,
  FaCloud,
  FaPalette,
  FaPen,
  FaFilm,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaChevronDown,
  FaPlay,
  FaTimes,
} from "react-icons/fa"
import type { Project } from "@/lib/portfolio-data"

const SKILL_ICONS: Record<string, React.ReactNode> = {
  "Full Stack Web Developer": <FaLaptopCode />,
  Sysadmin: <FaServer />,
  "Cloud Engineer": <FaCloud />,
  "Graphic Illustrator": <FaPalette />,
  "Graphic Designer": <FaPen />,
  "Multimedia Editor": <FaFilm />,
}

function TypingSkills() {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = TYPED_SKILLS[index]
    const speed = deleting ? 40 : 100
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)
        if (next === current) {
          setTimeout(() => setDeleting(true), 1500)
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
    <span className="text-sm md:text-lg lg:text-xl">
      [{text}
      <span className="animate-blink">_</span>]
    </span>
  )
}

function ProjectImage({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(true)
  return loaded ? (
    <img
      src={project.image}
      alt={project.name}
      onError={() => setLoaded(false)}
      className={project.name === "GEOLOCATION APP" ? "w-full max-h-[45vh] object-contain pixel-border mb-4" : "w-full h-auto pixel-border mb-4"}
    />
  ) : (
    <div className="w-full h-48 md:h-64 pixel-border mb-4 flex flex-col items-center justify-center gap-3 text-center px-4" style={{ color: 'var(--foreground)' }}>
      <span className="text-2xl animate-blink">[NO SCREENSHOT]</span>
      <span className="text-[10px]" style={{ opacity: 0.6 }}>
        ADD AN IMAGE LIKE {project.image} IN THE public/projects/ FOLDER
      </span>
    </div>
  )
}

export function PixelPortfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <div className="min-h-screen pixel-text scanline transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center backdrop-blur-sm transition-colors duration-300" style={{ backgroundColor: 'var(--background)', opacity: 0.8 }}>
        <div className="text-sm md:text-base flex items-center gap-2">
          <span className="animate-blink flex items-center" style={{ fontSize: '0.5rem' }}><FaPlay /></span> KDMG
        </div>
        <div className="flex items-center gap-4">
          <TemplateToggle variant="pixel" />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-4 flex justify-center"><img src={PROFILE_IMAGE} alt={PORTFOLIO_OWNER} className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-full border-4" style={{ imageRendering: 'auto', borderColor: 'currentColor' }} /></div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 leading-relaxed">
            {PORTFOLIO_OWNER}
          </h1>
          <div className="text-center h-6 md:h-8 mb-8" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            <TypingSkills />
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="#contact"
              className="pixel-btn px-8 py-4 text-sm md:text-base inline-block"
            >
              START GAME_
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-2xl flex justify-center"
        >
          <FaChevronDown />
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-20 px-4 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl mb-12 text-center"
          >
            ◆ SKILLS ◆
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="pixel-border p-6 transition-colors"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <div className="text-4xl mb-4 flex justify-center items-center" style={{ fontSize: '2rem' }}>{SKILL_ICONS[skill.name]}</div>
                <h3 className="text-xs md:text-sm">{skill.name}</h3>
                <div className="mt-4 h-2" style={{ backgroundColor: 'rgba(128,128,128,0.3)' }}>
                  <div
                    className="h-full"
                    style={{ width: `${skill.percentage}%`, backgroundColor: 'var(--progress)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="technologies" className="min-h-screen py-20 px-4 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl mb-12 text-center"
          >
            ◆ TECHNOLOGIES ◆
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TECHNOLOGIES.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="pixel-border p-4 text-center transition-colors"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <h3 className="text-xs md:text-sm font-semibold">{tech.name}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--foreground)', opacity: 0.6 }}>{tech.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-4 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl mb-12 text-center"
          >
            ◆ PROJECTS ◆
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, index) => (
              <motion.button
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProject(project)}
                className="pixel-border p-6 transition-colors text-left cursor-pointer w-full"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', fontFamily: 'inherit' }}
              >
                <h3 className="text-sm md:text-base font-semibold mb-2">{project.name}</h3>
                <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{project.description}</p>
                <p className="text-[10px] mt-3" style={{ color: 'var(--progress)', opacity: 0.8 }}>
                  [CLICK TO VIEW_]
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="pixel-border p-6 w-full max-w-6xl"
              style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm md:text-base font-semibold">{selectedProject.name}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="pixel-btn px-3 py-2 text-sm"
                  style={{ backgroundColor: 'var(--background)' }}
                  aria-label="Close project preview"
                >
                  <FaTimes />
                </button>
              </div>
              <ProjectImage project={selectedProject} />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{selectedProject.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Section */}
      <section id="about" className="min-h-screen py-20 px-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl mb-12 text-center"
          >
            ◆ ABOUT ◆
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pixel-border p-8" style={{ backgroundColor: 'var(--background)' }}
          >
            <p className="text-sm md:text-base leading-relaxed mb-6">
              I'm a passionate technologist who wears many hats in the digital
              world. From crafting elegant web applications to managing complex
              cloud infrastructure, I bring creativity and technical expertise
              to every project.
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-6 italic">
              "My disability may shape my journey, but it does not define my destination. With technology
              as my tool and determination as my strength, I can turn challenges into possibilities and
              dreams into reality."
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-6">
              My journey spans across full-stack development, system
              administration, cloud engineering, and creative design. This
              diverse skillset allows me to approach problems from multiple
              angles and deliver comprehensive solutions.
            </p>
            <p className="text-sm md:text-base leading-relaxed">
              When I'm not coding or managing servers, you'll find me creating
              digital art, editing multimedia content, or exploring new
              technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen py-20 px-4 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xl md:text-3xl mb-12 text-center"
          >
            ◆ CONTACT ◆
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pixel-border p-8"
            style={{ backgroundColor: 'var(--background)' }}
          >
            <p className="text-sm md:text-base mb-8 text-center">
              Ready to start a project? Let's connect!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:${SOCIALS.email}`}
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaEnvelope /></div>
                <div className="text-sm">EMAIL</div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={SOCIALS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaGithub /></div>
                <div className="text-sm">GITHUB</div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={SOCIALS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaLinkedin /></div>
                <div className="text-sm">LINKEDIN</div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={SOCIALS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaFacebook /></div>
                <div className="text-sm">FACEBOOK</div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm transition-colors duration-300" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', opacity: 0.7 }}>
        <p>© 2026 {PORTFOLIO_OWNER}</p>
      </footer>

      <ChatBot />
    </div>
  )
}