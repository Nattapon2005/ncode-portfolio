import Backdrop from "@/components/layout/Backdrop";
import Nav from "@/components/layout/Nav";
import Hero from "@/components/hero/Hero";
import SmoothScroll from "@/components/animations/SmoothScroll";
import { About, Skills, Projects, Contact, Footer } from "@/components/portfolio/Sections";
import { getProjects } from "@/lib/github";
export const revalidate = 3600;
export default async function Home() {
  const { projects, live } = await getProjects();
  return (<><Backdrop /><SmoothScroll /><Nav /><main><Hero /><About /><Skills /><Projects projects={projects} live={live} /><Contact /></main><Footer /></>);
}
