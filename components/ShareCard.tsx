"use client";

import { DiagnosisResult } from "@/lib/diagnosis";

interface Props {
  result: DiagnosisResult;
  times: number[];
}

export default function ShareCard({ result, times }: Props) {
  const shareText = `⚡ 瞬感タップで反応速度を計測！
平均 ${result.avgMs}ms（上位${100 - result.percentile}%）
ランク: ${result.rank} ${result.emoji} ${result.type}
${result.aiComment}
#瞬感タップ #反射神経
あなたも試す→ https://shunkan-tap.vercel.app`;

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  const best = Math.min(...times);
  const worst = Math.max(...times);

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Result card */}
      <div className="rounded-2xl p-6 mb-4"
        style={{
          background: "linear-gradient(160deg, #0f1a2e, #1a0a2e)",
          border: "1px solid rgba(110,231,247,0.3)",
          boxShadow: "0 0 40px rgba(110,231,247,0.15)",
        }}>
        <div className="text-center mb-4">
          <div className="text-5xl mb-2">{result.emoji}</div>
          <div className="text-3xl font-black mb-1" style={{ color: "#6ee7f7" }}>
            {result.avgMs}ms
          </div>
          <div className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-2"
            style={{ background: "rgba(110,231,247,0.2)", color: "#6ee7f7" }}>
            ランク {result.rank}
          </div>
          <div className="text-lg font-bold text-white mb-1">{result.type}</div>
          <div className="text-sm text-blue-300">上位 {100 - result.percentile}% 🎯</div>
        </div>

        {/* AI comment */}
        <div className="rounded-xl p-3 mb-4 text-center text-sm text-blue-100"
          style={{ background: "rgba(110,231,247,0.08)", border: "1px solid rgba(110,231,247,0.15)" }}>
          {result.aiComment}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {[
            ["ベスト", `${best}ms`],
            ["平均", `${result.avgMs}ms`],
            ["ワースト", `${worst}ms`],
          ].map(([label, val]) => (
            <div key={label} className="rounded-lg p-2"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-blue-400">{label}</div>
              <div className="font-bold text-white mt-0.5">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <a href={shareUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black text-base transition-all active:scale-95"
          style={{ background: "#000", color: "#fff", border: "1px solid #333" }}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xでシェア
        </a>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 rounded-xl font-bold text-base transition-all active:scale-95"
          style={{ background: "rgba(110,231,247,0.15)", color: "#6ee7f7", border: "1px solid rgba(110,231,247,0.3)" }}>
          もう一度測る ⚡
        </button>
      </div>
    </div>
  );
}
