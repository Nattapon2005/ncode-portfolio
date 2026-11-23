# 🎬 Animation & Theme Documentation — ncode Portfolio

> เอกสารสรุประบบอนิเมชั่น + ธีมสี ทั้งหมดที่ใช้จริงในเว็บนี้ (อัปเดต: 2026-11-08)
> หลักมั่นคงของทุกอนิเมชั่นในงานนี้: **transform + opacity เท่านั้น · รองรับ `prefers-reduced-motion` · หยุดเองเมื่อออกนอกจอ**

---

## 1. แผนที่อนิเมชั่นตามตำแหน่งบนเว็บ

### 🌍 Global (ทั้งเว็บ)

| อนิเมชั่น | ไฟล์ | รายละเอียด | ทริกเกอร์ |
|---|---|---|---|
| Smooth Scroll | `components/animations/SmoothScroll.tsx` | Lenis (lerp 0.08) + GSAP ScrollTrigger sync, lag smoothing | ตลอดหน้า |
| Section Reveal | `[data-reveal]` ใน SmoothScroll | การ์ด/บล็อก fade-up (y:50, scale .96 → ปกติ) สลับดีเลย์ 3 จังหวะ | scroll `top 90%` (reverse ได้) |
| Backdrop | `components/layout/Backdrop.tsx` | จุด grid ขาวจาง `bg-grid` + aurora blob สีฟ้า/ม่วง/ไซแอนเคลื่อน (transform) + จุดดาว 32 จุด `twinkle` | fixed ตลอดหน้า |
| Navbar Sheen | `.nav-sheen` | แสงสวยวิ่งผ่านแถบ glass nav ทุก 6 วิ | loop |
| Buttons | `.btn-primary` / `.btn-ghost` | hover: ยกขึ้น + glow ฟ้า | hover |

---

### 🦸 Hero — `#home` (`components/hero/Hero.tsx`)

| อนิเมชั่น | ตัวช่วย | รายละเอียด |
|---|---|---|
| ชื่อกระชากเข้า | `SplitText.tsx` | ตัวอักษร NATTAPON / PHLIWAN ลอยขึ้นจาก blur 14px + y:40, stagger 0.03s |
| Pop-in การ์ดลอย | `[data-pop]` (GSAP) | ชิป skill + การ์ดโปรไฟล์: scale .5 → 1, y:90, rotateX/rotateY 3D, blur 12px |
| Scroll Zoom-out ภาพยนตร์ | `[data-code]/[data-l]/[data-r]/[data-headline]` timeline scrub | เลื่อนลง: พื้นหลังโค้ดหดเข้า (scale .6, opacity .25), ชื่อเลื่อนแยกซ้าย-ขวา ±35vw, headline blur ตาย |
| ลอยตัวไปเรื่อยๆ | `.float-soft` (floaty 5s) | ชิป/การ์ดเด้งเบา 8 วุ้น |
| 3D Wireframes | `components/three/Shapes.tsx` (drei `Float`) | icosahedron ฟ้า + octahedron ไซแอน + รูปอื่นลอยหมุนตามเมาส์ |
| Typing loop | `TypeLoop.tsx` | ข้อความพิมพ์/ลบไปเรื่อยๆ |

---

### 📟 About "BEHIND THE CODE" — `#about` (`components/portfolio/Sections.tsx`)

