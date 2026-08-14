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

export type Certificate = {
  name: string
  issuer: string
  image: string
  credentialId?: string
  url?: string
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
  { name: "MySQL", category: "Database" },
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
  { name: "GEOLOCATION APP", description: "Location tracking and mapping application", image: "/api/projects/geolocation app.jpg" },
  { name: "CPMDWORKSPACE APP", description: "Workspace management system", image: "/api/projects/workspace.png" },
  { name: "TASKBOARD SYSTEM APP", description: "Task and project management board", image: "/api/projects/taskboard.png" },
  { name: "INVENTORY APP", description: "Stock and inventory tracking system", image: "/api/projects/inventory system.png" },
  { name: "WRITEUP APP", description: "Document writing and editing tool", image: "/api/projects/writeup.png" },
  { name: "BUDGET MANAGEMENT APP", description: "Financial planning and budget tracking", image: "/api/projects/budget management.png" },
  { name: "NOTICEBOARD APP", description: "Digital announcement and notice system", image: "/api/projects/noticeboard.png" },
  { name: "WHEREABOUTS APP", description: "Attendance and location tracking system", image: "/api/projects/whereabouts.png" },
  { name: "AI RESEARCH ASSISTANT APP", description: "AI-powered research and information assistant", image: "/api/projects/ai chatbot.png" },
]

export const SOCIALS = {
  email: "kentdarylgilowrk@gmail.com",
  github: "https://github.com/darylgilo",
  linkedin: "https://linkedin.com/in/daryl-gilo-23b727427",
  facebook: "https://facebook.com/darylgilo",
}

export const PROFILE_IMAGE = "/api/image/pixelimage.jpg"

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

export const CERTIFICATES: Certificate[] = [
  { name: "AI Fundamentals", issuer: "Coursera", image: "/api/certificates/AI fundamentals.pdf" },
  { name: "Cybersecurity Seminar", issuer: "Seminar", image: "/api/certificates/cybersecurity seminar.pdf" },
  { name: "Web Development", issuer: "DICT", image: "/api/certificates/darylgilo cert DICT WEB DEVELOPMENT1.pdf" },
  { name: "Basic JavaScript", issuer: "DICT", image: "/api/certificates/darylgilobasicJavaScript.pdf" },
  { name: "Static Website", issuer: "DICT", image: "/api/certificates/darylgilostaticwebsite.pdf" },
  { name: "Principles of Design", issuer: "DICT", image: "/api/certificates/dgiloprincipalsofdesign.pdf" },
  { name: "HTML and CSS Design", issuer: "DICT", image: "/api/certificates/DICT HTM and CSS Design.pdf" },
  { name: "Foundation of Cybersecurity", issuer: "Coursera", image: "/api/certificates/Foundation of Cybersecurity.pdf" },
  { name: "Foundations of User Experience (UX) Design", issuer: "Coursera", image: "/api/certificates/Foundations of User Experience (UX) Design.pdf" },
  { name: "Functional Composition", issuer: "DICT", image: "/api/certificates/Functional Composition.pdf" },
  { name: "Fundamental of Python Programming", issuer: "Coursera", image: "/api/certificates/Fundamental of Python Programming.pdf" },
  { name: "Introduction to Web Development", issuer: "Coursera", image: "/api/certificates/Introduction to web development.pdf" },
  { name: "Python", issuer: "DICT", image: "/api/certificates/python.pdf" },
  { name: "Start of UX Design", issuer: "Coursera", image: "/api/certificates/Start of UX design.pdf" },
  { name: "Technical Support Fundamentals", issuer: "Coursera", image: "/api/certificates/Technical Suppor Fundamentals.pdf" },
  { name: "Trends in Art and Design", issuer: "DICT", image: "/api/certificates/Trends in Art and Design.pdf" },
  { name: "Programming for Intermediate Users Using Python", issuer: "DICT", image: "/api/certificates/user-certificate-b3a0760a-cebe-4c8a-b1b7-7ff79e8532cf.pdf" },
  { name: "Digital Innovation in Government (ICT 001)", issuer: "DICT", image: "/api/certificates/user-certificate-c4b99f68-5ab6-4b94-aff2-463373ba91d1.pdf" },
  { name: "Web Content Management - WordPress", issuer: "DICT", image: "/api/certificates/Web content management - Wordpress.pdf" },
  { name: "Windows Server Administration", issuer: "Trainosys", image: "/api/certificates/Windows Server Administration.pdf" },
]