import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ challenge?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const challengeMs = params?.challenge ? parseInt(params.challenge, 10) : null;

  if (challengeMs && !isNaN(challengeMs)) {
    const ogUrl = `https://shunkan-tap.vercel.app/api/og?ms=${challengeMs}&challenge=true`;
    return {
      title: `⚔️ ${challengeMs}msに挑戦！ | 瞬感タップ`,
      description: `友達の反応速度${challengeMs}msに挑戦！あなたはもっと速くタップできる？`,
      openGraph: {
        title: `⚔️ ${challengeMs}msに挑戦！ | 瞬感タップ`,
        description: `友達の反応速度${challengeMs}msに挑戦！あなたはもっと速くタップできる？`,
        images: [{ url: ogUrl, width: 1200, height: 630 }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `⚔️ ${challengeMs}msに挑戦！ | 瞬感タップ`,
        description: `友達の反応速度${challengeMs}msに挑戦！`,
        images: [ogUrl],
      },
    };
  }

  return {
    title: "⚡ 瞬感タップ | 反射神経を測れ",
    description: "画面が光った瞬間にタップ！あなたの反応速度をミリ秒単位で計測してAIが診断。",
  };
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