| อนิเมชั่น | ไฟล์ | รายละเอียด |
|---|---|---|
| **Cinematic Scrub Heading** ⭐ | `animations/CineHeading.tsx` | หัวข้อถูก **pin** กลางจอ (+170% scroll) แล้ว scroll ขับ 4 ฉาก: **①** ตัวอักษรบินเข้าจากสองข้างสลับ rotateX ±45° (สุ่มลำดับ) → **②** hold → **③** ละลายกระจาย (x/y/rotateX/rotation/scale สุ่มตัวละทิศ) → **④** บินกลับจากปีกตรงข้าม รวมตัวจากกลางออกขอบ (`from: "edges"` + back.out) — เลื่อนย้อน = ย้อนฟิล์ม. perspective 700px บน h2 |
| ป้าย Role พิมพ์ขึ้น | `TypeOnce` ใน `animations/typewriters.tsx` | "Full Stack Web Developer · Bangkok, Thailand" พิมพ์ทีละตัว (16ms) + เคอร์เซอร์แท่งฟ้า |
| ประกายวิ่งบนป้าย | `.shimmer-text` | text gradient (ฟ้าอ่อน→ขาว→ฟ้า) background-position sweep ทุก 5s |
| Vision & Goals Quest-log | `[data-goal]` (GSAP) | รายการเด้งเข้าทีละบรรทัด (x:-18) ทุก 0.09s |
| Hover เป้าหมาย | `.goal-item` | พื้นฟ้าจาง + ลูกศร ▸ ขยาย + ตัวหนังสือขาวขึ้น |
| **Typewriter โค้ด** ⭐ | `TypewriterCode` ใน `typewriters.tsx` | พิมพ์ `const developer = {...}` ทีละตัว (9ms/ตัว, pause บรรทัดละ 160ms) พร้อม **syntax colors**: const=ฟ้า `#7DD3FC`, string=เขียว `#6EE7B9`, key=ม่วง `#C4B5FD`, punct=เทา. เคอร์เซอร์เรืองแสงกระพริบตลอด |
| **พื้นเทอรมินัล CRT** ⭐ | `.crt-shell` CSS ล้วน | ตารางจุดฟ้า 18px + แถบแสงกวาดลง 7s (`crtSweep`) + scanline 4px + กระพริบจอเก่า (`crtFlicker` twitch ~5.5s) + แสง pool ที่ก้นหายใจ 5.5s |
| **Deploy Log Streamer** ⭐ | `animations/BuildLog.tsx` | รอโค้ดพิมพ์เสร็จ (3.9s) → log 6 แถวไหลเข้า (✓ types / ✓ bundle / ▲ upload edge / ✓ deploy / ★ lighthouse) แถวละ 620ms → ถือ status bar `STREAM LIVE · 0 ERR` 3.6s → **wipe แล้วรันใหม่ตลอดไป**. พักเมื่อ off-screen |
| Typing loop ประจำ | `TypeLoop` | `> CODE. CREATE. IMPROVE. REPEAT.` |

---

### 🧩 Skills — `#skills` (`components/portfolio/SkillsBento.tsx`)

| อนิเมชั่น | ไฟล์ | รายละเอียด |
|---|---|---|
| **Matrix Rain** ⭐ | `animations/MatrixRain.tsx` | ฝนคาตากานา+hex ไหล **ช่องว่างระหว่างการ์ด bento** (opacity 40) — คอลัมน์พิเศษชมพูนีออน 6%. ระบบปั่น ~12fps, dpr 1, หยุดเมื่อไม่ใช้ + tab ซ่อน |
| Scan Sweep | `.bento-scan` | แถบแสงฟ้ากวาดลงทั้ง grid ทุก 6.5s (**transform-only** เป็น compositor, `--scan-h` ต่างกันตามจอ) |
| การ์ด Pop-in | `[data-bento]` (GSAP) | fade-up scale .94 → 1 (ไม่มี blur แล้ว) |
| Pills Cascade | `[data-tile]` (GSAP) | ชิป skill เด้งเข้าแบบ `back.out(1.8)` สุ่มลำดับ |
| Pill Hover | Tailwind classes | ยกขึ้น + ขอบ/glow ฟ้า + ไอคอน scale 110°, เปลี่ยนชนิดโดยแท็บ frontend/backend/database/tools |
| Dock ของเวิร์กสเตชัน | Tailwind | ไอคอนเด้งขึ้น + เรืองแสง + tooltip ชื่อแอป/หน้าที่ |
| Radar กรุงเทพฯ | `animate-ping` | จุดกรุงเทพฯ พ่นวงคลื่น + **นาฬิกาไทย live** (Intl, Asia/Bangkok ทุกวินาที) |

---

### 🪐 Projects — `#projects` (`components/portfolio/Sections.tsx`)

| อนิเมชั่น | รายละเอียด |
|---|---|
| พื้นดาว Canvas cinematic | `<canvas>` วาดเอง: nebula blob 3 จุดไหล (ม่วง/ฟ้า/ไซแอน), **โมโนลิธ** เรืองกลางจอ + เสาแสงเอียงตาม sin, วงโคจร 3 วง, ฝุ่นลอย 90 เม็ด, vignette. ลดเป็น static เมื่อ reduced-motion |
| **วงแหวนการ์ดโคจร** | เดสก์ท็อป: การ์ด glass **บังคับด้วย scroll** (pin `+= total*90%`) หมุน rotateY บนวงแหวน R≈38vw, การ์ดด้านท้ายจอ glowสลัว, แกนกลาง lerp 0.085 ให้กลิ่นแรงเฉื่อย, การ์ดมีครีบ idle float |
| Caption จ๊าบมาก | ชื่อ repo ด้านล่าง สลับ crossfade 200ms เมื่อหมุนผ่าน |
| Progress | แถบแนวนอน สีฟ้า→ม่วง scaleX ตาม progress |
|มือถือ | การ์ดเรียงแนวตั้ง scroll ปกติ (ไม่ pin) |

