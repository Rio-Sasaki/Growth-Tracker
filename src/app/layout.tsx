import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Growth Tracker',
  description: '読書・学習時間を一元管理し、自己成長を可視化するアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
