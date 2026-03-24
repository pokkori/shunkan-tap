import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { avgMs, times, rank, type } = await req.json();

    const prompt = `あなたは「瞬感タップ」というゲームのAI診断士です。
ユーザーの反応速度計測結果を元に、面白く前向きな診断コメントを日本語50文字以内で生成してください。

結果データ:
- 平均反応速度: ${avgMs}ms
- 計測10回のタイム: ${times.join(", ")}ms
- ランク: ${rank}
- タイプ: ${type}

「あなたはです！」のような断言系で、ポジティブに、絵文字1〜2個を使って。
50文字以内で。`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    const comment = content.type === "text" ? content.text.trim() : "反射神経は鋭いです！";

    return NextResponse.json({ comment });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ comment: "素晴らしい反射神経です！" });
  }
}
