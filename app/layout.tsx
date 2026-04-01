import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import OrbBackground from "@/components/OrbBackground";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

const SITE_URL = "https://shunkan-tap.vercel.app";
const TITLE = "瞬感タップ | 反射神経を測れ！反応速度ゲーム";
const DESC = "画面が光った瞬間にタップ！あなたの反応速度をミリ秒単位で計測してAIが診断。平均反応速度は250ms。あなたは何ms？友達と競おう。無料・登録不要。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  keywords: ["反応速度", "反射神経", "反応速度テスト", "タップゲーム", "ブラウザゲーム", "無料ゲーム", "瞬間タップ", "ms 反応速度", "反射神経 測定"],
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    url: SITE_URL,
    siteName: "瞬感タップ",
    locale: "ja_JP",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "瞬感タップ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og.png`],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  other: { "theme-color": "#0f1a0f" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "VideoGame",
      "name": "瞬感タップ",
      "description": DESC,
      "applicationCategory": "GameApplication",
      "operatingSystem": "Web",
      "url": SITE_URL,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
      "genre": "Reaction Game",
      "publisher": { "@type": "Organization", "name": "ポッコリラボ" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "瞬感タップはどうやって遊ぶの？",
          "acceptedAnswer": { "@type": "Answer", "text": "スタートを押して待機。画面が光った瞬間にタップするだけ。反応時間をミリ秒単位で計測します。5回の平均値でAIが診断を行います。スマホ・PCどちらでも無料で遊べます。" }
        },
        {
          "@type": "Question",
          "name": "平均的な反応速度は何ミリ秒ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的な成人の平均反応速度は200〜250msといわれています。スポーツ選手は150ms前後、ゲーマーは170ms前後が多いです。瞬感タップであなたの反応速度を測定してみましょう。" }
        },
        {
          "@type": "Question",
          "name": "スコアはSNSでシェアできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。測定結果のスコアカードをXでシェアできます。友達と反応速度を競い合いましょう。シェアボタンから画像付き投稿が可能です。" }
        },
        {
          "@type": "Question",
          "name": "練習で反応速度は向上しますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。毎日練習することで反応速度の向上が期待できます。瞬感タップで継続的にトレーニングしましょう。ゲームやスポーツのパフォーマンス向上にもつながります。" }
        },
        {
          "@type": "Question",
          "name": "ランキングや記録の保存はできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "自己ベストはブラウザのローカルストレージに自動保存されます。毎回プレイするたびに記録更新を目指せます。デイリーランキング機能も実装予定です。" }
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${notoSansJP.className} text-slate-100 antialiased`}>
        <OrbBackground />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
