import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { AuthGate } from "@/components/auth/AuthGate";
import { AuthProvider } from "@/context/AuthProvider";
import { LocaleProvider } from "@/context/LocaleProvider";
import { BRAND_THEME_COLOR } from "@/lib/themes";
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
  title: "함께묵상 · After Sermon",
  description:
    "설교 이후, 한 주를 함께 · After Sermon: Pray the week together · From Sunday Word to daily prayer with your friends",
  appleWebApp: {
    capable: true,
    title: "함께묵상",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: BRAND_THEME_COLOR,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      data-theme="after"
      className={`${outfit.variable} ${fraunces.variable}`}
    >
      <body>
        <LocaleProvider>
          <AuthProvider>
            <AuthGate>{children}</AuthGate>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
