"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ShareCard from "@/components/ShareCard";
import { calcPercentile, getLocalDiagnosis, DiagnosisResult } from "@/lib/diagnosis";
import { useGameSounds } from "@/hooks/useGameSounds";

type Phase = "ready" | "waiting" | "flash" | "result" | "done";

const TOTAL_ROUNDS = 10;
const FLASH_COLORS = ["#00ff88", "#6ee7f7", "#f59e0b", "#f472b6", "#a78bfa"];

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [currentMs, setCurrentMs] = useState<number | null>(null);
  const [isFoul, setIsFoul] = useState(false);
  const [flashColor, setFlashColor] = useState(FLASH_COLORS[0]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const flashStartRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playFlash, playTap, playFoul, playVictory } = useGameSounds();

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const startWaiting = useCallback(() => {
    setPhase("waiting");
    setIsFoul(false);
    setCurrentMs(null);
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      const color = FLASH_COLORS[Math.floor(Math.random() * FLASH_COLORS.length)];
      setFlashColor(color);
      flashStartRef.current = performance.now();
      playFlash();
      setPhase("flash");
      // 2秒後に自動で「遅すぎ」
      timeoutRef.current = setTimeout(() => {
        recordTime(2000);
      }, 2000);
    }, delay);
  }, []);

  const recordTime = useCallback((ms: number) => {
    clearTimer();
    setCurrentMs(ms);
    setPhase("result");
  }, []);

  const handleTap = useCallback(() => {
    if (phase === "waiting") {
      // フライング
      clearTimer();
      playFoul();
      setIsFoul(true);
      setCurrentMs(1000);
      setPhase("result");
    } else if (phase === "flash") {
      clearTimer();
      const ms = Math.round(performance.now() - flashStartRef.current);
      playTap(ms);
      recordTime(ms);
    }
  }, [phase, recordTime]);

  const handleNext = useCallback(() => {
    const ms = currentMs ?? 1000;
    const newTimes = [...times, ms];
    setTimes(newTimes);
    const newRound = round + 1;
    setRound(newRound);
    if (newRound >= TOTAL_ROUNDS) {
      finalize(newTimes);
    } else {
      startWaiting();
    }
  }, [currentMs, times, round, startWaiting]);

  const finalize = async (allTimes: number[]) => {
    setPhase("done");
    setIsLoading(true);
    playVictory();
    const valid = allTimes.filter(t => t < 1500);
    const avg = valid.length > 0
      ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
      : 500;
    const percentile = calcPercentile(avg);
    const local = getLocalDiagnosis(avg);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avgMs: avg, times: allTimes, rank: local.rank, type: local.type }),
      });
      const data = await res.json();
      setDiagnosis({ avgMs: avg, percentile, ...local, aiComment: data.comment });
    } catch {
      setDiagnosis({ avgMs: avg, percentile, ...local, aiComment: "素晴らしい反射神経です！⚡" });
    }
    setIsLoading(false);
  };

  useEffect(() => { return () => clearTimer(); }, []);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); handleTap(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTap]);

  const bgColor = phase === "flash" ? flashColor : phase === "waiting" ? "#0a0a1a" : "#0a0a1a";

  if (phase === "done") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(160deg, #0a0a1a, #0f1a2e)" }}>
        <h2 className="text-2xl font-black mb-6" style={{ color: "#6ee7f7" }}>
          ⚡ 計測完了！
        </h2>
        {isLoading ? (
          <div className="text-blue-300 animate-pulse text-lg">🤖 AIが診断中...</div>
        ) : diagnosis ? (
          <ShareCard result={diagnosis} times={times} />
        ) : null}
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #0a0a1a, #0f1a2e)" }}>
        <a href="/" className="absolute top-4 left-4 text-blue-400 text-sm">← トップ</a>
        <div className="text-6xl mb-4" style={{ filter: "drop-shadow(0 0 20px #6ee7f7)" }}>⚡</div>
        <h1 className="text-3xl font-black mb-2" style={{ color: "#6ee7f7" }}>瞬感タップ</h1>
        <p className="text-blue-300 mb-8 text-sm text-center">
          画面が光った瞬間にタップ！<br />10回計測してAIが診断
        </p>
        <p className="text-xs text-blue-500 mb-8 text-center">
          ※ フライングはペナルティ1000ms
        </p>
        <button
          onClick={startWaiting}
          className="px-14 py-4 rounded-2xl text-xl font-black transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #6ee7f7, #3b82f6)",
            color: "#000",
            boxShadow: "0 0 30px rgba(110,231,247,0.4)",
          }}>
          計測スタート ⚡
        </button>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4"
        style={{ background: "#0a0a1a" }}>
        <div className="text-center bounce-in">
          {isFoul ? (
            <>
              <div className="text-5xl mb-3">💥</div>
              <div className="text-2xl font-black text-red-400 mb-2">フライング！</div>
              <div className="text-blue-400 text-sm mb-6">光る前にタップしました</div>
              <div className="text-4xl font-black text-red-400 mb-1">1000ms</div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">⚡</div>
              <div className="text-5xl font-black mb-2"
                style={{ color: (currentMs ?? 999) < 200 ? "#00ff88" : (currentMs ?? 999) < 300 ? "#6ee7f7" : "#f59e0b" }}>
                {currentMs}ms
              </div>
              <div className="text-blue-300 text-sm mb-6">
                {(currentMs ?? 999) < 200 ? "⚡ 超高速！" : (currentMs ?? 999) < 260 ? "👍 Good!" : "がんばれ！"}
              </div>
            </>
          )}
          <div className="text-blue-500 text-xs mb-6">{round + 1} / {TOTAL_ROUNDS}回目</div>
          <button
            onClick={handleNext}
            className="px-10 py-3 rounded-xl font-bold text-base transition-all active:scale-95"
            style={{ background: "rgba(110,231,247,0.2)", color: "#6ee7f7", border: "1px solid rgba(110,231,247,0.3)" }}>
            {round + 1 >= TOTAL_ROUNDS ? "結果を見る 🤖" : "次へ →"}
          </button>
        </div>
      </div>
    );
  }

  // waiting / flash
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center select-none cursor-pointer"
      style={{
        background: bgColor,
        transition: phase === "flash" ? "background 0.05s" : "background 0.3s",
      }}
      onClick={handleTap}
      onTouchStart={(e) => { e.preventDefault(); handleTap(); }}
    >
      <div className="text-center pointer-events-none">
        {phase === "waiting" ? (
          <>
            <div className="text-6xl mb-4 opacity-50">👁️</div>
            <div className="text-xl font-bold text-blue-300 mb-2">準備して...</div>
            <div className="text-sm text-blue-500">{round + 1} / {TOTAL_ROUNDS}回目</div>
            <div className="mt-8 text-xs text-blue-700">光ったら即タップ！</div>
          </>
        ) : (
          <>
            <div className="text-7xl mb-4 flash-anim">⚡</div>
            <div className="text-3xl font-black text-black mb-2">今すぐタップ！</div>
            <div className="text-sm text-black opacity-60">{round + 1} / {TOTAL_ROUNDS}回目</div>
          </>
        )}
      </div>
    </div>
  );
}
