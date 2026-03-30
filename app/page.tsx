"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {[
        { size: 5, x: 10, y: 25, dur: 9, delay: 0, color: "rgba(250,204,21,0.30)" },
        { size: 7, x: 70, y: 10, dur: 13, delay: 1.5, color: "rgba(245,158,11,0.20)" },
        { size: 4, x: 40, y: 65, dur: 10, delay: 2.5, color: "rgba(250,204,21,0.25)" },
        { size: 6, x: 85, y: 50, dur: 11, delay: 3, color: "rgba(245,158,11,0.18)" },
        { size: 3, x: 20, y: 80, dur: 8, delay: 4, color: "rgba(250,204,21,0.22)" },
        { size: 5, x: 55, y: 30, dur: 14, delay: 5, color: "rgba(239,68,68,0.15)" },
        { size: 4, x: 90, y: 75, dur: 10, delay: 6, color: "rgba(250,204,21,0.20)" },
      ].map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animation: `floatP ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            filter: "blur(1px)",
          }}
        />
      ))}
      <style>{`
        @keyframes floatP {
          0% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { opacity: 1; }
          100% { transform: translateY(-25px) translateX(12px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/* SVG Lightning bolt icon */
function LightningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#facc15" filter="drop-shadow(0 0 6px rgba(250,204,21,0.6))" />
    </svg>
  );
}

/* SVG icons for how-to steps */
const StepIcons = [
  /* Crosshair/target */
  <svg key="s1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>,
  /* Zap */
  <svg key="s2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  /* Brain/AI */
  <svg key="s3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9.5 2a2.5 2.5 0 015 0v1M12 3v2m-4 2a3 3 0 016 0v1m-6 6h6m-3 0v4m-5 0h10"/><circle cx="12" cy="12" r="9"/></svg>,
  /* Share */
  <svg key="s4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
];

const STATS = [
  { value: "250ms", sub: "一般成人の平均" },
  { value: "150ms", sub: "上位1%の壁" },
  { value: "10回", sub: "精密計測回数" },
];

const HOW_TO = [
  { title: "画面を凝視", desc: "いつ光るかわからない..." },
  { title: "光ったら即タップ!", desc: "0.001秒の差が勝負を決める" },
  { title: "AIが反射神経を診断", desc: "10回の平均でタイプ診断" },
  { title: "Xでシェア", desc: "友達と反応速度を競おう" },
];

export default function HomePage() {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem('shunkan_streak') || '{"count":0,"last":""}');
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.last === today) setStreak(data.count);
    else if (data.last === yesterday) {
      const updated = { count: data.count + 1, last: today };
      localStorage.setItem('shunkan_streak', JSON.stringify(updated));
      setStreak(updated.count);
    } else {
      const updated = { count: 1, last: today };
      localStorage.setItem('shunkan_streak', JSON.stringify(updated));
      setStreak(1);
    }
  }, []);
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-12 relative"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(250,204,21,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(239,68,68,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.10) 0%, transparent 50%), #0F0F1A",
      }}
    >
      <FloatingParticles />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        {/* Hero */}
        <div
          className="text-center mb-10 p-6 w-full"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(250,204,21,0.15)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(250,204,21,0.08)",
          }}
        >
          <Image src="/images/hero.png" alt="瞬感タップ" width={400} height={225} className="mx-auto rounded-2xl mb-5" style={{ filter: "drop-shadow(0 0 32px rgba(250,204,21,0.3))" }} priority />
          <h1
            className="text-5xl sm:text-6xl font-black mb-3 tracking-tight"
            style={{
              background: "linear-gradient(135deg, #facc15 0%, #f59e0b 50%, #ef4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 20px rgba(250,204,21,0.3))",
            }}
          >
            瞬感タップ
          </h1>
          <p className="text-base text-yellow-300/90 font-bold mb-1">
            光った瞬間にタップせよ
          </p>
          <p className="text-sm text-slate-400">
            あなたの反射神経をミリ秒単位で計測・AIが診断
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 w-full mb-10">
          {STATS.map((s) => (
            <div
              key={s.sub}
              className="p-3 text-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(250,204,21,0.15)",
                borderRadius: "16px",
              }}
            >
              <div className="text-2xl font-black" style={{ color: "#facc15" }}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {streak > 1 && (
          <div
            className="text-center text-sm text-orange-300 mb-4 px-5 py-2 rounded-full font-bold"
            style={{
              background: "rgba(251,146,60,0.1)",
              border: "1px solid rgba(251,146,60,0.25)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="inline mr-1 -mt-0.5" aria-hidden="true">
              <path d="M8 1L10 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H6L8 1Z" fill="#fb923c" />
            </svg>
            {streak}日連続プレイ中!
          </div>
        )}

        {/* CTA */}
        <Link
          href="/game"
          className="inline-flex items-center gap-2 px-12 py-5 rounded-2xl text-xl font-black transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] min-h-[52px]"
          aria-label="瞬感タップ反射神経計測を開始する"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(245,158,11,0.4), 0 4px 20px rgba(0,0,0,0.3)",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          <LightningIcon />
          計測スタート
        </Link>
        <p className="text-xs text-slate-500 mt-3">登録不要・無料で計測</p>

        {/* How to play */}
        <div className="mt-10 w-full space-y-3">
          <h2 className="text-center font-bold text-slate-300 mb-4 text-sm tracking-widest uppercase">
            遊び方
          </h2>
          {HOW_TO.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-center p-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "16px",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(250,204,21,0.12)" }}>
                {StepIcons[i]}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer
          className="mt-10 text-center text-xs text-slate-500 pb-6 w-full px-4 py-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p>&copy; 2026 ポッコリラボ</p>
          <p className="mt-1">
            <a href="https://twitter.com/levona_design" className="underline hover:text-slate-300 transition-colors" aria-label="Xでお問い合わせ（@levona_design）">お問い合わせ: X @levona_design</a>
          </p>
          <div className="mt-2 space-x-4">
            <a href="/privacy" aria-label="プライバシーポリシーを見る" className="underline hover:text-slate-300 transition-colors">プライバシーポリシー</a>
            <a href="/legal" aria-label="特定商取引法に基づく表示" className="underline hover:text-slate-300 transition-colors">特商法表記</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
