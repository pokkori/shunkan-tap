"use client";
import React from "react";

// 稲妻テーマ: 黄・橙・赤・白の閃光オーブ
const orbs = [
  { size: 320, left: 10, top: 5,  color: "rgba(234,179,8,0.14)",   duration: 8,  delay: 0,   blur: 85  },
  { size: 260, left: 80, top: 10, color: "rgba(249,115,22,0.10)",  duration: 11, delay: 1.5, blur: 70  },
  { size: 300, left: 42, top: 58, color: "rgba(239,68,68,0.10)",   duration: 9,  delay: 0.8, blur: 90  },
  { size: 200, left: 85, top: 58, color: "rgba(234,179,8,0.12)",   duration: 7,  delay: 2.2, blur: 60  },
  { size: 360, left: 5,  top: 72, color: "rgba(249,115,22,0.08)",  duration: 12, delay: 0.3, blur: 100 },
  { size: 180, left: 55, top: 20, color: "rgba(241,245,249,0.07)", duration: 6,  delay: 1.0, blur: 65  },
  { size: 280, left: 30, top: 40, color: "rgba(239,68,68,0.08)",   duration: 10, delay: 3.0, blur: 80  },
  { size: 220, left: 65, top: 82, color: "rgba(234,179,8,0.10)",   duration: 8,  delay: 0.6, blur: 75  },
];

const OrbBackground = React.memo(function OrbBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes boltOrbFloat {
          0%   { transform: translate(0, 0) scale(1);       opacity: 0.5; }
          20%  { transform: translate(16px, -22px) scale(1.07); opacity: 0.88; }
          50%  { transform: translate(-10px, -38px) scale(0.95); opacity: 0.65; }
          75%  { transform: translate(22px, -14px) scale(1.04); opacity: 0.80; }
          100% { transform: translate(0, 0) scale(1);       opacity: 0.5; }
        }
      `}</style>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            animation: `boltOrbFloat ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            willChange: "transform, opacity",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
});

export default OrbBackground;
