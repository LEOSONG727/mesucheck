import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "매수체크 | 부동산 매수 전 리스크 체크",
  description:
    "네이버에서 본 집을 내 상황 기준으로 검토하는 부동산 매수 전 리스크 체크 리포트입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <ToastProvider>
          <div className="app-shell">
            <Header />
            <main className="pb-14 pt-[86px]">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
