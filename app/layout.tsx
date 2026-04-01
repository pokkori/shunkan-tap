import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
          "name": "このゲームは無料ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、完全無料で遊べます。アカウント登録も不要です。ブラウザを開くだけですぐに反応速度を測定できます。" }
        },
        {
          "@type": "Question",
          "name": "スマホで遊べますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、スマホ・タブレット・PCすべてに対応しています。iOS Safari・Android Chromeどちらでも正常に動作します。タップ操作でスムーズに反応速度を計測できます。" }
        },
        {
          "@type": "Question",
          "name": "スコアはどう計算されますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "画面が光ってからタップするまでの時間をミリ秒単位で計測します。5回プレイした結果の平均値がスコアとなり、AIが診断コメントを提供します。フライングは無効となります。" }
        },
        {
          "@type": "Question",
          "name": "反射神経は鍛えられますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい。継続的なトレーニングで反応速度の向上が期待できます。毎日練習することで神経伝達のスピードが改善し、ゲームやスポーツのパフォーマンス向上にもつながります。" }
        },
        {
          "@type": "Question",
          "name": "子供でも遊べますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、お子様でも安心して遊べます。シンプルな操作で反応速度を楽しく測定できます。家族で反応速度を競い合うのもおすすめです。" }
        },
        {
          "@type": "Question",
          "name": "難易度の設定はありますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "現在は標準モードのみです。ランダムなタイミングで画面が光るため、毎回違う難しさがあります。今後、ウェイト時間やラウンド数のカスタマイズ機能を追加予定です。" }
        },
        {
          "@type": "Question",
          "name": "BGMはオフにできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "はい、ゲーム画面上の音量ボタンでBGM・効果音のオン/オフを切り替えられます。静かな環境や公共の場でも快適にプレイできます。" }
        },
        {
          "@type": "Question",
          "name": "最高スコアの保存方法は？",
          "acceptedAnswer": { "@type": "Answer", "text": "自己ベストはブラウザのローカルストレージに自動保存されます。同じブラウザ・同じ端末であれば次回も記録が残ります。スコアカード画像をXでシェアして記録を残すこともできます。" }
        },
        {
          "@type": "Question",
          "name": "平均的な反応速度は何ミリ秒ですか？",
          "acceptedAnswer": { "@type": "Answer", "text": "一般的な成人の平均反応速度は200〜250msといわれています。スポーツ選手は150ms前後、ゲーマーは170ms前後が多いです。瞬感タップであなたの反応速度を測定してみましょう。" }
        },
        {
          "@type": "Question",
          "name": "ランキングや記録の共有はできますか？",
          "acceptedAnswer": { "@type": "Answer", "text": "自己ベストはブラウザに保存されます。また、スコアカード画像をXでシェアして友達と反応速度を競い合えます。デイリーランキング機能も実装予定です。" }
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
        {(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-XXXXXXXX') !== 'ca-pub-XXXXXXXX' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
