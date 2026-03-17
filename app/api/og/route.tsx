import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getRankInfo(avgMs: number): { rank: string; emoji: string; type: string } {
  if (avgMs < 170) return { rank: "S+", emoji: "🏆", type: "超人型アスリート" };
  if (avgMs < 200) return { rank: "S", emoji: "🎮", type: "プロゲーマー型" };
  if (avgMs < 230) return { rank: "A", emoji: "🦅", type: "鋭敏な野生型" };
  if (avgMs < 260) return { rank: "B", emoji: "⚖️", type: "バランス感覚型" };
  if (avgMs < 300) return { rank: "C", emoji: "🐢", type: "じっくり慎重型" };
  return { rank: "D", emoji: "🌸", type: "マイペース自由型" };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ms = searchParams.get("ms");
  const challenge = searchParams.get("challenge");

  if (!ms) {
    // Default static OGP
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
          <div style={{ fontSize: 120, marginBottom: 20 }}>⚡</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#fff", marginBottom: 12 }}>
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
      { width: 1200, height: 630 }
    );
  }

  const avgMs = parseInt(ms, 10);
  const info = getRankInfo(avgMs);
  const isChallenge = challenge === "true";

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
        <div style={{ fontSize: 80, marginBottom: 10 }}>{info.emoji}</div>
        <div style={{ fontSize: 36, color: "#94a3b8", fontWeight: 700, marginBottom: 8 }}>
          反応速度
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, color: "#6ee7f7", marginBottom: 8 }}>
          {avgMs}ms
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              padding: "8px 24px",
              borderRadius: 9999,
              background: "rgba(110,231,247,0.2)",
              color: "#6ee7f7",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ランク {info.rank}
          </div>
          <div style={{ fontSize: 28, color: "#fff", fontWeight: 700 }}>{info.type}</div>
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: isChallenge ? "#f59e0b" : "#fcd34d",
            marginTop: 8,
          }}
        >
          {isChallenge ? "⚔️ この記録に挑戦できるか？" : "⚡ 瞬感タップ"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
