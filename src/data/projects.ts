export type ProjectCategory = "all" | "3d-ai" | "ecommerce" | "frontend";

export type ProjectVisualType = "globe" | "audio" | "techgear" | "planto" | "outdoors";

export type Project = {
  id: string;
  repoName?: string;
  name: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tech: string[];
  category: Exclude<ProjectCategory, "all">;
  platform: "Vercel Edge" | "Render Cloud";
  status: "LIVE" | "BETA LIVE" | "DEPLOYED";
  accent: string;
  visual: ProjectVisualType;
  github: string;
  isPrivateRepo?: boolean;
  demo?: string;
  featured?: boolean;
  stars?: number;
};

const gh = "https://github.com/Nattapon2005";

// Curated & verified deployed systems by Nattapon Phliwan (@Nattapon2005)
export const fallbackProjects: Project[] = [
  {
    id: "condoverse",
    repoName: "condoverse",
    name: "CondoVerse",
    subtitle: "3D Interactive Global Residence Explorer",
    description:
      "Interactive 3D Earth real-estate discovery platform — spin the globe across continents, explore luxury residences in 3D space, and curate personal collections.",
    highlights: [
      "Interactive 3D Earth Globe",
      "Multi-Continent Filtering",
      "Saved Residences & Auth",
    ],
    tech: ["Next.js", "Three.js", "TypeScript", "Tailwind CSS"],
    category: "3d-ai",
    platform: "Vercel Edge",
    status: "LIVE",
    accent: "#00D9FF",
    visual: "globe",
    github: gh,
    isPrivateRepo: true,
    demo: "https://condoverse.vercel.app/",
    featured: true,
  },
  {
    id: "nexa-music-app",
    repoName: "nexa-music-app",
    name: "NEXA Studio",
    subtitle: "Discord Music Control Room & AI Companion",
    description:
      "Real-time web control room for the NEXA Discord companion — orchestrate voice channel audio streaming, live music queues, server permissions, and an AI studio assistant.",
    highlights: [
      "Discord Voice Stream Control",
      "Live Music Queue & History",
      "Integrated AI Assistant",
    ],
    tech: ["Next.js", "TypeScript", "Discord API", "AI Assistant"],
    category: "3d-ai",
    platform: "Render Cloud",
    status: "BETA LIVE",
    accent: "#8B5CF6",
    visual: "audio",
    github: gh,
    isPrivateRepo: true,
    demo: "https://nexa-music-app.onrender.com/",
    featured: true,
  },
  {
    id: "techgear-web",
    repoName: "TechGear-Ecommerce-Web",
    name: "TechGear Web",
    subtitle: "Full-Stack Gaming & IT E-Commerce",
    description:
      "End-to-end gaming hardware store built with PHP, Cloud MySQL/TiDB & Docker — complete with PromptPay QR slip verification, admin dashboard, and live Leaflet GPS delivery tracking.",
    highlights: [
      "PromptPay QR & Slip Upload",
      "Leaflet.js GPS Order Tracking",
      "Admin Dashboard & Reviews",
    ],
    tech: ["PHP", "MySQL", "SCSS", "Docker", "Leaflet.js"],
    category: "ecommerce",
    platform: "Render Cloud",
    status: "DEPLOYED",
    accent: "#3B82F6",
    visual: "techgear",
    github: `${gh}/TechGear-Ecommerce-Web`,
    // Replace with public .onrender.com URL (e.g. https://techgear-web-xxxx.onrender.com)
    demo: undefined,
  },
  {
    id: "plant-ecommerce-website",
    repoName: "plant-ecommerce-website",
    name: "Planto. Botanical",
    subtitle: "Indoor Plant E-Commerce & REST API",
    description:
      "Curated botanical shop showcasing house plants with a real-time slide-out cart, asynchronous product catalog backed by Node.js/Express REST APIs, and modular SCSS.",
    highlights: [
      "Real-Time Slide-Out Cart",
      "Node.js / Express REST API",
      "Fluid Modular SCSS UI",
    ],
    tech: ["JavaScript", "Node.js", "SCSS", "REST API"],
    category: "ecommerce",
    platform: "Vercel Edge",
    status: "LIVE",
    accent: "#34D399",
    visual: "planto",
    github: `${gh}/plant-ecommerce-website`,
    demo: "https://plant-ecommerce-website.vercel.app/",
  },
  {
    id: "webpage",
    repoName: "webpage",
    name: "Acme Outdoors",
    subtitle: "Futuristic React Storefront & Particle FX",
    description:
      "High-tech adventure gear web app powered by React + Vite — engineered with custom Canvas particle networks, aurora HUD overlays, page transitions, and dynamic route SEO.",
    highlights: [
      "Custom Canvas Particle FX",
      "Smooth Page Transitions",
      "Dynamic Per-Route SEO",
    ],
    tech: ["React", "Vite", "SCSS", "Canvas FX"],
    category: "frontend",
    platform: "Vercel Edge",
    status: "LIVE",
    accent: "#38BDF8",
    visual: "outdoors",
    github: `${gh}/webpage`,
    demo: "https://webpage-rust-eta.vercel.app/",
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
