export type Skill = {
  name: string
  percentage: number
}

export type Technology = {
  name: string
  category: string
}

export type Project = {
  name: string
  description: string
  image: string
}

export const PORTFOLIO_OWNER = "KENT DARYL M. GILO"

export const ROLE_LABEL = "FULL STACK WEB DEVELOPER"

export const SKILLS: Skill[] = [
  { name: "Full Stack Web Developer", percentage: 85 },
  { name: "DevOps Engineer", percentage: 80 },
  { name: "Cloud Engineer", percentage: 80 },
  { name: "UI/UX Designer", percentage: 80 },
  { name: "Graphic Designer", percentage: 85 },
  { name: "Multimedia Editor", percentage: 80 },
]

export const TYPED_SKILLS: string[] = [
  "FULL STACK WEB DEVELOPER",
  "DEVOPS ENGINEER",
  "CLOUD ENGINEER",
  "UI/UX DESIGNER",
  "GRAPHIC DESIGNER",
  "MULTIMEDIA EDITOR",
]

export const TECHNOLOGIES: Technology[] = [
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
  { name: "TAILWIND CSS", category: "Framework" },
  { name: "GIT/GITHUB", category: "Platform" },
  { name: "DOCKER", category: "Platform" },
  { name: "CLOUDFLARE", category: "Platform" },
]

export const PROJECTS: Project[] = [
  { name: "GEOLOCATION APP", description: "Location tracking and mapping application", image: "/projects/geolocation app.jpg" },
  { name: "CPMDWORKSPACE APP", description: "Workspace management system", image: "/projects/workspace.png" },
  { name: "TASKBOARD SYSTEM APP", description: "Task and project management board", image: "/projects/taskboard.png" },
  { name: "INVENTORY APP", description: "Stock and inventory tracking system", image: "/projects/inventory system.png" },
  { name: "WRITEUP APP", description: "Document writing and editing tool", image: "/projects/writeup.png" },
  { name: "BUDGET MANAGEMENT APP", description: "Financial planning and budget tracking", image: "/projects/budget management.png" },
  { name: "NOTICEBOARD APP", description: "Digital announcement and notice system", image: "/projects/noticeboard.png" },
  { name: "WHEREABOUTS APP", description: "Attendance and location tracking system", image: "/projects/whereabouts.png" },
  { name: "AI RESEARCH ASSISTANT APP", description: "AI-powered research and information assistant", image: "/projects/ai chatbot.png" },
]

export const SOCIALS = {
  email: "kentdarylgilowrk@gmail.com",
  github: "https://github.com/darylgilo",
  linkedin: "https://linkedin.com/in/daryl-gilo-23b727427",
  facebook: "https://facebook.com/darylgilo",
}

export const PROFILE_IMAGE = "/image/pixelimage.jpg"

export const QUOTES: string[] = [
  "A degree may mark the end of a chapter, but continuous learning writes the rest of the story.",
  "Every bug is not a failure; it's a lesson waiting to be understood.",
  "Technology keeps evolving, and so should we. Stay curious, keep learning, keep building.",
  "Behind every working system is a process of learning, testing, failing, and improving.",
  "Good technology solves problems; good technologists understand the problems first.",
  "Learning to code is not just learning a language—it's learning how to think differently.",
  "In technology, progress starts with a simple question: 'How can I make this better?'",
  "Build something. Break something. Fix it. Learn from it. Repeat.",
  "The future belongs to those who are willing to keep learning.",
  "The best skill in technology is not knowing everything, but being willing to learn anything.",
]

export const ABOUT_PARAGRAPHS = [
  "I'm a passionate technologist who wears many hats in the digital world. From crafting elegant web applications to managing complex cloud infrastructure, I bring creativity and technical expertise to every project.",
  "My journey spans across full-stack development, system administration, cloud engineering, and creative design. This diverse skillset allows me to approach problems from multiple angles and deliver comprehensive solutions.",
  "When I'm not coding or managing servers, you'll find me creating digital art, editing multimedia content, or exploring new technologies.",
]

export const ABOUT_QUOTE =
  '"My disability may shape my journey, but it does not define my destination. With technology as my tool and determination as my strength, I can turn challenges into possibilities and dreams into reality."'