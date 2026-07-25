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

## App Store (iOS) — Capacitor

Capacitor iOS 셸이 저장소에 포함되어 있습니다 (`ios/`, `capacitor.config.ts`).

**현재 방식:** WKWebView가 프로덕션 Next.js 앱을 로드합니다  
(`server.url` = `https://weekly-word-eight.vercel.app`).  
`webDir: public`은 sync용 placeholder이며, 앱의 소스가 아닙니다.  
오프라인 / static export는 이후 단계입니다.

**Bundle ID:** `com.aftersermon.app`  
**App name:** After Sermon  

**Privacy / Support URLs (이미 라이브):**
- Privacy: https://weekly-word-eight.vercel.app/privacy
- Support: https://weekly-word-eight.vercel.app/support  

제출 체크리스트·스토어 문구·스크린샷은 [`APP_STORE.md`](APP_STORE.md)를 보세요.

### A. 준비 (사람 / Apple)

1. [Apple Developer Program](https://developer.apple.com/programs/) 등록  
2. Bundle ID `com.aftersermon.app` 가 [Identifiers](https://developer.apple.com/account/resources/identifiers/list)에 있는지 확인 (없으면 생성)  
3. [App Store Connect](https://appstoreconnect.apple.com)에 앱 레코드 생성 (같은 Bundle ID)  
4. App Information에 Privacy / Support URL 입력 (위 URL)

### B. 로컬에서 Xcode로 Archive · 업로드

```bash
npm install
npm run cap:sync
npm run cap:open:ios
```

Xcode가 열리면:

1. 왼쪽 네비게이터에서 **App** 타깃 선택  
2. **Signing & Capabilities** → Team 선택 (개인/조직 Apple Developer)  
   - Bundle Identifier가 `com.aftersermon.app` 인지 확인  
3. 필요 시 **General**에서 Version (`1.0`) / Build (`1`) 조정  
4. 상단 scheme = **App**, destination = **Any iOS Device (arm64)** (시뮬레이터면 Archive 불가)  
5. **Product → Archive**  
6. Organizer에서 **Distribute App** → **App Store Connect** → Upload  
7. [App Store Connect](https://appstoreconnect.apple.com) → 앱 → **TestFlight**에서 빌드 처리 완료 대기  
8. 빌드를 버전/제출에 선택한 뒤 **Submit for Review**

인증서·프로비저닝은 Xcode가 자동 관리합니다 (Automatically manage signing).  
이 저장소에 가짜 인증서를 넣거나, 자격 증명 없이 업로드를 시도하지 마세요.

설정 변경 후 다시 sync할 때:

```bash
npm run cap:sync
```

### C. OAuth (iOS WKWebView) 주의

Google 로그인은 **WKWebView 안에서** 돌 때 제약이 있을 수 있습니다.

- Capacitor `server.allowNavigation`에 Google / Supabase 호스트를 넣어 두었습니다 (`capacitor.config.ts`).  
- Google이 임베디드 WebView 로그인을 차단하면 (`disallowed_useragent` 등):
  - `@capacitor/browser`로 시스템 Safari / SFSafariViewController 로그인으로 전환하거나  
  - ASWebAuthenticationSession / 커스텀 URL 스킴 콜백을 검토하세요.  
- Supabase Redirect URLs에 Capacitor 스킴이 필요해지면 예: `com.aftersermon.app://auth/callback`  
- **제출 전 실제 기기**에서 Google 로그인을 한 번 확인하세요.

### D. 유용한 npm 스크립트

| Script | 용도 |
| --- | --- |
| `npm run cap:sync` | 웹 자산 + 네이티브 플러그인 sync (`ios`) |
| `npm run cap:open:ios` | Xcode에서 `ios/App/App.xcworkspace` 또는 프로젝트 열기 |
| `npm run cap:copy` | 웹 자산만 copy |
