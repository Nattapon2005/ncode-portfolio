import { site } from "@/config/site";
import { fallbackProjects, type Project } from "@/data/projects";

const repoDescriptions: Record<string, { desc: string; tech: string[]; demo?: string }> = {
  "TechGear-Ecommerce-Web": {
    desc: "Modern E-Commerce Web Shopping Application built with PHP, MySQL, and responsive CSS with shopping cart, checkout, and inventory catalog.",
    tech: ["PHP", "MySQL", "JavaScript", "E-Commerce"],
  },
  "plant-ecommerce-website": {
    desc: "Aesthetic botanical and indoor plant e-commerce shop designed with modular SCSS and fluid responsive product showcase.",
    tech: ["SCSS", "HTML5", "JavaScript", "Responsive"],
  },
  "E-commerce Web App": {
    desc: "Full-featured shopping cart system with real-time add, remove, and quantity updates with responsive mobile/desktop UI.",
    tech: ["JavaScript", "HTML5", "CSS3", "Cart System"],
    demo: "https://my-wed-template-github-io.onrender.com/",
  },
  "Product API Website": {
    desc: "Fetches and renders dynamic product data asynchronously from RESTful JSON APIs with fast client-side rendering.",
    tech: ["JavaScript", "REST API", "JSON", "Async"],
  },
  "newYear": {
    desc: "Interactive celebration web experience featuring smooth CSS animations, keyframe effects, and dynamic particle visuals.",
    tech: ["CSS3", "JavaScript", "Keyframes", "Animation"],
  },
  "webpage": {
    desc: "Modern responsive web landing page architecture optimized for performance, semantic layout, and clean typography.",
    tech: ["HTML5", "CSS3", "Responsive Design"],
  },
};

interface GitHubRepo {
  name: string;
  fork: boolean;
  description: string | null;
  topics?: string[];
  language?: string | null;
  html_url: string;
  homepage?: string | null;
}

export async function getProjects(): Promise<{ projects: Project[]; live: boolean }> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/users/${site.github}/repos?per_page=100&sort=updated`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const data: GitHubRepo[] = await res.json();

    const projects: Project[] = data
      .filter((r) => !r.fork && r.name !== site.github) // Exclude profile README repo itself
      .slice(0, 8)
      .map((r) => {
        const customRepo = repoDescriptions[r.name];
        const customFallback = fallbackProjects.find((f) => f.name === r.name);
        const desc = r.description || customRepo?.desc || customFallback?.description || "Public repository on GitHub.";
        const tech = (r.topics && r.topics.length > 0)
          ? r.topics.slice(0, 4)
          : (customRepo?.tech || customFallback?.tech || [r.language, "Web Development"].filter((x): x is string => Boolean(x)));

        return {
          name: r.name,
          description: desc,
          tech,
          github: r.html_url,
          demo: r.homepage || customRepo?.demo || customFallback?.demo || undefined,
        };
      });

    // Merge any featured projects that might not be on GitHub directly (e.g. demo web app)
    const extra = fallbackProjects.filter((f) => !projects.some((p) => p.name.toLowerCase() === f.name.toLowerCase()));
    const finalProjects = [...projects, ...extra];

    return finalProjects.length ? { projects: finalProjects, live: true } : { projects: fallbackProjects, live: false };
  } catch {
    return { projects: fallbackProjects, live: false };
  }
}
