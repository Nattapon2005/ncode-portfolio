import { ImageResponse } from "next/og";

export const alt = "NCode — interactive cyberpunk portfolio of Nattapon Phliwan (Nut), full stack web developer in Bangkok, Thailand";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/*
 * OG link-preview ธีมเดียวกับเว็บ: พื้น #05070D + grid จุด + aurora ฟ้า/ม่วง
 * + ฝนโค้ด matrix จางๆ ทะลุชื่อ + mini terminal ฝั่งขวา + ชื่อ NATTAPON/PHLIWAN
 * ใช้เฉพาะ style ที่ Satori (next/og) รองรับ — flex, gradient, border, letterSpacing
 * ฟอนต์ใช้ Geist ที่ next/og มีให้ในตัว
 */

/* ฝนโค้ด (โชว์นิ้ว MatrixRain ในหน้า Skills) — hardcode ทุกคอลัมน์เพื่อ build ได้ deterministic ทุกครั้ง */
const RAIN: Array<{ x: number; top: number; o: number; c: string; chars: string[] }> = [
  { x: 336, top: 84, o: 0.2, c: "#00D9FF", chars: ["0", "1", "9", "F", "3", "7", "<", ">", "1", "0", "A", "C", ";", "6"] },
  { x: 556, top: 210, o: 0.17, c: "#34D399", chars: ["1", "0", "0", "1", "7", "{", "D", "5", "}", "0", "9", "2"] },
  { x: 1006, top: 108, o: 0.3, c: "#7DD3FC", chars: ["9", "F", "0", "{", "1", "E", "}", "3", "8", "A", ">", "2", "7", "D", ";", "5"] },
  { x: 1082, top: 56, o: 0.24, c: "#8B5CF6", chars: ["<", "/", "0", "1", "{", "3", "F", "9", "0", "A", "}", ";"] },
  { x: 1148, top: 150, o: 0.22, c: "#00D9FF", chars: ["F", "3", "9", "1", "0", "C", "7", ";", "E", "0"] },
  { x: 962, top: 424, o: 0.2, c: "#34D399", chars: ["6", "3", "A", "F", ";", "9", "0", "1", "D", "4"] },
];

