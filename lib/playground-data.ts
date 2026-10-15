export type LessonPreviewType = "html" | "css" | "javascript" | "react" | "static"

export type Lesson = {
  id: string
  moduleId: string
  /** Optional sidebar group label — grouped lessons render under one collapsible header (e.g. "Hooks"). */
  group?: string
  title: string
  description: string
  explanation: string
  code: string
  language: string
  previewType: LessonPreviewType
  interactive: boolean
  topics: string[]
  expectedOutput?: string
  sampleTable?: { headers: string[]; rows: string[][] }
  sections?: { title: string; content: string }[]
}

export type ModuleCategoryId =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "fullstack"
  | "framework"
  | "library"

export type ModuleCategory = {
  id: ModuleCategoryId
  label: string
}

/** Ordered group labels rendered as the top tab row in the playground header. */
export const MODULE_CATEGORIES: ModuleCategory[] = [
  { id: "frontend", label: "Front End" },
  { id: "backend", label: "Back End" },
  { id: "database", label: "Database" },
  { id: "devops", label: "DevOps" },
  { id: "fullstack", label: "Full Stack" },
  { id: "framework", label: "Framework" },
  { id: "library", label: "Library" },
]

export type Module = {
  id: string
  label: string
  description: string
  /** Header group this module's tab lives under. */
  category: ModuleCategoryId
}

export const PLAYGROUND_MODULES: Module[] = [
  { id: "html", label: "HTML", description: "Structure of the web — elements, text, links, forms.", category: "frontend" },
  { id: "css", label: "CSS", description: "Styling — colors, layout, flexbox, transforms.", category: "frontend" },
  { id: "tailwind", label: "Tailwind", description: "Utility-first styling, compared against raw CSS.", category: "framework" },
  { id: "javascript", label: "JavaScript", description: "Logic, DOM, events, async code.", category: "frontend" },
  { id: "typescript", label: "TypeScript", description: "Typed JavaScript — safer, clearer code.", category: "fullstack" },
  { id: "react", label: "React", description: "Components, props, and state.", category: "library" },
  { id: "nextjs", label: "Next.js", description: "App Router, routing, and rendering concepts.", category: "fullstack" },
  { id: "php", label: "PHP", description: "Server-side syntax and expected output.", category: "backend" },
  { id: "sql", label: "SQL", description: "Queries with sample tables and results.", category: "database" },
  { id: "github", label: "Git & GitHub", description: "Commands with example terminal output.", category: "devops" },
]

/** Modules belonging to one header group, in tab order. */
export function modulesForCategory(category: ModuleCategoryId): Module[] {
  return PLAYGROUND_MODULES.filter((m) => m.category === category)
}

export const PLAYGROUND_LESSONS: Lesson[] = [
  {
    id: "html-text-headings",
    moduleId: "html",
    group: "Page Elements",
    title: "Text & Headings",
    description: "Headings, paragraphs, and basic text structure.",
    explanation:
      "HTML gives a page its structure. Headings (h1-h6) describe hierarchy, and p holds paragraphs of text. Try editing the heading or adding a new p element, then watch the preview update.",
    code: "<h1>Hello, developer!</h1>\n<p>This is a paragraph. Edit me in the code editor.</p>\n<h2>A smaller heading</h2>\n<p>Add your own paragraph below and see it appear instantly.</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["h1-h6", "p", "structure"],
  },
  {
    id: "html-forms",
    moduleId: "html",
    title: "Forms & Inputs",
    description: "Collect user input with form elements.",
    explanation:
      "Forms collect input. The input element changes behavior through its type attribute — text, email, password, and more. Try changing an input type (text to email) or adding a new field.",
    code: "<form>\n  <label>Name</label><br />\n  <input type=\"text\" placeholder=\"Your name\" /><br /><br />\n  <label>Email</label><br />\n  <input type=\"email\" placeholder=\"you@example.com\" /><br /><br />\n  <button type=\"submit\">Submit</button>\n</form>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["form", "input", "label", "button"],
  },
  {
    id: "css-box-model",
    moduleId: "css",
    title: "Box Model",
    description: "Content, padding, border, and margin.",
    explanation:
      "Every element is a box: content, then padding, then border, then margin. Padding adds space inside; margin adds space outside. Try changing the padding or margin values.",
    code: "<style>\n  .box {\n    width: 160px;\n    background: #7c5cff;\n    color: white;\n    padding: 20px;\n    border: 4px solid #2f2a6b;\n    margin: 24px;\n    border-radius: 12px;\n    font-family: sans-serif;\n  }\n</style>\n\n<div class=\"box\">Edit my padding and margin!</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["padding", "margin", "border"],
  },
  {
    id: "css-flexbox",
    moduleId: "css",
    group: "Layout",
    title: "Flexbox Centering",
    description: "Center anything with three lines of CSS.",
    explanation:
      "Flexbox lays out children along an axis. display flex turns it on, justify-content aligns the main axis, align-items aligns across it. Try flex-start or flex-end to feel each axis.",
    code: "<style>\n  .stage {\n    height: 220px;\n    background: #14141a;\n    border-radius: 12px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  .card {\n    background: #22d3ee;\n    color: #062a33;\n    font-family: sans-serif;\n    font-weight: bold;\n    padding: 16px 28px;\n    border-radius: 10px;\n  }\n</style>\n\n<div class=\"stage\">\n  <div class=\"card\">Centered!</div>\n</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["flex", "justify-content", "align-items"],
  },
  {
    id: "css-transform",
    moduleId: "css",
    group: "Motion",
    title: "Transforms",
    description: "Rotate, scale, and move elements.",
    explanation:
      "The transform property changes shape without disturbing layout. rotate() spins by degrees. Try 0deg, 90deg, or 180deg and see the result immediately.",
    code: "<style>\n  .box {\n    width: 100px;\n    height: 100px;\n    background: purple;\n    transform: rotate(45deg);\n    margin: 60px auto;\n    border-radius: 12px;\n  }\n</style>\n\n<div class=\"box\"></div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["transform", "rotate"],
  },
]


export const PLAYGROUND_LESSONS_PART2: Lesson[] = [
  {
    id: "tailwind-flex-center",
    moduleId: "tailwind",
    group: "Layout",
    title: "Flex Centering in Tailwind",
    description: "The same centering, the utility way.",
    explanation:
      "Tailwind teaches best next to raw CSS. The CSS version needs a style block with display, alignment, and padding. The Tailwind version says the same thing as utility classes: flex items-center justify-center p-5.",
    code: "<div class=\"flex items-center justify-center p-5\"\n     style=\"height:220px;background:#14141a;border-radius:12px;\">\n  <div style=\"background:#22d3ee;color:#062a33;font-weight:bold;padding:16px 28px;border-radius:10px;font-family:sans-serif;\">\n    Centered with utilities!\n  </div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["flex", "items-center", "justify-center"],
  },
  {
    id: "js-variables",
    moduleId: "javascript",
    title: "Variables & Output",
    description: "Store values and print them to the console.",
    explanation:
      "const declares a value that will not be reassigned; let allows reassignment. console.log prints to the console panel. Try changing values, then press Run.",
    code: "<script>\n  const name = \"Kent\";\n  let projects = 9;\n  projects = projects + 1;\n  console.log(\"Hello, \" + name + \"!\");\n  console.log(\"Projects built: \" + projects);\n</script>\n\n<p>See the console panel below. Press Run after editing.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["const", "let", "console.log"],
  },
  {
    id: "js-events",
    moduleId: "javascript",
    group: "DOM",
    title: "Events",
    description: "React to clicks with addEventListener.",
    explanation:
      "querySelector finds the button, addEventListener click runs a function on every click. Click the button in the preview — output lands in the console panel.",
    code: "<button id=\"button\" style=\"background:#7c5cff;color:white;border:none;border-radius:10px;padding:12px 24px;font-size:15px;cursor:pointer;\">Click me</button>\n\n<script>\n  const button = document.querySelector(\"#button\");\n  button.addEventListener(\"click\", () => {\n    console.log(\"Button clicked!\");\n  });\n</script>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["querySelector", "addEventListener"],
  },
  {
    id: "react-state",
    moduleId: "react",
    group: "Hooks",
    title: "State with useState",
    description: "A counter that updates live.",
    explanation:
      "State is data a component remembers. useState(0) creates a count starting at 0; setCount updates it and React re-renders. The preview below is a real working demo — click the button.",
    code: "const [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>\n  Count: {count}\n</button>",
    language: "tsx",
    previewType: "react",
    interactive: true,
    topics: ["useState", "onClick"],
  },
]

export const PLAYGROUND_LESSONS_PART3: Lesson[] = [
  {
    id: "ts-annotations",
    moduleId: "typescript",
    title: "Type Annotations",
    description: "Say what type each value is.",
    explanation:
      "TypeScript adds types to JavaScript. string means text, number means a number. The compiler catches mistakes before code runs. This lesson is read-and-study: types are checked at build time, so there is no live runtime.",
    code: "const username: string = \"kent\";\nconst projects: number = 9;\nconst isAvailable: boolean = true;\n\nfunction greet(name: string): string {\n  return \"Hello, \" + name + \"!\";\n}\n\nconsole.log(greet(username));",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["string", "number", "boolean"],
    expectedOutput: "Hello, kent!",
  },
  {
    id: "ts-interfaces",
    moduleId: "typescript",
    title: "Interfaces",
    description: "Describe the shape of objects.",
    explanation:
      "An interface declares the shape an object must have — which properties, and of which type. If a required property is missing, TypeScript complains immediately.",
    code: "interface Project {\n  name: string;\n  description: string;\n  year: number;\n}\n\nconst app: Project = {\n  name: \"Geolocation App\",\n  description: \"Location tracking and mapping\",\n  year: 2024,\n};",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["interface", "object shape"],
    expectedOutput: "No errors — app matches the Project shape.",
  },
  {
    id: "nextjs-routing",
    moduleId: "nextjs",
    group: "Routing",
    title: "App Router Basics",
    description: "Folders become routes.",
    explanation:
      "In the App Router, every folder inside app with a page.tsx file becomes a URL. app/page.tsx is slash, app/about/page.tsx is slash-about, and brackets mean dynamic segments. This lesson is conceptual — study the structure.",
    code: "app/\n  page.tsx            ->  /\n  about/\n    page.tsx          ->  /about\n  blog/\n    [slug]/\n      page.tsx        ->  /blog/anything\n  layout.tsx          ->  shared wrapper",
    language: "text",
    previewType: "static",
    interactive: false,
    topics: ["app router", "pages", "dynamic routes"],
    expectedOutput: "Folders map to URLs. Brackets mean dynamic segments.",
  },
  {
    id: "php-basics",
    moduleId: "php",
    title: "PHP Fundamentals",
    description: "Server-side syntax and output.",
    explanation:
      "PHP runs on the server, not in the browser — so this lesson shows syntax plus expected output instead of a live preview. Variables start with dollar sign, echo prints text.",
    code: "<?php\n$name = \"Kent\";\n$projects = 9;\n\necho \"Hello, \" . $name . \"!\";\necho \"Projects: \" . $projects;\n\nforeach ([\"HTML\", \"CSS\", \"JS\"] as $skill) {\n  echo \"- \" . $skill;\n}",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["variables", "echo", "foreach"],
    expectedOutput: "Hello, Kent! | Projects: 9 | - HTML | - CSS | - JS",
  },
  {
    id: "sql-select",
    moduleId: "sql",
    group: "CRUD",
    title: "SELECT and WHERE",
    description: "Ask the database a question.",
    explanation:
      "SQL asks questions of tables. SELECT chooses columns, FROM chooses the table, WHERE filters rows, ORDER BY sorts them. No live database in V1 — study the sample table and expected result.",
    code: "SELECT name, year\nFROM projects\nWHERE year >= 2024\nORDER BY year DESC;",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["SELECT", "WHERE", "ORDER BY"],
    sampleTable: {
      headers: ["name", "year"],
      rows: [
        ["Geolocation App", "2023"],
        ["Taskboard App", "2024"],
        ["AI Research Assistant", "2025"],
      ],
    },
    expectedOutput: "AI Research Assistant — 2025 | Taskboard App — 2024",
  },
  {
    id: "git-basics",
    moduleId: "github",
    title: "First Commit Flow",
    description: "From init to push.",
    explanation:
      "Git lessons are visual tutorials: commands plus the terminal output they produce. This is the classic first-push flow — memorize it, you will use it constantly.",
    code: "git init\ngit add .\ngit commit -m \"Initial commit\"\ngit branch -M main\ngit remote add origin <repository-url>\ngit push -u origin main",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["init", "commit", "push"],
    expectedOutput: "[main (root-commit)] Initial commit — 3 files changed. Branch main set up to track origin/main.",
  },
]

export const PLAYGROUND_LESSONS_PART4: Lesson[] = [
  {
    id: "html-links",
    moduleId: "html",
    group: "Page Elements",
    title: "Links",
    description: "Navigate with anchor tags.",
    explanation:
      "The a tag creates links. href is the destination. Use slash-path for internal pages and https for external sites. target blank opens a new tab.",
    code: "<a href=\"#home\">Go to Home section</a>\n<p><a href=\"https://nextjs.org\">Visit Next.js docs</a></p>\n<p>Try changing the href or link text.</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["a", "href"],
  },
  {
    id: "html-lists",
    moduleId: "html",
    group: "Page Elements",
    title: "Lists",
    description: "Ordered, unordered, and nested lists.",
    explanation:
      "ul is a bulleted list, ol is numbered, and each item is an li. Lists can nest inside each other. Try adding items or changing ol to ul.",
    code: "<h3>My stack</h3>\n<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n<h3>Steps</h3>\n<ol>\n  <li>Learn</li>\n  <li>Build</li>\n  <li>Deploy</li>\n</ol>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["ul", "ol", "li"],
  },
  {
    id: "html-tables",
    moduleId: "html",
    group: "Page Elements",
    title: "Tables",
    description: "Rows and columns of data.",
    explanation:
      "table holds tabular data. tr is a row, th is a header cell, td is a data cell. Try adding a row or a new column.",
    code: "<table border=\"1\" cellpadding=\"8\">\n  <tr><th>Skill</th><th>Level</th></tr>\n  <tr><td>HTML</td><td>Advanced</td></tr>\n  <tr><td>CSS</td><td>Intermediate</td></tr>\n</table>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["table", "tr", "td"],
  },
  {
    id: "html-semantic",
    moduleId: "html",
    group: "Semantics & A11y",
    title: "Semantic HTML in Depth",
    description: "Meaningful page structure.",
    explanation:
      "Semantic tags describe meaning: header, nav, main, section, footer. They help accessibility and SEO versus plain divs everywhere.",
    code: "<header><h2>My Site</h2></header>\n<nav><a href=\"#a\">Home</a> | <a href=\"#b\">About</a></nav>\n<main>\n  <section><h3>Welcome</h3><p>Real content goes here.</p></section>\n</main>\n<footer><small>Footer info</small></footer>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["header", "nav", "main", "footer"],
  },
  {
    id: "html-images",
    moduleId: "html",
    group: "Page Elements",
    title: "Images",
    description: "Show pictures with alt text.",
    explanation:
      "img shows pictures. src is the file path, alt describes the image for screen readers. Always write meaningful alt text.",
    code: "<img src=\"/api/image/logo%20app.png\" alt=\"Portfolio logo\" width=\"80\" />\n<p>Try changing the width or the alt text.</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["img", "src", "alt"],
  },
]


export const PLAYGROUND_LESSONS_PART5: Lesson[] = [
  {
    id: "css-selectors",
    moduleId: "css",
    title: "Selectors",
    description: "Target elements precisely.",
    explanation:
      "Selectors pick which elements to style: element names, .classes, and #ids. Class selectors are reusable; id selectors should be unique.",
    code: "<style>\n  p { color: #555; font-family: sans-serif; }\n  .highlight { color: #7c5cff; font-weight: bold; }\n  #special { background: #fff7cc; padding: 8px; border-radius: 8px; }\n</style>\n\n<p>Normal paragraph.</p>\n<p class=\"highlight\">Highlighted with a class.</p>\n<p id=\"special\">Styled with an id.</p>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["class", "id", "element"],
  },
  {
    id: "css-colors",
    moduleId: "css",
    title: "Colors",
    description: "Hex, rgb, and named colors.",
    explanation:
      "Colors can be names (purple), hex codes (#7c5cff), or rgb values. Hex is most common in real codebases. Try swapping the swatch colors.",
    code: "<style>\n  .row { display: flex; gap: 12px; font-family: sans-serif; }\n  .sw { width: 90px; height: 90px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; }\n</style>\n<div class=\"row\">\n  <div class=\"sw\" style=\"background: purple;\">named</div>\n  <div class=\"sw\" style=\"background: #7c5cff;\">hex</div>\n  <div class=\"sw\" style=\"background: rgb(34, 211, 238);\">rgb</div>\n</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["hex", "rgb", "color"],
  },
  {
    id: "css-grid",
    moduleId: "css",
    group: "Layout",
    title: "Grid",
    description: "Two-dimensional layouts.",
    explanation:
      "Grid handles rows and columns together. grid-template-columns defines sizes — 1fr is one fraction of free space. Try 1fr 2fr 1fr.",
    code: "<style>\n  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }\n  .card { background: #7c5cff; color: white; font-family: sans-serif; padding: 20px; border-radius: 10px; text-align: center; }\n</style>\n<div class=\"grid\">\n  <div class=\"card\">1</div>\n  <div class=\"card\">2</div>\n  <div class=\"card\">3</div>\n  <div class=\"card\">4</div>\n  <div class=\"card\">5</div>\n  <div class=\"card\">6</div>\n</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["grid", "columns", "gap"],
  },
  {
    id: "css-position",
    moduleId: "css",
    group: "Layout",
    title: "Positioning",
    description: "Static, relative, absolute.",
    explanation:
      "position relative moves an element from its normal spot; absolute positions it against the nearest positioned ancestor. Try changing top and left.",
    code: "<style>\n  .wrap { position: relative; background: #14141a; border-radius: 12px; height: 160px; font-family: sans-serif; }\n  .badge { position: absolute; top: 12px; right: 12px; background: #22d3ee; color: #062a33; font-weight: bold; font-size: 12px; padding: 6px 12px; border-radius: 999px; }\n  .label { position: relative; top: 60px; left: 20px; color: white; }\n</style>\n<div class=\"wrap\">\n  <div class=\"badge\">NEW</div>\n  <div class=\"label\">Move me with top and left.</div>\n</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["relative", "absolute"],
  },
]


export const PLAYGROUND_LESSONS_PART6: Lesson[] = [
  {
    id: "css-transitions",
    moduleId: "css",
    group: "Motion",
    title: "Transitions",
    description: "Smooth state changes on hover.",
    explanation:
      "transition animates property changes over time. Hover the button to see background and scale glide instead of snap. Try 0.2s vs 1s.",
    code: "<style>\n  .btn { background: #7c5cff; color: white; border: none; border-radius: 10px; padding: 14px 30px; font-size: 15px; cursor: pointer; transition: background 0.3s, transform 0.3s; }\n  .btn:hover { background: #22d3ee; transform: scale(1.08); }\n</style>\n<button class=\"btn\">Hover me</button>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["transition", "hover"],
  },
  {
    id: "css-animations",
    moduleId: "css",
    group: "Motion",
    title: "Animations",
    description: "Keyframes that loop forever.",
    explanation:
      "Keyframes describe a timeline from state to state, looping with infinite. Try changing the distance or duration.",
    code: "<style>\n  .ball { width: 50px; height: 50px; border-radius: 50%; background: #7c5cff; animation: bounce 1.2s ease-in-out infinite; }\n  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-40px); } }\n</style>\n<div class=\"ball\"></div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["keyframes", "animation"],
  },
  {
    id: "css-media",
    moduleId: "css",
    title: "Media Queries",
    description: "Different styles per screen size.",
    explanation:
      "Media queries apply rules only when conditions match, usually max-width for mobile. Shrink the preview pane narrow to see the change.",
    code: "<style>\n  .box { background: #7c5cff; color: white; font-family: sans-serif; padding: 24px; border-radius: 12px; }\n  @media (max-width: 500px) { .box { background: #22d3ee; color: #062a33; } }\n</style>\n<div class=\"box\">Shrink the preview under 500px!</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["media", "responsive"],
  },
  {
    id: "css-variables",
    moduleId: "css",
    title: "CSS Variables",
    description: "One value, reused everywhere.",
    explanation:
      "Variables store values once and reuse them with var(). Change --brand in one place and every user updates. This powers theming.",
    code: "<style>\n  :root { --brand: #7c5cff; }\n  .card { background: var(--brand); color: white; font-family: sans-serif; padding: 20px; border-radius: 12px; }\n  .text { color: var(--brand); font-family: sans-serif; font-weight: bold; }\n</style>\n<div class=\"card\">Brand card</div>\n<p class=\"text\">Try changing --brand to #22d3ee</p>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["variables", "var()"],
  },
]


export const PLAYGROUND_LESSONS_PART7: Lesson[] = [
  {
    id: "tw-spacing",
    moduleId: "tailwind",
    title: "Spacing",
    description: "Padding and margin utilities.",
    explanation:
      "Tailwind spacing uses a scale: p-4 is padding 1rem, m-2 is margin 0.5rem. Directional variants: px (horizontal), py (vertical), pt, mb, and so on. Try p-2 vs p-8.",
    code: "<div style=\"background:#14141a;border-radius:12px;padding:16px;font-family:sans-serif;\">\n  <div class=\"p-4\" style=\"background:#7c5cff;color:white;border-radius:8px;\">p-4 box (edit to p-8)</div>\n  <div class=\"mt-4 p-4\" style=\"background:#22d3ee;color:#062a33;border-radius:8px;\">mt-4 pushes me down</div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["p-4", "m-2", "mt-4"],
  },
  {
    id: "tw-typography",
    moduleId: "tailwind",
    title: "Typography",
    description: "Size, weight, and alignment.",
    explanation:
      "Text utilities control size (text-sm to text-4xl), weight (font-bold), and alignment (text-center). Compare with raw CSS font-size and font-weight.",
    code: "<div style=\"font-family:sans-serif;background:#14141a;border-radius:12px;padding:20px;\">\n  <p class=\"text-2xl font-bold\" style=\"color:white;\">Big bold title</p>\n  <p class=\"text-sm\" style=\"color:#aaa;\">Small muted subtitle — try text-lg</p>\n  <p class=\"text-center font-bold\" style=\"color:#22d3ee;\">Centered accent</p>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["text-xl", "font-bold", "text-center"],
  },
  {
    id: "tw-responsive",
    moduleId: "tailwind",
    group: "Variants",
    title: "Responsive Breakpoints",
    description: "Mobile-first prefixed classes.",
    explanation:
      "Prefixes like sm:, md:, lg: apply only above that width. Below: stacked boxes. Above md: three columns. Shrink the preview to feel it.",
    code: "<div class=\"grid\" style=\"display:grid;gap:12px;grid-template-columns:1fr;font-family:sans-serif;\">\n  <style>@media(min-width:768px){.grid{grid-template-columns:1fr 1fr 1fr !important;}}</style>\n  <div style=\"background:#7c5cff;color:white;padding:20px;border-radius:10px;text-align:center;\">A</div>\n  <div style=\"background:#7c5cff;color:white;padding:20px;border-radius:10px;text-align:center;\">B</div>\n  <div style=\"background:#7c5cff;color:white;padding:20px;border-radius:10px;text-align:center;\">C</div>\n</div>\n<p style=\"font-family:sans-serif;color:#888;font-size:12px;\">Pattern: grid md:grid-cols-3</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["sm:", "md:", "responsive"],
  },
  {
    id: "tw-hover",
    moduleId: "tailwind",
    group: "Variants",
    title: "Hover States",
    description: "Interactive variants.",
    explanation:
      "Variants like hover: change styles on interaction. Pattern: bg-violet-500 hover:bg-cyan-400 hover:scale-105. Try it on the button.",
    code: "<button style=\"background:#7c5cff;color:white;border:none;border-radius:10px;padding:14px 30px;font-size:15px;cursor:pointer;transition:all 0.3s;font-family:sans-serif;\" onmouseover=\"this.style.background='#22d3ee'\" onmouseout=\"this.style.background='#7c5cff'\">Hover me (hover:bg-cyan-400)</button>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["hover:", "variants"],
  },
]


