export type Project = {
  name: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  image?: string;
};

const gh = "https://github.com/Nattapon2005";

// Verified real data directly from GitHub profile and repositories (@Nattapon2005)
export const fallbackProjects: Project[] = [
  {
    name: "TechGear-Ecommerce-Web",
    description: "Modern E-Commerce Web Shopping Application built with PHP, MySQL, and responsive CSS with cart, checkout, and inventory catalog.",
    tech: ["PHP", "MySQL", "JavaScript", "E-Commerce"],
    github: `${gh}/TechGear-Ecommerce-Web`,
  },
  {
    name: "plant-ecommerce-website",
    description: "Aesthetic botanical and indoor plant e-commerce shop designed with modular SCSS and fluid responsive product showcase.",
    tech: ["SCSS", "HTML5", "JavaScript", "Responsive"],
    github: `${gh}/plant-ecommerce-website`,
  },
  {
    name: "E-commerce Web App",
    description: "Full-featured shopping cart system with real-time add, remove, and quantity updates with responsive mobile/desktop UI.",
    tech: ["JavaScript", "HTML5", "CSS3", "Cart System"],
    github: gh,
    demo: "https://my-wed-template-github-io.onrender.com/",
  },
  {
    name: "Product API Website",
    description: "Fetches and renders dynamic product data asynchronously from RESTful JSON APIs with fast client-side rendering.",
    tech: ["JavaScript", "REST API", "JSON", "Async"],
    github: gh,
  },
  {
    name: "newYear",
    description: "Interactive celebration web experience featuring smooth CSS animations, keyframe effects, and dynamic particle visuals.",
    tech: ["CSS3", "JavaScript", "Keyframes", "Animation"],
    github: `${gh}/newYear`,
  },
  {
    name: "webpage",
    description: "Modern responsive web landing page architecture optimized for performance, semantic layout, and clean typography.",
    tech: ["HTML5", "CSS3", "Responsive Design"],
    github: `${gh}/webpage`,
  },
];

export type SkillCategory = "all" | "frontend" | "backend" | "database" | "tools";

export type BentoSkill = {
  name: string;
  category: "frontend" | "backend" | "database" | "tools";
  icon: string;
  invert?: boolean;
};

export const bentoSkills: BentoSkill[] = [
  // Frontend
  { name: "React", category: "frontend", icon: "/icons/react.svg" },
  { name: "TypeScript", category: "frontend", icon: "/icons/typescript.svg" },
  { name: "Next.js", category: "frontend", icon: "/icons/nextjs.svg" },
  { name: "Tailwind CSS", category: "frontend", icon: "/icons/tailwindcss.svg" },
  { name: "JavaScript", category: "frontend", icon: "/icons/javascript.svg" },
  { name: "HTML5", category: "frontend", icon: "/icons/html5.svg" },
  { name: "CSS3", category: "frontend", icon: "/icons/css3.svg" },
  { name: "SCSS", category: "frontend", icon: "/icons/sass.svg" },
  { name: "Bootstrap", category: "frontend", icon: "/icons/bootstrap.svg" },
  { name: "Vite", category: "frontend", icon: "/icons/vitejs.svg" },

  // Backend
  { name: "Node.js", category: "backend", icon: "/icons/nodejs.svg" },
  { name: "Express.js", category: "backend", icon: "/icons/express.svg", invert: true },
  { name: "PHP", category: "backend", icon: "/icons/php.svg" },
  { name: "Python", category: "backend", icon: "/icons/python.svg" },

  // Database
  { name: "MySQL", category: "database", icon: "/icons/mysql.svg" },
  { name: "SQL", category: "database", icon: "/icons/mysql.svg" },

  // Tools
  { name: "Git", category: "tools", icon: "/icons/git.svg" },
  { name: "GitHub", category: "tools", icon: "/icons/github.svg", invert: true },
  { name: "VS Code", category: "tools", icon: "/icons/vscode.svg" },
  { name: "Docker", category: "tools", icon: "/icons/docker.svg" },
  { name: "Postman", category: "tools", icon: "/icons/postman.svg" },
  { name: "Figma", category: "tools", icon: "/icons/figma.svg" },
];

export const workstationApps = [
  { name: "VS Code", role: "Primary IDE", icon: "/icons/vscode.svg" },
  { name: "Terminal", role: "CLI & Scripts", icon: "/icons/terminal.svg" },
  { name: "Chrome", role: "DevTools & Testing", icon: "/icons/chrome.svg" },
  { name: "GitHub", role: "Code Repository", icon: "/icons/github.svg", invert: true },
  { name: "Postman", role: "API Testing", icon: "/icons/postman.svg" },
  { name: "Figma", role: "UI/UX Design", icon: "/icons/figma.svg" },
  { name: "Next.js", role: "Full Stack Framework", icon: "/icons/nextjs.svg" },
  { name: "Docker", role: "Containers", icon: "/icons/docker.svg" },
];

export const profile = {
  name: "Nattapon Phliwan",
  nickname: "Nut",
  role: "Full Stack Web Developer",
  location: "Bangkok, Thailand",
  avatar: "https://avatars.githubusercontent.com/u/240534025?v=4",
  bio: "Passionate Full Stack Web Developer focused on building modern, responsive, and user-friendly web applications. Skilled in HTML, CSS, JavaScript, PHP, SQL, React, and SCSS with expanding focus on Node.js, Express, and modern full-stack architectures.",
  goals: [
    "Become a highly skilled Professional Full Stack Developer",
    "Build modern, secure, and scalable web applications",
    "Develop reliable backend systems and RESTful APIs",
    "Master database design, cloud technologies, and deployment",
    "Work on impactful real-world projects and freelance jobs",
  ],
};
