import type { CapacitorConfig } from '@capacitor/cli';

/**
 * After Sermon — Capacitor iOS shell
 *
 * Current approach: load the production Next.js app in the WKWebView.
 * Offline / static export is a later step — do NOT treat `webDir` alone as the app.
 *
 * Production URL: https://weekly-word-eight.vercel.app
 */
const config: CapacitorConfig = {
  appId: 'com.aftersermon.app',
  appName: 'After Sermon',
  // Placeholder assets for `cap sync`; the live app is served via server.url below.
  webDir: 'public',
  server: {
    // Load the deployed Next.js app (SSR + OAuth already work on Vercel).
    url: 'https://weekly-word-eight.vercel.app',
    cleartext: false,
    // Allow Google OAuth + Supabase auth redirects inside / out of the WebView.
    allowNavigation: [
      'https://weekly-word-eight.vercel.app',
      'https://*.supabase.co',
      'https://accounts.google.com',
      'https://*.google.com',
      'https://apis.google.com',
    ],
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#0f1419',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
    },
  },
};

export default config;