export const PLAYGROUND_LESSONS_PART8: Lesson[] = [
  {
    id: "js-conditions",
    moduleId: "javascript",
    title: "Conditions",
    description: "Branch logic with if/else.",
    explanation:
      "if runs code when a condition is true; else covers the rest. Try changing the score value across the 90/70 boundaries.",
    code: "<script>\n  const score = 85;\n  if (score >= 90) {\n    console.log(\"Grade: A\");\n  } else if (score >= 70) {\n    console.log(\"Grade: B\");\n  } else {\n    console.log(\"Grade: C\");\n  }\n</script>\n<p>Press Run. Try score 95 or 60.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["if", "else"],
  },
  {
    id: "js-loops",
    moduleId: "javascript",
    title: "Loops",
    description: "Repeat with for.",
    explanation:
      "A for loop repeats while its condition holds. i starts at 0, runs while below 5, and increments each round. Try changing the limit.",
    code: "<script>\n  for (let i = 0; i < 5; i++) {\n    console.log(\"Round \" + (i + 1));\n  }\n</script>\n<p>Press Run. Try i less than 10.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["for", "loop"],
  },
  {
    id: "js-arrays",
    moduleId: "javascript",
    title: "Arrays",
    description: "Lists and map().",
    explanation:
      "Arrays hold ordered lists. map() transforms each item and returns a new array. Try adding a skill or changing the arrow function.",
    code: "<script>\n  const skills = [\"HTML\", \"CSS\", \"JS\"];\n  console.log(\"Count: \" + skills.length);\n  const loud = skills.map((s) => s.toUpperCase());\n  console.log(loud.join(\", \"));\n</script>\n<p>Press Run. Try pushing a new skill.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["array", "map"],
  },
  {
    id: "js-functions",
    moduleId: "javascript",
    title: "Functions",
    description: "Reusable blocks.",
    explanation:
      "Functions package logic with inputs (parameters) and an output (return). Call greet with different names to see reuse.",
    code: "<script>\n  function greet(name) {\n    return \"Hello, \" + name + \"!\";\n  }\n  console.log(greet(\"Kent\"));\n  console.log(greet(\"Developer\"));\n</script>\n<p>Press Run. Try your own name.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["function", "return"],
  },
  {
    id: "js-fetch",
    moduleId: "javascript",
    group: "APIs",
    title: "Fetch and JSON",
    description: "Load data with async/await.",
    explanation:
      "fetch() requests a URL and returns a promise. await pauses until it resolves, and .json() parses the body. This demo uses an inline data URL so it works offline in the sandbox.",
    code: "<script>\n  async function load() {\n    const res = await fetch(\"data:application/json,\" + encodeURIComponent(JSON.stringify({ stack: [\"Next.js\", \"React\", \"TS\"] })));\n    const data = await res.json();\n    console.log(\"Stack: \" + data.stack.join(\", \"));\n  }\n  load();\n</script>\n<p>Press Run. Try adding an item to the stack array.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["fetch", "async", "json"],
  },
]


export const PLAYGROUND_LESSONS_PART9: Lesson[] = [
  {
    id: "ts-union",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Union and Intersection Types",
    description: "This OR that, and this AND that.",
    explanation:
      "A union (|) allows one of several types: string | number means text or a number, nothing else. An intersection (&) combines shapes: A & B must satisfy both — great for merging partial objects into one full type.",
    code: "type Status = \"draft\" | \"published\" | \"archived\";\n\nconst post: Status = \"published\";\nconst id: string | number = 42;\n\ntype WithId = { id: number };\ntype WithName = { name: string };\n\nconst user: WithId & WithName = { id: 1, name: \"Kent\" };",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["union", "|", "intersection", "&"],
    expectedOutput: "post must be one of the three strings. user must have both id and name; missing name is an error.",
  },
  {
    id: "ts-generics",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Generics",
    description: "Types as parameters.",
    explanation:
      "Generics let a function work with any type while staying type-safe. T is a placeholder filled in at the call site — wrap<string> keeps strings, wrap<number> keeps numbers.",
    code: "function wrap<T>(value: T): T[] {\n  return [value];\n}\n\nconst a = wrap<string>(\"hi\");\nconst b = wrap<number>(7);",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["generics", "T"],
    expectedOutput: "a is string[], b is number[]. Mixing types is caught at compile time.",
  },
  {
    id: "react-props",
    moduleId: "react",
    title: "Props",
    description: "Pass data into components.",
    explanation:
      "Props are inputs to components — the parent passes values, the child reads them. Same component, different props, different output. This is a study lesson showing the pattern.",
    code: "function Greeting({ name }: { name: string }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n<Greeting name=\"Kent\" />\n<Greeting name=\"Developer\" />",
    language: "tsx",
    previewType: "react",
    interactive: true,
    topics: ["props", "component"],
  },
  {
    id: "nextjs-link",
    moduleId: "nextjs",
    group: "Routing",
    title: "Link and Navigation",
    description: "Client-side page switches.",
    explanation:
      "The Link component navigates without a full page reload — faster and state-preserving versus a plain a tag. useRouter handles programmatic navigation.",
    code: "import Link from \"next/link\";\n\n<Link href=\"/playground\">Go to Playground</Link>\n\n// Programmatic:\n// router.push(\"/playground\");",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["Link", "router"],
    expectedOutput: "Clicking Link swaps the page client-side. No full reload, state is preserved.",
  },
  {
    id: "php-forms",
    moduleId: "php",
    title: "Forms and POST",
    description: "Read what the user submitted.",
    explanation:
      "Form fields arrive in the dollar-POST array keyed by name. Always check with isset before reading, then validate the values.",
    code: "<?php\nif (isset($_POST[\"email\"])) {\n  $email = $_POST[\"email\"];\n  echo \"Got: \" . $email;\n} else {\n  echo \"No submission yet.\";\n}",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["POST", "forms", "isset"],
    expectedOutput: "Submit email kent@mail.com → Got: kent@mail.com",
  },
  {
    id: "sql-join",
    moduleId: "sql",
    title: "JOIN",
    description: "Combine two tables.",
    explanation:
      "JOIN connects rows across tables through a shared key — here projects.owner_id matches users.id. INNER JOIN keeps only rows with a match on both sides.",
    code: "SELECT users.name, projects.name\nFROM projects\nINNER JOIN users ON projects.owner_id = users.id;",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["JOIN", "INNER JOIN"],
    sampleTable: {
      headers: ["user", "project"],
      rows: [
        ["Kent", "Geolocation App"],
        ["Kent", "Taskboard App"],
      ],
    },
    expectedOutput: "Kent — Geolocation App | Kent — Taskboard App",
  },
  {
    id: "git-branch",
    moduleId: "github",
    group: "Collaboration",
    title: "Branches and Merge",
    description: "Work without breaking main.",
    explanation:
      "Branches isolate work: create one, commit there, merge back when done. main stays deployable the whole time.",
    code: "git branch feature-login\ngit checkout feature-login\ngit commit -am \"Add login form\"\ngit checkout main\ngit merge feature-login",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["branch", "merge"],
    expectedOutput: "Merge made by the 'ort' strategy. main now includes the login commits.",
  },
]



export const PLAYGROUND_LESSONS_PART10: Lesson[] = [
  {
    id: "html-elements",
    moduleId: "html",
    title: "Elements",
    description: "Tags, content, and nesting.",
    explanation:
      "An element is an opening tag, content, and closing tag. Elements nest inside each other to build structure. Try nesting a strong tag inside the paragraph.",
    code: "<p>This is a <strong>strong</strong> element inside a paragraph.</p>\n<p>Elements can <em>nest</em> like <strong><em>this</em></strong>.</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["tags", "nesting"],
  },
  {
    id: "html-attributes",
    moduleId: "html",
    title: "Attributes in Depth",
    description: "Extra info on tags.",
    explanation:
      "Attributes add info to tags as name-value pairs: id, class, src, href, placeholder, and more. Try changing the placeholder or adding a title attribute.",
    code: "<input type=\"text\" placeholder=\"Type here\" title=\"A text field\" />\n<p id=\"intro\" class=\"lead\">Attributes live inside the opening tag.</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["attributes", "id", "class"],
  },
  {
    id: "html-fundamentals",
    moduleId: "html",
    title: "Fundamentals",
    description: "The skeleton of every page.",
    explanation:
      "HTML is the structure of every web page — it describes WHAT each piece of content is, not how it looks. Every page shares one skeleton: a doctype declaration, the html wrapper, a head for metadata (title, charset, viewport), and a body for everything visible. Elements nest inside one another to build the page, and attributes give each tag extra meaning — links (href), images (src/alt), and hooks (id/class). Learn this skeleton once and you can read the source of any website.",
    code: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>My page</title>\n</head>\n<body>\n  <!-- Comments are notes for humans; the browser ignores them -->\n  <header><h1>Visible content lives in body</h1></header>\n  <main>\n    <p>Head holds metadata like the title.</p>\n    <p><strong>Strong</strong> and <em>emphasis</em> carry meaning.</p>\n    <ul>\n      <li>Lists organize related items</li>\n    </ul>\n  </main>\n</body>\n</html>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["doctype", "head", "body", "elements", "attributes", "semantic"],
    expectedOutput: "A valid page skeleton: heading, two paragraphs (one with strong/emphasis), and a bullet list inside header and main.",
    sections: [
      {
        title: "1. Elements and Tags",
        content:
          "An element = an opening tag, content, and a closing tag: <p>Hello</p>.\nTags are the angle-bracket keywords — <p> opens and </p> closes, so most elements come in pairs.\nElements nest to form a tree: <ul><li><strong>bold item</strong></li></ul>.\nVoid (self-closing) tags have no content and no closing partner: <img>, <br>, <hr>, <input>, <meta>.\nMost text elements are block-level (they take a full row); inline elements (strong, em, a, span) flow inside the text.",
      },
      {
        title: "2. The HTML Skeleton (Basic Structure)",
        content:
          "Every page starts with the same skeleton:\n<!DOCTYPE html> switches the browser into standards mode (modern HTML).\n<html lang=\"en\"> is the root of the document; lang helps screen readers and translation tools.\n<head> holds metadata people don't see: charset, viewport, title, styles, favicon.\n<body> holds everything visible: headings, text, images, links, forms.\nIndentation doesn't change how the page looks, but it reveals the tree structure to humans.",
      },
      {
        title: "3. Common Core Tags",
        content:
          "Headings: <h1> to <h6> — importance from highest to lowest; one <h1> per page is best practice.\nText: <p> paragraph, <strong> bold importance, <em> italic emphasis, <br> line break, <hr> divider.\nLinks & media: <a href> link, <img src alt> image, <video> and <audio>.\nStructure: <div> generic block container, <span> generic inline wrapper.\nLists: <ul> unordered, <ol> ordered, <li> item.\nTables: <table> with <tr> rows, <th> header cells, <td> data cells.",
      },
      {
        title: "4. Attributes",
        content:
          "Attributes live inside the opening tag as name-value pairs: <tag attribute=\"value\">.\nid — a unique name for one element; class — a shared label many elements can use (the main CSS/JS hook).\nhref = link target, src = image or script source, alt = fallback text when the image fails.\nBoolean attributes work standing alone: <input required>, <button disabled>, <option selected>.\nOthers worth knowing: title (tooltip), data-* (custom data readable by JS), placeholder, checked.\nExample: <img src=\"cat.jpg\" alt=\"A cat\" width=\"300\">",
      },
      {
        title: "5. Semantic HTML",
        content:
          "Semantic tags describe WHAT the content is, not just how it looks.\nPage regions: <header> (top), <nav> (menus), <main> (main content), <footer> (bottom).\nContent blocks: <article> (self-contained piece), <section> (grouped topic), <aside> (side content), <figure> + <figcaption> (image with caption).\nWhy it matters: screen readers navigate by these landmarks, search engines read them as structure, and other developers understand your markup at a glance.\nRule of thumb: if a <div> id looks like \"header\" or \"nav\", replace it with the semantic tag.\n(Full walkthroughs: see the Attributes in Depth and Semantic HTML in Depth lessons in the sidebar.)",
      },
    ],
  },
  {
    id: "html-accessibility",
    moduleId: "html",
    group: "Semantics & A11y",
    title: "Accessibility",
    description: "Labels, alt, and roles.",
    explanation:
      "Accessible pages work for everyone: label every input, give images alt text, and use button instead of clickable divs. Try removing the label to feel the difference with assistive tech in mind.",
    code: "<label for=\"search\">Search</label>\n<input id=\"search\" type=\"search\" placeholder=\"Search lessons\" />\n<button type=\"button\">Search</button>\n<img src=\"/api/image/logo%20app.png\" alt=\"Site logo\" width=\"60\" />",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["label", "alt", "a11y"],
  },
  {
    id: "html-html5",
    moduleId: "html",
    group: "Semantics & A11y",
    title: "HTML5 Concepts",
    description: "Modern input types and media.",
    explanation:
      "HTML5 added smart inputs (email, date, range, color) with built-in validation, plus native audio and video. Try changing the input type.",
    code: "<label>Email <input type=\"email\" placeholder=\"you@mail.com\" /></label><br /><br />\n<label>Date <input type=\"date\" /></label><br /><br />\n<label>Level <input type=\"range\" min=\"0\" max=\"100\" /></label>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["html5", "inputs", "media"],
  },
]



export const PLAYGROUND_LESSONS_PART11: Lesson[] = [
  {
    id: "css-fundamentals",
    moduleId: "css",
    title: "Fundamentals",
    description: "How CSS attaches to HTML.",
    explanation:
      "Three ways to apply CSS: inline style attribute, internal style block, or external stylesheet. Internal style blocks are best for learning. Try changing the color.",
    code: "<style>\n  h2 { color: #7c5cff; font-family: sans-serif; }\n</style>\n<h2>Styled by a rule</h2>\n<p style=\"color: #888; font-family: sans-serif;\">Inline style wins over blocks.</p>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["rules", "inline", "style"],
  },
  {
    id: "css-specificity",
    moduleId: "css",
    title: "Specificity",
    description: "Which rule wins.",
    explanation:
      "When rules conflict, the most specific wins: id beats class beats element. Inline beats all. Try removing the id to see the class rule take over.",
    code: "<style>\n  p { color: gray; font-family: sans-serif; }\n  .note { color: #7c5cff; }\n  #winner { color: #e11d48; font-weight: bold; }\n</style>\n<p>Element rule.</p>\n<p class=\"note\">Class beats element.</p>\n<p class=\"note\" id=\"winner\">ID beats everything.</p>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["specificity", "cascade"],
  },
  {
    id: "css-typography",
    moduleId: "css",
    title: "Typography",
    description: "Size, weight, spacing.",
    explanation:
      "Typography is font-size, font-weight, line-height, and letter-spacing. Good defaults: 1.6 line-height for body text. Try the sizes.",
    code: "<style>\n  body { font-family: sans-serif; }\n  .big { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }\n  .body { font-size: 15px; line-height: 1.6; color: #444; }\n</style>\n<p class=\"big\">Big tight headline</p>\n<p class=\"body\">Comfortable body text with generous line height for easy reading.</p>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["font-size", "line-height"],
  },
  {
    id: "css-display",
    moduleId: "css",
    group: "Layout",
    title: "Display",
    description: "Block vs inline vs inline-block.",
    explanation:
      "block takes full width and stacks; inline flows in text and ignores width; inline-block flows but accepts size. Try changing each box.",
    code: "<style>\n  .b { display: block; background: #7c5cff; color: white; padding: 8px; margin: 4px 0; font-family: sans-serif; }\n  .i { display: inline; background: #22d3ee; padding: 8px; }\n  .ib { display: inline-block; width: 100px; background: #e11d48; color: white; padding: 8px; font-family: sans-serif; }\n</style>\n<div class=\"b\">block — full width</div>\n<span class=\"i\">inline</span> <span class=\"i\">flows</span>\n<div><span class=\"ib\">inline-block 100px</span></div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["block", "inline"],
  },
  {
    id: "css-pseudo-class",
    moduleId: "css",
    title: "Pseudo-classes",
    description: "Style by state.",
    explanation:
      "Pseudo-classes style element states: hover, focus, first-child, nth-child. Try tabbing into the input to trigger focus.",
    code: "<style>\n  li:nth-child(odd) { background: #f1efff; }\n  li { font-family: sans-serif; padding: 6px 10px; border-radius: 6px; }\n  input:focus { outline: 2px solid #7c5cff; }\n  a:hover { color: #e11d48; }\n</style>\n<ul><li>One</li><li>Two</li><li>Three</li></ul>\n<input placeholder=\"Focus me\" /> <a href=\"#x\">Hover me</a>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: [":hover", ":focus", ":nth-child"],
  },
  {
    id: "css-pseudo-element",
    moduleId: "css",
    title: "Pseudo-elements",
    description: "Style virtual parts.",
    explanation:
      "Pseudo-elements style parts that are not real tags: first-letter drop caps, before/after decorations. content is required for before and after.",
    code: "<style>\n  .drop::first-letter { font-size: 42px; font-weight: 800; color: #7c5cff; }\n  .tag::before { content: \"NEW \"; background: #22d3ee; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; }\n  p { font-family: sans-serif; }\n</style>\n<p class=\"drop\">Drop caps start articles with flair.</p>\n<p class=\"tag\">Badge added with ::before.</p>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["::before", "::first-letter"],
  },
  {
    id: "css-advanced",
    moduleId: "css",
    title: "Advanced CSS",
    description: "Gradients, shadows, blend.",
    explanation:
      "Combine gradients, shadows, and blur for premium surfaces. One rule can layer multiple backgrounds. Try the angle or colors.",
    code: "<style>\n  .card { width: 220px; padding: 28px; border-radius: 16px; color: white; font-family: sans-serif; font-weight: bold;\n    background: linear-gradient(135deg, #7c5cff, #22d3ee);\n    box-shadow: 0 12px 30px rgba(124,92,255,0.4); }\n</style>\n<div class=\"card\">Gradient + shadow card</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["gradient", "shadow"],
  },
]


export const PLAYGROUND_LESSONS_PART12: Lesson[] = [
  {
    id: "tw-utility",
    moduleId: "tailwind",
    title: "Utility-First Concept",
    description: "Small classes, composed.",
    explanation:
      "Instead of writing CSS rules, compose tiny utilities directly on elements. One class does one thing; combinations build anything.",
    code: "<div class=\"p-6 rounded-xl text-white font-bold\" style=\"background:#7c5cff;font-family:sans-serif;\">\n  p-6 + rounded-xl + font-bold = a card\n</div>\n<p style=\"font-family:sans-serif;color:#888;font-size:12px;\">Raw CSS equivalent: padding, border-radius, font-weight in a rule.</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["utilities", "compose"],
  },
  {
    id: "tw-layout",
    moduleId: "tailwind",
    group: "Layout",
    title: "Layout",
    description: "Container, flex, grid.",
    explanation:
      "Layout utilities: container centers with max-width, flex lines things up, grid builds columns. This demo is a centered flex row.",
    code: "<div class=\"flex gap-3 justify-center\" style=\"display:flex;gap:12px;justify-content:center;background:#14141a;border-radius:12px;padding:20px;font-family:sans-serif;\">\n  <div style=\"background:#7c5cff;color:white;padding:16px 24px;border-radius:8px;font-weight:bold;\">One</div>\n  <div style=\"background:#22d3ee;color:#062a33;padding:16px 24px;border-radius:8px;font-weight:bold;\">Two</div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["container", "flex", "grid"],
  },
  {
    id: "tw-sizing",
    moduleId: "tailwind",
    title: "Sizing",
    description: "Width and height scale.",
    explanation:
      "Sizing utilities: w-full, w-1/2, h-10, max-w-md. Fractions split parents without math. Try w-1/2 vs w-full.",
    code: "<div style=\"background:#14141a;border-radius:12px;padding:16px;font-family:sans-serif;\">\n  <div class=\"w-full\" style=\"background:#7c5cff;color:white;padding:12px;border-radius:8px;text-align:center;\">w-full</div>\n  <div class=\"mt-2\" style=\"width:50%;background:#22d3ee;color:#062a33;padding:12px;border-radius:8px;text-align:center;\">w-1/2</div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["w-full", "h-10", "max-w"],
  },
  {
    id: "tw-colors",
    moduleId: "tailwind",
    title: "Colors",
    description: "Palette with shades.",
    explanation:
      "Colors pair a hue with a shade: violet-500, cyan-400, slate-800. bg- paints, text- inks. Higher numbers are darker.",
    code: "<div style=\"display:flex;gap:12px;font-family:sans-serif;\">\n  <div style=\"background:#8b5cf6;color:white;padding:20px;border-radius:10px;font-weight:bold;\">violet-500</div>\n  <div style=\"background:#22d3ee;color:#062a33;padding:20px;border-radius:10px;font-weight:bold;\">cyan-400</div>\n  <div style=\"background:#1e293b;color:white;padding:20px;border-radius:10px;font-weight:bold;\">slate-800</div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["bg-", "text-", "palette"],
  },
  {
    id: "tw-borders",
    moduleId: "tailwind",
    title: "Borders",
    description: "Width, color, radius.",
    explanation:
      "Border utilities: border thickness, border-color, rounded size. rounded-full makes pills and avatars.",
    code: "<div style=\"display:flex;gap:12px;font-family:sans-serif;font-weight:bold;\">\n  <div style=\"border:2px solid #7c5cff;border-radius:8px;padding:16px 24px;\">border</div>\n  <div style=\"border:2px solid #22d3ee;border-radius:999px;padding:16px 24px;\">rounded-full</div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["border", "rounded"],
  },
  {
    id: "tw-effects",
    moduleId: "tailwind",
    title: "Effects",
    description: "Shadows and opacity.",
    explanation:
      "Effect utilities add depth: shadow-lg lifts, opacity-50 fades. Layer them for premium cards.",
    code: "<div style=\"display:flex;gap:12px;font-family:sans-serif;font-weight:bold;\">\n  <div style=\"background:white;border-radius:10px;padding:20px 28px;box-shadow:0 10px 25px rgba(0,0,0,0.25);\">shadow-lg</div>\n  <div style=\"background:#7c5cff;color:white;border-radius:10px;padding:20px 28px;opacity:0.5;\">opacity-50</div>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["shadow", "opacity"],
  },
]


