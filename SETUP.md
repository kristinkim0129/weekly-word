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

# 질문 보드 AI 답변 (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...
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

Vercel 프로젝트에 같은 `NEXT_PUBLIC_SUPABASE_*` / `NEXT_PUBLIC_SITE_URL` / `OPENAI_API_KEY` 추가 후 Redeploy.

## 4. 확인

```bash
npm run dev
```

브라우저에서 Google 로그인 → 말씀 담기 → 그룹 만들기까지 테스트.

## 다음 (App Store)

- Capacitor iOS 래핑
- Apple Developer + TestFlight
