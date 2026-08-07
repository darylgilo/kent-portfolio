"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { SnakeGame } from "@/components/snake-game"
import { motion } from "framer-motion"
import { 
  FaLaptopCode, 
  FaServer, 
  FaCloud, 
  FaPalette, 
  FaPen, 
  FaFilm,
  FaCoffee,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaChevronDown,
  FaPlay,
  FaDatabase,
  FaWindows,
  FaLinux,
  FaAws,
  FaFire
} from "react-icons/fa"

export default function Home() {
  const skills = [
    { name: "Full Stack Web Developer", icon: <FaLaptopCode />, percentage: 85 },
    { name: "Sysadmin", icon: <FaServer />, percentage: 80 },
    { name: "Cloud Engineer", icon: <FaCloud />, percentage: 80 },
    { name: "Graphic Illustrator", icon: <FaPalette />, percentage: 80 },
    { name: "Graphic Designer", icon: <FaPen />, percentage: 85 },
    { name: "Multimedia Editor", icon: <FaFilm />, percentage: 80 },
  ]

  const technologies = [
    { name: "LARAVEL", category: "Framework" },
    { name: "REACT JS", category: "Library" },
    { name: "REACT NATIVE", category: "Framework" },
    { name: "JAVASCRIPT", category: "Language" },
    { name: "TYPESCRIPT", category: "Language" },
    { name: "NEXT JS", category: "Framework" },
    { name: "POSTGRESQL", category: "Database" },
    { name: "PHP", category: "Language" },
    { name: "SQL", category: "Database" },
    { name: "WINDOWS SERVER", category: "Server" },
    { name: "LINUX SERVER", category: "Server" },
    { name: "VERCEL", category: "Platform" },
    { name: "LARAVEL CLOUD", category: "Platform" },
    { name: "FIREBASE", category: "Platform" },
    { name: "AWS", category: "Platform" },
    { name: "AI/ML", category: "AI" },
  ]

  const projects = [
    { name: "GEOLOCATION APP", description: "Location tracking and mapping application" },
    { name: "CPMDWORKSPACE APP", description: "Workspace management system" },
    { name: "LIBRARY SYSTEM APP", description: "Digital library management platform" },
    { name: "INVENTORY APP", description: "Stock and inventory tracking system" },
    { name: "WRITEUP APP", description: "Document writing and editing tool" },
    { name: "BUDGET MANAGEMENT APP", description: "Financial planning and budget tracking" },
    { name: "NOTICEBOARD APP", description: "Digital announcement and notice system" },
    { name: "WHEREABOUTS APP", description: "Attendance and location tracking system" },
    { name: "AI RESEARCH ASSISTANT APP", description: "AI-powered research and information assistant" },
  ]

  return (
    <div className="min-h-screen pixel-text scanline transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center backdrop-blur-sm transition-colors duration-300" style={{ backgroundColor: 'var(--background)', opacity: 0.8 }}>
        <div className="text-sm md:text-base flex items-center gap-2">
          <span className="animate-blink flex items-center" style={{ fontSize: '0.5rem' }}><FaPlay /></span> PORTFOLIO
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="text-6xl md:text-8xl mb-4 animate-float flex justify-center"><FaCoffee /></div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl mb-4 leading-relaxed">
            KENT DARYL M. GILO
          </h1>
          <p className="text-sm md:text-lg lg:text-xl mb-8" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            [FULL STACK DEVELOPER]
          </p>
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
            {skills.map((skill, index) => (
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
                <div className="text-4xl mb-4 flex justify-center items-center" style={{ fontSize: '2rem' }}>{skill.icon}</div>
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
            {technologies.map((tech, index) => (
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
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="pixel-border p-6 transition-colors"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <h3 className="text-sm md:text-base font-semibold mb-2">{project.name}</h3>
                <p className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.7 }}>{project.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              to every project. I'm also a PWD (Person With Disability), and I
              believe that diversity and inclusion make us stronger.
            </p>
            <p className="text-sm md:text-base leading-relaxed mb-6 italic">
              "Technology is my weapon — disability is not inability. Through code,
              I can build bridges, create solutions, and move mountains."
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
                href="mailto:kentdarylgilowrk@gmail.com"
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaEnvelope /></div>
                <div className="text-sm">EMAIL</div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://github.com/darylgilo"
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
                href="https://linkedin.com/in/daryl-gilo-23b727427"
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
                href="https://facebook.com/darylgilo"
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaFacebook /></div>
                <div className="text-sm">FACEBOOK</div>
              </motion.a>
            </div>

            <SnakeGame />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm transition-colors duration-300" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', opacity: 0.7 }}>
        <p>© 2026 KENT DARYL M. GILO</p>
      </footer>
    </div>
  )
}
