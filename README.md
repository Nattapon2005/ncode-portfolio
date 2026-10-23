# 🌊 NCode — Creative Developer Portfolio

An interactive, cyberpunk-ocean themed creative developer portfolio website built for **Nattapon Phliwan** (@Nattapon2005). Featuring real-time procedural animations, interactive 3D elements, and smooth modern web aesthetics.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)

---

## ✨ Key Features

- **🦈 Procedural Cyber Aquatic Creatures**: 
  - Dynamic retro-cyberpunk swimmers (*White Shark, Koi Fish, Blue Whale, Manta Ray, Jellyfish*) driven by an Inverse-Kinematics joint-chain spine simulation with fluid travelling-wave physics rendered directly on HTML5 Canvas.
  - Zero heavy video/GIF assets: pure procedural pixel rendering with `requestAnimationFrame` loop cancellation when offscreen.
- **🌊 3D Shaders & Ambient Canvas**:
  - Interactive WebGL fluid wave plane using Three.js & ShaderGradient.
  - Floating 3D wireframe geometries with custom lighting.
- **🧩 Bento Grid Skills & Workstation Showcase**:
  - Interactive skill cards categorized by Frontend, Backend, Database, and Dev Tools with interactive hover tilt physics (`TiltCard`).
  - Real-time Asia/Bangkok workstation clock and environment status indicator.
- **💻 Live GitHub Project Sync**:
  - Dynamically fetches latest repositories from GitHub API with automatic fallback caching for seamless 100% uptime.
- **🎯 Smooth Lenis Scrolling**:
  - Integrated Lenis smooth-scroll physics with responsive navigation and quick anchor jumping.
- **📬 Interactive Contact Section**:
  - Instant one-click email copy system connected directly to `nattaponphli@gmail.com`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D & Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@shadergradient/react](https://www.shadergradient.co/)
- **Animation**: [GSAP](https://greensock.com/gsap/), Canvas 2D Procedural Math
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nattapon2005/ncode-portfolio.git
   cd ncode-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## 📦 Scripts

- `npm run dev`: Runs the local development server with Turbopack.
- `npm run build`: Compiles production build with type checking and linting.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

---

## 👤 Author

**Nattapon Phliwan (Nut)**
- **GitHub**: [@Nattapon2005](https://github.com/Nattapon2005)
- **Email**: [nattaponphli@gmail.com](mailto:nattaponphli@gmail.com)
- **Instagram**: [@nattapon_phliwan](https://www.instagram.com/nattapon_phliwan/)