---

### 🌊 Contact — `#contact` (`components/portfolio/ContactSection.tsx`)

| อนิเมชั่น | ไฟล์ | รายละเอียด |
|---|---|---|
| **สัตว์คาตติกไซเบอร์** ⭐ | `animations/CyberAquaticCreature.tsx` | ปลา/แมงกะพรุน/หนอนอวกาศ procedural pixel-art เคลื่อนไหวบน canvas (กระพริบเหง้า/ครีบสแกน) — สปีชีส์สุ่ม, 39KB engine |
| (สำรอง) | `PixelFishCanvas.tsx` |ityEngine ปลา pixel แบบเก่า ยังเก็บไว้ใช้เพิ่มได้ |
| (สำรอง) | `three/ContactGradient.tsx` | ฉาก Three.js อื่น — ยังไม่ถูกตั้งใช้งาน |

---

## 2. Keyframes ใน `globals.css`

| keyframe | ที่ใช้ | note ประสิทธิภาพ |
|---|---|---|
| `drift` | `.code-drift` พื้นหลัง hero | transform เท่านั้น |
| `floaty` | `.float-soft`, `.skill-tile` | transform เท่านั้น |
| `twinkle` | จุดดาว Backdrop | opacity เท่านั้น |
| `fadeIn` | tooltip dock | 0.2s สั้นพิเศษ |
| `navSheen` | แสง nav | transform เท่านั้น |
| `scanY` | `.bento-scan` | **animate translateY** ผ่าน custom prop `--scan-h` (แยกค่ามือถือ) — ไม่แตะ layout |
| `caretBlink` | เคอร์เซอร์แท่งโค้ด | stepped(1) CRT จริง |
| `crtPool` / `crtSweep` / `crtFlicker` | ตกแต่งจอ CRT | transform/opacity เท่านั้น |
| `shimmer` | ป้าย role | background-position (text clip) |
| `logIn` | แถว build log | transform+opacity 0.28s |
| `linePulse` | เส้นใต้ RevealHeading | opacity เท่านั้น |

ทุกกลุ่ม closure ด้วย `@media (prefers-reduced-motion: reduce) { … animation:none }` ✓

---

## 3. 🎨 ธีมสี

### พื้นหลัง & โครงสร้าง

| สี | Hex | ใช้ทำอะไร |
|---|---|---|
| Deep Black Navy | `#05070D` | พื้นทั้งเว็บ (`--bg`), ปุ่ม primary อักษร |
| Card Top (Dark) | `#111A2B` (f0) | gradient การ์ด holo (เข้มกว่าเดิม เพราะปลด backdrop-blur) |
| Card Bottom | `#0B1220` (e8) | ปลายล่างการ์ด |
| Border ฟ้าจาง | `#00D9FF22` | ขอบการ์ดทุกใบ |
| Border ขาวจาง | `#ffffff10-15` | ขอบชิป/dock |

### สีเน้น (Accent)

| สี | Hex | ใช้ตรงไหน |
|---|---|---|
| **Cyan Neon** ⭐ (ดาวเด่น) | `#00D9FF` | heading glow, scan, radar, เคอร์เซอร์, จุด active, ป้าย role |
| Blue | `#3B82F6` | blob aurora, wireframe 3D, การ์ด-จุดไฟ terminal |
| Violet | `#8B5CF6` | gradient progress, วงแหวนพื้น canvas, syntax key |
| **Sky (เอาไว้แยแสงหัว)** | `#7DD3FC` | const ในโค้ด, shimmer ป้าย role |
| Magenta Glitch | `#FF2E88` | RGB-split ตัวอักษรเวลา glitch, คอลัมน์พิเศษ matrix rain |
| Emerald (สำเร็จ) | `#34D399` / `#6EE7B9` | จุด ✓ log, `STACK...` ยังคงอยู่ใน skills, ping พร้อมรับงาน |
| Amber (กำลังดำเนินการ) | `#FBBF24`/`#FFD166` | ▲ upload log |

### ตัวอักษร

