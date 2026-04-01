import { useRef, useCallback } from "react";

/**
 * 瞬感タップ BGM / SE
 * Web Audio API で生成する高BPM(160)電子音BGM
 * 正解タップ音・ミス音・コンボ音も含む
 */
export function useTapBGM() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const isPlayingRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (ctx: AudioContext, dest: AudioNode, freq: number, type: OscillatorType, startTime: number, dur: number, vol: number) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(dest);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
        osc.start(startTime);
        osc.stop(startTime + dur + 0.05);
      } catch { /* silent */ }
    },
    []
  );

  // 1ビート分 (BPM160 = 0.375s/beat)
  const scheduleBeat = useCallback(
    (ctx: AudioContext, master: GainNode, beatTime: number, beat: number) => {
      const BPM = 160;
      const beatDur = 60 / BPM;

      // ハイハット（全ビート）
      playTone(ctx, master, 8000, "square", beatTime, 0.03, 0.06);

      // キック（1・3拍目）
      if (beat % 4 === 0 || beat % 4 === 2) {
        playTone(ctx, master, 60,  "sine",     beatTime, 0.15, 0.6);
        playTone(ctx, master, 90,  "sine",     beatTime, 0.10, 0.4);
      }

      // スネア（2・4拍目）
      if (beat % 4 === 1 || beat % 4 === 3) {
        playTone(ctx, master, 250, "sawtooth", beatTime, 0.07, 0.15);
        playTone(ctx, master, 180, "sawtooth", beatTime, 0.05, 0.10);
      }

      // 電子メロディ（8ビートサイクル）
      const melodyNotes = [440, 554, 659, 740, 880, 740, 659, 554];
      const note = melodyNotes[beat % 8];
      playTone(ctx, master, note, "square", beatTime, beatDur * 0.6, 0.08);

      // ベースライン（4ビートごと）
      if (beat % 2 === 0) {
        const bassNotes = [110, 138, 110, 123];
        const bassNote = bassNotes[(beat / 2) % 4];
        playTone(ctx, master, bassNote, "sawtooth", beatTime, beatDur * 1.8, 0.12);
      }
    },
    [playTone]
  );

  const startBGM = useCallback(() => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    beatCountRef.current = 0;

    const ctx = getCtx();
    const master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
    masterRef.current = master;

    const BPM = 160;
    const beatDur = 60 / BPM;
    const LOOKAHEAD = 0.2;
    let nextBeatTime = ctx.currentTime + 0.05;

    const scheduler = () => {
      while (nextBeatTime < ctx.currentTime + LOOKAHEAD) {
        scheduleBeat(ctx, master, nextBeatTime, beatCountRef.current);
        beatCountRef.current++;
        nextBeatTime += beatDur;
      }
      schedulerRef.current = window.setTimeout(scheduler, 80);
    };
    scheduler();
  }, [getCtx, scheduleBeat]);

  const stopBGM = useCallback(() => {
    isPlayingRef.current = false;
    if (schedulerRef.current !== null) {
      clearTimeout(schedulerRef.current);
      schedulerRef.current = null;
    }
    if (masterRef.current) {
      try {
        masterRef.current.gain.linearRampToValueAtTime(0, (ctxRef.current?.currentTime ?? 0) + 0.2);
      } catch { /* silent */ }
      masterRef.current = null;
    }
  }, []);

  // 正解タップ音
  const playTapHit = useCallback((ms: number) => {
    try {
      const ctx = getCtx();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      // 速いほど高音
      const freq = ms < 200 ? 1200 : ms < 300 ? 900 : 660;
      playTone(ctx, master, freq, "triangle", ctx.currentTime, 0.15, 0.6);
      if (ms < 250) {
        playTone(ctx, master, freq * 1.5, "triangle", ctx.currentTime + 0.05, 0.1, 0.4);
      }
    } catch { /* silent */ }
  }, [getCtx, playTone]);

  // ミス音（フライング）
  const playFoulSound = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      playTone(ctx, master, 200, "sawtooth", ctx.currentTime, 0.1,  0.5);
      playTone(ctx, master, 150, "sawtooth", ctx.currentTime + 0.08, 0.1, 0.4);
      playTone(ctx, master, 100, "sawtooth", ctx.currentTime + 0.16, 0.12, 0.3);
    } catch { /* silent */ }
  }, [getCtx, playTone]);

  // コンボ音（結果確定時）
  const playCombo = useCallback(() => {
    try {
      const ctx = getCtx();
      const master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
      [523, 659, 784, 1047].forEach((f, i) =>
        playTone(ctx, master, f, "triangle", ctx.currentTime + i * 0.08, 0.2, 0.45)
      );
    } catch { /* silent */ }
  }, [getCtx, playTone]);

  return { startBGM, stopBGM, playTapHit, playFoulSound, playCombo };
}
