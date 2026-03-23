import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shunkan-tap.vercel.app"),
  title: "⚡ 瞬感タップ | 反射神経を測れ",
  description: "画面が光った瞬間にタップ！あなたの反応速度をミリ秒単位で計測してAIが診断。友達と競おう。",
  openGraph: {
    title: "⚡ 瞬感タップ | 反射神経を測れ",
    description: "あなたの反応速度は何ms？AIが診断します",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "瞬感タップ",
  "description": "反射神経を鍛える瞬間タップゲーム",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web",
  "url": "https://shunkan-tap.vercel.app",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
  "genre": "Reaction Game"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