/* mini terminal ฝั่งขวา — สไตล์เดียวกับการ์ด terminal ใน About */
const TERM: Array<{ c: string; dot?: boolean; text: string }> = [
  { c: "#64748B", text: "> whoami" },
  { c: "#7DD3FC", text: "nattapon.phliwan" },
  { c: "#64748B", text: "> stack --list" },
  { c: "#6EE7B9", text: '["next","react","ts","gsap"]' },
  { c: "#64748B", text: "> npm run build" },
  { c: "#34D399", dot: true, text: "live — coding now" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#05070D",
          position: "relative",
          overflow: "hidden",
          color: "#F5F9FF",
        }}
      >
        {/* ─ พื้นหลัง: ตารางจุด + แสง aurora สองก้อน (เหมือน Backdrop บนเว็บ) ─ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(rgba(0,217,255,0.13) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -230,
            left: -150,
            width: 700,
            height: 700,
            display: "flex",
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(0,217,255,0.16) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            right: -170,
            width: 720,
            height: 720,
            display: "flex",
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          }}
        />

        {/* ─ ฝนโค้ดจางๆ ไหลหลังชื่อ + ริมขอบขวา (จะโดน overflow ตัดเหมือน rain จริง) ─ */}
        {RAIN.map((col, i) => (
          <div
            key={`rain-${i}`}
            style={{
              position: "absolute",
              top: col.top,
              left: col.x,
              display: "flex",
              flexDirection: "column",
              opacity: col.o,
            }}
          >
            {col.chars.map((ch, j) => (
              <span key={j} style={{ color: col.c, fontSize: 20, lineHeight: 1.35, textAlign: "center" }}>
                {ch}
              </span>
            ))}
          </div>
        ))}

        {/* ─ mini terminal ฝั่งขวา (เบลอความโปร่งให้ฝนโค้ดส่องทะลุ) ─ */}
        <div
          style={{
            position: "absolute",
            top: 172,
            right: 64,
            width: 380,
            display: "flex",
            flexDirection: "column",
            padding: "16px 20px",
            border: "1px solid rgba(0,217,255,0.22)",
            borderRadius: 14,
            backgroundColor: "rgba(13,20,35,0.78)",
          }}
        >
          {TERM.map((line, i) => (
            <div key={`term-${i}`} style={{ display: "flex", alignItems: "center", height: 28 }}>
              {line.dot && (
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    backgroundColor: line.c,
                    marginRight: 9,
                    display: "flex",
                  }}
                />
              )}
              <span style={{ color: line.c, fontSize: 19, lineHeight: 1.2, marginLeft: line.dot ? 0 : 0 }}>
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* ─ แถวบน: chip แบรนด์ + github ─ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "44px 64px 0",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              border: "1px solid rgba(0,217,255,0.4)",
              borderRadius: 999,
              backgroundColor: "rgba(0,217,255,0.07)",
            }}
          >
            <span style={{ color: "#00D9FF", fontSize: 25, lineHeight: 1.2 }}>{"</>"}</span>
            <span style={{ color: "#F5F9FF", fontSize: 25, letterSpacing: 2, marginLeft: 12, lineHeight: 1.2 }}>NCode</span>
          </div>
          <span style={{ color: "rgba(125,211,252,0.9)", fontSize: 24, letterSpacing: 1, lineHeight: 1.2 }}>
            github.com/Nattapon2005
          </span>
        </div>

        {/* ─ กลาง: kicker + ชื่อ (ทับฝนโค้ดด้วยความทึบเต็ม) + เส้นแสง + โค้ดสัญลักษณ์ ─ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
            padding: "0 64px",
          }}
        >
          <span
            style={{
              color: "#7DD3FC",
              fontSize: 25,
              letterSpacing: 5,
              lineHeight: 1.2,
            }}
          >
            FULL STACK WEB DEVELOPER · BANGKOK, THAILAND
          </span>
          <span style={{ color: "#F5F9FF", fontSize: 122, letterSpacing: 6, lineHeight: 1.06, marginTop: 10 }}>
            NATTAPON
          </span>
          <span style={{ color: "#00D9FF", fontSize: 122, letterSpacing: 6, lineHeight: 1.06 }}>PHLIWAN</span>
          <div
            style={{
              width: 240,
              height: 6,
              borderRadius: 3,
              marginTop: 18,
              background: "linear-gradient(90deg, #00D9FF, #8B5CF6)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              padding: "16px 26px",
              marginTop: 20,
              border: "1px solid rgba(0,217,255,0.28)",
              borderRadius: 14,
              backgroundColor: "rgba(13,20,35,0.9)",
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ color: "#7DD3FC", fontSize: 29, lineHeight: 1.2 }}>const</span>
              <span style={{ color: "#F5F9FF", fontSize: 29, lineHeight: 1.2, marginLeft: 10 }}>dev</span>
              <span style={{ color: "#64748B", fontSize: 29, lineHeight: 1.2, marginLeft: 9 }}>=</span>
              <span style={{ color: "#6EE7B9", fontSize: 29, lineHeight: 1.2, marginLeft: 9 }}>{'"Nattapon Phliwan"'}</span>
            </div>
          </div>
        </div>

        {/* ─ แถวล่าง: เทคโลจี + สถานะพร้อมรับงาน ─ */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 64px 44px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                border: "1px solid rgba(0,217,255,0.18)",
                borderRadius: 10,
                backgroundColor: "rgba(13,20,35,0.7)",
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: "#00D9FF", display: "flex" }} />
              <span style={{ color: "#BAE6FD", fontSize: 22, lineHeight: 1.2, marginLeft: 10 }}>~/ncode/profile.ts</span>
              <span style={{ color: "#34D399", fontSize: 20, letterSpacing: 2, lineHeight: 1.2, marginLeft: 18 }}>READY</span>
              <span style={{ width: 4, height: 16, borderRadius: 1, backgroundColor: "#34D399", marginLeft: 8, display: "flex" }} />
            </div>
            <span style={{ color: "rgba(125,211,252,0.85)", fontSize: 23, letterSpacing: 1, lineHeight: 1.4, marginTop: 8 }}>
              nattaponphli@gmail.com
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: "#34D399", display: "flex" }} />
            <span style={{ color: "#34D399", fontSize: 23, letterSpacing: 3, lineHeight: 1.2, marginLeft: 10 }}>
              OPEN TO WORK
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
