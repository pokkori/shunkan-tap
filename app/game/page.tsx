"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShareCard from "@/components/ShareCard";
import { calcPercentile, getLocalDiagnosis, DiagnosisResult } from "@/lib/diagnosis";
import { useGameSounds } from "@/hooks/useGameSounds";
import { updateStreak, loadStreak, getStreakMilestoneMessage, type StreakData } from "@/lib/streak";

type Phase = "ready" | "waiting" | "flash" | "result" | "done";

const TOTAL_ROUNDS = 10;
const FLASH_COLORS = ["#00ff88", "#6ee7f7", "#f59e0b", "#f472b6", "#a78bfa"];

function GameInner() {
  const searchParams = useSearchParams();
  const challengeMs = searchParams.get("challenge")
    ? parseInt(searchParams.get("challenge")!, 10)
    : null;

  const [phase, setPhase] = useState<Phase>("ready");
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [currentMs, setCurrentMs] = useState<number | null>(null);
  const [isFoul, setIsFoul] = useState(false);
  const [flashColor, setFlashColor] = useState(FLASH_COLORS[0]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [bestAvg, setBestAvg] = useState<number | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const flashStartRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playFlash, playTap, playFoul, playVictory } = useGameSounds();

  useEffect(() => {
    const b = localStorage.getItem("shunkan_best_avg");
    if (b) setBestAvg(parseInt(b));
    setStreakData(loadStreak("shunkan_tap"));
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const vibrate = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
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
      vibrate(50);
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
      vibrate([100, 50, 100]);
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
    vibrate([100, 50, 100]);
    const updatedStreak = updateStreak("shunkan_tap");
    setStreakData(updatedStreak);
    const valid = allTimes.filter(t => t < 1500);
    const avg = valid.length > 0
      ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length)
      : 500;
    const prev = parseInt(localStorage.getItem("shunkan_best_avg") ?? "9999");
    if (avg < prev) {
      localStorage.setItem("shunkan_best_avg", String(avg));
      setBestAvg(avg);
    }
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
          <ShareCard result={diagnosis} times={times} challengeMs={challengeMs} />
        ) : null}
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #0a0a1a, #0f1a2e)" }}>
        <a href="/" className="absolute top-4 left-4 text-blue-400 text-sm min-h-[44px] inline-flex items-center" aria-label="トップページに戻る">← トップ</a>
        <div className="text-6xl mb-4" style={{ filter: "drop-shadow(0 0 20px #6ee7f7)" }}>⚡</div>
        <h1 className="text-3xl font-black mb-2" style={{ color: "#6ee7f7" }}>瞬感タップ</h1>

        {challengeMs !== null && (
          <div className="rounded-2xl p-4 mb-4 text-center w-full max-w-xs"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.4)",
            }}>
            <div className="text-sm text-red-300 mb-1">友達からの挑戦状！</div>
            <div className="text-3xl font-black text-red-400">{challengeMs}ms</div>
            <div className="text-xs text-red-300 mt-1">この記録を超えろ！</div>
          </div>
        )}

        <p className="text-blue-300 mb-8 text-sm text-center">
          画面が光った瞬間にタップ！<br />10回計測してAIが診断
        </p>
        <p className="text-xs text-blue-500 mb-4 text-center">
          ※ フライングはペナルティ1000ms
        </p>
        {bestAvg !== null && (
          <p className="text-xs text-yellow-400 mb-3 text-center">
            🏆 ベスト: {bestAvg}ms
          </p>
        )}
        {streakData && streakData.count > 0 && (
          <div className="mb-6 px-4 py-2 rounded-xl text-center"
            style={{ background: "rgba(110,231,247,0.1)", border: "1px solid rgba(110,231,247,0.25)" }}>
            <p className="text-cyan-300 font-bold text-sm">{streakData.count}日連続プレイ中</p>
            {getStreakMilestoneMessage(streakData.count) && (
              <p className="text-yellow-400 text-xs mt-0.5">{getStreakMilestoneMessage(streakData.count)}</p>
            )}
          </div>
        )}
        <button
          onClick={startWaiting}
          className="px-14 py-4 rounded-2xl text-xl font-black transition-all active:scale-95 min-h-[44px]"
          aria-label={challengeMs !== null ? "友達の挑戦を受けて計測を開始する" : "反射神経計測を開始する"}
          style={{
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            color: "#fff",
            boxShadow: "0 0 30px rgba(245,158,11,0.5)",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}>
          {challengeMs !== null ? "挑戦を受ける ⚔️" : "計測スタート ⚡"}
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
            className="px-10 py-3 rounded-xl font-bold text-base transition-all active:scale-95 min-h-[44px]"
            aria-label={round + 1 >= TOTAL_ROUNDS ? "AI診断結果を見る" : "次の計測へ進む"}
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

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center"
        style={{ background: "#0a0a1a" }}>
        <div className="text-blue-300 animate-pulse">読み込み中...</div>
      </div>
    }>
      <GameInner />
    </Suspense>
  );
}