export const PLAYGROUND_LESSONS_PART13: Lesson[] = [
  {
    id: "tw-flexbox",
    moduleId: "tailwind",
    group: "Layout",
    title: "Flexbox",
    description: "flex, gap, justify.",
    explanation:
      "Tailwind flex: flex turns it on, gap spaces children, justify-between spreads them. Raw CSS needs three separate declarations.",
    code: "<div style=\"display:flex;justify-content:space-between;gap:12px;background:#14141a;border-radius:12px;padding:16px;font-family:sans-serif;font-weight:bold;color:white;\">\n  <div style=\"background:#7c5cff;padding:12px 20px;border-radius:8px;\">Left</div>\n  <div style=\"background:#22d3ee;color:#062a33;padding:12px 20px;border-radius:8px;\">Right</div>\n</div>\n<p style=\"font-family:sans-serif;color:#888;font-size:12px;\">Pattern: flex justify-between gap-3</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["flex", "gap", "justify"],
  },
  {
    id: "tw-grid",
    moduleId: "tailwind",
    group: "Layout",
    title: "Grid",
    description: "grid-cols made easy.",
    explanation:
      "grid-cols-3 makes three equal columns; gap spaces them. Responsive: grid-cols-1 on mobile, md:grid-cols-3 on desktop.",
    code: "<div style=\"display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-family:sans-serif;font-weight:bold;color:white;text-align:center;\">\n  <div style=\"background:#7c5cff;padding:18px;border-radius:8px;\">1</div>\n  <div style=\"background:#7c5cff;padding:18px;border-radius:8px;\">2</div>\n  <div style=\"background:#7c5cff;padding:18px;border-radius:8px;\">3</div>\n</div>\n<p style=\"font-family:sans-serif;color:#888;font-size:12px;\">Pattern: grid grid-cols-3 gap-3</p>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["grid-cols", "gap"],
  },
  {
    id: "tw-dark",
    moduleId: "tailwind",
    group: "Variants",
    title: "Dark Mode",
    description: "dark: variant.",
    explanation:
      "The dark: variant applies only in dark mode: bg-white dark:bg-slate-900. Your portfolio uses CSS variables for the same idea.",
    code: "<div style=\"background:#0d0d0f;border:1px solid #26262b;border-radius:12px;padding:20px;font-family:sans-serif;color:#e5e5e5;\">\n  <p style=\"font-weight:bold;\">Dark card (dark:bg-slate-900)</p>\n  <p style=\"font-size:13px;color:#9ca3af;\">Muted text adapts: text-slate-500 dark:text-slate-400</p>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["dark:", "theme"],
  },
  {
    id: "tw-patterns",
    moduleId: "tailwind",
    title: "Component Patterns",
    description: "Reusable button and card.",
    explanation:
      "Compose utilities into patterns: a primary button and a card. In real projects, extract these into components so markup stays clean.",
    code: "<button style=\"background:linear-gradient(90deg,#7c5cff,#22d3ee);color:white;border:none;border-radius:999px;padding:12px 28px;font-weight:bold;cursor:pointer;font-family:sans-serif;\">Primary button</button>\n<div style=\"background:white;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-top:12px;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.08);\">\n  <p style=\"font-weight:bold;margin:0;\">Card title</p>\n  <p style=\"font-size:13px;color:#666;margin:4px 0 0;\">Card body text.</p>\n</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["button", "card", "patterns"],
  },
  {
    id: "tw-compare",
    moduleId: "tailwind",
    title: "CSS vs Tailwind",
    description: "Same result, two styles.",
    explanation:
      "Identical outcome, different workflow. Raw CSS centralizes rules in a stylesheet; Tailwind colocates utilities on the element. Neither is wrong — pick per team.",
    code: "<style>.classic { display: flex; align-items: center; justify-content: center; padding: 20px; background: #14141a; border-radius: 12px; color: white; font-family: sans-serif; font-weight: bold; }</style>\n<div class=\"classic\">Classic CSS: 5 declarations</div>\n<div style=\"display:flex;align-items:center;justify-content:center;padding:20px;background:#14141a;border-radius:12px;color:#22d3ee;font-family:sans-serif;font-weight:bold;margin-top:8px;\">Tailwind: flex items-center justify-center p-5</div>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["compare", "workflow"],
  },
]


export const PLAYGROUND_LESSONS_PART14: Lesson[] = [
  {
    id: "js-syntax",
    moduleId: "javascript",
    title: "Syntax",
    description: "Statements and semicolons.",
    explanation:
      "JavaScript runs statement by statement. Semicolons end them (optional but conventional). Comments explain without running. Press Run to see all three lines.",
    code: "<script>\n  // A comment — ignored by the machine\n  console.log(\"First statement\");\n  console.log(\"Second statement\");\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["syntax", "comments"],
  },
  {
    id: "js-types",
    moduleId: "javascript",
    title: "Data Types",
    description: "string, number, boolean.",
    explanation:
      "Core types: string text in quotes, number math values, boolean true/false. typeof reveals any value's type. Try your own values.",
    code: "<script>\n  console.log(typeof \"Kent\");\n  console.log(typeof 42);\n  console.log(typeof true);\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["typeof", "types"],
  },
  {
    id: "js-operators",
    moduleId: "javascript",
    title: "Operators",
    description: "Math and comparison.",
    explanation:
      "Arithmetic (+ - * / %) computes; comparison (=== > <) decides. Strict === checks value AND type — prefer it over loose ==.",
    code: "<script>\n  console.log(10 + 5);\n  console.log(10 % 3);\n  console.log(5 === \"5\");\n  console.log(10 > 7);\n</script>\n<p>Press Run. Try 5 == \"5\" to see loose equality.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["operators", "==="],
  },
  {
    id: "js-objects",
    moduleId: "javascript",
    title: "Objects",
    description: "Key-value data.",
    explanation:
      "Objects group related data as key-value pairs. Dot notation reads them. Try adding a role property.",
    code: "<script>\n  const dev = { name: \"Kent\", stack: \"Next.js\", years: 3 };\n  console.log(dev.name);\n  console.log(dev.stack + \" — \" + dev.years + \" yrs\");\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["object", "keys"],
  },
  {
    id: "js-destructure",
    moduleId: "javascript",
    title: "Destructuring",
    description: "Unpack in one line.",
    explanation:
      "Destructuring unpacks arrays and objects into variables in one line. The names must match object keys. Try renaming with colon syntax.",
    code: "<script>\n  const user = { name: \"Kent\", age: 25 };\n  const { name, age } = user;\n  console.log(name + \" is \" + age);\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["destructuring"],
  },
  {
    id: "js-spread",
    moduleId: "javascript",
    title: "Spread and Rest",
    description: "Expand and collect.",
    explanation:
      "Spread (...) expands arrays into elements; rest collects leftovers into an array. Same dots, opposite jobs. Try adding items.",
    code: "<script>\n  const a = [1, 2];\n  const b = [...a, 3, 4];\n  console.log(b.join(\", \"));\n  function sum(...nums) { return nums.reduce((t, n) => t + n, 0); }\n  console.log(\"Sum: \" + sum(1, 2, 3));\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["spread", "rest"],
  },
]


export const PLAYGROUND_LESSONS_PART15: Lesson[] = [
  {
    id: "js-dom",
    moduleId: "javascript",
    group: "DOM",
    title: "DOM",
    description: "Change the page live.",
    explanation:
      "The DOM is the page as objects. textContent rewrites text; style rewrites CSS. Click the button to mutate both.",
    code: "<p id=\"msg\" style=\"font-family:sans-serif;\">Original text</p>\n<button id=\"go\" style=\"background:#7c5cff;color:white;border:none;border-radius:8px;padding:10px 20px;cursor:pointer;\">Change it</button>\n<script>\n  document.querySelector(\"#go\").addEventListener(\"click\", () => {\n    const m = document.querySelector(\"#msg\");\n    m.textContent = \"Changed by JavaScript!\";\n    m.style.color = \"#7c5cff\";\n    m.style.fontWeight = \"bold\";\n  });\n</script>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["DOM", "textContent"],
  },
  {
    id: "js-forms",
    moduleId: "javascript",
    group: "DOM",
    title: "Forms",
    description: "Read input values.",
    explanation:
      "Prevent the default submit reload, read .value from inputs, and respond. Try typing different names.",
    code: "<input id=\"name\" placeholder=\"Your name\" style=\"padding:8px;border-radius:6px;border:1px solid #ccc;\" />\n<button id=\"hi\" style=\"background:#7c5cff;color:white;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;\">Greet</button>\n<script>\n  document.querySelector(\"#hi\").addEventListener(\"click\", () => {\n    const v = document.querySelector(\"#name\").value || \"stranger\";\n    console.log(\"Hello, \" + v + \"!\");\n  });\n</script>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["forms", "value"],
  },
  {
    id: "js-json",
    moduleId: "javascript",
    group: "Async",
    title: "JSON",
    description: "Stringify and parse.",
    explanation:
      "JSON is text-shaped data. stringify converts objects to text for transport; parse converts text back. Try breaking the JSON to see the error.",
    code: "<script>\n  const obj = { name: \"Kent\", skills: 9 };\n  const text = JSON.stringify(obj);\n  console.log(text);\n  const back = JSON.parse(text);\n  console.log(\"Back: \" + back.name);\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["JSON", "parse"],
  },
  {
    id: "js-promises",
    moduleId: "javascript",
    group: "Async",
    title: "Promises",
    description: "Future values with then.",
    explanation:
      "Promises represent future values. then() runs on success, catch() on failure. This demo resolves after a short delay.",
    code: "<script>\n  const wait = new Promise((resolve) => setTimeout(() => resolve(\"Done waiting!\"), 500));\n  wait.then((msg) => console.log(msg));\n  console.log(\"Asked to wait...\");\n</script>\n<p>Press Run. Notice order: sync logs first.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["promise", "then"],
  },
  {
    id: "js-async",
    moduleId: "javascript",
    group: "Async",
    title: "Async and Await",
    description: "Cleaner async code.",
    explanation:
      "async/await flattens promise chains into straight-line code. await pauses that function until the promise settles. Same wait demo, cleaner shape.",
    code: "<script>\n  function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }\n  async function main() {\n    console.log(\"Starting...\");\n    await delay(500);\n    console.log(\"Finished!\");\n  }\n  main();\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["async", "await"],
  },
  {
    id: "js-modules",
    moduleId: "javascript",
    title: "Modules",
    description: "Import and export.",
    explanation:
      "Modules split code across files. export shares, import receives. This is a study lesson — the pattern matters more than running it here.",
    code: "// math.js\n// export function add(a, b) { return a + b; }\n\n// main.js\n// import { add } from \"./math.js\";\n// console.log(add(2, 3));",
    language: "javascript",
    previewType: "static",
    interactive: false,
    topics: ["import", "export"],
    expectedOutput: "3 — add(2, 3) resolves through the import.",
  },
  {
    id: "js-errors",
    moduleId: "javascript",
    title: "Error Handling",
    description: "try, catch, finally.",
    explanation:
      "try runs risky code; catch handles the failure gracefully instead of crashing. finally always runs for cleanup. Try valid JSON to skip the catch.",
    code: "<script>\n  try {\n    const bad = JSON.parse(\"not json\");\n    console.log(bad);\n  } catch (e) {\n    console.log(\"Caught: invalid JSON, using defaults.\");\n  } finally {\n    console.log(\"Cleanup done.\");\n  }\n</script>\n<p>Press Run.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["try", "catch"],
  },
  {
    id: "js-advanced",
    moduleId: "javascript",
    title: "Advanced JS",
    description: "Closures remember.",
    explanation:
      "A closure is a function that remembers its birth scope. counter keeps its own count private — no global needed. Call it repeatedly.",
    code: "<script>\n  function makeCounter() {\n    let count = 0;\n    return () => ++count;\n  }\n  const next = makeCounter();\n  console.log(next());\n  console.log(next());\n  console.log(next());\n</script>\n<p>Press Run. Each call remembers.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["closure", "scope"],
  },
]

export const PLAYGROUND_LESSONS_PART16: Lesson[] = [
  {
    id: "ts-primitives",
    moduleId: "typescript",
    title: "Primitive Types",
    description: "string, number, boolean.",
    explanation:
      "Primitives are the atoms: string text, number math, boolean flags. Annotate each so misuse is caught before runtime.",
    code: "const title: string = \"Playground\";\nconst lessons: number = 48;\nconst live: boolean = true;",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["primitives"],
    expectedOutput: "All assignments match. Assigning 5 to title would error.",
  },
  {
    id: "ts-arrays",
    moduleId: "typescript",
    title: "Arrays and Objects",
    description: "Typed collections.",
    explanation:
      "string[] means array of strings; inline object types lock shapes. Push a number into names and the compiler complains.",
    code: "const names: string[] = [\"Kent\", \"Dev\"];\nconst profile: { name: string; age: number } = { name: \"Kent\", age: 25 };",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["arrays", "objects"],
    expectedOutput: "names.push(5) errors. profile.age = old errors.",
  },
  {
    id: "ts-alias",
    moduleId: "typescript",
    title: "Type Aliases",
    description: "Name any shape.",
    explanation:
      "type gives any shape a reusable name — simpler than repeating inline types everywhere. Aliases can also union.",
    code: "type ID = string | number;\ntype User = { id: ID; name: string };\n\nconst u: User = { id: 7, name: \"Kent\" };",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["type", "alias"],
    expectedOutput: "u is valid. id accepts strings or numbers.",
  },
  {
    id: "ts-functions",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Function Types",
    description: "Typed inputs and outputs.",
    explanation:
      "Annotate parameters and return type. Callers passing wrong types fail fast at compile time, not in production.",
    code: "function total(a: number, b: number): number {\n  return a + b;\n}\n\nconst t = total(3, 4);",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["functions", "return"],
    expectedOutput: "t is 7. Passing text is a compile error.",
  },
]
export const PLAYGROUND_LESSONS_PART17: Lesson[] = [
  {
    id: "ts-narrow",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Type Narrowing",
    description: "typeof guards.",
    explanation:
      "Narrowing shrinks a union to one member with checks like typeof. Inside the if, value is safely a string.",
    code: "function shout(value: string | number): string {\n  if (typeof value === \"string\") {\n    return value.toUpperCase();\n  }\n  return String(value);\n}",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["narrowing", "typeof"],
    expectedOutput: "shout(hi) is HI. shout(5) is 5.",
  },
  {
    id: "ts-optional",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Optional Properties",
    description: "Maybe-there fields.",
    explanation:
      "A question mark marks a property optional. Code must handle undefined — use fallback defaults.",
    code: "interface Config {\n  title: string;\n  subtitle?: string;\n}\n\nfunction label(c: Config): string {\n  return c.subtitle ?? c.title;\n}",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["optional", "?"],
    expectedOutput: "Missing subtitle falls back to title.",
  },
  {
    id: "ts-utility",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Utility Types",
    description: "Partial, Pick, Omit.",
    explanation:
      "Utilities transform types: Partial makes all optional, Pick selects keys, Omit drops keys. Perfect for forms and updates.",
    code: "interface User { id: number; name: string; email: string }\ntype Draft = Partial<User>;\ntype Card = Pick<User, \"name\" | \"email\">;",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["Partial", "Pick"],
    expectedOutput: "Draft allows empty object. Card has only name and email.",
  },
  {
    id: "ts-advanced",
    moduleId: "typescript",
    group: "Advanced Types",
    title: "Advanced TS",
    description: "readonly and as const.",
    explanation:
      "readonly freezes properties after creation; as const freezes literals to exact values. Use both for config objects.",
    code: "const CONFIG = { theme: \"dark\", limit: 10 } as const;\ninterface State { readonly id: number }",
    language: "typescript",
    previewType: "static",
    interactive: false,
    topics: ["readonly", "as const"],
    expectedOutput: "CONFIG.theme cannot widen. id cannot be reassigned.",
  },
]
export const PLAYGROUND_LESSONS_PART18: Lesson[] = [
  {
    id: "react-jsx",
    moduleId: "react",
    title: "JSX",
    description: "HTML in JavaScript.",
    explanation:
      "JSX looks like HTML but runs as JavaScript: className instead of class, curly braces embed values. Study the shape.",
    code: "const name = \"Kent\";\nconst el = <h1 className=\"title\">Hello, {name}!</h1>;",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["JSX", "className"],
    expectedOutput: "Renders h1 saying Hello, Kent!",
  },
  {
    id: "react-components",
    moduleId: "react",
    title: "Components",
    description: "Functions that render.",
    explanation:
      "A component is a function returning UI. Capitalized names signal components to React. Compose small ones into pages.",
    code: "function Badge({ text }: { text: string }) {\n  return <span>{text}</span>;\n}\n\nfunction App() {\n  return <Badge text=\"Ship it\" />;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["components"],
    expectedOutput: "App renders Badge showing Ship it.",
  },
  {
    id: "react-events",
    moduleId: "react",
    title: "Events",
    description: "onClick handlers.",
    explanation:
      "React events use camelCase props like onClick with function values. No addEventListener needed — declare behavior inline.",
    code: "function Button() {\n  function handle() {\n    alert(\"Clicked!\");\n  }\n  return <button onClick={handle}>Click</button>;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["onClick", "events"],
    expectedOutput: "Clicking runs handle once per click.",
  },
  {
    id: "react-conditional",
    moduleId: "react",
    title: "Conditional Rendering",
    description: "Show UI by state.",
    explanation:
      "Render different UI with ternaries or logical AND. When logged in, show the dashboard; otherwise show the button.",
    code: "function Panel({ loggedIn }: { loggedIn: boolean }) {\n  return loggedIn ? <p>Welcome back!</p> : <button>Log in</button>;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["conditional", "ternary"],
    expectedOutput: "true shows welcome; false shows the button.",
  },
  {
    id: "react-lists",
    moduleId: "react",
    title: "Lists and Keys",
    description: "map with stable keys.",
    explanation:
      "map() turns arrays into elements. key gives React a stable identity per item so updates stay fast and correct. Never use index when ids exist.",
    code: "const skills = [{ id: 1, n: \"HTML\" }, { id: 2, n: \"CSS\" }];\n<ul>\n  {skills.map((s) => <li key={s.id}>{s.n}</li>)}\n</ul>",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["map", "key"],
    expectedOutput: "Two list items with stable keys 1 and 2.",
  },
]
export const PLAYGROUND_LESSONS_PART19: Lesson[] = [
  {
    id: "react-forms",
    moduleId: "react",
    title: "Forms",
    description: "Controlled inputs.",
    explanation:
      "Controlled inputs store their value in state and update on every keystroke. The UI always mirrors state — single source of truth.",
    code: "const [name, setName] = useState(\"\");\n<input value={name} onChange={(e) => setName(e.target.value)} />\n<p>Hello, {name || \"stranger\"}!</p>",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["forms", "controlled"],
    expectedOutput: "Typing updates the greeting instantly.",
  },
  {
    id: "react-effect",
    moduleId: "react",
    group: "Hooks",
    title: "useEffect",
    description: "Sync with the outside.",
    explanation:
      "useEffect runs after render for side work: fetching, timers, subscriptions. The array lists dependencies — empty means run once.",
    code: "useEffect(() => {\n  document.title = \"Count: \" + count;\n}, [count]);",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["useEffect", "deps"],
    expectedOutput: "Tab title follows count on every change.",
  },
  {
    id: "react-ref",
    moduleId: "react",
    group: "Hooks",
    title: "useRef",
    description: "Hold without rendering.",
    explanation:
      "Refs hold mutable values that survive renders without triggering new ones. Classic use: focus an input imperatively.",
    code: "const inputRef = useRef<HTMLInputElement>(null);\nfunction focus() {\n  inputRef.current?.focus();\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["useRef", "focus"],
    expectedOutput: "Calling focus() puts the cursor in the input.",
  },
  {
    id: "react-context",
    moduleId: "react",
    group: "Hooks",
    title: "Context",
    description: "Share without prop drilling.",
    explanation:
      "Context shares values (like theme) across many levels without passing props through each layer. Provider sets it; useContext reads it.",
    code: "const Theme = createContext(\"light\");\n<Theme.Provider value=\"dark\">\n  <App />\n</Theme.Provider>",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["context", "provider"],
    expectedOutput: "Any child reading Theme gets dark.",
  },
  {
    id: "react-hooks",
    moduleId: "react",
    group: "Hooks",
    title: "Custom Hooks",
    description: "Extract reusable logic.",
    explanation:
      "Custom hooks extract stateful logic into shareable functions starting with use. Same logic, many components, zero duplication.",
    code: "function useToggle(start = false) {\n  const [v, setV] = useState(start);\n  const flip = () => setV((x) => !x);\n  return [v, flip] as const;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["custom hooks"],
    expectedOutput: "Any component can toggle with useToggle().",
  },
  {
    id: "react-patterns",
    moduleId: "react",
    title: "Component Patterns",
    description: "Small, pure, composed.",
    explanation:
      "Keep components small and focused: one job each, props in, UI out. Compose them like bricks. Lift shared state to the closest common parent.",
    code: "function Card({ title, children }: { title: string; children: React.ReactNode }) {\n  return <section><h3>{title}</h3>{children}</section>;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["patterns", "children"],
    expectedOutput: "Card wraps any children under its title.",
  },
]
export const PLAYGROUND_LESSONS_PART20: Lesson[] = [
  {
    id: "nextjs-structure",
    moduleId: "nextjs",
    title: "Project Structure",
    description: "Where everything lives.",
    explanation:
      "app holds routes, components holds UI, lib holds data and helpers, public holds static files. Keep this shape and any Next.js dev feels at home.",
    code: "app/\n  page.tsx\n  layout.tsx\n  playground/\n    page.tsx\ncomponents/\nlib/\npublic/",
    language: "text",
    previewType: "static",
    interactive: false,
    topics: ["structure"],
    expectedOutput: "Routes in app, UI in components, data in lib.",
  },
  {
    id: "nextjs-pages",
    moduleId: "nextjs",
    group: "Routing",
    title: "Pages",
    description: "page.tsx is a URL.",
    explanation:
      "Any page.tsx file is a route. Export a default component and it renders at that path. This portfolio page is app/playground/page.tsx.",
    code: "export default function Playground() {\n  return <PlaygroundPage />;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["pages"],
    expectedOutput: "Visiting /playground renders this component.",
  },
  {
    id: "nextjs-layouts",
    moduleId: "nextjs",
    group: "Routing",
    title: "Layouts",
    description: "Shared wrappers.",
    explanation:
      "layout.tsx wraps every page in its folder: nav, fonts, theme. It persists across navigation — state inside survives page switches.",
    code: "export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html><body>{children}</body></html>;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["layouts"],
    expectedOutput: "Every page renders inside the shared layout.",
  },
  {
    id: "nextjs-dynamic",
    moduleId: "nextjs",
    group: "Routing",
    title: "Dynamic Routes",
    description: "Brackets mean params.",
    explanation:
      "Folders in brackets match any value: blog/[slug] handles every post. Read the value from params in the page.",
    code: "app/\n  blog/\n    [slug]/\n      page.tsx\n\n// /blog/hello renders with slug = hello",
    language: "text",
    previewType: "static",
    interactive: false,
    topics: ["dynamic", "params"],
    expectedOutput: "One file serves infinite post URLs.",
  },
  {
    id: "nextjs-rsc",
    moduleId: "nextjs",
    title: "Server and Client",
    description: "Two component kinds.",
    explanation:
      "Server Components fetch and render on the server by default. Add use client only when you need state, effects, or browser APIs.",
    code: "// Server by default — can fetch directly\nasync function Posts() {\n  const data = await fetchPosts();\n  return <List items={data} />;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["server", "client"],
    expectedOutput: "Less JS shipped; interactivity stays client-side.",
  },
]
export const PLAYGROUND_LESSONS_PART21: Lesson[] = [
  {
    id: "nextjs-fetch",
    moduleId: "nextjs",
    title: "Data Fetching",
    description: "Fetch on the server.",
    explanation:
      "Fetch directly inside Server Components — no useEffect needed. Data loads before the page streams to the browser.",
    code: "async function Certificates() {\n  const res = await fetch(\"https://api.example.com/certs\");\n  const certs = await res.json();\n  return <ul>{certs.map((c) => <li key={c.id}>{c.name}</li>)}</ul>;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["fetch", "server"],
    expectedOutput: "Page arrives with data already rendered.",
  },
  {
    id: "nextjs-loading",
    moduleId: "nextjs",
    title: "Loading and Error UI",
    description: "Files that handle states.",
    explanation:
      "loading.tsx shows a fallback while a route loads; error.tsx catches failures with a retry button. Conventions over wiring.",
    code: "app/\n  dashboard/\n    page.tsx\n    loading.tsx    // skeleton while loading\n    error.tsx      // fallback with retry",
    language: "text",
    previewType: "static",
    interactive: false,
    topics: ["loading", "error"],
    expectedOutput: "Slow routes show skeletons; crashes show recovery UI.",
  },
  {
    id: "nextjs-deploy",
    moduleId: "nextjs",
    title: "Deployment",
    description: "Ship with Vercel.",
    explanation:
      "Push to GitHub, import into Vercel, deploy. Every push gets a preview URL; main auto-deploys to production. This portfolio ships exactly this way.",
    code: "git push origin main\n# Vercel builds with: npm run build\n# Output: https://your-site.vercel.app",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["vercel", "deploy"],
    expectedOutput: "Live site in minutes with preview per push.",
  },
  {
    id: "php-vars",
    moduleId: "php",
    title: "Variables and Types",
    description: "Dollar-sign data.",
    explanation:
      "Every variable starts with $. Types are loose: strings, ints, floats, booleans, arrays. Concatenate with dots, not plus.",
    code: "<?php\n$name = \"Kent\";\n$age = 25;\n$rate = 4.5;\n$active = true;\necho $name . \" is \" . $age;",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["variables", "types"],
    expectedOutput: "Kent is 25",
  },
  {
    id: "php-conditions",
    moduleId: "php",
    title: "Conditions and Loops",
    description: "if, for, while.",
    explanation:
      "Same ideas as JS with PHP spelling: if/elseif/else, for, while, foreach for arrays. foreach is the workhorse for lists.",
    code: "<?php\n$score = 85;\nif ($score >= 90) { echo \"A\"; }\nelseif ($score >= 70) { echo \"B\"; }\nelse { echo \"C\"; }\n\nforeach ([\"a\", \"b\"] as $x) { echo $x; }",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["if", "foreach"],
    expectedOutput: "B then ab",
  },
]
export const PLAYGROUND_LESSONS_PART22: Lesson[] = [
  {
    id: "php-functions",
    moduleId: "php",
    title: "Functions and Arrays",
    description: "Reusable PHP blocks.",
    explanation:
      "Functions group logic; arrays hold lists; count() measures them. array_map transforms like JS map.",
    code: "<?php\nfunction greet($name) { return \"Hi, \" . $name; }\necho greet(\"Kent\");\n$skills = [\"PHP\", \"Laravel\", \"MySQL\"];\necho count($skills);",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["functions", "arrays"],
    expectedOutput: "Hi, Kent then 3",
  },
  {
    id: "php-sessions",
    moduleId: "php",
    title: "Sessions",
    description: "Remember the user.",
    explanation:
      "Sessions persist data across requests via dollar-SESSION. Start the session first, then read and write keys like login state.",
    code: "<?php\nsession_start();\n$_SESSION[\"user\"] = \"kent\";\necho \"Logged in as \" . $_SESSION[\"user\"];",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["sessions"],
    expectedOutput: "Logged in as kent on later requests too.",
  },
  {
    id: "php-oop",
    moduleId: "php",
    title: "OOP Basics",
    description: "Classes and objects.",
    explanation:
      "Classes blueprint objects: properties hold data, methods hold behavior. new builds an instance; arrow calls its methods.",
    code: "<?php\nclass Dev {\n  public $name;\n  function __construct($n) { $this->name = $n; }\n  function hi() { return \"Hi, \" . $this->name; }\n}\n$d = new Dev(\"Kent\");\necho $d->hi();",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["class", "OOP"],
    expectedOutput: "Hi, Kent",
  },
  {
    id: "php-api",
    moduleId: "php",
    title: "APIs with PHP",
    description: "Return JSON.",
    explanation:
      "Set the JSON header, encode an array, echo it. Any frontend can now consume this endpoint with fetch.",
    code: "<?php\nheader(\"Content-Type: application/json\");\necho json_encode([\"name\" => \"Kent\", \"stack\" => \"Laravel\"]);",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["API", "JSON"],
    expectedOutput: "{\"name\":\"Kent\",\"stack\":\"Laravel\"}",
  },
  {
    id: "sql-fundamentals",
    moduleId: "sql",
    title: "Database Fundamentals",
    description: "Tables, rows, columns.",
    explanation:
      "A database holds tables; tables hold rows; rows hold column values. Each row needs a unique id (primary key).",
    code: "-- users table\n-- id | name | role\n-- 1  | Kent | dev\n-- 2  | Ana  | designer",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["tables", "keys"],
    expectedOutput: "Two rows, three columns, id is the key.",
  },
  {
    id: "sql-insert",
    moduleId: "sql",
    group: "CRUD",
    title: "INSERT and UPDATE",
    description: "Add and change rows.",
    explanation:
      "INSERT adds rows naming columns and values. UPDATE changes rows — always pair with WHERE or every row changes.",
    code: "INSERT INTO users (name, role)\nVALUES (\"Ana\", \"designer\");\n\nUPDATE users\nSET role = \"lead\"\nWHERE name = \"Ana\";",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["INSERT", "UPDATE"],
    expectedOutput: "One row added, then Ana becomes lead.",
  },
]
export const PLAYGROUND_LESSONS_PART23: Lesson[] = [
  {
    id: "sql-delete",
    moduleId: "sql",
    group: "CRUD",
    title: "DELETE",
    description: "Remove rows safely.",
    explanation:
      "DELETE removes rows matching WHERE. Without WHERE it empties the table — the classic footgun. Always check the filter with SELECT first.",
    code: "DELETE FROM users\nWHERE name = \"Ana\";",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["DELETE", "WHERE"],
    expectedOutput: "One row removed. Ana is gone.",
  },
  {
    id: "sql-aggregate",
    moduleId: "sql",
    title: "Aggregate Functions",
    description: "COUNT, SUM, AVG.",
    explanation:
      "Aggregates collapse many rows into one number: COUNT rows, SUM totals, AVG averages. Perfect for dashboards.",
    code: "SELECT COUNT(*) AS total,\n       AVG(year) AS avg_year\nFROM projects;",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["COUNT", "AVG"],
    sampleTable: {
      headers: ["name", "year"],
      rows: [
        ["Geo App", "2023"],
        ["Taskboard", "2024"],
        ["AI Assistant", "2025"],
      ],
    },
    expectedOutput: "total 3, avg_year 2024",
  },
  {
    id: "sql-group",
    moduleId: "sql",
    title: "GROUP BY and HAVING",
    description: "Aggregate per group.",
    explanation:
      "GROUP BY splits rows into buckets then aggregates each. HAVING filters buckets after grouping — WHERE cannot do that job.",
    code: "SELECT year, COUNT(*) AS n\nFROM projects\nGROUP BY year\nHAVING n > 1;",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["GROUP BY", "HAVING"],
    expectedOutput: "Only years with 2+ projects listed.",
  },
  {
    id: "sql-subquery",
    moduleId: "sql",
    title: "Subqueries",
    description: "Queries inside queries.",
    explanation:
      "A subquery computes a value the outer query uses — here the average year. Outer keeps rows above it.",
    code: "SELECT name\nFROM projects\nWHERE year > (SELECT AVG(year) FROM projects);",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["subquery"],
    expectedOutput: "Projects newer than the average year.",
  },
  {
    id: "sql-advanced",
    moduleId: "sql",
    title: "Indexes and Transactions",
    description: "Speed and safety.",
    explanation:
      "Indexes speed lookups like a book index; transactions bundle writes so all succeed or all roll back. Money transfers need both.",
    code: "-- Speed up owner lookups\nCREATE INDEX idx_owner ON projects(owner_id);\n\n-- All-or-nothing transfer\nBEGIN;\nUPDATE accounts SET bal = bal - 100 WHERE id = 1;\nUPDATE accounts SET bal = bal + 100 WHERE id = 2;\nCOMMIT;",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["index", "transaction"],
    expectedOutput: "Faster reads; money never half-moved.",
  },
]
export const PLAYGROUND_LESSONS_PART24: Lesson[] = [
  {
    id: "git-fundamentals",
    moduleId: "github",
    title: "Git Fundamentals",
    description: "Snapshots, not files.",
    explanation:
      "Git snapshots your work: working tree (editing), staging (selected), repository (saved). Commits chain into history you can revisit.",
    code: "working tree  ->  staging  ->  repository\n(editing)      (git add)    (git commit)",
    language: "text",
    previewType: "static",
    interactive: false,
    topics: ["snapshots", "areas", "repositories"],
    expectedOutput: "Three areas; commits move snapshots right.",
  },
  {
    id: "git-status",
    moduleId: "github",
    title: "Status and Add",
    description: "See and stage changes.",
    explanation:
      "status shows what changed; add stages files for the next commit. Stage deliberately — commits should tell one story.",
    code: "git status\ngit add index.html\ngit add .",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["status", "add"],
    expectedOutput: "Untracked and modified files listed, then staged.",
  },
  {
    id: "git-commit",
    moduleId: "github",
    title: "Commit",
    description: "Save a snapshot.",
    explanation:
      "commit saves staged work with a message. Write imperative summaries: Add login, not added stuff. Good messages are documentation.",
    code: "git commit -m \"Add hero section\"\ngit log --oneline",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["commit", "log"],
    expectedOutput: "New commit hash with your message on top.",
  },
  {
    id: "git-remote",
    moduleId: "github",
    group: "Collaboration",
    title: "Remotes, Push, Pull",
    description: "Sync with GitHub.",
    explanation:
      "remote links local to GitHub; push uploads; pull downloads. Clone once, then push and pull forever after.",
    code: "git clone <url>\ngit push origin main\ngit pull origin main",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["push", "pull", "clone"],
    expectedOutput: "Local and GitHub stay in sync.",
  },
  {
    id: "git-pr",
    moduleId: "github",
    group: "Collaboration",
    title: "Pull Requests",
    description: "Propose, review, merge.",
    explanation:
      "Push a branch, open a PR, get review, merge. PRs are where teams discuss code before it reaches main.",
    code: "git push origin feature-login\n# GitHub -> Compare & pull request\n# Review -> Merge pull request",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["PR", "review"],
    expectedOutput: "Branch reviewed and merged via the PR page.",
  },
  {
    id: "git-workflow",
    moduleId: "github",
    group: "Collaboration",
    title: "GitHub Workflow",
    description: "The daily loop.",
    explanation:
      "The professional loop: pull latest, branch, commit small, push, open PR, merge, delete branch. Repeat all day.",
    code: "git pull origin main\ngit checkout -b fix-nav\ngit commit -am \"Fix nav overlap\"\ngit push origin fix-nav\n# open PR, merge, delete branch",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["workflow", "collaboration", "review"],
    expectedOutput: "Clean main, reviewed changes, zero drama.",
  },
]

