"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const STATS = [
  { value: "250ms", sub: "一般成人の平均" },
  { value: "150ms", sub: "上位1%の壁" },
  { value: "10回", sub: "精密計測回数" },
];

const HOW_TO = [
  { icon: "👁️", title: "画面を凝視", desc: "いつ光るかわからない…" },
  { icon: "⚡", title: "光ったら即タップ！", desc: "0.001秒の差が勝負を決める" },
  { icon: "🤖", title: "AIが反射神経を診断", desc: "10回の平均でタイプ診断" },
  { icon: "📤", title: "Xでシェア", desc: "友達と反応速度を競おう" },
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
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050510 0%, #0a0f2e 60%, #050510 100%)" }}
    >
      {/* Hero */}
      <div className="text-center mb-10">
        <Image src="/images/hero.png" alt="瞬感タップ" width={400} height={225} className="mx-auto rounded-2xl mb-5" style={{ filter: "drop-shadow(0 0 32px #facc15)" }} priority />
        <h1
          className="text-5xl sm:text-6xl font-black mb-3 tracking-tight"
          style={{ color: "#fff", textShadow: "0 0 40px rgba(250,204,21,0.6)" }}
        >
          瞬感タップ
        </h1>
        <p className="text-base text-yellow-300 font-bold mb-1">
          光った瞬間にタップせよ
        </p>
        <p className="text-sm text-slate-400">
          あなたの反射神経をミリ秒単位で計測・AIが診断
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-10">
        {STATS.map((s) => (
          <div
            key={s.sub}
            className="rounded-2xl p-3 text-center"
            style={{
              background: "rgba(250,204,21,0.08)",
              border: "1px solid rgba(250,204,21,0.25)",
            }}
          >
            <div className="text-2xl font-black" style={{ color: "#facc15" }}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {streak > 1 && <div className="text-center text-sm text-orange-400 mb-4">🔥 {streak}日連続プレイ中!</div>}

      {/* CTA */}
      <Link
        href="/game"
        className="inline-flex items-center gap-2 px-12 py-5 rounded-2xl text-xl font-black transition-all active:scale-95 min-h-[44px]"
        aria-label="瞬感タップ反射神経計測を開始する"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          color: "#fff",
          boxShadow: "0 0 40px rgba(245,158,11,0.5), 0 4px 20px rgba(0,0,0,0.4)",
          textShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        計測スタート
      </Link>
      <p className="text-xs text-slate-500 mt-3">登録不要・無料で計測</p>

      {/* How to play */}
      <div className="mt-10 w-full max-w-sm space-y-3">
        <h2 className="text-center font-bold text-slate-300 mb-4 text-sm tracking-widest uppercase">
          遊び方
        </h2>
        {HOW_TO.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 items-center p-4 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span className="text-2xl w-8 shrink-0 text-center">{item.icon}</span>
            <div>
              <div className="font-bold text-white text-sm">{item.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-10 text-center text-xs text-slate-600 pb-6">
        <p>© 2026 ポッコリラボ</p>
        <p className="mt-1">
          <a href="https://twitter.com/levona_design" className="underline hover:text-slate-500" aria-label="Xでお問い合わせ（@levona_design）">お問い合わせ: X @levona_design</a>
        </p>
        <div className="mt-2 space-x-4">
          <a href="/privacy" className="underline hover:text-slate-500" aria-label="プライバシーポリシーを見る">プライバシーポリシー</a>
          <a href="/legal" className="underline hover:text-slate-500" aria-label="特定商取引法に基づく表記を見る">特商法表記</a>
        </div>
      </footer>
    </div>
  );
}
