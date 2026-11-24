export const site = {
  name: "Nattapon Phliwan", brand: "NCode", github: "Nattapon2005",
  // โดเมนหลักของเว็บ — ใช้เป็น metadataBase / canonical / sitemap
  // แก้จุดเดียวตรงนี้ครั้งเดียว แล้ว og:image / canonical / sitemap เปลี่ยนตามทั้งหมด
  url: "https://ncode-dev.vercel.app",
  githubUrl: "https://github.com/Nattapon2005",
  email: "nattaponphli@gmail.com",
  socials: [{ label: "GitHub", href: "https://github.com/Nattapon2005" }, { label: "Instagram", href: "https://www.instagram.com/nattapon_phliwan/" }],
  nav: ["home", "about", "skills", "projects", "contact"],
};
export const config = {
  animationIntensity: 1,      // 0 disables scroll flourish, 1 default
  glowIntensity: 0.6,
  shaderColors: { color1: "#00D9FF", color2: "#3B82F6", color3: "#8B5CF6" },
  enableLenis: true,
  quality3D: "auto" as "auto" | "low" | "high",
};
