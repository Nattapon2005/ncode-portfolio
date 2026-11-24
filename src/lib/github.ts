import { site } from "@/config/site";
import { fallbackProjects, type Project } from "@/data/projects";

interface GitHubRepo {
  name: string;
  fork: boolean;
  description: string | null;
  topics?: string[];
  language?: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count?: number;
}

export async function getProjects(): Promise<{ projects: Project[]; live: boolean }> {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(
      `https://api.github.com/users/${site.github}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error(String(res.status));
    const data: GitHubRepo[] = await res.json();

    const repoMap = new Map(
      data
        .filter((r) => !r.fork && r.name !== site.github && r.name !== "ncode-portfolio")
        .map((r) => [r.name.toLowerCase(), r])
    );

    // Enrich curated flagship projects with live GitHub metadata while preserving verified deploy URLs
    const enriched: Project[] = fallbackProjects.map((proj) => {
      const match =
        (proj.repoName && repoMap.get(proj.repoName.toLowerCase())) ||
        repoMap.get(proj.id.toLowerCase());
      if (!match) return proj;

      return {
        ...proj,
        github: match.html_url || proj.github,
        isPrivateRepo: false,
        stars: match.stargazers_count ?? proj.stars,
      };
    });

    return { projects: enriched, live: true };
  } catch {
    return { projects: fallbackProjects, live: false };
  }
}