export const PLAYGROUND_LESSONS_PART25: Lesson[] = [
  {
    id: "css-responsive",
    moduleId: "css",
    title: "Responsive Design",
    description: "One layout, every screen size.",
    explanation:
      "Responsive design makes a page adapt to any viewport. Combine flexible units (%, max-width, rem) with media queries so the layout reflows at breakpoints. Try shrinking the preview pane to watch the cards stack.",
    code: "<style>\n  .cards {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 12px;\n  }\n  .card {\n    background: #7c5cff;\n    color: white;\n    padding: 24px;\n    border-radius: 10px;\n    font-family: sans-serif;\n    text-align: center;\n  }\n  @media (max-width: 600px) {\n    .cards { grid-template-columns: 1fr; }\n  }\n</style>\n\n<div class=\"cards\">\n  <div class=\"card\">One</div>\n  <div class=\"card\">Two</div>\n  <div class=\"card\">Three</div>\n</div>",
    language: "html",
    previewType: "css",
    interactive: true,
    topics: ["media queries", "units", "breakpoints", "fluid layout"],
    expectedOutput: "3 columns on wide screens, stacked 1 column under 600px.",
  },
  {
    id: "nextjs-route-handlers",
    moduleId: "nextjs",
    group: "Routing",
    title: "Route Handlers",
    description: "API endpoints inside your routes.",
    explanation:
      "A route.ts file inside any folder creates an API endpoint. Export a function per HTTP method — GET, POST — and it serves that path. app/api/posts/route.ts becomes /api/posts. This is how your frontend fetches data from the same app.",
    code: "// app/api/posts/route.ts\nexport async function GET() {\n  const posts = [{ id: 1, title: \"Hello\" }]\n  return Response.json(posts)\n}\n\nexport async function POST(req: Request) {\n  const body = await req.json()\n  return Response.json({ created: body }, { status: 201 })\n}\n\n// Frontend:\n// const res = await fetch(\"/api/posts\")",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["route.ts", "GET", "POST", "Response.json"],
    expectedOutput: "GET /api/posts → 200 [{\"id\":1,\"title\":\"Hello\"}]  |  POST → 201 {created: ...}",
  },
  {
    id: "git-clone",
    moduleId: "github",
    title: "Clone and .gitignore",
    description: "Get an existing repo, ignore the junk.",
    explanation:
      "git clone copies a remote repo (with full history) so you can work locally. The .gitignore file lists paths git should never track — node_modules, .env, build output. One less thing to accidentally commit.",
    code: "git clone https://github.com/kent/dev-portfolio.git\ncd dev-portfolio\n\necho \"node_modules/\" > .gitignore\necho \".env\" >> .gitignore\n\ngit status",
    language: "bash",
    previewType: "static",
    interactive: false,
    topics: ["clone", "gitignore"],
    expectedOutput: "Repo copied to ./dev-portfolio; node_modules and .env no longer show up in git status.",
  },
]

export const PLAYGROUND_LESSONS_PART26: Lesson[] = [
  {
    id: "php-operators",
    moduleId: "php",
    title: "Operators",
    description: "Math, comparison, and glue in PHP.",
    explanation:
      "PHP uses +, -, *, / for math, . for string concatenation (not +!), and == vs === for loose vs strict comparison. Comparison results feed your if statements. Try changing the values inside the echo statements.",
    code: "<?php\n$a = 10;\n$b = 3;\n\necho $a + $b;   // 13\necho $a . $b;  // 103 (concatenation)\necho $a > $b;  // 1 (true)\necho ($a === 10) ? 'yes' : 'no';  // yes\n?>",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["arithmetic", "concatenation", "===", "comparison", "logical"],
    expectedOutput: "13 | 103 | 1 | yes",
  },
  {
    id: "php-files",
    moduleId: "php",
    title: "Files",
    description: "Read and write files on the server.",
    explanation:
      "PHP can touch the filesystem: file_get_contents() reads, file_put_contents() writes, and include lets you reuse code across files. This runs server-side, so the browser never sees your file paths or raw PHP.",
    code: "<?php\n// Write\nfile_put_contents(\"notes.txt\", \"Hello from PHP\");\n\n// Read\n$content = file_get_contents(\"notes.txt\");\necho $content;\n\n// Reuse code\ninclude \"config.php\";\n?>",
    language: "php",
    previewType: "static",
    interactive: false,
    topics: ["file_get_contents", "file_put_contents", "include", "require"],
    expectedOutput: "Echoes: Hello from PHP (written then read back on the server).",
  },
  {
    id: "sql-relationships",
    moduleId: "sql",
    title: "Relationships",
    description: "How two tables reference each other.",
    explanation:
      "A relationship links rows across tables with keys. One-to-many is the common case: many projects belong to one user. The child table stores the parent's key as a FOREIGN KEY, which is what JOIN later matches on.",
    code: "CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(50)\n);\n\nCREATE TABLE projects (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  owner_id INT,\n  FOREIGN KEY (owner_id) REFERENCES users(id)\n);\n\n-- 1 user  ->  many projects\n-- projects.owner_id  ->  users.id",
    language: "sql",
    previewType: "static",
    interactive: false,
    topics: ["foreign key", "one-to-many", "primary key", "REFERENCES"],
    sampleTable: {
      headers: ["users.id", "users.name", "projects.owner_id", "projects.name"],
      rows: [
        ["1", "Kent", "1", "Geolocation App"],
        ["1", "Kent", "1", "Taskboard App"],
      ],
    },
    expectedOutput: "Both projects point to owner_id = 1, the same user row.",
  },
]

export const PLAYGROUND_LESSONS_PART27: Lesson[] = [
  {
    id: "html-tags",
    moduleId: "html",
    title: "Common Tags",
    description: "The common tags and how they behave.",
    explanation:
      "Every tag has a job. Headings (h1-h6) rank importance, p holds paragraphs, div is a blank container, and span is an inline wrapper. Block tags (p, div, h1) take a full row; inline tags (span, strong, a) flow with the text. Try swapping a tag to see its default behavior change.",
    code: "<h1>I am a heading (block)</h1>\n<p>I am a paragraph (block).\n  <span>I am a span (inline)</span>\n  <strong>I am strong (inline)</strong>\n  <a href=\"#\">I am a link (inline)</a>\n</p>\n<div>I am a div (block container)</div>\n<small>I am small text (inline)</small>",
    language: "html",
    previewType: "html",
    interactive: true,
    topics: ["block", "inline", "div", "span", "h1-p", "a", "strong"],
    expectedOutput: "Block tags stack on their own rows; inline tags sit side by side inside the text.",
  },
  {
    id: "js-fundamentals",
    moduleId: "javascript",
    title: "JavaScript Fundamentals",
    description: "What JS is and where it runs.",
    explanation:
      "JavaScript adds behavior to a page. It runs inside the browser after the HTML loads — place it in a <script> tag, usually at the end of body so the elements already exist. Statements run one by one from top to bottom, console.log() prints to the Console panel, and // starts a comment. JS can read and change the page (the DOM), react to clicks and typing (events), and fetch data from servers (fetch/JSON). The seven core concepts below cover almost all everyday JavaScript. Press Run to execute this file.",
    code: "<p>Open the Console panel below, then press Run.</p>\n<script>\n  // 1. Print to the console\n  console.log(\"Hello from JavaScript!\");\n\n  // 2. Talk to the page\n  document.querySelector(\"p\").style.color = \"#7c5cff\";\n\n  // 3. Do a little math\n  const total = 9 + 4;\n  console.log(\"9 + 4 =\", total);\n</script>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["script", "console.log", "comments", "statements"],
    expectedOutput: "Console shows: Hello from JavaScript! | 9 + 4 = 13, and the paragraph turns purple.",
    sections: [
      {
        title: "1. Variables and Data Types",
        content:
          "Variables are containers for stored information — declare once, use anywhere.\nconst for values that never change (use this by default); let for values that will be reassigned; avoid the old var.\nPrimitives: String (\"hello\"), Number (42, 3.14), Boolean (true), Undefined (declared but unassigned), Null (intentionally empty).\ntypeof value reveals a type — typeof \"hi\" is \"string\", typeof 42 is \"number\".\nExample:\nconst name = \"Kent\";\nlet score = 0; score = 10; // reassignment is fine",
      },
      {
        title: "2. Operators",
        content:
          "Arithmetic: +, -, *, / (divide), % (modulus — the remainder), ** (power).\nAssignment: =, plus shorthands like += and -=.\nComparison: === strict (value AND type — always prefer it), == loose (converts types — avoid), plus > < >= <=.\nLogical: && (both true), || (at least one true), ! (inverts) — combine conditions.\nString + string concatenates: \"Score: \" + 9 becomes \"Score: 9\" — or use template literals: `Score: ${9}`.",
      },
      {
        title: "3. Control Flow (Conditionals)",
        content:
          "Control flow lets your program make decisions — which code runs depends on a condition.\nif / else if / else picks one branch when its condition is true:\nif (score >= 90) { grade = \"A\"; } else if (score >= 80) { grade = \"B\"; } else { grade = \"C\"; }\nswitch is cleaner for one value with many fixed cases — remember break after each case and default for the fallback.\nTruthiness: 0, \"\", null, undefined, and NaN are falsey; everything else is truthy.\nTernary shorthand: const label = score >= 60 ? \"Pass\" : \"Fail\";",
      },
      {
        title: "4. Loops",
        content:
          "Loops handle repetition without rewriting code.\nfor loop — best when you know how many times to repeat:\nfor (let i = 0; i < 5; i++) { console.log(i); } // prints 0 to 4\nwhile loop — keeps running while a condition stays true; make sure something inside it changes or it never ends.\nfor...of — loops over an array cleanly: for (const item of fruits) { console.log(item); }\nbreak exits the loop early; continue skips to the next iteration.",
      },
      {
        title: "5. Functions",
        content:
          "Functions are reusable blocks of code that take inputs (parameters), run logic, and return an output.\nfunction greet(name) { return `Hello, ${name}!`; } — parameters go in, a value comes out with return.\nArrow shorthand (the modern default): const greet = (name) => `Hello, ${name}!`\nCalling a function without return gives undefined.\nWhy they matter: they keep code DRY, readable, and testable — the building block of every larger program.",
      },
      {
        title: "6. Data Structures: Arrays and Objects",
        content:
          "Arrays — ordered lists in square brackets:\nconst fruits = [\"apple\", \"banana\", \"cherry\"];\nf[0] is the first item (zero-based). Handy methods: push(), pop(), map(), filter(), length.\nObjects — key-value pairs describing one entity:\nconst user = { name: \"Sarah\", age: 25, active: true };\nRead with user.name or user[\"age\"]. An array of objects = a list of records: [{...}, {...}].\nDestructuring pulls values out directly: const { name } = user;",
      },
      {
        title: "7. The DOM and Event Handling",
        content:
          "The DOM (Document Object Model) is the browser's live object tree of your HTML — JavaScript can read and change it.\nSelect: document.querySelector(\"#button\") grabs an element.\nListen: element.addEventListener(\"click\", () => { ... }) runs code on click (also input, submit, keydown).\nUpdate: element.textContent = \"New!\", element.classList.add(\"active\"), element.style.color = \"red\".\nThe page updates without reloading — that's what makes a site feel like an app.\nTip: place <script> at the end of body (or wait for DOMContentLoaded) so elements exist before you select them.",
      },
    ],
  },
]

export const PLAYGROUND_LESSONS_PART28: Lesson[] = [
  {
    id: "js-api",
    moduleId: "javascript",
    group: "APIs",
    title: "REST & HTTP Fundamentals",
    description: "Methods, URLs, and status codes.",
    explanation:
      "A REST API is a URL you talk to with an HTTP method: GET reads, POST creates, PUT or PATCH updates, DELETE removes. The server replies with a status code — 2xx means success, 4xx means the request was wrong (404 not found, 405 method not allowed), 5xx means the server broke. This lesson runs an offline mock server that behaves exactly like a real one; the next lesson calls a real URL with fetch().",
    code: "<script>\n  // Mock server — behaves exactly like a real REST API, works offline\n  const posts = [{ id: 1, title: 'Hello' }];\n\n  function request(method, path, body) {\n    if (path !== '/posts' && path !== '/posts/1')\n      return { status: 404, body: { error: 'Not found' } };\n    if (method === 'GET') return { status: 200, body: posts };\n    if (method === 'POST') return { status: 201, body: { id: 2, ...body } };\n    if (method === 'DELETE') return { status: 204, body: null };\n    return { status: 405, body: { error: method + ' not allowed' } };\n  }\n\n  console.log('GET /posts ->', request('GET', '/posts'));\n  console.log('POST /posts ->', request('POST', '/posts', { title: 'New post' }));\n  console.log('DELETE /posts/1 ->', request('DELETE', '/posts/1'));\n  console.log('PATCH /posts/1 ->', request('PATCH', '/posts/1', { title: 'hi' }));\n  console.log('GET /missing ->', request('GET', '/missing'));\n</script>\n<p>Press Run. Then edit a method or path and run again to see the status change.</p>",
    language: "html",
    previewType: "javascript",
    interactive: true,
    topics: ["REST", "HTTP methods", "status codes"],
  },
  {
    id: "react-fetch",
    moduleId: "react",
    title: "Data Fetching",
    description: "loading, error, success — handle all three.",
    explanation:
      "Every data UI has three states: loading, error, success. useEffect runs the fetch after the component mounts ([] = run once), and setState moves the UI between them. Two gotchas: fetch() only rejects on network failure — a 404 or 500 still resolves, so always check res.ok before reading the body — and fetching belongs in an effect because it is a side effect: work that talks to the outside world.",
    code: "type Post = { id: number; title: string };\ntype State = \"loading\" | \"error\" | \"done\";\n\nfunction PostList() {\n  const [posts, setPosts] = useState<Post[]>([]);\n  const [state, setState] = useState<State>(\"loading\");\n\n  useEffect(() => {\n    fetch(\"/api/posts\")\n      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))\n      .then((data) => {\n        setPosts(data);\n        setState(\"done\");\n      })\n      .catch(() => setState(\"error\"));\n  }, []);\n\n  if (state === \"loading\") return <p>Loading...</p>;\n  if (state === \"error\") return <p>Could not load posts.</p>;\n  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}",
    language: "tsx",
    previewType: "static",
    interactive: false,
    topics: ["fetch", "useEffect", "loading state"],
    expectedOutput:
      "Shows Loading... first, then the list of posts — or the error line if the request fails. [] keeps the fetch running only once on mount.",
  },
]

