"use client";
import React from "react";

export type TapPose = "idle" | "ready" | "fast" | "miss";

interface Props {
  pose: TapPose;
  size?: number;
}

export default function TapMascot({ pose, size = 80 }: Props) {
  const isMiss  = pose === "miss";
  const isFast  = pose === "fast";
  const isReady = pose === "ready";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isFast
          ? "drop-shadow(0 0 20px rgba(234,179,8,1.0))"
          : isMiss
          ? "drop-shadow(0 0 8px rgba(239,68,68,0.8))"
          : isReady
          ? "drop-shadow(0 0 14px rgba(249,115,22,0.8))"
          : "drop-shadow(0 0 10px rgba(234,179,8,0.5))",
        animation: pose === "idle" ? "boltIdle 2.5s ease-in-out infinite" : undefined,
        transform: isMiss ? "rotate(25deg)" : undefined,
        transition: "transform 0.2s",
      }}
      aria-label={`ピカくん - ${pose}`}
      role="img"
    >
      <style>{`
        @keyframes boltIdle {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-5px) scale(1.04); }
        }
        @keyframes boltAura {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.9; }
        }
      `}</style>

      {/* スピードオーラ (fast時) */}
      {isFast && (
        <>
          <ellipse cx="50" cy="50" rx="46" ry="46" fill="rgba(234,179,8,0.12)"
            style={{ animation: "boltAura 0.3s ease-in-out infinite" }} />
          <path d="M8 35 L22 50 L8 65" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
          <path d="M92 35 L78 50 L92 65" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
        </>
      )}

      {/* 稲妻型ボディ */}
      <path
        d="M55 8 L35 48 L50 48 L38 92 L72 42 L54 42 L68 8 Z"
        fill={isMiss ? "#6b7280" : isFast ? "#fde047" : isReady ? "#fb923c" : "#fbbf24"}
        stroke={isMiss ? "#4b5563" : "#92400e"}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 内側ハイライト */}
      <path
        d="M57 14 L42 46 L53 46 L44 80 L64 44 L52 44 L63 14 Z"
        fill="rgba(255,255,255,0.25)"
      />

      {/* 目 */}
      {!isMiss ? (
        <>
          <circle cx="46" cy="35" r={isFast ? 5 : 4} fill="#1c1917" />
          <circle cx="60" cy="35" r={isFast ? 5 : 4} fill="#1c1917" />
          <circle cx="47.5" cy="33.5" r="1.5" fill="white" />
          <circle cx="61.5" cy="33.5" r="1.5" fill="white" />
        </>
      ) : (
        /* ミス時: ×目 */
        <>
          <line x1="43" y1="32" x2="49" y2="38" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="49" y1="32" x2="43" y2="38" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="57" y1="32" x2="63" y2="38" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="63" y1="32" x2="57" y2="38" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* ready時: 汗マーク */}
      {isReady && (
        <ellipse cx="30" cy="28" rx="4" ry="6" fill="#bfdbfe" opacity="0.8" transform="rotate(-15 30 28)" />
      )}

      {/* fast時: 火花 */}
      {isFast && (
        <>
          <circle cx="20" cy="25" r="3" fill="#fde047" opacity="0.9" />
          <circle cx="80" cy="30" r="2.5" fill="#fde047" opacity="0.8" />
          <circle cx="18" cy="70" r="2" fill="#fb923c" opacity="0.7" />
        </>
      )}
    </svg>
  );
}
