export interface DiagnosisResult {
  avgMs: number;
  rank: string;
  percentile: number;
  type: string;
  emoji: string;
  aiComment: string;
}

export function calcPercentile(avgMs: number): number {
  // 反応速度の分布（正規分布近似）
  // 平均250ms, 標準偏差50ms
  if (avgMs < 150) return 99;
  if (avgMs < 175) return 97;
  if (avgMs < 200) return 90;
  if (avgMs < 220) return 80;
  if (avgMs < 240) return 70;
  if (avgMs < 260) return 50;
  if (avgMs < 280) return 35;
  if (avgMs < 310) return 20;
  if (avgMs < 350) return 10;
  if (avgMs < 400) return 5;
  return 2;
}

export function getLocalDiagnosis(avgMs: number): { rank: string; type: string; emoji: string } {
  if (avgMs < 170) return { rank: "S+", type: "超人型アスリート", emoji: "" };
  if (avgMs < 200) return { rank: "S", type: "プロゲーマー型", emoji: "" };
  if (avgMs < 230) return { rank: "A", type: "鋭敏な野生型", emoji: "" };
  if (avgMs < 260) return { rank: "B", type: "バランス感覚型", emoji: "️" };
  if (avgMs < 300) return { rank: "C", type: "じっくり慎重型", emoji: "" };
  return { rank: "D", type: "マイペース自由型", emoji: "" };
}
