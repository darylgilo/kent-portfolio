"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"
import { 
  FaLaptopCode, 
  FaServer, 
  FaCloud, 
  FaPalette, 
  FaPen, 
  FaFilm,
  FaGhost,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaChevronDown,
  FaPlay
} from "react-icons/fa"

export default function Home() {
  const skills = [
    { name: "Full Stack Web Developer", icon: <FaLaptopCode /> },
    { name: "Sysadmin", icon: <FaServer /> },
    { name: "Cloud Engineer", icon: <FaCloud /> },
    { name: "Graphic Illustrator", icon: <FaPalette /> },
    { name: "Graphic Designer", icon: <FaPen /> },
    { name: "Multimedia Editor", icon: <FaFilm /> },
  ]

  return (
    <div className="min-h-screen pixel-text scanline transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center backdrop-blur-sm transition-colors duration-300" style={{ backgroundColor: 'var(--background)', opacity: 0.8 }}>
        <div className="text-sm md:text-base flex items-center gap-2">
          <span className="animate-blink flex items-center" style={{ fontSize: '0.5rem' }}><FaPlay /></span> KENT.DARYL
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
          <div className="text-6xl md:text-8xl mb-4 animate-float flex justify-center"><FaGhost /></div>
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
                <div className="mt-4 h-2" style={{ backgroundColor: 'var(--foreground)', opacity: 0.2 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="h-full bg-current"
                  />
                </div>
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
              to every project.
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
                href="mailto:contact@kentdaryl.dev"
                className="pixel-btn p-6 text-center block"
              >
                <div className="text-3xl mb-2 flex justify-center"><FaEnvelope /></div>
                <div className="text-sm">EMAIL</div>
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://github.com/kentdaryl"
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
                href="https://linkedin.com/in/kentdaryl"
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
                href="https://facebook.com/kentdaryl"
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
        <p>© 2024 KENT DARYL M. GILO</p>
        <p className="mt-2">PRESS START TO CONTINUE</p>
      </footer>
    </div>
  )
}
