# 함께묵상 · After Sermon — 설정 가이드 (Google 로그인)

## 1. Supabase 프로젝트

1. [supabase.com](https://supabase.com)에서 새 프로젝트 생성
2. **Project Settings → API**에서 URL / `anon` key 복사
3. 프로젝트 루트에 `.env.local` 작성:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SITE_URL=https://weekly-word-eight.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. **SQL Editor**에서 [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql) 전체 실행

   - 경고가 떠도 **Enable RLS / Run** 해도 됩니다. 스크립트가 모든 테이블에 RLS(+ FORCE)를 켭니다.
   - `DROP`을 쓰지 않도록 정리해 두었습니다.

## 2. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/auth/clients) → OAuth Client (Web)
2. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://weekly-word-eight.vercel.app`
3. Authorized redirect URIs:
   - Supabase Dashboard → Authentication → Providers → Google 에 표시된 callback  
     예: `https://xxxx.supabase.co/auth/v1/callback`
4. Client ID / Secret을 Supabase **Authentication → Providers → Google**에 붙여넣기
5. Supabase **Authentication → URL Configuration**:
   - Site URL: `https://weekly-word-eight.vercel.app`
   - Redirect URLs에 추가:
     - `http://localhost:3000/auth/callback`
     - `https://weekly-word-eight.vercel.app/auth/callback`

## 3. Vercel 환경변수

Vercel 프로젝트에 같은 `NEXT_PUBLIC_SUPABASE_*` / `NEXT_PUBLIC_SITE_URL` 추가 후 Redeploy.

## 4. 확인

```bash
npm run dev
```

브라우저에서 Google 로그인 → 말씀 담기 → 그룹 만들기까지 테스트.

## 다음 — App Store (iOS)

웹 프로덕션이 안정된 뒤, **네이티브 셸**로 감싸 App Store에 올립니다.  
현재 저장소에는 Capacitor / `ios/` 프로젝트가 **아직 없습니다.** 아래는 처음부터의 정확한 다음 단계입니다.

제출 체크리스트·스토어 문구·스크린샷 목록은 [`APP_STORE.md`](APP_STORE.md)를 보세요.

### A. 준비 (사람 / Apple)

1. [Apple Developer Program](https://developer.apple.com/programs/) 등록  
2. Bundle ID 생성 (예: `com.aftersermon.app`)  
3. App Store Connect에 앱 레코드 생성  
4. Privacy / Support URL 확인:
   - `https://weekly-word-eight.vercel.app/privacy`
   - `https://weekly-word-eight.vercel.app/support`

### B. Capacitor 초기화 (로컬, 자격 증명 불필요)

프로덕션 URL을 WebView로 여는 방식이 가장합니다 (SSR/OAuth가 이미 Vercel에 있음).

```bash
# 1) Capacitor 추가
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init "After Sermon" com.aftersermon.app --web-dir public

# 2) capacitor.config.ts 에서 server.url 을 프로덕션으로 지정 (예시)
# server: { url: 'https://weekly-word-eight.vercel.app', cleartext: false }

# 3) iOS 플랫폼 추가
npx cap add ios
npx cap sync ios
npx cap open ios
```

그다음 Xcode에서:

1. Signing & Capabilities → Team 선택, Bundle Identifier 확인  
2. 배포용 버전/빌드 번호  
3. **Product → Archive** → Distribute App → App Store Connect  
4. TestFlight 내부 테스트 후 Submit for Review  

인증서·프로비저닝은 Xcode / Apple Developer가 발급합니다.  
이 저장소에 가짜 인증서를 만들거나, 자격 증명 없이 업로드를 시도하지 마세요.

### C. OAuth (iOS WebView) 주의

Google / Supabase 리다이렉트가 Capacitor WebView에서 막히면:

- Supabase Redirect URLs에 Capacitor/커스텀 스킴 콜백 추가  
- 또는 ASWebAuthenticationSession / 시스템 브라우저 로그인 플로우로 전환  

제출 전 실제 기기에서 Google 로그인을 한 번 확인하세요.
