"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { haptics } from "@/utils/haptics";
import { useSearchParams } from "next/navigation";
import ShareCard from "@/components/ShareCard";
import OrbBackground from "@/components/OrbBackground";
import TapMascot, { type TapPose } from "@/components/TapMascot";
import ScorePopup from "@/components/ScorePopup";
import { calcPercentile, getLocalDiagnosis, DiagnosisResult } from "@/lib/diagnosis";
import { useGameSounds } from "@/hooks/useGameSounds";
import { useTapBGM } from "@/hooks/useTapBGM";
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
  const [mascotPose, setMascotPose] = useState<TapPose>("idle");

  const [bestAvg, setBestAvg] = useState<number | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [scorePopups, setScorePopups] = useState<{ id: number; score: number; x: number; y: number }[]>([]);
  const popupIdRef = useRef(0);
  const flashStartRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playFlash, playTap, playFoul, playVictory } = useGameSounds();
  const { startBGM, stopBGM, playTapHit, playFoulSound, playCombo } = useTapBGM();

  useEffect(() => {
    const b = localStorage.getItem("shunkan_best_avg");
    if (b) setBestAvg(parseInt(b));
    setStreakData(loadStreak("shunkan_tap"));
  }, []);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const startWaiting = useCallback(() => {
    setPhase("waiting");
    setMascotPose("ready");
    setIsFoul(false);
    setCurrentMs(null);
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      const color = FLASH_COLORS[Math.floor(Math.random() * FLASH_COLORS.length)];
      setFlashColor(color);
      flashStartRef.current = performance.now();
      playFlash();
      navigator.vibrate?.(50);
      setPhase("flash");
      setMascotPose("fast");
      timeoutRef.current = setTimeout(() => {
        recordTime(2000);
      }, 2000);
    }, delay);
  }, []);

  const recordTime = useCallback((ms: number) => {
    clearTimer();
    setCurrentMs(ms);
    setPhase("result");
    setMascotPose("idle");
  }, []);

  const handleTap = useCallback(() => {
    if (phase === "waiting") {
      clearTimer();
      playFoul();
      playFoulSound();
      haptics.error();
      setIsFoul(true);
      setMascotPose("miss");
      setCurrentMs(1000);
      setPhase("result");
    } else if (phase === "flash") {
      clearTimer();
      haptics.tap();
      const ms = Math.round(performance.now() - flashStartRef.current);
      playTap(ms);
      playTapHit(ms);
      // ScorePopup: 速いほど高得点
      const pts = ms < 200 ? 300 : ms < 300 ? 200 : ms < 500 ? 100 : 50;
      const pid = popupIdRef.current++;
      const px = window.innerWidth / 2;
      const py = window.innerHeight / 2;
      setScorePopups(prev => [...prev, { id: pid, score: pts, x: px, y: py }]);
      recordTime(ms);
    }
  }, [phase, recordTime, playFoul, playFoulSound, playTap, playTapHit]);

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
    setMascotPose("fast");
    playVictory();
    playCombo();
    haptics.success();
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
      setDiagnosis({ avgMs: avg, percentile, ...local, aiComment: "素晴らしい反射神経です！" });
    }
    setIsLoading(false);
    stopBGM();
  };

  useEffect(() => {
    return () => {
      clearTimer();
      stopBGM();
    };
  }, [stopBGM]);

  // キーボード操作
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); handleTap(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTap]);

  const bgColor = phase === "flash" ? flashColor : "#0f0a00";

  if (phase === "done") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(160deg, #0f0a00, #1a1000, #0f0a00)" }}
      >
        <OrbBackground />
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <TapMascot pose={mascotPose} size={72} />
          </div>
          <h2
            className="text-2xl font-black mb-6"
            style={{ color: "#fbbf24", textShadow: "0 0 16px rgba(234,179,8,0.7)" }}
          >
            計測完了！
          </h2>
          {isLoading ? (
            <div className="text-yellow-300 animate-pulse text-lg">AIが診断中...</div>
          ) : diagnosis ? (
            <ShareCard result={diagnosis} times={times} challengeMs={challengeMs} />
          ) : null}
        </div>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #0f0a00, #1a1000, #0f0a00)" }}
      >
        <OrbBackground />
        <a
          href="/"
          className="absolute top-4 left-4 text-yellow-400 text-sm min-h-[44px] inline-flex items-center z-10"
          aria-label="トップページに戻る"
        >
          ← トップ
        </a>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4">
            <TapMascot pose="idle" size={80} />
          </div>
          <h1
            className="text-3xl font-black mb-2"
            style={{ color: "#fbbf24", textShadow: "0 0 20px rgba(234,179,8,0.8)" }}
          >
            瞬感タップ
          </h1>

          {challengeMs !== null && (
            <div
              className="rounded-2xl p-4 mb-4 text-center w-full max-w-xs"
              style={{
                background: "rgba(239,68,68,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(239,68,68,0.35)",
                boxShadow: "0 0 20px rgba(239,68,68,0.1)",
              }}
            >
              <div className="text-sm text-red-300 mb-1">友達からの挑戦状！</div>
              <div className="text-3xl font-black text-red-400">{challengeMs}ms</div>
              <div className="text-xs text-red-300 mt-1">この記録を超えろ！</div>
            </div>
          )}

          <p className="text-yellow-200 mb-8 text-sm text-center opacity-80">
            画面が光った瞬間にタップ！<br />10回計測してAIが診断
          </p>
          <p className="text-xs text-yellow-600 mb-4 text-center">
            ※ フライングはペナルティ1000ms
          </p>
          {bestAvg !== null && (
            <p className="text-xs text-yellow-400 mb-3 text-center">
              ベスト: {bestAvg}ms
            </p>
          )}
          {streakData && streakData.count > 0 && (
            <div
              className="glass-dark mb-6 px-4 py-2 rounded-xl text-center"
            >
              <p className="text-yellow-300 font-bold text-sm">{streakData.count}日連続プレイ中</p>
              {getStreakMilestoneMessage(streakData.count) && (
                <p className="text-yellow-400 text-xs mt-0.5">{getStreakMilestoneMessage(streakData.count)}</p>
              )}
            </div>
          )}
          <button
            onClick={() => { startBGM(); startWaiting(); }}
            className="px-14 py-4 rounded-2xl text-xl font-black transition-all active:scale-95 min-h-[44px]"
            aria-label={challengeMs !== null ? "友達の挑戦を受けて計測を開始する" : "反射神経計測を開始する"}
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              color: "#fff",
              boxShadow: "0 0 30px rgba(245,158,11,0.6)",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            {challengeMs !== null ? "挑戦を受ける" : "計測スタート"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div
        className="min-h-dvh flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg, #0f0a00, #1a1000)" }}
      >
        <OrbBackground />
        <div className="text-center bounce-in relative z-10">
          {isFoul ? (
            <>
              <div className="flex justify-center mb-3">
                <TapMascot pose="miss" size={64} />
              </div>
              <div className="text-2xl font-black text-red-400 mb-2">フライング！</div>
              <div className="text-yellow-400 text-sm mb-6">光る前にタップしました</div>
              <div
                className="text-4xl font-black text-red-400 mb-1"
                style={{ textShadow: "0 0 12px rgba(239,68,68,0.6)" }}
              >
                1000ms
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                <TapMascot pose={(currentMs ?? 999) < 250 ? "fast" : "idle"} size={64} />
              </div>
              <div
                className="text-5xl font-black mb-2"
                style={{
                  color: (currentMs ?? 999) < 200 ? "#00ff88" : (currentMs ?? 999) < 300 ? "#6ee7f7" : "#f59e0b",
                  textShadow: `0 0 16px ${(currentMs ?? 999) < 200 ? "rgba(0,255,136,0.6)" : "rgba(234,179,8,0.6)"}`,
                }}
              >
                {currentMs}ms
              </div>
              <div className="text-yellow-300 text-sm mb-6">
                {(currentMs ?? 999) < 200 ? "超高速！" : (currentMs ?? 999) < 260 ? "Good!" : "がんばれ！"}
              </div>
            </>
          )}
          <div className="text-yellow-600 text-xs mb-6">{round + 1} / {TOTAL_ROUNDS}回目</div>
          <button
            onClick={handleNext}
            className="px-10 py-3 rounded-xl font-bold text-base transition-all active:scale-95 min-h-[44px]"
            aria-label={round + 1 >= TOTAL_ROUNDS ? "AI診断結果を見る" : "次の計測へ進む"}
            style={{
              background: "rgba(234,179,8,0.15)",
              backdropFilter: "blur(8px)",
              color: "#fbbf24",
              border: "1px solid rgba(234,179,8,0.3)",
              boxShadow: "0 0 12px rgba(234,179,8,0.2)",
            }}
          >
            {round + 1 >= TOTAL_ROUNDS ? "結果を見る" : "次へ →"}
          </button>
        </div>
      </div>
    );
  }

  // waiting / flash
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center select-none cursor-pointer relative"
      style={{
        background: phase === "flash" ? bgColor : "linear-gradient(160deg, #0f0a00, #1a1000)",
        transition: phase === "flash" ? "background 0.05s" : "background 0.3s",
      }}
      onClick={handleTap}
      onTouchStart={(e) => { e.preventDefault(); handleTap(); }}
    >
      {phase === "waiting" && <OrbBackground />}
      {scorePopups.map(p => (
        <ScorePopup
          key={p.id}
          score={p.score}
          x={p.x}
          y={p.y}
          onDone={() => setScorePopups(prev => prev.filter(s => s.id !== p.id))}
        />
      ))}
      <div className="text-center pointer-events-none relative z-10">
        {phase === "waiting" ? (
          <>
            <div className="flex justify-center mb-4 opacity-80">
              <TapMascot pose="ready" size={72} />
            </div>
            <div
              className="text-xl font-bold mb-2"
              style={{ color: "#fbbf24" }}
            >
              準備して...
            </div>
            <div className="text-sm text-yellow-600">{round + 1} / {TOTAL_ROUNDS}回目</div>
            <div className="mt-8 text-xs text-yellow-800">光ったら即タップ！</div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <TapMascot pose="fast" size={88} />
            </div>
            <div
              className="text-3xl font-black mb-2"
              style={{ color: "#000", textShadow: "0 0 8px rgba(0,0,0,0.3)" }}
            >
              今すぐタップ！
            </div>
            <div className="text-sm opacity-60" style={{ color: "#000" }}>
              {round + 1} / {TOTAL_ROUNDS}回目
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0f0a00, #1a1000)" }}
      >
        <div className="text-yellow-300 animate-pulse">読み込み中...</div>
      </div>
    }>
      <GameInner />
    </Suspense>
  );
}
