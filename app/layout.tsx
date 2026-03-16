import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "⚡ 瞬感タップ | 反射神経を測れ",
  description: "画面が光った瞬間にタップ！あなたの反応速度をミリ秒単位で計測してAIが診断。友達と競おう。",
  openGraph: {
    title: "⚡ 瞬感タップ | 反射神経を測れ",
    description: "あなたの反応速度は何ms？AIが診断します",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
