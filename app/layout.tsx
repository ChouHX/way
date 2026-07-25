import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "永盛罚单/移民咨询中心 | 专业守护您的权益",
  description: "专业处理交通罚单、E-ZPass、车祸理赔与信用修复服务。",
  icons: {
    icon: "/logo-transparent.png",
    shortcut: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
