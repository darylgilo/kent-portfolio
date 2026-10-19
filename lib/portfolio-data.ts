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
  { name: "IT Support", percentage: 85 },
  { name: "Mobile Developer", percentage: 80 },
  { name: "AI Engineering", percentage: 75 },
]

export const TYPED_SKILLS: string[] = [
  "FULL STACK WEB DEVELOPER",
  "DEVOPS ENGINEER",
  "CLOUD ENGINEER",
  "UI/UX DESIGNER",
  "GRAPHIC DESIGNER",
  "MULTIMEDIA EDITOR",
  "IT SUPPORT",
  "MOBILE DEVELOPER",
  "AI ENGINEERING",
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

export const PROFILE_IMAGE = "/api/image/darylphoto.png"

export const QUOTES: string[] = [
  "A degree may mark the end of a chapter, but continuous learning writes the rest of the story.",
  "Every bug is not a failure; it's a lesson waiting to be understood.",
  "The art of turning 'Madali lang 'yan sa app!' into 2,000 lines of functional logic.",
  "Behind every working system is a process of learning, testing, failing, and improving.",
  "Good technology solves problems; good technologists understand the problems first.",
  "Non-tech people think making an app takes two hours because they watched a 30-second tutorial on TikTok and Youtube.",
  "Learning to code is not just learning a language—it's learning how to think differently.",
  "Build something. Break something. Fix it. Learn from it. Repeat.",
  "Code is like magic, except the spells are written in JavaScript and the magic trick actually works.",
  "The future belongs to those who are willing to keep learning.",
  "The best skill in technology is not knowing everything, but being willing to learn anything.",
  "Building a web app isn't just clicking a few buttons—it’s negotiating with servers, fighting CSS layouts, and convincing the database to behave.",
  "Making a web app look easy to use is the hardest part of building it.",
  "Where creative imagination meets strict logical execution.",
  "Making tech work so gracefully that people think it’s simple, sana parehas tayo ng nararamdaman diba.",
  "Making tech work so gracefully that people think it’s simple—behind every 'easy' feature is our sweat, logic, and endless caffeine.",
]

export const ABOUT_PARAGRAPHS = [
  "I'm a technology enthusiast passionate about building digital solutions that combine technical excellence with creative thinking. I enjoy exploring different areas of technology, developing applications, and finding effective ways to solve real-world problems.",
  "My experience spans software development, system administration, cloud technologies, and digital design. This diverse skill set allows me to approach challenges from different perspectives and build solutions that are functional, reliable, and thoughtfully designed.",
  "Beyond development, I enjoy exploring new technologies, creating digital art, and working with multimedia. I'm always eager to learn, experiment, and discover new possibilities through technology.",
]

export const ABOUT_QUOTE =
  '"My disability may shape my journey, but it does not define my destination. With technology as my tool and determination as my strength, I can turn challenges into possibilities and dreams into reality."'

export const CERTIFICATES: Certificate[] = [
  { name: "AI Fundamentals", issuer: "Coursera", image: "/api/certificates/AI fundamentals.png" },
  { name: "Cybersecurity Seminar", issuer: "Seminar", image: "/api/certificates/cybersecurity seminar.png" },
  { name: "Web Development", issuer: "DICT", image: "/api/certificates/darylgilo cert DICT WEB DEVELOPMENT1.png" },
  { name: "Basic JavaScript", issuer: "DICT", image: "/api/certificates/darylgilobasicJavaScript.png" },
  { name: "Static Website", issuer: "DICT", image: "/api/certificates/darylgilostaticwebsite.png" },
  { name: "Principles of Design", issuer: "DICT", image: "/api/certificates/dgiloprincipalsofdesign.png" },
  { name: "HTML and CSS Design", issuer: "DICT", image: "/api/certificates/DICT HTM and CSS Design.png" },
  { name: "Foundation of Cybersecurity", issuer: "Coursera", image: "/api/certificates/Foundation of Cybersecurity.png" },
  { name: "Foundations of User Experience (UX) Design", issuer: "Coursera", image: "/api/certificates/Foundations of User Experience (UX) Design.png" },
  { name: "Functional Composition", issuer: "DICT", image: "/api/certificates/Functional Composition.png" },
  { name: "Fundamental of Python Programming", issuer: "Data Analytics Philippines", image: "/api/certificates/Fundamental of Python Programming.png" },
  { name: "Introduction to Web Development", issuer: "LifeGiver", image: "/api/certificates/Introduction to web development.png" },
  { name: "Python", issuer: "DICT", image: "/api/certificates/python.png" },
  { name: "Start of UX Design", issuer: "Coursera", image: "/api/certificates/Start of UX design.png" },
  { name: "Technical Support Fundamentals", issuer: "Coursera", image: "/api/certificates/Technical Suppor Fundamentals.png" },
  { name: "Trends in Art and Design", issuer: "DICT", image: "/api/certificates/Trends in Art and Design.png" },
  { name: "Programming for Intermediate Users Using Python", issuer: "DICT", image: "/api/certificates/user-certificate-b3a0760a-cebe-4c8a-b1b7-7ff79e8532cf.png" },
  { name: "Digital Innovation in Government (ICT 001)", issuer: "DICT", image: "/api/certificates/user-certificate-c4b99f68-5ab6-4b94-aff2-463373ba91d1.png" },
  { name: "Web Content Management - WordPress", issuer: "DICT", image: "/api/certificates/Web content management - Wordpress.png" },
  { name: "Windows Server Administration", issuer: "Trainosys", image: "/api/certificates/Windows Server Administration.png" },
]