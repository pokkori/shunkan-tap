import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = " 瞬感タップ | 反射神経を測れ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #050510 0%, #0a0f2e 60%, #050510 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20, filter: "drop-shadow(0 0 40px #facc15)" }}></div>
        <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", marginBottom: 12, textShadow: "0 0 40px rgba(250,204,21,0.6)" }}>
          瞬感タップ
        </div>
        <div style={{ fontSize: 32, color: "#fcd34d", fontWeight: 700, marginBottom: 8 }}>
          光った瞬間にタップせよ
        </div>
        <div style={{ fontSize: 24, color: "#94a3b8" }}>
          あなたの反射神経をms単位で計測・AIが診断
        </div>
      </div>
    ),
    { ...size }
  );
}
