import { useRef, useCallback } from "react";

export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback((freq: number, type: OscillatorType, dur: number, vol = 0.3, delay = 0) => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch { /* silent fail */ }
  }, [getCtx]);

  // 光った瞬間の「ビッ」
  const playFlash = useCallback(() => {
    tone(1200, "triangle", 0.05, 0.5);
    tone(900, "triangle", 0.08, 0.3, 0.04);
  }, [tone]);

  // タップ成功音（速さによって音が変わる）
  const playTap = useCallback((ms: number) => {
    if (ms < 200) {
      // 超高速 — 上昇チャイム
      tone(660, "sine", 0.12, 0.4);
      tone(880, "sine", 0.1, 0.35, 0.1);
      tone(1100, "sine", 0.08, 0.25, 0.18);
    } else if (ms < 300) {
      // Good
      tone(550, "sine", 0.15, 0.35);
      tone(770, "sine", 0.1, 0.2, 0.1);
    } else {
      // 普通
      tone(440, "triangle", 0.15, 0.3);
    }
  }, [tone]);

  // フライング — ブザー
  const playFoul = useCallback(() => {
    tone(150, "sawtooth", 0.2, 0.4);
    tone(100, "sawtooth", 0.3, 0.3, 0.1);
  }, [tone]);

  // 診断完了 — ファンファーレ
  const playVictory = useCallback(() => {
    const seq = [523, 659, 784, 1047];
    seq.forEach((f, i) => tone(f, "triangle", 0.3, 0.4, i * 0.13));
  }, [tone]);

  return { playFlash, playTap, playFoul, playVictory };
}