// "CORE CONCEPTS" dropdown sections for individual lessons, keyed by lesson id.
// Merged into each lesson by ALL_PLAYGROUND_LESSONS below so the main lesson
// arrays stay focused on code/explanation/preview data.
const LESSON_SECTIONS: Record<string, { title: string; content: string }[]> = {
  "html-text-headings": [
    { title: "Headings hierarchy", content: "h1–h6 rank importance, not font size — one h1 per page, then h2/h3 for subsections. Never skip a level (h1 straight to h4); screen readers navigate by heading order. Visual size is CSS's job." },
    { title: "Paragraphs and breaks", content: "p holds blocks of text. Browsers collapse spaces and newlines in the source, so messy source code still renders as one space. br forces a line break — use it for addresses/poems, not for spacing between paragraphs (use margin instead)." },
    { title: "Text semantics", content: "strong = real importance (renders bold), em = emphasis (renders italic), mark = highlight, small = fine print, blockquote = quoted passage (cite attribute names the source), abbr (title) = abbreviation." },
    { title: "Special characters", content: "Some characters are reserved in HTML: show < as &lt;, > as &gt;, & as &amp;. &nbsp; is a non-breaking space that keeps words/numbers glued together (\"100&nbsp;kg\")." },
  ],
  "html-forms": [
    { title: "Form anatomy", content: "form wraps everything; action = where data is sent, method = GET (values in the URL) or POST (values in the body). Each control needs a name attribute — that's the key the server receives." },
    { title: "Input types", content: "text, email, password, number, date, checkbox, radio, file, range... The type decides the mobile keyboard, built-in validation, and UI (date pickers, spinners). radio buttons sharing one name = one choice." },
    { title: "Labels matter", content: "label for=\"input-id\" must match the input's id. Clicking the label focuses the input, and screen readers announce the label instead of \"edit text field\". Wrap label around the input for a shorthand." },
    { title: "Buttons and validation", content: "button type=\"submit\" sends the form; type=\"button\" waits for JS; type=\"reset\" clears fields. required, min/max, pattern, and maxlength add free browser validation before any server is involved." },
  ],
  "html-links": [
    { title: "Anchor basics", content: "a creates links; href is the destination. Link text should say where you go — \"Click here\" tells a screen reader nothing. Long documents can link to #section-id to jump within the page." },
    { title: "Link targets", content: "Absolute: https://example.com. Relative: /about (site root) or ./page.html (same folder). mailto: opens email, tel: opens the phone dialer." },
    { title: "Opening new tabs", content: "target=\"_blank\" opens a new tab — always pair with rel=\"noopener noreferrer\" (security + performance). Internal navigation should stay in the same tab; only external links justify a new tab." },
    { title: "Link states", content: "CSS handles :link, :visited, :hover, and :focus. A real keyboard user tabs through links — never remove :focus outlines. And never fake a link with a div + onclick; assistive tech can't announce it." },
  ],
  "html-lists": [
    { title: "Ordered vs unordered", content: "ul = order doesn't matter (bullets); ol = sequence matters (numbers, letters, roman numerals via type). li is always the direct child of ul/ol — nothing else." },
    { title: "Nesting", content: "To nest, put the whole child ul/ol INSIDE an li: <li>Fruit<ul><li>Apple</li></ul></li>. Putting ul directly inside ul is invalid and breaks numbering." },
    { title: "Styling", content: "list-style-type switches markers (disc, circle, square, decimal, lower-alpha, none). list-style: none is the first thing you write when building nav menus." },
    { title: "Where lists shine", content: "Menus, breadcrumbs, tables of contents, step-by-step instructions, and card grids all start as lists — they announce \"list, 5 items\" to screen readers, giving instant structure." },
  ],
  "html-tables": [
    { title: "Anatomy", content: "table > thead + tbody; tr = a row, th = header cell (bold, centered), td = data cell. Every row should have the same number of cells or the layout wobbles." },
    { title: "Caption and scope", content: "caption names the table; th scope=\"col\"/\"row\" tells screen readers what a cell labels. Header cells are the accessibility backbone — without them a table is just noise to a screen reader." },
    { title: "When NOT to use", content: "Tables are for tabular data only (numbers, comparisons, schedules). Page layout belongs to CSS Grid/Flexbox — tables were abused for layout in the 2000s and it wrecked accessibility." },
    { title: "Spanning cells", content: "colspan merges cells across columns (a header over 3 groups); rowspan merges down rows (one category spanning rows). Both used mostly in thead and summary rows." },
  ],
  "html-semantic": [
    { title: "Landmark regions", content: "header (top), nav (menus), main (primary content — only ONE per page), footer (bottom), aside (related side content). Screen readers jump between landmarks like chapters in a book." },
    { title: "article vs section vs div", content: "article = self-contained and meaningful alone (a blog post, a product card). section = a themed grouping that needs a heading. div = no meaning — use it only for styling hooks." },
    { title: "Why it beats divs", content: "Search engines read structure, screen readers announce landmarks, and other developers skim your markup without guessing. A <div id=\"header\"> hides all of that." },
    { title: "Quick audit", content: "If you can describe a div's purpose in words (\"this is the footer\"), there's a semantic tag for it. Also keep heading order logical — validators flag skipped levels." },
  ],
  "html-images": [
    { title: "img essentials", content: "src = path to the image, alt = text alternative. alt is required — describe what's IN the photo. Purely decorative images use alt=\"\" so screen readers skip them entirely." },
    { title: "Sizing without layout shift", content: "width/height attributes reserve space so text doesn't jump while the image loads (CLS!). CSS max-width: 100% + height: auto keeps images inside any container." },
    { title: "Formats", content: "JPG = photos, PNG = transparent graphics, SVG = logos/icons (crisp at any size), WebP = modern and small, GIF = animated but heavy. loading=\"lazy\" defers below-the-fold images." },
    { title: "figure and figcaption", content: "figure + figcaption pairs an image (or code/quote) with a caption that semantically belongs to it — better than a plain p underneath an img." },
  ],
  "html-elements": [
    { title: "The pair rule", content: "Every non-void element needs an opening and closing tag. Mismatched tags corrupt the tree — the browser auto-closes what it can, but your layout silently breaks." },
    { title: "Clean nesting", content: "Children must sit COMPLETELY inside parents: <p><strong>ok</strong></p>. Never overlap like <p><strong>bad</p></strong> — that's invalid and unpredictable." },
    { title: "Void elements", content: "img, br, hr, input, meta, link, source have no content and no closing tag: <img src=\"cat.jpg\" alt=\"\">. The trailing slash is optional in HTML5." },
    { title: "Block vs inline", content: "Block (div, p, h1, ul) starts a new line and takes full width. Inline (span, strong, a, img) flows within the text and doesn't break the line." },
  ],
  "html-attributes": [
    { title: "Syntax", content: "name=\"value\" sits inside the opening tag: <a href=\"/about\">. Quotes are strongly recommended. Boolean attributes are true just by existing: <input required>, <button disabled>." },
    { title: "Global attributes", content: "id, class, title, style, lang, hidden, tabindex, and data-* work on EVERY element — worth memorizing early." },
    { title: "id vs class", content: "id = ONE unique element (also the target of #anchors and label for=). class = a reusable label shared by many elements — the hook CSS styles and JS queries." },
    { title: "data-* for JS", content: "data-color=\"blue\" is read in JS as element.dataset.color — a clean place to store tiny bits of state in the markup without breaking other attributes." },
  ],
  "html-accessibility": [
    { title: "Labels and alt text", content: "Every input needs a matching label; every informative image needs alt. Decorative images get alt=\"\" to be ignored. This is the single biggest accessibility win." },
    { title: "Semantics over divs", content: "button, a, nav, h1–h6, table all carry built-in roles that screen readers announce. A clickable <div role=\"button\"> still needs ARIA, keyboard handling, and focus — real buttons do it for free." },
    { title: "Keyboard first", content: "If you can't do it with Tab, Enter, and Space, it's broken for keyboard users. Keep :focus-visible outlines — they're not ugly, they're the cursor for non-mouse users." },
    { title: "Contrast and ARIA", content: "Body text needs roughly 4.5:1 contrast against its background. ARIA is a last resort — the first rule of ARIA is \"don't use ARIA\" when a native HTML element already fits." },
  ],
  "html-html5": [
    { title: "Modern input types", content: "email, url, tel, number, date, color, range replace plain text boxes — each gives free validation plus the right mobile keyboard and pickers." },
    { title: "Media elements", content: "video and audio with controls, multiple <source> children for format fallback, and <track kind=\"captions\"> for subtitles — no plugins needed." },
    { title: "Semantic structure", content: "header, nav, main, section, article, footer (the 'semantic HTML5 tags') were added to describe pages directly instead of abusing tables and divs." },
    { title: "Built-in browser APIs", content: "localStorage/sessionStorage keep data in the browser, canvas draws pixels, plus geolocation, drag-and-drop, and fetch — all driven by JavaScript." },
  ],
  "html-tags": [
    { title: "Block tags", content: "h1–h6, p, div, ul, li, table, form, header, section — each starts a new line and spans the available width." },
    { title: "Inline tags", content: "strong, em, a, span, img, code, small — they sit inside text without breaking the line, so several can share one line." },
    { title: "Inline-block", content: "button, img, and inline-block elements accept width/height yet still line up with text — the middle ground between the two." },
    { title: "Pick by meaning", content: "Choose a tag for what it MEANS (a for navigation, button for actions, li for list items), then style it with CSS. Meaning-first markup = free accessibility." },
  ],
  "css-box-model": [
    { title: "Four layers", content: "Every element is four boxes: content (text/image) → padding (inner breathing room, has background) → border (the edge) → margin (outer space between elements, transparent)." },
    { title: "The default trap", content: "box-sizing: border-box makes width INCLUDE padding + border, so a 300px-wide box stays 300px. Without it, width 300 + padding 20 = 340px wide. border-box globally (the reset) avoids the math." },
    { title: "Margin quirks", content: "Vertical margins of adjacent blocks collapse into one (the larger wins) — a classic \"why is my gap double?\" mystery. Horizontal margins never collapse." },
    { title: "DevTools", content: "Inspect any element: the box-model diagram shows exact px for all four layers, and the Computed tab highlights what's consuming space." },
  ],
  "css-flexbox": [
    { title: "The three lines", content: "display: flex on the parent, align-items: center (cross axis / vertical), justify-content: center (main axis / horizontal) — centers anything in both directions." },
    { title: "Axes", content: "Row direction: main axis = horizontal (justify), cross axis = vertical (align). Flip to flex-direction: column and they swap roles." },
    { title: "Centering gotchas", content: "The parent needs a height (100vh/100%) for vertical centering to be visible. For a single inline-ish child, margin: auto on the child works too." },
    { title: "Gap, not margins", content: "gap: 16px spaces flex items uniformly without first/last-child margin hacks — the modern default for rows of cards/buttons." },
  ],
  "css-transform": [
    { title: "Functions", content: "rotate(45deg), scale(1.2), translateX(20px) / translate(20px, 10px), skew, and matrix. Chain them: transform: rotate(10deg) scale(1.1)." },
    { title: "Visual only", content: "Transform changes how something LOOKS without affecting the layout flow — neighbors keep their positions, unlike margin changes." },
    { title: "transform-origin", content: "The pivot point defaults to the center (50% 50%). Set it to bottom center or top left to rotate around a different corner." },
    { title: "Smooth motion", content: "transform is GPU-friendly — pair with transition for silky hover effects (buttons that lift, cards that zoom) instead of animating top/left." },
  ],
  "css-selectors": [
    { title: "Basic selectors", content: "element (div), .class (matches class attribute), #id (unique id), * (everything). Combine: button.primary matches class=\"primary\" on buttons." },
    { title: "Combinators", content: "Descendant: \"div p\" (any depth). Child: \"div > p\" (direct only). Adjacent: \"h1 + p\" (immediately after). General sibling: \"h1 ~ p\" (anywhere after)." },
    { title: "Grouping and pseudo", content: "h1, h2 { } styles both. :hover, :focus, :nth-child(2n) target states/positions without adding classes." },
    { title: "Practical advice", content: "Keep specificity low — prefer single classes over deep selectors like .main .nav ul li a. Short selectors are easier to override and debug." },
  ],
  "css-colors": [
    { title: "Formats", content: "Hex #ff6600 / #f60, rgb(255 102 0), hsl(24 100% 50%) — same orange in three dialects. Named colors (orange) exist but are limited." },
    { title: "HSL intuition", content: "hsl(hue 0-360, saturation %, lightness %) is the most human: keep S/L and slide H to build a harmonious palette — great for theming." },
    { title: "Alpha channel", content: "rgb(0 0 0 / 0.5) or #00000080 add transparency; hsla/rgba are the older syntax. Modern shorthand supports the / alpha form in all formats." },
    { title: "Tools of the trade", content: "color-mix() blends colors in CSS; oklch() is the modern perceptually-even space. Use utilities to convert hex → rgb → hsl when needed." },
  ],
  "css-grid": [
    { title: "Two axes", content: "Grid controls rows AND columns at once (Flexbox = one axis). display: grid on the parent; everything inside becomes a grid item." },
    { title: "Tracks", content: "grid-template-columns: 200px 1fr 1fr = fixed sidebar + two equal columns. fr = free space share; minmax(200px, 1fr) sets a floor; repeat(3, 1fr) is shorthand." },
    { title: "Auto placement", content: "Items flow into cells in order. grid-auto-rows sizes implicit rows; span across with grid-column: span 2 or explicitly grid-column: 1 / 3." },
    { title: "Responsive without media queries", content: "grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) creates as many 250px+ columns as fit — responsive grids in one line." },
  ],
  "css-position": [
    { title: "The four values", content: "static (default, ignores offsets), relative (offsets relative to where it WOULD be, still in flow), absolute (nearest positioned ancestor), fixed (viewport), sticky (scrolls, then sticks)." },
    { title: "Absolute's containing block", content: "absolute looks for the closest ancestor with position other than static; if none, it anchors to the page. top: 0; left: 0 then pins its corner there." },
    { title: "z-index", content: "Overlapping? z-index controls stacking — but only for positioned elements (or flex/grid items). Huge z-index battles usually mean a missing position value." },
    { title: "Sticky recipes", content: "position: sticky; top: 0 makes headers that stick while scrolling. It needs an overflow setting on ancestors that doesn't clip it — the classic debugging case." },
  ],
  "css-transitions": [
    { title: "Four properties", content: "transition: property duration timing-function delay — e.g. transition: all 0.3s ease 0.05s. Only animate transform and opacity for smooth 60fps results." },
    { title: "Trigger", content: "Transitions need a state change: :hover, :focus, or a class toggle. Without a trigger they never run — unlike animations." },
    { title: "duration matters", content: "150–300ms feels responsive; over 500ms feels sluggish for UI feedback. ease-in-out reads naturally for most hover effects." },
    { title: "What not to transition", content: "Animating top/left/width forces layout recalculations (jank). Animate transform: translate/scale instead — the compositor handles those on the GPU." },
  ],
  "css-animations": [
    { title: "Keyframes", content: "@keyframes spin { from { transform: rotate(0) } to { transform: rotate(360deg) } } defines the movie; animation: spin 2s linear infinite plays it." },
    { title: "Shorthand order", content: "animation: name duration timing-function delay iteration-count direction fill-mode. Most-used: animation: pulse 1.5s ease-in-out infinite." },
    { title: "Control", content: "iteration-count: infinite loops forever; alternate ping-pongs; fill-mode: forwards keeps the final frame (else it snaps back)." },
    { title: "Practical uses", content: "Spinners, skeleton loaders, entrance fades, subtle attention pulses. For hover micro-interactions, transitions are simpler." },
  ],
  "css-media": [
    { title: "The syntax", content: "@media (min-width: 768px) { ... } applies rules only when the condition matches. Mobile-first means writing base styles small and stacking min-width queries upward." },
    { title: "Breakpoints", content: "Common rungs: 640 (sm), 768 (md), 1024 (lg), 1280 (xl). Pick them by where YOUR content breaks, not by device names like \"iPhone\"." },
    { title: "More than width", content: "Conditions can test height, orientation, prefers-color-scheme (dark mode), prefers-reduced-motion (accessibility), and even pointer type (hover: none)." },
    { title: "Common mistake", content: "max-width queries are desktop-first and cause overlap gaps between ranges. min-width chains always build on each other — fewer surprises." },
  ],
  "css-variables": [
    { title: "Declaring", content: "--brand: #6366f1; inside a selector (usually :root). Use it with var(--brand). Unlike colors, variables live with hyphens, not camelCase." },
    { title: "Cascading power", content: "Variables inherit and can be overridden per scope — redefine --brand inside .dark and everything under it switches color. That's theming in two lines." },
    { title: "Fallbacks", content: "var(--missing, 16px) supplies a default when the variable doesn't exist — prevents a rule from silently dying." },
    { title: "Real uses", content: "Theme colors, spacing scales (var(--gap)), font stacks, and dark mode. Values can even hold calc() so one token adjusts everywhere." },
  ],
  "css-fundamentals": [
    { title: "Three ways in", content: "Inline style=\"\" (worst), <style> in the head (fine for tiny pages), and a linked stylesheet with <link rel=\"stylesheet\"> (the standard)." },
    { title: "How rules read", content: "selector { declaration } — e.g. p { color: blue }. The browser matches every p on the page and applies the block. Semicolons separate declarations; a missing one kills the rest." },
    { title: "The cascade", content: "When two rules fight, the browser resolves: importance > specificity > source order. Understanding this beats memorizing properties." },
    { title: "Cascade layers & reset", content: "A tiny reset (margin: 0, box-sizing: border-box) removes browser inconsistencies before your styles ever run." },
  ],
  "css-specificity": [
    { title: "The score", content: "Inline style = 1000, #id = 100, .class/:pseudo = 10, element/pseudo-element = 1. Compare column by column: (0,2,0) beats (0,1,0)." },
    { title: "!important", content: "It jumps every score — a life raft that becomes an anchor if overused. Prefer fixing specificity instead; then !important stays for true overrides." },
    { title: "Equal scores", content: "When specificity ties, the LAST rule in the stylesheet wins. Moving a rule down can be the whole fix." },
    { title: "Strategy", content: "Keep selectors flat (one class where possible), use data-attributes for variants, and reserve ids for JS hooks — flat CSS is override-friendly CSS." },
  ],
  "css-typography": [
    { title: "Sizing", content: "px = fixed, rem = relative to root font-size (best for accessibility), em = relative to the parent's font-size. Line-height unitless (1.5) scales automatically." },
    { title: "Font stacks", content: "font-family: Inter, system-ui, sans-serif falls back if the first font fails to load. Load web fonts via @import or <link>, and preconnect for speed." },
    { title: "Spacing rhythm", content: "letter-spacing tightens headings; word-spacing and max-width: 65ch keep line length readable — 60–75 characters per line is the comfort zone." },
    { title: "Modern extras", content: "clamp(1.5rem, 4vw, 2.5rem) scales type fluidly between screens; font-weight pairs with system fonts for hierarchy without loading five files." },
  ],
  "css-display": [
    { title: "Block vs inline vs inline-block", content: "Block (div, p) = full width, new line. Inline (span, a) = flows in text, ignores width/height. inline-block = sits inline but accepts width/height — the hybrid." },
    { title: "display: none vs visibility", content: "none removes the element AND its space (it's out of the accessibility tree too). visibility: hidden keeps the gap but hides it visually." },
    { title: "Flex and grid", content: "display: flex makes children flex items in one row/column; display: grid creates rows AND columns. Both change how DIRECT children lay out." },
    { title: "Hidden utilities", content: "display: none in media queries powers responsive hiding (sidebar on mobile). Watch the flash: elements are hidden as soon as the query matches." },
  ],
  "css-pseudo-class": [
    { title: "State classes", content: ":hover, :focus, :focus-visible, :active, :visited — states the browser tracks FOR you, no JS class-toggling required." },
    { title: "Structural", content: ":first-child, :last-child, :nth-child(2n), :only-child target position in the parent — zebra-striped table rows are one line: tr:nth-child(even)." },
    { title: "Form logic", content: ":required, :invalid, :checked, :disabled, :placeholder-shown style validation live as the user types — pair with :not() for clean rules." },
    { title: "Specificity note", content: "Each :pseudo-class counts as a class-level point — a.href:hover still beats bare a { } without any !important." },
  ],
  "css-pseudo-element": [
    { title: "Two colons", content: "::before and ::after create virtual elements whose content comes from the content property — they inject decorations without touching the HTML." },
    { title: "content realities", content: "content: \"★\" or url(icon.png) works; they're replaced elements, so normal text properties behave oddly. They're decorative — screen readers mostly ignore them." },
    { title: "Other pseudo-elements", content: "::selection (highlight color), ::placeholder, ::first-line, ::first-letter (drop caps), and ::marker (list bullets)." },
    { title: "Classic uses", content: "Badges (::after with attr(data-count)), tooltips, gradient underlines, quote marks — all without extra markup." },
  ],
  "css-advanced": [
    { title: "Gradients", content: "linear-gradient(90deg, #6366f1, #ec4899) and radial-gradient(circle, ...) are functions returning images — great for backgrounds and fake borders." },
    { title: "Shadows", content: "box-shadow: 0 4px 12px rgb(0 0 0 / 0.1) adds depth (x y blur spread color, comma = multiple layers). text-shadow styles text only." },
    { title: "Blend modes", content: "mix-blend-mode: multiply/screen and background-clip: text (gradient text) create effects that used to require Photoshop." },
    { title: "Clamp & modern layout", content: "clamp() for fluid values, aspect-ratio for boxes without padding hacks, :has() as 'the parent selector' — modern CSS removes whole JS chunks." },
  ],
  "css-responsive": [
    { title: "Breakpoints", content: "Media queries are the hinges: base styles for phones, then @media (min-width: X) rules that layer upward. Tailwind's sm/md/lg are the same X values." },
    { title: "Fluid units", content: "rem/em/%/vw/vh adapt on their own — a width: 80% column shrinks with the screen, sparing you a query entirely. Prefer fluid first, queries second." },
    { title: "Pictures and text", content: "img { max-width: 100% } is the one-liner that makes images responsive; clamp() makes type fluid; minmax() keeps grid columns from crushing." },
    { title: "Testing", content: "DevTools device mode (Ctrl+Shift+M) emulates widths. Resize the real window too — content-driven breakpoints beat preset device sizes." },
  ],
  "tailwind-flex-center": [
    { title: "The utility trio", content: "flex (display: flex), items-center (align-items), justify-content via justify-center — the Tailwind spelling of the three-line CSS centering recipe." },
    { title: "Full-height centering", content: "min-h-screen on the parent gives the needed height for vertical centering — Tailwind's answer to the 100vh CSS requirement." },
    { title: "Flex-direction", content: "flex-col stacks children vertically; add it when centering a column of elements instead of a row." },
    { title: "Why it works", content: "Each class compiles to exactly one CSS rule (display:flex; align-items:center; justify-content:center) — same cascade, no naming debates." },
  ],
  "tw-spacing": [
    { title: "The scale", content: "p-1 = 0.25rem (4px), p-2 = 0.5rem, p-4 = 1rem — every step is ×4px from the same scale, so spacing across pages stays consistent by design." },
    { title: "Padding vs margin", content: "p-/pt-/pr/pb/pl = inside (background shows). m-/mt-/mr/mb/ml = outside (pushes neighbors). mx-auto centers horizontally." },
    { title: "Gaps beat margins", content: "gap-4 on a flex/grid parent spaces children evenly without first/last margin tricks — the modern default." },
    { title: "Arbitrary values", content: "p-[13px] escapes the scale when you truly need an odd number — use sparingly or the rhythm breaks." },
  ],
  "tw-typography": [
    { title: "Size and weight", content: "text-sm … text-4xl scale type (roughly 1.25× per step); font-light … font-black set weight. Combine: text-2xl font-bold." },
    { title: "Alignment", content: "text-left / text-center / text-right align; tracking-* adjusts letter spacing; leading-* line height (leading-relaxed for reading comfort)." },
    { title: "Color and decoration", content: "text-gray-500 sets color (number = shade, higher = darker); underline, line-through, uppercase, italic decorate in one class." },
    { title: "Fonts", content: "font-sans / font-serif / font-mono swap families from the theme config; arbitrary font-[Inter] loads a custom one already configured in CSS." },
  ],
  "tw-responsive": [
    { title: "Mobile-first prefixes", content: "sm: (640px), md: (768px), lg: (1024px), xl: (1280px), 2xl: (1536px). Base styles are mobile; prefixed styles apply ABOVE that width." },
    { title: "Reading order", content: "Base class first, then responsive overrides: \"grid grid-cols-1 md:grid-cols-3\" — one column on phones, three on desktop, one declaration each." },
    { title: "Why mobile-first", content: "Unprefixed styles always apply; the query only ADAPTS upward. Desktop-first (max-width) requires re-specifying everything at every step." },
    { title: "Hidden/show", content: "hidden md:block hides on mobile and reveals at md — the responsive show/hide pattern in two classes." },
  ],
  "tw-hover": [
    { title: "Variant prefixes", content: "hover:bg-blue-700 applies only while hovering; focus:ring-2 on focus; active: when pressed. Variants stack: hover:md:underline." },
    { title: "Transitions", content: "transition (or transition-all) plus duration-200 makes the color change smooth — utilities alone would snap instantly." },
    { title: "Full recipe", content: "A button: bg-blue-600 hover:bg-blue-700 transition — state change + easing in four classes." },
    { title: "Other dynamic variants", content: "group-hover: triggers from the parent (add group to parent), peer-checked: from a sibling — powerful composition without JavaScript." },
  ],
  "tw-utility": [
    { title: "One class, one job", content: "p-4 is padding, text-center is alignment — no .card-title soup. Class lists read as a specification of what's visually true." },
    { title: "Composition over cascade", content: "Two conflicting classes? The LATER one in the generated stylesheet wins (Tailwind's internal order), not the one written last in HTML — know the tie-break." },
    { title: "Extracting patterns", content: "Repeated 5-class combos become components: @apply in CSS or a real React component. Reuse code, not string concatenation." },
    { title: "Mindset shift", content: "CSS stops being 'where do I write this rule?' — you describe each element inline. The cost: longer class attributes; the win: zero naming and no dead CSS." },
  ],
  "tw-layout": [
    { title: "Containers", content: "max-w-7xl mx-auto px-4 centers a page with breathing room — the standard wrapper. w-full lets content fill available space." },
    { title: "Flex utilities", content: "flex, flex-col, items-center, justify-between, gap-6 — the whole flexbox vocabulary, abbreviated." },
    { title: "Grid utilities", content: "grid grid-cols-3 gap-4 defines columns directly; md:grid-cols-2 changes them responsively." },
    { title: "Display switches", content: "block, inline, inline-flex, hidden control display — responsive patterns pair them (hidden md:flex) for conditional layouts." },
  ],
  "tw-sizing": [
    { title: "Width and height", content: "w-full (100%), w-1/2, w-64 (16rem), h-screen, h-96 — fractions and scale steps, same 4px rhythm as spacing." },
    { title: "min and max", content: "min-h-screen fills the viewport at minimum; max-w-md caps a reading column; max-w-full prevents overflow — three classics." },
    { title: "Arbitrary and viewport", content: "w-[400px] for exact pixels; w-screen / h-dvh target the viewport directly (dvh handles mobile browser bars)." },
    { title: "With images", content: "w-full h-full object-cover makes an image fill its box while cropping — the standard thumbnail combo (sizes come from the parent)." },
  ],
  "tw-colors": [
    { title: "Shade numbers", content: "gray-50 (lightest) … gray-900 (darkest); 500 is the mid accent. bg-blue-600 text-white is the classic pairing — one number picks the mood." },
    { title: "Tailwind colors", content: "gray, red, amber, emerald, sky, indigo, violet, pink — a full accessible-ish palette; text-* for color, bg-* for fills, border-* for edges." },
    { title: "Opacity and alpha", content: "bg-black/50 adds transparency (the slash syntax); opacity-75 fades the whole element." },
    { title: "Custom colors", content: "Define in the config (or @theme in v4): brand: { 500: '#6366f1' } — then bg-brand-500 works like any built-in." },
  ],
  "tw-borders": [
    { title: "Width and side", content: "border (1px), border-2, border-4; border-t / border-b for one side; border-0 removes. Default color is gray-200." },
    { title: "Color and radius", content: "border-gray-300 sets color; rounded-md / rounded-lg / rounded-full (pill/circle) replace pixel radii with the shared scale." },
    { title: "Dividers", content: "A bottom border (border-b) on list rows creates table-like dividers without collapsing-margin gymnastics." },
    { title: "Ring", content: "ring-2 ring-blue-500 draws an OUTSIDE outline (focus indicators!) without affecting layout like border does." },
  ],
  "tw-effects": [
    { title: "Shadows", content: "shadow-sm (subtle) … shadow-xl (dramatic); shadow-none removes. Cards typically use shadow-sm + hover:shadow-md." },
    { title: "Opacity", content: "opacity-0 … opacity-100 fade whole elements — combine with transition-opacity for cheap fades." },
    { title: "Overflow and clipping", content: "overflow-hidden clips children (with rounded corners it crops images to the radius) — prevents content poking out of cards." },
    { title: "Blend and blur", content: "mix-blend-multiply/screen blend layers; backdrop-blur-md frosts what's behind (glassmorphism) — modern polish in one class." },
  ],
  "tw-flexbox": [
    { title: "Direction and wrapping", content: "flex-row (default) / flex-col set the main axis; flex-wrap lets items spill to a new line when space runs out." },
    { title: "Distribution", content: "justify-between pushes items to the edges (space between), justify-center groups them center, justify-start/end anchor them." },
    { title: "Cross-axis", content: "items-center / items-stretch / items-start control the other axis; self-* overrides one child (self-end)." },
    { title: "Growth", content: "flex-1 grows to fill leftover space; flex-none locks natural size; shrink-0 refuses to shrink — the three you'll type most." },
  ],
  "tw-grid": [
    { title: "Columns made easy", content: "grid + grid-cols-2/3/4 sets columns instantly — no template strings, no guessing track sizes. gap-4 spaces the cells." },
    { title: "Responsive columns", content: "grid-cols-1 md:grid-cols-3 — the whole responsive-grid pattern in two classes; auto-fit behavior without minmax syntax." },
    { title: "Row and column spans", content: "col-span-2 / row-span-2 stretch one card across cells; col-start-3 / row-start-1 place items explicitly." },
    { title: "Auto-fit pattern", content: "grid-cols-[repeat(auto-fit,minmax(200px,1fr))] brings the pure-CSS responsive trick into Tailwind via arbitrary values." },
  ],
  "tw-dark": [
    { title: "The variant", content: "dark:bg-gray-900 applies in dark mode — put the dark: class next to its base counterpart so both are readable at a glance." },
    { title: "How mode is chosen", content: "By default Tailwind follows prefers-color-scheme (OS setting). For a manual toggle, add class=\"dark\" to <html> and media queries still work as fallback." },
    { title: "Strategy", content: "Design light styles first, then add dark: overrides for background, text, and border — three properties usually cover a whole page." },
    { title: "Contrast check", content: "Dark mode isn't 'invert everything': keep text at gray-100 on gray-900, soften pure white, and raise shadows to borders for depth." },
  ],
  "tw-patterns": [
    { title: "Button recipe", content: "px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition — save it as a component once the combo repeats." },
    { title: "Card recipe", content: "rounded-xl border border-gray-200 bg-white p-6 shadow-sm — border for definition, shadow for lift, padding for breathing room." },
    { title: "Extract, don't repeat", content: "When the same 5+ classes appear three times, promote to a React component (or @apply block) with props for variants." },
    { title: "Consistency wins", content: "Shared recipes mean spacing, radii, and colors match across pages automatically — the real reason utility systems scale." },
  ],
  "tw-compare": [
    { title: "Same output", content: "CSS class { padding: 1rem } and Tailwind p-4 compile to identical rules. Tailwind doesn't change what CSS IS — it changes where rules are written." },
    { title: "Where styles live", content: "Plain CSS: one place per rule, easy to find, risk of spaghetti. Tailwind: with the markup, longer to read, impossible to leave dead rules." },
    { title: "When Tailwind wins", content: "Rapid UI, design systems, teams that hate naming. When plain CSS wins: complex animations, one-off designs, print stylesheets." },
    { title: "They mix", content: "Plenty of real projects use Tailwind for layout plus small custom CSS files for keyframes and theme tokens — tools, not religion." },
  ],
  "ts-generics": [
    { title: "Type parameters", content: "function first<T>(arr: T[]): T { return arr[0] } — T is a placeholder TS fills from the call: first([1,2]) → number, first([\"a\"]) → string." },
    { title: "Constraints", content: "<T extends { id: number }> forces T to have an id — you get flexibility AND access to guaranteed members." },
    { title: "Generic types", content: "interface Box<T> { value: T }; Array<string>, Promise<number>, Record<string, User> are all generics you already use daily." },
    { title: "When to reach for it", content: "Same logic, different types: identity, cache<K,V>, result wrappers. If you're typing any or duplicating code per type — it's a generic." },
  ],
  "ts-union": [
    { title: "Union (OR)", content: "type ID = string | number — the value may be EITHER. Widens what's accepted; forces handling of every member before use." },
    { title: "Intersection (AND)", content: "type Visible & { id: number } combines two shapes — the value must satisfy BOTH. Great for composing mixins: A & B & C." },
    { title: "Literal unions", content: "type Status = \"idle\" | \"loading\" | \"done\" — the workhorse: unions of string literals power dropdown states, props enums, and switch narrowing." },
    { title: "Handling unions", content: "if (typeof v === \"string\") / switch (v) narrow each branch — TS then knows exactly which members exist inside (see Type Narrowing)." },
  ],
  "ts-utility": [
    { title: "Partial, Required, Readonly", content: "Partial<T> makes every field optional (patch payloads), Required<T> the opposite, Readonly<T> locks them — wrappers around existing types." },
    { title: "Pick and Omit", content: "Pick<User, \"name\" | \"age\"> keeps only listed keys; Omit<User, \"password\"> drops one — shape outputs without redeclaring." },
    { title: "Record", content: "Record<KeyType, ValueType> builds maps: Record<string, number> = { [key: string]: number } — the typed object-as-dictionary." },
    { title: "Return types", content: "ReturnType<typeof fn> extracts a function's return type; Awaited<T> unwraps promises — auto-derived contracts that can't drift." },
  ],
  "ts-advanced": [
    { title: "readonly and as const", content: "readonly arrays/props prevent mutation; as const freezes values (and keys) into literal types — the source of true const-like data." },
    { title: "Literal inference", content: "let a = \"x\" widens to string; const b = \"x\" stays \"x\"; as const makes { size: \"L\" } keep size: \"L\" instead of string." },
    { title: "Satisfies", content: "const routes = {...} satisfies Record<string, Route> checks a value against a type WITHOUT widening it — precise checking, exact inference." },
    { title: "Type-level patterns", content: "Mapped types (type Str = { [K in keyof T]: string }), conditional types (T extends X ? A : B), and template literal types — advanced but common in libs." },
  ],
  "nextjs-loading": [
    { title: "loading.tsx", content: "Drop loading.tsx next to page.tsx and Next shows it INSTANTLY while the page's awaits resolve — a streaming spinner with zero code." },
    { title: "error.tsx", content: "A client component receiving error + reset; it catches render/data errors for its segment and everything below — no try/catch in the page." },
    { title: "not-found.tsx", content: "Rendered by notFound() (e.g., unknown slug) — the 404 UI for a route segment, styled with your own layout." },
    { title: "Segments and boundaries", content: "Each folder's loading/error files create Suspense/error boundaries around its children — nested spinners mean localized waiting." },
  ],
  "nextjs-route-handlers": [
    { title: "route.ts = API", content: "app/api/notes/route.ts exports async functions named after HTTP verbs: GET, POST, PATCH, DELETE — REST endpoints inside your route tree." },
    { title: "Request and Response", content: "Handlers receive a Request: await req.json() reads the body; return Response.json(data) (or NextResponse) sends — standard Web APIs." },
    { title: "Params", content: "export async function GET(req, { params }: { params: Promise<{ id: string }> }) — dynamic segments arrive as params (await in Next 15+)." },
    { title: "Server-only secrets", content: "Route handlers run on the server — API keys and DB calls stay private. Never expose secrets in Client Components (they're public by definition)." },
  ],
  "nextjs-deploy": [
    { title: "Vercel first", content: "Push to GitHub → import in vercel.com → auto-build every branch/PR. Zero config for most apps; the domain is live in minutes." },
    { title: "Environment variables", content: "Dashboard → Settings → Environment Variables (or .env.local locally: process.env.DATABASE_URL). Never commit .env files — .env*.local is git-ignored by default." },
    { title: "Other hosts", content: "Any Node host can run next build + next start (or Docker). Static exports (output: 'export') go to any static CDN but drop server features." },
    { title: "Before you ship", content: "npm run build locally first (catches type/lint errors), check metadata, test 404s and loading states — then let CI deploy." },
  ],
  "js-variables": [
    { title: "let, const, var", content: "const by default (can't be reassigned), let when reassignment is needed, var only in old code — it leaks out of blocks and hoists confusingly." },
    { title: "Naming", content: "camelCase for variables (userName, totalPrice), SCREAMING_SNAKE for true constants. Names describe WHAT, not HOW (x → itemCount)." },
    { title: "Dynamic typing", content: "A variable's TYPE lives in the value, not the name — let x = 5 then x = \"five\" is legal. This is what causes classic JS gotchas like \"5\" + 3." },
    { title: "Output", content: "console.log() is your debugger; console.table() renders arrays/objects nicely; alert() blocks the page — demo only." },
  ],
  "js-events": [
    { title: "addEventListener", content: "element.addEventListener(\"click\", handler) attaches a function that runs on the event. Prefer it over onclick = \"...\" attributes — logic stays in JS." },
    { title: "The event object", content: "The handler receives an event: e.target (the thing clicked), e.preventDefault() (stop default behavior), e.key (for keyboard events)." },
    { title: "Common events", content: "click, dblclick, mouseover, keydown/keyup, submit, input, change, focus, DOMContentLoaded (page ready)." },
    { title: "Removing and options", content: "removeEventListener needs the SAME function reference — use named functions. { once: true } auto-removes after one run." },
  ],
  "js-conditions": [
    { title: "Truthy and falsy", content: "Falsy: false, 0, \"\", null, undefined, NaN, 0n. Everything else is truthy — so if (value) is the idiomatic emptiness check." },
    { title: "Operators", content: "=== (strict, no type juggling) vs == (coerces types — avoid it), plus !==, && (and), || (or), ! (not). Strict comparison by habit." },
    { title: "else if chains", content: "if / else if / else evaluate top-down and stop at the first match. Keep branches flat; deep nesting hides bugs." },
    { title: "Modern syntax", content: "Optional chaining ?. reads a nested value safely (user?.address?.city → undefined instead of an error); ?? picks the right-side default only for null/undefined." },
  ],
  "js-loops": [
    { title: "The classic for", content: "for (let i = 0; i < n; i++) — initializer, condition, step. let i keeps a fresh binding per iteration (var doesn't — closures bite)." },
    { title: "while vs do...while", content: "while checks FIRST (may run zero times); do...while runs at least once. Use when the count isn't known upfront." },
    { title: "Loop control", content: "break exits immediately; continue skips to the next iteration — perfect for skipping invalid items." },
    { title: "Modern loops", content: "for...of iterates values (arrays, strings, maps); for...in iterates keys (objects). for...of replaces most manual index loops." },
  ],
  "js-arrays": [
    { title: "Creating and reading", content: "const list = [1, 2, 3]; access list[0] (zero-based), check list.length. Arrays are objects — indexes are numbers as strings under the hood." },
    { title: "Mutating methods", content: "push (end), pop (end), shift (start), unshift (start), splice (cut/insert), sort, reverse — they change the original array." },
    { title: "Non-mutating methods", content: "map, filter, slice, concat, toSorted return NEW arrays — the originals stay untouched, which prevents sneaky shared-reference bugs." },
    { title: "map vs filter vs forEach", content: "map transforms 1:1 (returns new array), filter keeps matches (returns subset), forEach just runs for side effects (returns undefined)." },
  ],
  "js-functions": [
    { title: "Two forms", content: "function greet(name) { return \"Hi \" + name } or const greet = (name) => `Hi ${name}`. Named declarations hoist (usable before the line); const arrows don't." },
    { title: "Parameters and defaults", content: "Default values (prefix = \"Mr.\") fill missing arguments; rest (...nums) collects extras into an array. JS is loose about argument counts — check types when it matters." },
    { title: "Return", content: "return ends the function and sends a value back; a function without return gives undefined. Arrow functions with braces need explicit return." },
    { title: "Scope", content: "Functions create their own scope — inner can read outer (closures), outer can't see inner. const/let declared inside stay inside." },
  ],
  "js-syntax": [
    { title: "Statements and lines", content: "Statements end with semicolons; ASI (automatic semicolon insertion) usually saves you, but leading-semicolon bugs make explicit ; the safer habit." },
    { title: "Comments", content: "// single line, /* multi */ — comment WHY, not WHAT; the code already says what." },
    { title: "Expressions vs statements", content: "Expressions produce values (3 + 4); statements do actions (if, for, let). Only statements can't sit on the right side of =." },
    { title: "Common errors", content: "Missing } / typo'd variable = SyntaxError caught before running. A file runs top-to-bottom — one throw stops everything below it." },
  ],
  "js-types": [
    { title: "Primitives", content: "string, number, boolean, undefined, null, bigint, symbol. Everything else (including arrays and functions) is an object." },
    { title: "Checking", content: "typeof x returns \"string\" etc. — but typeof null is \"object\" (a 30-year-old bug), and arrays report \"object\". Array.isArray(a) for arrays." },
    { title: "Number quirks", content: "0.1 + 0.2 = 0.30000000000000004 (floating point). NaN appears from invalid math — NaN === NaN is false, use Number.isNaN()." },
    { title: "Coercion hazards", content: "\"5\" * 2 works (10), \"5\" + 2 doesn't (\"52\") — + joins strings first. == \"\" tricks: [] == 0 is true. Use === and convert explicitly." },
  ],
  "js-operators": [
    { title: "Math", content: "+ - * / % (remainder) ** (power). % is the gem: even check (n % 2 === 0), wrapping indexes, every-Nth-item tricks." },
    { title: "Comparison", content: "=== / !== compare value AND type. < > <= >= work on strings too (alphabetical). Mixed-type comparison silently yields nonsense." },
    { title: "Assignment", content: "x += 1 shorthand; also ++ / --. Destructuring assignment (let {a, b} = obj) is covered in its own lesson." },
    { title: "Logical and chaining", content: "&& requires both, || needs one, ?? only defaults on null/undefined. x = input ?? \"Guest\" beats || because 0 and \"\" are valid values." },
  ],
  "js-objects": [
    { title: "Literals and access", content: "const user = { name: \"Kent\", age: 24 }; read via user.name or user[\"name\"]. Quotes needed for keys with spaces/hyphens." },
    { title: "Nesting and mutation", content: "Objects hold arrays and other objects: user.address.city. They're reference types — copying with = aliases the SAME object; use spread for a real copy." },
    { title: "Methods shorthand", content: "greet() { return `Hi ${this.name}` } — the this keyword points at the object calling the method (context-sensitive)." },
    { title: "Iteration and keys", content: "Object.keys/values/entries turn an object into arrays for map/filter; for...in loops its keys. JSON.stringify(obj) shows it in the console." },
  ],
  "js-destructure": [
    { title: "From objects", content: "const { name, age } = user pulls properties into variables in one line; rename with { name: fullName }; defaults with { role = \"user\" }." },
    { title: "From arrays", content: "const [first, second] = list grabs by position; skip with holes ([, mid]) or rest ([head, ...tail])." },
    { title: "Function parameters", content: "function greet({ name, age }) — destructured props in the signature. Great for React props and config objects; add a default ({} = {}) to avoid crashes." },
    { title: "Nested patterns", content: "const { address: { city } } = user digs two levels deep — powerful, but deep patterns get unreadable fast; keep to 1–2 levels." },
  ],
  "js-spread": [
    { title: "Expanding", content: "...list spreads items: [...list, \"new\"], Math.max(...nums), fn(...args). Works on arrays; objects use { ...obj, extra: 1 }." },
    { title: "Shallow copies", content: "{ ...user, age: 25 } creates a new object with edits — the immutable-update idiom (and how React state updates must be written)." },
    { title: "Rest", content: "The same ... in a parameter list COLLECTS: function sum(...nums) gathers all arguments into an array — named rest parameter." },
    { title: "Limits", content: "Spread only copies one level deep (nested objects are still shared) and only works on iterables — spreading a plain object into an array throws." },
  ],
  "js-dom": [
    { title: "Selecting", content: "document.querySelector(\".card\") (first match) / querySelectorAll (NodeList, needs forEach). getElementById and getElementsByClassName are the older trio." },
    { title: "Changing content", content: "el.textContent = \"...\" (safe, no HTML parsing); el.innerHTML = \"<b>\" (powerful but XSS-prone with user data); classList.add/remove/toggle for classes." },
    { title: "Creating elements", content: "document.createElement(\"li\"), set its content, then appendChild / append to insert. Prefer building nodes over string-concatenating HTML." },
    { title: "Traversal", content: "el.parentElement, el.nextElementSibling, el.children, el.closest(\".modal\") walk the tree — closest climbs UP to the nearest match (event delegation loves it)." },
  ],
  "js-forms": [
    { title: "Reading values", content: "const value = input.value (current string); for checkbox use .checked; for select use .selectedIndex or selectedOptions. Numbers need Number(input.value)." },
    { title: "The submit event", content: "form.addEventListener(\"submit\", e => { e.preventDefault(); ... }) — preventDefault stops the page reload so JS handles the data." },
    { title: "FormData", content: "new FormData(form) collects everything with name attributes; get(name) reads one; Object.fromEntries(formData) turns it into a plain object instantly." },
    { title: "Validation", content: "e.target.checkValidity() runs the HTML rules (required, type=email); reportValidity() shows the native messages — free UX before writing custom checks." },
  ],
  "js-fetch": [
    { title: "The request", content: "const res = await fetch(url) returns a Response (headers/status) — NOT the data yet. Check res.ok; a 404 still resolves without throwing." },
    { title: "Reading the body", content: "await res.json() (or .text() / .blob()) parses the payload. Forgetting the second await is THE classic fetch bug." },
    { title: "Full pattern", content: "try { const res = await fetch(u); if (!res.ok) throw new Error(`HTTP ${res.status}`); const data = await res.json(); } catch (err) { ... }." },
    { title: "Options and errors", content: "fetch(url, { method: \"POST\", headers: { \"Content-Type\": \"application/json\" }, body: JSON.stringify(payload) }). Network failures land in catch, not res." },
  ],
  "js-json": [
    { title: "What JSON is", content: "A text format for data: doubles only for strings, no comments, no trailing commas. Objects, arrays, strings, numbers, booleans, null — that's all." },
    { title: "JSON.stringify", content: "Object → text for sending: JSON.stringify(data, null, 2) pretty-prints. Circular references throw; functions and undefined get dropped." },
    { title: "JSON.parse", content: "Text → object: JSON.parse('{\"a\":1}'). Malformed text throws a SyntaxError — always wrap in try/catch when parsing external data." },
    { title: "Cloning", content: "JSON.parse(JSON.stringify(obj)) deep-clones (slow but simple); structuredClone(obj) is the modern built-in that also handles Dates and Maps." },
  ],
  "js-promises": [
    { title: "Three states", content: "Pending → fulfilled (a value) or rejected (an error). A promise represents a future result — using .then reads like 'when it's done, do this'." },
    { title: "Chaining", content: ".then(next).catch(both).finally(cleanup). Each then returns a NEW promise, so values flow down the chain; return inside then to pass along." },
    { title: "Error handling", content: "One .catch at the end handles errors from ANY earlier step — like try/catch for async. Errors thrown inside then are caught downstream." },
    { title: "Combinators", content: "Promise.all (all or nothing, parallel), Promise.race (first to finish), Promise.allSettled (never rejects) — parallel requests made declarative." },
  ],
  "js-async": [
    { title: "async returns promises", content: "Marking a function async means it ALWAYS returns a promise; await pauses THAT function (not the whole page) until the promise settles." },
    { title: "try/catch replaces then", content: "Async code reads top-down like sync code: const data = await res.json() inside try, errors in catch — no chain nesting." },
    { title: "Sequential vs parallel", content: "await a; await b waits twice. Promise.all([a(), b()]) runs both together — await the combo. Biggest real-world speed win." },
    { title: "Common traps", content: "Forgetting await on a non-async use gives a promise object (\"[object Promise]\"). Top-level await needs a module context (type=\"module\")." },
  ],
  "js-modules": [
    { title: "export and import", content: "export const/api at the bottom of a file; import { api } from \"./utils.js\" at the top. Everything in its own file — no more 5000-line scripts." },
    { title: "Default exports", content: "export default Component allows import Component from \"./Comp\" (any name, one per file). Named exports force explicit, greppable names." },
    { title: "Browser setup", content: "<script type=\"module\" src=\"app.js\"> defers automatically and enables import/export. Paths are relative and must include ./ or the full URL." },
    { title: "Why modules", content: "Each module has its own scope (no accidental globals), imports are live views of exports, and bundlers can tree-shake unused code away." },
  ],
  "js-errors": [
    { title: "try / catch / finally", content: "Code that might throw goes in try; errors land in catch (e = Error object with .message/.stack); finally always runs (cleanup, closing states)." },
    { title: "Throwing your own", content: "throw new Error(\"Email required\") stops execution and jumps to the nearest catch. Custom classes (class AppError extends Error) add error types." },
    { title: "Where errors happen", content: "SyntaxError = the file won't run at all. ReferenceError = undefined variable. TypeError = wrong type operation (null.prop). Reading the name guides the fix." },
    { title: "Uncaught and async", content: "Uncaught errors stop that script but not the page's other scripts. In async code, a rejected promise without catch becomes an unhandled rejection." },
  ],
  "react-state": [
    { title: "useState", content: "const [count, setCount] = useState(0) declares state with an initial value. The array destructure gives you the CURRENT value and its setter." },
    { title: "Updates are async", content: "setCount(5) queues a re-render; count won't change in the same function body — read the NEW value with the updater form: setCount(c => c + 1)." },
    { title: "Why new objects", content: "State should be treated as immutable: setForm({ ...form, name: v }) — mutating the old object gives React nothing to detect, so the UI silently skips." },
    { title: "Re-renders", content: "Calling a setter re-runs the component (React compares by Object.is). Same value = no re-render, which makes double-sets harmless." },
  ],
  "react-props": [
    { title: "Passing data", content: "<User name=\"Kent\" age={24} /> — strings in quotes, everything else in braces. The child receives them as an object: function User(props)." },
    { title: "Destructuring", content: "function User({ name, age }) pulls props out directly at the signature — cleaner than props.name everywhere." },
    { title: "Children", content: "{children} is the content written BETWEEN tags — the slot that makes wrappers like Card, Modal, and Layout possible." },
    { title: "Props are read-only", content: "Never write to a prop inside the child — data flows DOWN, events flow UP. A child mutating props breaks React's whole model." },
  ],
  "react-jsx": [
    { title: "It's not HTML", content: "JSX compiles to React.createElement calls. class → className, for → htmlFor, style takes an object: style={{ color: \"red\" }} (camelCase keys)." },
    { title: "Expressions only", content: "Anything in { } must be an expression: variables, calls, ternaries. Statements (if, for, let) are illegal inside braces — compute beforehand." },
    { title: "One root", content: "A component returns ONE element; wrap siblings in a fragment <>...</> (or <React.Fragment>) instead of an extra div." },
    { title: "Tags and components", content: "<div> lowercase = host element; <Card> uppercase = your component (must be imported). One lowercase typo = a mysterious React error." },
  ],
  "react-components": [
    { title: "Function components", content: "A component is a function returning JSX: function Greeting() { return <h1>Hi</h1> }. Use it as <Greeting /> — capital letter required." },
    { title: "Props in", content: "Components read props and decide their output — same function + different props = different UI. That's the whole mental model." },
    { title: "File organization", content: "One component per file, filename matches the component (UserCard.tsx), colocate its CSS/test — components are reusable, self-contained units." },
    { title: "Composition beats config", content: "Build small pieces (Avatar, Badge, Button) and assemble them — reuse comes from nesting, not from a 30-prop mega-component." },
  ],
  "react-events": [
    { title: "Handler props", content: "onClick / onChange / onSubmit take FUNCTIONS (not strings): onClick={() => setN(n + 1)}. Pass a reference when the handler logic already exists." },
    { title: "Synthetic events", content: "React wraps native events in a pooled synthetic one — same API everywhere (e.target.value) plus consistent behavior across browsers." },
    { title: "Passing data", content: "onClick={() => remove(id)} closes over values; avoid onClick={remove(id)} — that CALLS it during render." },
    { title: "Common events", content: "onChange (inputs — every keystroke), onSubmit (forms + preventDefault), onKeyDown; e.stopPropagation() stops bubbling to parents." },
  ],
  "js-advanced": [
    { title: "Closures", content: "A function remembers where it was created — inner functions keep access to outer variables forever. That's how counters, caching, and private state work." },
    { title: "Practical closure patterns", content: "Module pattern (privately scoped state), event handlers holding config, memoize(fn) caching results by argument." },
    { title: "this binding", content: "this depends on CALL, not location: obj.method() → obj; detached function → undefined (strict) / window. Arrow functions inherit this from enclosing scope." },
    { title: "Currying and partials", content: "const add = a => b => a + b splits arguments — the base of pipelines, reusable handlers, and React's useCallback patterns." },
  ],
  "react-conditional": [
    { title: "Ternary in JSX", content: "{isLoggedIn ? <Home/> : <Login/>} — if/else flattened into an expression. JSX needs EXPRESSIONS, not statements, so plain if can't sit inside it." },
    { title: "Short-circuit &&", content: "{count > 0 && <Badge/>} renders only when true. Beware {items && <List/>} with 0 — it prints the 0; guard with items.length > 0." },
    { title: "Early returns", content: "For big branches, return null or an error screen BEFORE the main JSX — keeps the render function flat and readable." },
    { title: "Extract to components", content: "When branches grow past a few lines, split them into <Loading/> / <ErrorView/> components — conditional rendering stays one clean line." },
  ],
  "react-lists": [
    { title: "map to JSX", content: "{fruits.map(f => <li key={f}>{f}</li>)} turns data into elements. map RETURNS the array — remember the return, or you render nothing." },
    { title: "Keys matter", content: "key = a STABLE identity (database id), not the array index. Index keys break reordering, inputs, and animations because React reuses the wrong DOM." },
    { title: "Filtering and logic", content: "Chain: users.filter(u => u.active).map(...), or compute in the component body before return for complex lists." },
    { title: "Performance", content: "Long lists re-render fully on any state change — React.memo on items and useMemo on the array help only after profiling shows it's needed." },
  ],
  "react-forms": [
    { title: "Controlled inputs", content: "value={text} + onChange={e => setText(e.target.value)} — React state is the single source of truth; the DOM input just mirrors it." },
    { title: "Why control", content: "Instant validation, conditional enable/disable, formatting, and submitting exactly the state you have — uncontrolled inputs hide their value until you ask." },
    { title: "Submitting", content: "onSubmit on the form + e.preventDefault() (no page reload). Read state directly: no FormData gymnastics needed." },
    { title: "Multiple fields", content: "One state object per form: setForm({ ...form, email: v }) or a reducer for many fields. Reset by setting state back to initial values." },
  ],
  "react-effect": [
    { title: "What it's for", content: "Effects sync React state with SYSTEMS outside React: timers, subscriptions, fetches, focus. NOT for derived calculations — those go in the render body." },
    { title: "Dependency array", content: "[] = run once after first render; [count] = re-run when count changes; no array = every render. List EVERYTHING the effect reads (exhaustive-deps rule)." },
    { title: "Cleanup", content: "Return a function from the effect to cancel: clearInterval, removeEventListener, abort fetch. It runs before the next run AND on unmount." },
    { title: "Missing deps", content: "Omitting a dep = stale closure (old values forever). Fixes: add the dep, or move computations up so the effect only handles the system itself." },
  ],
  "react-ref": [
    { title: "useRef holds values", content: "const inputRef = useRef(null) — .current starts as null (or the initial value) and NEVER triggers a re-render when changed. Mutable pocket." },
    { title: "DOM access", content: "Attach ref={inputRef} to an element: inputRef.current.focus() / .scrollIntoView() — imperative actions React doesn't model as state." },
    { title: "What goes in state vs ref", content: "Value affects the UI → state (re-renders). Value only code needs (timer id, previous value, focus) → ref (silent)." },
    { title: "Caveats", content: "Refs are mutable across renders without re-rendering — reading .current during render gives stale data. Update UI? use state instead." },
  ],
  "react-context": [
    { title: "The problem it solves", content: "Prop drilling: passing theme through 5 layers of components just to reach one. Context is a broadcast channel every descendant can read." },
    { title: "Three steps", content: "createContext(default) → <ThemeContext.Provider value={x}> high in the tree → const theme = useContext(ThemeContext) anywhere below." },
    { title: "Value identity", content: "value={...} as a new object every render re-renders ALL consumers — useMemo or split contexts (ThemeContext + AuthContext) to limit blast radius." },
    { title: "When to use", content: "Global, slowly-changing data: theme, locale, current user, feature flags. NOT for every state — local state stays local (and simpler)." },
  ],
  "react-hooks": [
    { title: "What a custom hook is", content: "A function starting with use that CALLS other hooks (useState/useEffect). It's just code extraction — no magic, plain React rules apply." },
    { title: "Example shape", content: "function useCounter(start = 0) { const [n, setN] = useState(start); return { n, inc: () => setN(n + 1) } } — reusable state logic, no UI." },
    { title: "Rules still apply", content: "Hooks run at the TOP level of the use-function: no loops, no conditionals. The lint plugin (react-hooks rules) enforces it." },
    { title: "Why they matter", content: "Components stay declarative while logic (fetching, media queries, timers, localStorage) gets shared as useFetch, useMediaQuery, useLocalStorage." },
  ],
  "react-patterns": [
    { title: "Small and pure", content: "One component = one job; rendering from props alone (pure) makes components predictable and testable. If it's 200 lines, it's really three components." },
    { title: "Composition", content: "children and slot props beat config-prop explosions: <Card><CardBody/><CardFooter/></Card> — flexible without prop soup." },
    { title: "Controlled flexibility", content: "Lift shared state to the common parent; pass down state + handlers (state down, events up). Variants via props with sensible defaults." },
    { title: "Memoization discipline", content: "React.memo / useMemo / useCallback only where profiling proves re-render cost — premature memoizing is harder to read with zero gain." },
  ],
  "ts-annotations": [
    { title: "The colon", content: "let name: string = \"Kent\"; const age: number = 24; function greet(who: string): string { ... } — annotations go after the name/parameter, before = or { }." },
    { title: "Inference", content: "You can skip annotations when the initializer is clear: const age = 24 infers number. Annotate function RETURNS and ambiguous values; let the rest infer." },
    { title: "Arrays and tuples", content: "string[] or Array<string> for lists; [string, number] for a fixed-size pair — the tuple knows each position's type (and errors on extras)." },
    { title: "Bad news early", content: "A wrong annotation fails at COMPILE time (red squiggle) instead of production: let x: number = \"five\" never ships." },
  ],
  "ts-primitives": [
    { title: "The primitives", content: "string, number, boolean, null, undefined, bigint, symbol, void, never, unknown, any. TypeScript adds literal types too: type X = \"a\" | \"b\"." },
    { title: "unknown vs any", content: "any disables checking (escape hatch, dangerous). unknown ACCEPTS anything but forces narrowing before use — the safe version of any." },
    { title: "void and never", content: "void = function returns nothing meaningful. never = it never returns (always throws / infinite loop) — both keep call sites honest." },
    { title: "typeof in type space", content: "typeof x in an annotation asks for x's inferred type: let y: typeof x — handy for reusing a variable's type without repeating it." },
  ],
  "ts-arrays": [
    { title: "Typed lists", content: "const nums: number[] = [1, 2]; const names: Array<string> = [\"a\"] — both syntaxes identical; pushing a wrong type fails at compile time." },
    { title: "Object literals", content: "const u: { name: string; age: number } = {...} — inline shapes work for one-offs; interfaces (next lessons) scale better." },
    { title: "Readonly protection", content: "readonly number[] (or ReadonlyArray<number>) blocks push/assignment — useful for constants that must never be mutated." },
    { title: "Inference bonus", content: "TS infers array element types too: [1, 2] is number[] — spreading or .map results keep their types automatically." },
  ],
  "ts-interfaces": [
    { title: "Declaring a shape", content: "interface User { name: string; age: number } — then const u: User = {...}. Missing or extra-typed-wrong fields are errors." },
    { title: "Optional and readonly", content: "email?: string = may be absent; readonly id: number = can't change after creation — both common in real models." },
    { title: "Extending", content: "interface Admin extends User { role: string } inherits and adds — build hierarchies without copy-pasting fields." },
    { title: "Interfaces vs objects", content: "Interfaces are open (can merge later) and describe STRUCTS for objects/classes; type handles everything else (unions, tuples, primitives)." },
  ],
  "ts-alias": [
    { title: "type = a name", content: "type ID = string | number; type Point = { x: number; y: number } — name ANY type, not just object shapes." },
    { title: "Primitives and literals", content: "type Status = \"loading\" | \"ready\" | \"error\" — string literals create valid-value lists; autocomplete suggests them and typos fail." },
    { title: "type vs interface", content: "For plain object contracts both work; choose type for unions/intersections/aliases, interface for object shapes you may extend or augment." },
    { title: "Combining", content: "\"a\" | \"b\" is a union (OR); A & B is an intersection (AND — both at once). Both are type-level, cost nothing at runtime." },
  ],
  "ts-functions": [
    { title: "Parameters", content: "Every parameter needs a type (or inference): function add(a: number, b: number): number — return type shown after )." },
    { title: "Optional and defaults", content: "id?: string marks optional (must come last-ish); greet(name = \"Guest\") uses a default — TS infers from the default value." },
    { title: "Arrow and inline", content: "const add = (a: number, b: number): number => a + b — same rules; contextually typed callbacks (map, onClick) often need NO annotation." },
    { title: "Never returning", content: "annotate : never for functions that always throw — it stops TS from letting callers use a 'return value' that doesn't exist." },
  ],
  "ts-narrow": [
    { title: "Why narrow", content: "A union (string | null) can't be used until TS PROVES which side it is — narrowing turns unknown territory into safe calls." },
    { title: "typeof and in", content: "if (typeof v === \"string\") ... narrows inside the block; \"key\" in obj proves the property exists before reading it." },
    { title: "Truthiness and equality", content: "if (value), if (x === null), and checking x.length all narrow — TS tracks the same logic your brain does." },
    { title: "Discriminated unions", content: "{ kind: \"circle\", r: number } | { kind: \"rect\", w: number } — switch on .kind and each branch narrows perfectly. The most useful pattern in TS." },
  ],
  "ts-optional": [
    { title: "The question mark", content: "interface Task { title: string; done?: boolean } — done may be undefined; accessing it gives boolean | undefined (handle it!)." },
    { title: "Optional chaining", content: "user?.address?.city short-circuits to undefined when user is missing instead of throwing — the runtime twin of the optional property." },
    { title: "Defaults with ??", content: "const done = task.done ?? false converts maybe-undefined into a definite value in one expression." },
    { title: "exactOptionalPropertyTypes", content: "Strict mode can forbid explicitly assigning undefined to optional props — subtle, but it keeps 'absent' and 'present as undefined' distinct." },
  ],
  "nextjs-routing": [
    { title: "Folder = URL", content: "app/about/page.tsx serves /about; app/blog/[slug]/page.tsx serves /blog/anything. The filesystem IS the router — no config table." },
    { title: "The rules", content: "Every route segment needs a page.tsx (or route.ts). Folder names define URL parts; layout.tsx and loading.tsx are special files, not URLs." },
    { title: "The app directory", content: "Routes live in app/ (App Router). Nested folders nest routes; route groups (folder)/ reorganize WITHOUT affecting the URL." },
    { title: "Nav structure", content: "Link between pages (next/link, next lesson), and keep route folders shallow — deep nesting deepens the URL for users too." },
  ],
  "nextjs-structure": [
    { title: "Top level", content: "app/ (routes + UI), components/, lib/ (helpers), public/ (static files served at /), next.config, package.json — the four you touch daily." },
    { title: "Inside app/", content: "page.tsx = public URL, layout.tsx = shared wrapper, loading/error.tsx = states, route.ts = API endpoint. One file's job each — the contract." },
    { title: "Import aliases", content: "@/* maps to the project root (tsconfig paths) — import { Button } from \"@/components/Button\" stays short from anywhere." },
    { title: "Server vs client folders", content: "Files are Server Components by default; \"use client\" at the top of a file (and its importers of interactivity) flips it to the browser bundle." },
  ],
  "nextjs-pages": [
    { title: "page.tsx is a URL", content: "export default function AboutPage() { return ... } — the default export becomes the route's content. The name is a convention, the export isn't optional." },
    { title: "Async pages", content: "Pages can be async functions and await data directly — the server renders with real content before HTML arrives (great SEO, no loading flash)." },
    { title: "Params prop", content: "Dynamic routes receive params: export default async function Post({ params }: { params: Promise<{ slug: string }> }) — await it in Next 15+." },
    { title: "Metadata", content: "export const metadata = { title: \"...\", description: \"...\" } sets <head> tags per page — titles and descriptions without extra libraries." },
  ],
  "nextjs-layouts": [
    { title: "Shared wrappers", content: "layout.tsx wraps every page INSIDE its folder: app/layout.tsx wraps the whole site (html/body live there), app/dashboard/layout.tsx wraps dashboard pages." },
    { title: "Persistent by design", content: "Layouts do NOT re-render on navigation — sidebars, navs, and providers stay mounted (no flicker, state preserved while URLs change)." },
    { title: "Nesting", content: "Layouts nest like folders; each renders its children. The root layout MUST return <html> and <body>." },
    { title: "When to use", content: "Anything shared by many routes belongs in a layout: header, footer, menu, theme provider. One-off chrome stays in the page." },
  ],
  "nextjs-link": [
    { title: "<Link>", content: "import Link from \"next/link\"; <Link href=\"/about\">About</Link> — renders an <a> but prefetches and swaps pages client-side: no full reload." },
    { title: "Why not <a>", content: "Plain <a href> forces a full document reload (JS re-downloads). Link keeps the app alive — instant-feeling navigation." },
    { title: "useRouter", content: "const router = useRouter(); router.push(\"/dashboard\") navigates programmatically (after login, form submit); router.back() goes back." },
    { title: "Dynamic hrefs", content: "href={`/posts/${post.id}`} builds URLs; use template literals — Link prefetches visible routes automatically for speed." },
  ],
  "nextjs-dynamic": [
    { title: "Bracket folders", content: "app/blog/[slug]/page.tsx → /blog/hello, /blog/world. The page receives the segment value as params.slug." },
    { title: "Reading params", content: "export default async function Post({ params }) { const { slug } = await params } — await it in Next 15; pass to fetches to load THAT content." },
    { title: "Catch-all routes", content: "[...slug]/page.tsx matches /docs/a/b/c with params.slug = [\"a\",\"b\",\"c\"]; [[...slug]] also matches the bare /docs." },
    { title: "generateStaticParams", content: "Return [{ slug: \"a\" }, { slug: \"b\" }] from the page to pre-render those paths at build time — dynamic routes can still be static." },
  ],
  "nextjs-rsc": [
    { title: "Server by default", content: "Components run on the SERVER (Node), fetch data directly, and send HTML — no client JS for markup-only UI. Smaller bundles by default." },
    { title: "\"use client\"", content: "Marks the boundary where code ships to the browser: hooks, event handlers, browser APIs. Only the boundary file and below need it." },
    { title: "Passing across", content: "Server → client: props must be serializable (no functions). Client → server: call Server Actions instead of importing server code." },
    { title: "How to choose", content: "Static text/layout/lists → server. Interactivity/state/DOM events → client. Push 'use client' as far DOWN the tree as possible." },
  ],
  "nextjs-fetch": [
    { title: "Direct fetching", content: "In a Server Component: const res = await fetch(\"https://api...\"); const data = await res.json(); — no useEffect, no loading-state juggling in the component." },
    { title: "Caching", content: "Next.js can cache fetches across requests; add { cache: \"no-store\" } (or next: { revalidate }) for fresh/revalidated data — this is the ISR dial." },
    { title: "No client bundle cost", content: "The fetch runs on the server; users receive rendered HTML + only the data they need. Secrets stay on the server too (never fetch secrets client-side)." },
    { title: "Where it belongs", content: "Fetch at the page/layout level and pass results down as props — children stay presentational and testable." },
  ],
  "php-basics": [
    { title: "Tags and file", content: "<?php ... ?> wraps server code; pure-PHP files usually omit the closing tag. The .php file is processed on the server — only the OUTPUT reaches the browser." },
    { title: "Output", content: "echo \"text\"; prints (no parentheses needed); print_r($var) / var_dump($var) inspect structures. Right-click → View Source shows generated HTML, not your PHP." },
    { title: "Statements", content: "Every statement ends with ; — the most common beginner error. // and /* */ comment; $variables are ALWAYS prefixed with $." },
    { title: "Request flow", content: "Browser → server runs PHP (queries DB, builds HTML) → browser receives plain HTML. That asymmetry IS server-side programming." },
  ],
  "php-vars": [
    { title: "Syntax", content: "$name = \"Kent\"; — dollar sign required, no type keywords. Variables are case-sensitive ($user ≠ $User) and can be reassigned freely." },
    { title: "Types", content: "string, int, float, bool, array, null. var_dump shows the type; gettype()/settype() convert at runtime (PHP is loosely typed)." },
    { title: "Strings", content: "Single quotes = literal; double quotes interpolate \"$name\" and process escapes. Concatenation is the . dot: \"Hi \" . $name." },
    { title: "Superglobals", content: "$_GET, $_POST, $_SESSION, $_SERVER, $_FILES are pre-built arrays — where user input and server info arrive." },
  ],
  "php-operators": [
    { title: "Math", content: "+ - * / % and ** (power). Division by zero is a warning/error in modern PHP — validate denominators." },
    { title: "Comparison", content: "== (loose, type-coercing), === (strict — ALWAYS prefer it: \"1\" === 1 is false), != vs !==, and spaceship <=> for three-way compare." },
    { title: "Logic", content: "&& (and), || (or), ! (not) — plus and/or with different precedence (another reason to stick with && and ||)." },
    { title: "String glue", content: ". concatenates; .= appends ($msg .= \" line\"); .=\" interpolates variables inside double quotes: \"$name is here\" — templates without noise." },
  ],
  "php-conditions": [
    { title: "if / elseif / else", content: "if ($age >= 18) { } elseif (...) { } else { } — braces are REQUIRED in PHP (unlike JS), and conditions often wrap variables in $." },
    { title: "Loops", content: "for (classic counting), foreach ($arr as $k => $v) (THE array loop), while/do-while. foreach is PHP's bread and butter." },
    { title: "Switch", content: "switch ($status) { case 'a': break; default: } — break prevents fall-through; PHP 8 allows expressions in case." },
    { title: "Null coalescing", content: "$name = $input ?? 'Guest' returns the right side only when left is null/undefined — replaces whole isset() ternary chains." },
  ],
  "php-functions": [
    { title: "Declaring", content: "function add(int $a, int $b): int { return $a + $b; } — types and return type are optional but excellent hygiene (strict_types=1 enforces them)." },
    { title: "Arrays", content: "$list = [1,2,3]; $map = ['name' => 'Kent'] — one syntax for lists and maps. count(), array_push(), array_keys(), array_map() are the toolkit." },
    { title: "Scope", content: "Functions have their OWN scope — globals don't leak in (use global $x or, better, pass as parameter). superglobals ($_GET) work everywhere." },
    { title: "Common helpers", content: "implode(',', $a) joins; explode(',', $s) splits; in_array(), str_contains(), strlen(), trim() — the daily dozen." },
  ],
  "php-forms": [
    { title: "GET vs POST", content: "<form method=\"post\">; PHP fills $_POST for POST, $_GET for GET (query strings). POST = changes data; GET = safe retrievals/URLs." },
    { title: "Reading fields", content: "$_POST['email'] — every input needs name= (PHP reads by name, not id). Check isset() first or undefined-index warnings appear." },
    { title: "Processing flow", content: "if ($_SERVER['REQUEST_METHOD'] === 'POST') { validate → save → redirect } at the TOP of the file, HTML below — the classic PHP script shape." },
    { title: "Safety", content: "Escape output with htmlspecialchars($x, ENT_QUOTES, 'UTF-8') to stop XSS; NEVER trust $_POST — validate types, lengths, formats." },
  ],
  "php-sessions": [
    { title: "Starting", content: "session_start() at the very top grants $_SESSION — a per-user storage array that survives page loads (cart, login, flash messages)." },
    { title: "How it works", content: "The server stores data keyed by a session id sent as a cookie — data lives on the SERVER, the browser only holds the id." },
    { title: "Typical use", content: "$_SESSION['user_id'] = $id after login; if (!isset($_SESSION['user_id'])) redirect to login — the guard pattern." },
    { title: "Ending", content: "session_destroy() clears everything on logout; unset($_SESSION['k']) removes one key. Always session_start() before any output." },
  ],
  "php-oop": [
    { title: "Class basics", content: "class User { public $name; function __construct($name) { $this->name = $name; } } — constructor runs on new User($name); access members with ->." },
    { title: "Visibility", content: "public (anywhere), protected (class + children), private (class only) — visibility is the core of encapsulation." },
    { title: "Inheritance", content: "class Admin extends User — inherits properties/methods, override with care; $this works in both parent and child code." },
    { title: "Why OOP", content: "Groups data + behavior into objects you can reuse and test: a User class instead of loose functions and string keys everywhere." },
  ],
  "php-api": [
    { title: "Return JSON", content: "header('Content-Type: application/json'); echo json_encode($data); — the entire response contract: correct header + encoded payload." },
    { title: "Routing by method", content: "switch ($_SERVER['REQUEST_METHOD']) { GET: list, POST: create, PUT/PATCH: update, DELETE: delete } — one file, four operations." },
    { title: "Input", content: "$body = json_decode(file_get_contents('php://input'), true) for JSON bodies; $_POST for form data; $_GET['id'] for query params." },
    { title: "CORS and errors", content: "Cross-origin callers need Access-Control-Allow-Origin headers (and OPTIONS handling). Send status codes: http_response_code(404) with a JSON error." },
  ],
  "php-files": [
    { title: "Reading", content: "file_get_contents('notes.txt') returns the whole file (false on failure); file() gives an array of lines; is_file()/file_exists() check first." },
    { title: "Writing", content: "file_put_contents('log.txt', $data, FILE_APPEND) writes/appends — returns bytes written or false. Path is relative to the SCRIPT (cwd rules apply)." },
    { title: "Handles", content: "fopen/fwrite/fclose streams line by line — better for huge files; fgets reads one line at a time." },
    { title: "Safety", content: "Never build paths from raw user input (path traversal: ../../etc/passwd) — whitelist filenames, basename() them, and keep writes inside a known dir." },
  ],
  "sql-fundamentals": [
    { title: "Tables, rows, columns", content: "A table = grid of records: columns have TYPES (INT, VARCHAR(255), DATE, BOOLEAN), rows are instances. The primary key uniquely names each row." },
    { title: "Relational idea", content: "Data is split into tables ONCE, then linked by ids — customers here, orders there, joined when needed. No duplicated customer rows per order." },
    { title: "SQL dialects", content: "The SELECT/WHERE core is universal; limits, dates, and strings differ across MySQL, PostgreSQL, SQLite, SQL Server — mind the flavor you're on." },
    { title: "Where code runs", content: "Your app sends a query STRING; the database engine parses, plans, and executes it, returning rows — SQL is the contract between both." },
  ],
  "sql-select": [
    { title: "The clause order", content: "SELECT cols FROM table WHERE filter GROUP BY ... HAVING ... ORDER BY ... LIMIT n — read left to right; FROM feeds SELECT." },
    { title: "WHERE filters rows", content: "=, <>, >, <, BETWEEN, IN (...), LIKE ('K%'), IS NULL. Combine with AND/OR — remember parentheses: AND binds tighter than OR." },
    { title: "Ordering and limiting", content: "ORDER BY col DESC for newest-first; NULL sorts first/last depending on engine. LIMIT 10 (SQL Server: SELECT TOP 10) caps results." },
    { title: "Aliases", content: "SELECT COUNT(*) AS total FROM users — AS renames columns for your app's JSON; table aliases (FROM users u) shorten joins." },
  ],
  "sql-insert": [
    { title: "INSERT", content: "INSERT INTO users (name, email) VALUES ('Kent', 'k@x.com'); — always name the columns (survives schema changes). Multi-row: VALUES (...), (...)." },
    { title: "Update carefully", content: "UPDATE users SET name = 'X' WHERE id = 3 — the WHERE is the safety. Run it with a SELECT first: same WHERE, no SET." },
    { title: "Returning data", content: "PostgreSQL: INSERT ... RETURNING *; MySQL: LAST_INSERT_ID(). Otherwise re-query after insert to get the new row." },
    { title: "Prepared statements", content: "Placeholders (? / :name) separate SQL from data — prevents SQL injection AND lets the engine cache the plan. Never concatenate user input." },
  ],
  "sql-delete": [
    { title: "The statement", content: "DELETE FROM orders WHERE id = 5; — without WHERE it empties the TABLE (the classic disaster). Always SELECT with the same WHERE first." },
    { title: "Soft deletes", content: "Real apps often add deleted_at TIMESTAMP instead of dropping rows — the data survives for audits; queries add WHERE deleted_at IS NULL." },
    { title: "Truncate vs delete", content: "TRUNCATE wipes fast with no rollback in most engines (and resets identity counters); DELETE is row-by-row and fully logged." },
    { title: "FK order", content: "Deleting a parent with children may violate foreign keys (ON DELETE RESTRICT/CASCADE decides). Know your constraint before deleting." },
  ],
  "sql-aggregate": [
    { title: "The functions", content: "COUNT(*), SUM(qty), AVG(price), MIN/MAX(score) — they collapse many rows into ONE number." },
    { title: "COUNT variants", content: "COUNT(*) counts rows; COUNT(col) skips NULLs; COUNT(DISTINCT col) counts unique values — the differences show up with sparse data." },
    { title: "NULL behavior", content: "Aggregates ignore NULLs (AVG over [10, NULL] = 10, not 5). COALESCE(col, 0) inside SUM when NULLs should count as zero." },
    { title: "With GROUP BY", content: "An aggregate next to a plain column REQUIRES GROUP BY that column: SELECT dept, COUNT(*) FROM emp GROUP BY dept — one row per dept." },
  ],
  "sql-group": [
    { title: "GROUP BY buckets", content: "Rows sharing the same value collapse into one output row; the aggregate then summarizes EACH bucket (per category, per user, per month)." },
    { title: "HAVING filters groups", content: "WHERE filters BEFORE grouping; HAVING filters AFTER (on the aggregate): HAVING COUNT(*) > 5. WHERE first, HAVING second." },
    { title: "Reporting recipe", content: "SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id HAVING SUM(total) > 100 ORDER BY spent DESC — spend-threshold report." },
    { title: "Grouping expressions", content: "GROUP BY DATE(created_at) buckets by day; FORMAT/TO_CHAR formats groups — date bucketing powers dashboards." },
  ],
  "sql-join": [
    { title: "The idea", content: "JOIN glues tables on a condition — usually orders.user_id = users.id — and returns matched columns as one wide row set." },
    { title: "JOIN types", content: "INNER (matches only), LEFT (all from left + matches, NULLs where absent), RIGHT (mirror), FULL (everything). LEFT is the everyday default." },
    { title: "Aliases and clarity", content: "FROM orders o JOIN users u ON o.user_id = u.id — alias everything once multiple tables appear; qualify columns (u.name) to avoid ambiguity." },
    { title: "Missing matches", content: "If rows vanish, you wanted LEFT JOIN; NULLs on the right side mean 'no match'. This is the #1 join debugging insight." },
  ],
  "sql-relationships": [
    { title: "Primary and foreign keys", content: "PRIMARY KEY uniquely names a row; FOREIGN KEY in another table points at it (orders.user_id → users.id) — the link that replaces duplicated data." },
    { title: "One-to-many", content: "One user has MANY orders: the 'many' side holds the FK. That single rule covers most real schemas (posts/comments, customers/orders)." },
    { title: "One-to-one and many-to-many", content: "1:1 = FK with UNIQUE (user ↔ profile). M:N needs a JOIN table (posts ↔ tags via post_tags) with two FKs." },
    { title: "Integrity", content: "CASCADE (delete children with parent), SET NULL, RESTRICT — declared with the FK. Constraints enforce what your code might forget." },
  ],
  "sql-subquery": [
    { title: "Query inside a query", content: "SELECT name FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100) — the inner query runs first, its result feeds the outer." },
    { title: "Placement", content: "Subqueries work in WHERE, FROM, and SELECT. In FROM it's a derived table: (SELECT ...) AS t — results behave like a real table." },
    { title: "Scalar and EXISTS", content: "Comparison subquery returns one value: WHERE price > (SELECT AVG(price) ...). EXISTS checks presence efficiently: WHERE EXISTS (SELECT 1 ...)." },
    { title: "Readability", content: "Two levels are fine; deeper is usually a JOIN or CTE (WITH ...) in disguise — flatten before it becomes unreadable." },
  ],
  "sql-advanced": [
    { title: "Indexes", content: "An index is a lookup structure (like a book's index) on WHERE/JOIN columns — massive SELECT speed, slight insert/update cost. Index FKs and hot filters." },
    { title: "Transactions", content: "BEGIN → statements → COMMIT or ROLLBACK — all-or-nothing. Money transfers must be two statements that can never half-succeed (ACID)." },
    { title: "When NOT to index", content: "Tiny tables, rarely queried columns, and low-cardinality booleans often aren't worth it — every index taxes every write." },
    { title: "EXPLAIN", content: "EXPLAIN / EXPLAIN ANALYZE shows the plan: full table scan on a big table = missing index; surprises live here, not in intuition." },
  ],
  "git-fundamentals": [
    { title: "Snapshots, not files", content: "Every commit is a complete snapshot of tracked files plus metadata (author, message, parent). History is a linked list of these snapshots." },
    { title: "The three areas", content: "Working directory (your edits) → staging area (what the next commit includes) → repository (.git history). git add copies edits INTO staging." },
    { title: "Tracked vs untracked", content: "Tracked = Git already knows the file; untracked = new, invisible until git add. .gitignore pre-hides junk (node_modules, .env)." },
    { title: "Local vs remote", content: "Your repo is local; GitHub is a remote — an agreed-upon URL to sync with (git remote -v shows yours)." },
  ],
  "git-basics": [
    { title: "The first loop", content: "git init (new repo) → edit files → git add . → git commit -m \"msg\" → git remote add origin URL → git push -u origin main. That's the whole lifecycle." },
    { title: "Commit messages", content: "\"Fix login redirect\" beats \"update\" — imperative mood, present tense, explaining WHY when the diff doesn't say it." },
    { title: "Reading output", content: "Every git status/commit echoes what changed and what's next (\"use git add to stage\") — the CLI literally tells you the next step." },
    { title: "Idempotent add", content: "git add . stages ALL changes (new + modified); git add src/ limits scope. Stage deliberately — a commit should be one logical change." },
  ],
  "git-status": [
    { title: "Reading status", content: "Red = staged? No — red = modified/untracked NOT staged; green = staged and ready for the next commit. The two-column mental model matters." },
    { title: "Staging precisely", content: "git add file.ts stages one file; git add -p stages HUNK by hunk — the tool for splitting one messy file into clean commits." },
    { title: "Unstaging", content: "git restore --staged file.ts moves a file back OUT of staging (keeps your edits). git restore file.ts discards edits entirely — destructive!" },
    { title: "Diff first", content: "git diff (unstaged) and git diff --staged review exactly what will be committed — always diff before commit." },
  ],
  "git-pr": [
    { title: "The flow", content: "Push a BRANCH, open a Pull Request on GitHub, reviewers comment, approve, merge — code reaches main only through reviewed PRs (usually)." },
    { title: "What reviewers look for", content: "Logic errors, missing tests, naming clarity, scope creep ('why is a config change in this PR?'). Small PRs get fast, deep reviews." },
    { title: "Checks", content: "CI runs build/lint/tests automatically on the PR — red X means fix before merging. Draft PRs signal 'feedback welcome, not ready to merge'." },
    { title: "Merge strategies", content: "Merge commit (history preserved), squash (whole PR → one clean commit), rebase (linear). Teams pick one — squashing is popular for tidy main." },
  ],
  "git-workflow": [
    { title: "The daily loop", content: "git pull → create/switch branch → edit + git add + git commit → push → open PR → review → merge → pull main. Repeat." },
    { title: "Branch naming", content: "feature/login, fix/cart-total, chore/deps — prefixes tell readers intent before they open anything." },
    { title: "Keeping main healthy", content: "Short-lived branches (hours/days, not weeks) minimize conflicts. Pull main into your branch often; rebase or merge — just stay current." },
    { title: "Where things go wrong", content: "Push rejected = you're behind (pull first). Conflict = resolve and commit. Detached HEAD = git switch main. 90% of panic is one of these three." },
  ],
  "git-commit": [
    { title: "Saving a snapshot", content: "git commit -m \"msg\" records everything staged; --amend folds fixes into the last commit (only if NOT pushed — rewriting pushed history hurts)." },
    { title: "What makes a good commit", content: "One logical change each: a feature, a fix, a refactor — never 'misc changes'. Small commits make bisection, review, and revert painless." },
    { title: "Authorship", content: "user.name / user.email in config identify YOU; a wrong email means GitHub can't link commits to your account (fixable later with --amend)." },
    { title: "Recovery", content: "git log --oneline shows history; git revert <hash> UNDOES a commit by adding its inverse — safe for shared branches (git reset is local-only)." },
  ],
  "git-clone": [
    { title: "Clone", content: "git clone URL copies the whole repo (history included) and sets origin for you — the standard way to START on an existing project." },
    { title: ".gitignore", content: "List files Git should never track: node_modules/, .env, dist/, *.log. Ignored files never show in status and never enter commits — secrets stay out." },
    { title: "Ignoring for everyone", content: ".gitignore belongs IN the repo (shared); .git/info/exclude is personal-only. Committing .env is a leak — rotate keys if it happens." },
    { title: "Forks vs clones", content: "clone = copy to your machine; fork = copy on GitHub (for contributing without write access). Typical flow: fork → clone → branch → PR." },
  ],
  "git-remote": [
    { title: "The vocabulary", content: "origin = the default remote name. git push sends commits UP; git pull fetches AND merges DOWN; git fetch downloads without merging (safe look)." },
    { title: "Tracking", content: "git push -u origin main links local main to remote main — afterwards plain git push/pull know their target." },
    { title: "Diverged history", content: "Pull = fetch + merge (may create a merge commit) or --rebase (replays your commits on top, linear history). Pick one team convention." },
    { title: "Pull requests", content: "git pull origin main (or --rebase) before pushing — pushing rejected when behind is Git protecting shared history." },
  ],
  "git-branch": [
    { title: "What a branch is", content: "A branch is a movable label pointing at a commit — creating one is instant. main is just the default label; feature branches point elsewhere." },
    { title: "The loop", content: "git switch -c feature-x → commit work → git switch main → git merge feature-x → done. Work never touches main until merged." },
    { title: "Merge vs rebase", content: "merge preserves true history (with a merge commit); rebase replays yours onto the other branch for a straight line. Never rebase SHARED commits." },
    { title: "Conflicts", content: "Same lines changed on both sides = conflict markers in the file. Edit, git add, commit — the merge completes when you resolve." },
  ],
}

