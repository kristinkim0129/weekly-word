import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { AppProvider } from "@/context/AppProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weekly Word",
  description: "일요일의 말씀을 한 주 동안 살아내도록 돕는 앱",
  appleWebApp: {
    capable: true,
    title: "Weekly Word",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#e8f7f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${fraunces.variable}`}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