| สี | Hex | ไว้ทำ |
|---|---|---|
| หัวข้อ/ตัวหนังสือหลัก | `#F5F9FF` | หัวข้อ/ตัวหนังสือชน |
| เขียนใน log/ปกติ | `text-slate-300` | เนื้อหาพรรณ |
| รอง/บรรยาย | `text-slate-400/500` | คำอธิบายจุด |
| จางสุด | `text-slate-600` | ตัวเลขไร้ความสำคัญ placeholder |

### Syntax ของโค้ดใน terminal (tk-*)

| Token | สี |
|---|---|
| keyword (const) | `#7DD3FC` (ฟ้า, หนา) |
| string | `#6EE7B9` (มิ้นต์) |
| property/key | `#C4B5FD` (ม่วงอ่อน) |
| punctuation | `#64748B` (เทา) |
| ตัวหนังสือธรรมดา | `text-slate-300` |

---

## 4. ไฟล์รวมอนิเมชั่น ทั้งหมด (`src/components/animations/`)

| ไฟล์ | หน้าที่ | กำลังใช้ที่ |
|---|---|---|
| `SmoothScroll.tsx` | Lenis + reveal ทั้งระบบ | `app/page.tsx` (global) |
| `TiltCard.tsx` | เปล่งแสงตามเมาส์ (--mx/--my) ผ่าน rAF, เมาส์ไม่ bug, ไม่ยกบดบัง | About/Skills ทุกการ์ด |
| `SplitText.tsx` | ตัวอักษรลอยจาก blur | Hero ชื่อ |
| `TypeLoop.tsx` | พิมพ์/ลบวน | Hero + โค้ด terminal |
| `CineHeading.tsx` | pin+scrub 4 ฉาก | About หัวข้อ |
| `RevealHeading.tsx` | letters fade-up + เส้น pulse + hover glitch | Skills หัวข้อ |
| `MatrixRain.tsx` | ฝนดิจิทัลพื้นหลัง grid | Skills |
| `typewriters.tsx` | `TypewriterCode` + `TypeOnce` | terminal + ป้าย role |
| `BuildLog.tsx` | deploy log วน loop | ก้น terminal card |
| `CyberAquaticCreature.tsx` | สัตว์ pixel ไซเบอร์ canvas | Contact |
| `PixelFishCanvas.tsx` | (สำรอง) ปลา pixel เก่า | — |

---

## 5. 🧹 แนวคิดที่ทดแล้วแล้วปลดออก (เผื่ออยากกลับมา)

- **Split-Flap Heading** — ป้ายสนามบินพลิกตัวอักษร: เท่ แต่ว่องไวต่อ hydration, ช้า, ทำให้แม่น้ำตกเหลื่อมเยิก → เสริมแทนด้วย RevealHeading
- **LED Ticker Rows** — กลุ่ม chiip วิ่ง 2 แถวสวนกัน → ได้ยินคำติ "สวยดีแต่ไม่อ่านง่ายเท่า grid เดิม" จึง revert
- **Decode Scramble** — สุ่มข้อความมาเปลี่ยนเป็นคำ finite → รวมจุดเดิมจนไม่ถูกใจ
- CSS ประเภทเหล่านี้ถูกไล่ล้างออกอยู่แล้ว แต่ **ควรระวัง hydration**: ตามหลังผลงานในหน้าจอจริง อย่าสุ่ม(random)ตอน render ครั้งแรก

---

## 6. ⚠️ กฎระเบียบการใช้งาน (สำหรับทำนองเพิ่มเติม)

1. **ไม่กลับไปใช้ `backdrop-filter: blur`** ระดับการ์ดใหญ่/ชิปจำนวนมาก — มัน vendor ราคาแพงทุกเฟรม scroll (เคยเป็นสาเหตุกระตุกหลัก)
2. ห้าม random ข้อความใน render แรก (การตัดสิน hydration) — ดึง random ไว้ใน `useEffect` เชิง trigger เท่านั้น
3. เจาะอนิเมชั่นต่อเนื่อง (continuous loops) ทุกชิ้นต้อง **พักเอง** เมื่อ off-screen (IO / ScrollTrigger `visible`)
4. Canvas ต้อง `dpr = min(2, DPR)` ถ้าสำคัญความคม; ปริแฟรีเรียล (ฝนรายบรรทัดของข้อความ) พอ 12-18fps ก็สวย
5. ตลอดทาง: `transform` + `opacity` เป็น first-class; ส่วน `top/left/width` = ผิดประเพณี (เห็นกับ `.bento-scan` เดิม)
6. ถ้าเพิ่ม pin/pinned ให้ระวังว่า `SmoothScroll` sync ScrollTrigger อยู่แล้ว — pin ใดๆ ต้องใช้ `gsap.matchMedia()` ระวังมือถือ
7. เอาไว้ตรวจง่าย: เปิด **dev server แล้ดูว่า ห้ามมีป้าย "1 Issue"** — มีเมื่อไหร่แปลว่าบางอย่าง hydration/SSR ผิด