export const ALL_PLAYGROUND_LESSONS: Lesson[] = [
  ...PLAYGROUND_LESSONS,
  ...PLAYGROUND_LESSONS_PART2,
  ...PLAYGROUND_LESSONS_PART3,
  ...PLAYGROUND_LESSONS_PART4,
  ...PLAYGROUND_LESSONS_PART5,
  ...PLAYGROUND_LESSONS_PART6,
  ...PLAYGROUND_LESSONS_PART7,
  ...PLAYGROUND_LESSONS_PART8,
  ...PLAYGROUND_LESSONS_PART9,
  ...PLAYGROUND_LESSONS_PART10,
  ...PLAYGROUND_LESSONS_PART11,
  ...PLAYGROUND_LESSONS_PART12,
  ...PLAYGROUND_LESSONS_PART13,
  ...PLAYGROUND_LESSONS_PART14,
  ...PLAYGROUND_LESSONS_PART15,
  ...PLAYGROUND_LESSONS_PART16,
  ...PLAYGROUND_LESSONS_PART17,
  ...PLAYGROUND_LESSONS_PART18,
  ...PLAYGROUND_LESSONS_PART19,
  ...PLAYGROUND_LESSONS_PART20,
  ...PLAYGROUND_LESSONS_PART21,
  ...PLAYGROUND_LESSONS_PART22,
  ...PLAYGROUND_LESSONS_PART23,
  ...PLAYGROUND_LESSONS_PART24,
  ...PLAYGROUND_LESSONS_PART25,
  ...PLAYGROUND_LESSONS_PART26,
  ...PLAYGROUND_LESSONS_PART27,
  ...PLAYGROUND_LESSONS_PART28,
].map((lesson) =>
  LESSON_SECTIONS[lesson.id] ? { ...lesson, sections: LESSON_SECTIONS[lesson.id] } : lesson
)

