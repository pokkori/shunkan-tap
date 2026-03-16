import Link from "next/link";

const STATS = [
  { label: "平均反応速度", value: "250ms", sub: "一般成人の平均" },
  { label: "トップ層", value: "150ms", sub: "上位1%の壁" },
  { label: "計測回数", value: "10回", sub: "ブレを除去した精密計測" },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #0a0a1a 0%, #0f1a2e 60%, #0a0a1a 100%)" }}>

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-8xl mb-4" style={{ filter: "drop-shadow(0 0 24px #6ee7f7)" }}>⚡</div>
        <h1 className="text-4xl sm:text-5xl font-black mb-3"
          style={{ color: "#6ee7f7", textShadow: "0 0 20px rgba(110,231,247,0.5)" }}>
          瞬感タップ
        </h1>
        <p className="text-lg text-blue-200 mb-1 font-bold">
          光った瞬間にタップせよ
        </p>
        <p className="text-sm text-blue-400">
          あなたの反射神経をミリ秒単位で計測・AIが診断
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-10">
        {STATS.map((s) => (
          <div key={s.label}
            className="rounded-xl p-3 text-center"
            style={{ background: "rgba(110,231,247,0.08)", border: "1px solid rgba(110,231,247,0.2)" }}>
            <div className="text-xl font-black" style={{ color: "#6ee7f7" }}>{s.value}</div>
            <div className="text-xs text-blue-300 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/game"
        className="inline-block px-14 py-4 rounded-2xl text-xl font-black transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #6ee7f7, #3b82f6)",
          color: "#000",
          boxShadow: "0 0 30px rgba(110,231,247,0.4)",
        }}>
        計測スタート ⚡
      </Link>

      {/* How to play */}
      <div className="mt-10 w-full max-w-sm space-y-3">
        <h2 className="text-center font-bold text-blue-300 mb-4">遊び方</h2>
        {[
          { icon: "👁️", title: "画面を凝視", desc: "いつ光るかわからない…" },
          { icon: "⚡", title: "光ったら即タップ！", desc: "0.001秒の差が勝負を決める" },
          { icon: "🤖", title: "AIが反射神経を診断", desc: "10回の平均でタイプ診断" },
          { icon: "📤", title: "Xでシェア", desc: "友達と反応速度を競おう" },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 items-center p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="font-bold text-blue-200 text-sm">{item.title}</div>
              <div className="text-xs text-blue-400">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