ตัวขุดมุมสำคัญ (ปรับจุดนี้ได้ทันที):
- ความเร็วพิมพ์โค้ด: `<TypewriterCode charMs={9} linePause={160} />`
- จังหวะ build log: `<BuildLog stepMs={620} holdMs={3600} />`
- ความยาวฟิล์ม: `end: "+=170%"` ใน CineHeading
- ฝนหนักขึ้น: `opacity-40` ที่ `<MatrixRain />` ใน SkillsBento
- ความยาวเส้น glow: `.rgb-line { max-width:520px }`

---

## 7. 🔗 Open Graph / Social Media Link Preview

ตั้งไว้เพื่อให้เวลาโพสต์ลิงก์เว็บลง Discord / LINE / X (Twitter) / LinkedIn จะขึ้นการ์ดสวยเทียบธีมเว็บพอดี

| ไฟล์ | หน้าที่ |
|---|---|
| `app/opengraph-image.tsx` | ภาพ preview **1200×630 px** สร้างตอน build ด้วย `next/og` (`ImageResponse` + ฟอนต์ **Geist** ในตัวของ next/og) — ธีมเดียวกับเว็บ: พื้น `#05070D` + ตารางจุด + aurora ฟ้า/ม่วง + **ฝนโค้ด matrix จางๆ ทะลุชื่อ** (ยืมธีมจาก MatrixRain, hardcode เพื่อ deterministic) + **mini terminal ฝั่งขวา** (`> whoami`, `> stack --list`, `● live — coding now`) + chip `</> NCode` + ชื่อ **NATTAPON / PHLIWAN** (ขาว/นีออนฟ้า) + เส้นไล่สี cyan→violet + การ์ด `const dev = "Nattapon Phliwan"` สี syntax เหมือน terminal + **แท็บไฟล์ style editor** `● ~/ncode/profile.ts  READY▎` + email + จุดเขียว `OPEN TO WORK` |
| `app/twitter-image.tsx` | re-export จาก opengraph-image (twitter card `summary_large_image` ใช้ภาพเดียวกัน) |
| `app/layout.tsx` | metadata หลัก: `metadataBase`, title template, description, keywords, canonical, `og:` (type/url/siteName/locale), `twitter:`, `viewport.themeColor = #05070D` |
| `app/robots.ts` | robots.txt — allow `/` + ชี้ sitemap |
| `app/sitemap.ts` | sitemap.xml (1 หน้าเว็บ, priority 1) |
| `src/config/site.ts` | **`site.url` = จุดเดียวที่เก็บโดเมนจริง** (`https://ncode.vercel.app`) — og:image / canonical / sitemap ต่อกันจากที่นี่ทั้งหมด |

### ข้อควรรู้

- ภาพ OG สร้าง **ตอน build** (static) — เปลี่ยนดีไซน์แล้วต้อง `npm run build` ใหม่ภาพถึงเปลี่ยน
- `next/og` ใช้เอ็นจิ้น Satori: ใช้ได้แค่ flexbox + gradient + `border` — **ไม่ได้** `backdrop-filter`, CSS grid, `transition` — และช่องว่างระหว่าง span ที่เป็น flex item ให้ใช้ `marginLeft` เท่านั้น (space ใน string หัวท้ายถูกตัดออก)
- ฟอนต์เพิ่มได้ผ่าน `fonts: [{ name, data, weight }]` รองรับ ttf/otf/woff (ขีดจำกัด bundle รวม ≤ 500KB)
- ดูภาพจริงได้: รัน `npm run dev` แล้วเปิด `http://localhost:3000/opengraph-image`
- ดูแท็กจริงตอน build: เช็ค `<meta property="og:" ...>` ใน `.next/server/app/index.html`
- แก้โดเมน: เพิ่ม/เปลี่ยน 1 บรรทัดเดียว `url` ใน `src/config/site.ts` เท่านั้น
- เครื่องมือเทสต์ preview: [metakeck.io](https://metakeck.io) / X Card Validator — paste URL เว็บจริงหลัง deploy

---

*สร้างโดยอัตโนมัติ ณ วันที่ 08/Nov/2026 — พร้อม Next.js 16 (next/og) และ Lenis/GSAP*