// Lesson order follows the spec's Learning Modules list (section 4) for each module.
// Titles not listed here (extra lessons) stay at the end in their original order.
const LESSON_ORDER: Record<string, string[]> = {
  html: [
    "Fundamentals", "Elements", "Common Tags", "Attributes in Depth",
    "Text & Headings", "Links", "Images", "Lists", "Tables",
    "Forms & Inputs", "Semantic HTML in Depth", "Accessibility", "HTML5 Concepts",
  ],
  css: [
    "Fundamentals", "Selectors", "Specificity", "Colors", "Typography", "Box Model",
    "Display", "Positioning", "Flexbox Centering", "Grid",
    "Responsive Design", "Media Queries", "Pseudo-classes", "Pseudo-elements",
    "Transforms", "Transitions", "Animations", "CSS Variables", "Advanced CSS",
  ],
  tailwind: [
    "Utility-First Concept", "Layout", "Spacing", "Sizing", "Flexbox",
    "Flex Centering in Tailwind", "Grid", "Colors", "Borders", "Effects",
    "Typography", "Responsive Breakpoints", "Hover States", "Dark Mode",
    "Component Patterns", "CSS vs Tailwind",
  ],
  javascript: [
    "JavaScript Fundamentals", "Syntax", "Variables & Output", "Data Types",
    "Operators", "Conditions", "Loops", "Functions", "Arrays", "Objects",
    "Destructuring", "Spread and Rest", "DOM", "Events", "Forms",
    "REST & HTTP Fundamentals", "Fetch and JSON", "JSON", "Promises", "Async and Await", "Modules",
    "Error Handling", "Advanced JS",
  ],
  typescript: [
    "Type Annotations", "Primitive Types", "Arrays and Objects", "Interfaces",
    "Type Aliases", "Union and Intersection Types", "Function Types", "Generics",
    "Type Narrowing", "Optional Properties", "Utility Types", "Advanced TS",
  ],
  react: [
    "JSX", "Components", "Props", "State with useState", "Events",
    "Conditional Rendering", "Lists and Keys", "Forms", "useEffect", "useRef",
    "Context", "Custom Hooks", "Data Fetching", "Component Patterns",
  ],
  nextjs: [
    "App Router Basics", "Project Structure", "Pages", "Layouts",
    "Link and Navigation", "Dynamic Routes", "Server and Client",
    "Data Fetching", "Loading and Error UI", "Deployment", "Route Handlers",
  ],
  php: [
    "PHP Fundamentals", "Variables and Types", "Operators", "Conditions and Loops",
    "Functions and Arrays", "Forms and POST", "Sessions", "Files",
    "OOP Basics", "APIs with PHP",
  ],
  sql: [
    "Database Fundamentals", "SELECT and WHERE", "INSERT and UPDATE", "DELETE",
    "Aggregate Functions", "GROUP BY and HAVING", "JOIN", "Relationships",
    "Subqueries", "Indexes and Transactions",
  ],
  github: [
    "Git Fundamentals", "First Commit Flow", "Status and Add", "Commit",
    "Clone and .gitignore", "Remotes, Push, Pull", "Branches and Merge",
    "Pull Requests", "GitHub Workflow",
  ],
}

export function lessonsForModule(moduleId: string): Lesson[] {
  const lessons = ALL_PLAYGROUND_LESSONS.filter((l) => l.moduleId === moduleId)
  const order = LESSON_ORDER[moduleId]
  if (!order) return lessons

  const rank = (l: Lesson): number => {
    const i = order.indexOf(l.title)
    return i === -1 ? order.length : i
  }
  // Sort is stable: extras without a spec slot keep their original order at the end.
  return lessons.sort((a, b) => rank(a) - rank(b))
}

