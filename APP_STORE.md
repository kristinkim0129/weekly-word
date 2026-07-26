# App Store — listing copy & submission prep

**English one-pager (with screenshots):** [`docs/ONE_PAGER.md`](./docs/ONE_PAGER.md)

**App (KR):** Sundaily (함께묵상)  
**App (EN):** Sundaily  
**Bundle / product:** weekly-word · Capacitor iOS shell (`com.aftersermon.app` — do not change)  
**App Store Connect Name:** set to **Sundaily** (you must change this in ASC; Apple unique-name check applies). Display name on device comes from the iOS build (`CFBundleDisplayName`).
**Production web:** https://weekly-word-eight.vercel.app  
**Privacy URL:** https://weekly-word-eight.vercel.app/privacy  
**Support URL:** https://weekly-word-eight.vercel.app/support  
**Support email:** aftersermon.review@gmail.com  

**In-app purchases:** None  
**Subscriptions:** None  
**Ads:** None  

---

## Status snapshot (what’s done vs your steps)

| Area | Status | Notes |
| --- | --- | --- |
| Production web deploy | Done | Live: https://weekly-word-eight.vercel.app |
| Privacy Policy page (`/privacy`) | Done | HTTP 200 verified 2026-07-25 |
| Support page (`/support`) | Done | HTTP 200 verified 2026-07-25 |
| Listing copy (EN + KO) below | Draft ready | Paste into App Store Connect |
| Capacitor / `ios/` project | **In repo** | `cap:sync` OK; WebView → prod URL — [SETUP.md](SETUP.md) |
| DB columns (passage / avatars) | Verified | `week_captures.passage`, `profiles.avatar_url`, `profiles.avatar_emoji` via PostgREST |
| CLI / Xcode Archive upload | **Blocked** | Exact: *No Accounts* + *No profiles for com.aftersermon.app* — sign into Xcode Accounts, then Archive in UI |
| Physical iPhone for Dev profile | **You** | None connected on last check (simulators only) |
| Apple Developer account | **You** | Paid membership + Team in Signing |
| App Store Connect app record | **You** | Create app, bundle ID, screenshots |
| Age rating questionnaire | **You** | Suggested answers below |
| Screenshots / app icon | **You** | Spec list below (repo icon is 1024 Capacitor placeholder) |
| TestFlight / review submission | **You** | After Archive upload exists |

---

## Brand lines (reuse everywhere)

**Purpose (one sentence)** — product truth; keep light in store copy  
Apply Sunday’s sermon Word in daily life — and share the walk with your people.  
주일 설교 말씀을 매일 삶에 적용하고, 공동체와 함께 지켜가요.

**Internal note (do not promote)**  
Contrast vs daily new passages is product insight only — not for subtitle, promo, or screenshot captions.

**Tone**  
Simple. Lightweight. Low pressure. No guilt. Accountability without preachiness.

**Primary**  
Sundaily — From Sunday to Daily

**Secondary**  
Sunday’s Word, Daily Life.

**KR primary**  
Sundaily — 주일에 들은 은혜, 매일 나누는 삶

**KR secondary**  
주일 설교를 매일의 루틴으로

### Weekly rhythm (guide) — soft, not a checklist

Invite, don’t assign. Use for onboarding / website / in-app tips. Keep store listing short.

| When | Focus | Light practice |
| --- | --- | --- |
| **Sunday** | Capture | Write one verse or one message that landed. Share the grace at home or in small group. |
| **Mon–Tue** | Meditate | Reread it; say it aloud. Notice how it meets today’s work and meetings. |
| **Wed–Thu** | Apply | One small obedience. When stress or temptation hits, choose by the Word. |
| **Fri–Sat** | Reflect & prepare | Look back gently — repent where needed. Pray toward next Sunday. |

**KR**

| 언제 | 초점 | 가볍게 |
| --- | --- | --- |
| **주일** | 말씀 담기 | 가장 와닿은 핵심 구절·메시지 하나. 가족·소그룹에서 은혜 나누기. |
| **월–화** | 말씀 묵상 | 적어둔 구절을 다시 읽고 소리 내어 고백. 오늘 일정과 어떻게 닿는지 되새기기. |
| **수–목** | 삶에 적용 | 작은 순종 하나. 유혹·스트레스 앞에서 말씀의 기준으로 선택. |
| **금–토** | 돌아보고 준비 | 한 주를 돌아보며 회개와 용서. 다음 주일을 사모하며 마음 준비. |

Store copy: name the four beats only if needed — **Capture → Meditate → Apply → Reflect**. No day-by-day pressure in the App Store blurb.

---

## English (US)

**Name** (30)  
Sundaily

> Change this in App Store Connect → App Information → **Name**. Repo/display name alone does not update the store listing. Name must be unique on the App Store.

**Subtitle** (30) — recommended  
From Sunday to Daily

Count: 20 chars ✓

**Subtitle — A/B options** (≤30 each)  
| Option | Chars | Use when… |
| --- | --- | --- |
| From Sunday to Daily | 20 | Default — brand arc |
| Sunday's Word, Daily Life. | 26 | Application emphasis |
| Apply Sunday’s Word daily | 25 | Accountability / apply |
| Simple Sunday follow-through | 28 | Emphasize lightweight |

**Promotional text** (170)  
From Sunday to Daily. Capture the sermon Word, apply it in daily life, and check in with friends — light accountability, no heavy plans.

**One-liner**  
Sunday’s Word, Daily Life. — with people who walk it with you.

**Description** (paste into App Store Connect)

```
Sundaily — From Sunday to Daily

Sunday’s Word, Daily Life.
Capture what landed on Sunday. Return to it. Try a small step. Look back. Share the walk with friends.

No heavy reading plans. No pressure to do more.
Just a simple space to apply one Word through the week — with light accountability.

A gentle week with one Word:
• Sunday — Capture what you heard and shared
• Mon–Tue — Meditate: reread, pray, notice your day
• Wed–Thu — Apply: one small obedience
• Fri–Sat — Reflect, and prepare for next Sunday

Check in when you’ve prayed. Walk it with a buddy if you want.

We’re people who believe community matters.
We built Sundaily so Sunday’s sermon can become a daily rhythm — lived and shared. That’s all we’re after.

Sundaily — From Sunday to Daily
```

**Keywords** (100 chars max; no spaces after commas)  
sermon,prayer,bible,church,accountability,meditation,devotional,sunday,faith,smallgroup

Count check: = 87

**Category**  
Primary: Lifestyle  
Secondary: Social Networking (optional)

**What’s New** (first release)  
Welcome to Sundaily — From Sunday to Daily. Apply Sunday’s Word in daily life with friends.

**Screenshot captions** (≤30–40 recommended for overlay)

| # | Caption |
| --- | --- |
| 1 | From Sunday to Daily |
| 2 | Sunday — Capture |
| 3 | Mon–Tue — Meditate |
| 4 | Wed–Thu — Apply |
| 5 | Fri–Sat — Reflect |
| 6 | With friends. Simple. |

**A note from the founder** (long form / About / website)

We’re people who believe community matters.

We built Sundaily to be light: take Sunday’s sermon Word into daily life, return to it through the week, and walk it with friends — accountability without the weight of doing more.

That’s all we’re after.

---

## 한국어

**이름** (30)  
Sundaily

**부제** (30) — 추천  
주일에서 매일로

글자 수: 7 ✓  
(긴 메인 카피 “주일에 들은 은혜, 매일 나누는 삶”은 설명·히어로용)

**부제 — A/B 옵션** (각 ≤30)

| 옵션 | 글자 | 언제 |
| --- | --- | --- |
| 주일에서 매일로 | 7 | 기본 — brand arc |
| 주일 설교를 매일의 루틴으로 | 14 | 적용·루틴 강조 |
| 은혜를 매일 나누는 삶 | 11 | 나눔·공동체 |
| 부담 없이, 매일의 말씀 | 11 | no-pressure |

**홍보 문구** (170)  
주일에 들은 은혜, 매일 나누는 삶. 설교 말씀을 담고, 매일 적용하고, 친구와 체크인. 무거운 플랜 없이, 가벼운 책임감으로.

**한 줄**  
주일 설교를 매일의 루틴으로.

**설명** (App Store Connect에 붙여넣기)

```
Sundaily — 주일에 들은 은혜, 매일 나누는 삶

주일 설교를 매일의 루틴으로.
와닿은 말씀을 담고, 묵상하고, 작은 순종으로 적용하고, 돌아보기. 그게 한 주예요.

무거운 묵상 플랜이 아닙니다.
부담 없이, 주일 말씀이 매일 삶에 남도록 — 친구와 함께 지켜가요.

한 말씀으로 이어가는 한 주:
• 주일 — 말씀 담기 (핵심 하나, 은혜 나누기)
• 월–화 — 말씀 묵상 (다시 읽고, 오늘과 연결)
• 수–목 — 삶에 적용 (작은 순종 하나)
• 금–토 — 돌아보고, 다음 주일 준비

기도한 뒤 체크인. 원하면 버디와 함께.

우리는 공동체가 중요한 사람들입니다.
Sundaily는 주일 설교가 매일의 삶이 되도록 — 함께 잇고 싶어서 만들었습니다. 그게 우리가 바라는 전부입니다.

Sundaily — 주일에서 매일로
```

**키워드** (100자 이내, 쉼표 뒤 공백 없이)  
기도,설교,말씀,교회,묵상,주일,소그룹,적용,신앙,공동체

**카테고리**  
주: 라이프스타일  
부: 소셜 네트워킹 (선택)

**새로운 기능** (첫 출시)  
Sundaily에 오신 것을 환영합니다 — 주일에 들은 은혜를, 매일 나누는 삶으로.

**스크린샷 캡션**

| # | 캡션 |
| --- | --- |
| 1 | 주일에 들은 은혜, 매일 나누는 삶 |
| 2 | 주일 — 말씀 담기 |
| 3 | 월–화 — 말씀 묵상 |
| 4 | 수–목 — 삶에 적용 |
| 5 | 금–토 — 돌아보고 준비 |
| 6 | 친구와 함께. 심플하게. |

**창업자 노트** (긴 버전 / About / 웹)

우리는 공동체가 중요한 사람들입니다.

Sundaily는 주일 설교가 매일의 루틴이 되도록 만들고 싶었습니다. 말씀을 담고, 삶에 적용하고, 친구와 함께 가볍게 지켜가요 — 부담 없이.

그게 우리가 바라는 전부입니다.

---

## App Store Connect — submission checklist

### 1. Accounts & identifiers (you)

- [ ] Enroll in [Apple Developer Program](https://developer.apple.com/programs/) ($99/year)
- [ ] In [Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list): create App ID  
  - Suggested bundle ID: `com.aftersermon.app` (or your org’s reverse-DNS)
- [ ] Create the app in [App Store Connect](https://appstoreconnect.apple.com) with that bundle ID
- [ ] Confirm support email inbox works (`aftersermon.review@gmail.com` or replace everywhere: `/privacy`, `/support`, this doc)

### 2. Store URLs (ready once prod is live)

Use these in App Store Connect → App Information:

| Field | URL |
| --- | --- |
| Privacy Policy URL | `https://weekly-word-eight.vercel.app/privacy` |
| Support URL | `https://weekly-word-eight.vercel.app/support` |
| Marketing URL (optional) | `https://weekly-word-eight.vercel.app` |

Open both URLs in a private browser window and confirm they load without login.

### 3. Age rating (suggested answers)

This is a prayer / meditation / small-group accountability app. No UGC marketplace, no gambling, no alcohol, no violence, no mature themes beyond ordinary religious practice.

Suggested questionnaire direction (adjust if your build differs):

| Topic | Suggested |
| --- | --- |
| Cartoon / realistic violence | None |
| Profanity / crude humor | None |
| Mature / suggestive themes | None |
| Horror / fear | None |
| Alcohol / tobacco / drugs | None |
| Simulated gambling | None |
| Sexual content | None |
| Unrestricted web access | No (app should not expose a full browser) |
| User-generated content | **Yes** — group posts / questions / prayer shares among invited members |
| Messaging / chat | No (or Yes only if you later add DMs) |
| Contests | No |

Expect a rating around **4+** if UGC is limited to invited small groups and moderated by leaving the group / reporting via support email. Document that users join via invite code and can leave a season.

### 4. App Privacy (nutrition labels)

Declare in App Store Connect what data is collected. Align with `/privacy`:

| Data type | Linked to user? | Used for tracking? | Why |
| --- | --- | --- | --- |
| Contact Info — Email / Name | Yes | No | Account (Google sign-in via Supabase) |
| User Content — Other user content | Yes | No | Scripture notes, prayer check-ins, group posts |
| Identifiers — User ID | Yes | No | Auth / sync |
| Product Interaction (optional) | Yes | No | App functionality / diagnostics if you add analytics later |

**Do not claim “No data collected.”** Auth + cloud sync means data is collected.  
**Tracking:** Currently none intended — answer No unless you add ads/ATT SDKs.

Third parties to mention in privacy answers if asked: **Supabase** (auth + database), **Google** (sign-in).

### 5. In-App Purchases / monetization

- [x] No IAP in the product today  
- [ ] In App Store Connect, leave IAP empty; Pricing = Free  
- [ ] If you add paid features later, create IAP products *before* submission that uses them

### 6. Screenshots & icon

**Composer (in app):** [http://localhost:3000/app-store-shots](http://localhost:3000/app-store-shots)  
(로그인 없이 · 한국어 / English 토글 · 실제 앱 UI 슬라이드)

**Do not upload** legacy `public/app-store/app-store-en-*.png` (old “After Sermon” / tiger marketing). Use only `public/app-store/asc/` regenerated from the composer:

```bash
node scripts/capture-asc-shots.mjs
sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png
```

| # | File | Value prop (EN) | Real UI |
| --- | --- | --- | --- |
| 1 | `*-01-hero` | From Sunday to Daily | Landing — Sundaily + Google sign-in |
| 2 | `*-02-capture` | Capture Sunday’s Word | Sermon — Chapter + Passage + one-line |
| 3 | `*-03-daily` | Pray — then check in | Daily — Read · Reflect · One-line + Pray & check |
| 4 | `*-04-prayed` | Send “I prayed” | Daily — Done + From the heart |
| 5 | `*-05-footprints` | See prayer footprints | Group — invite 3/8 + footprints |

**ASC sizes in repo:** iPhone 6.5" **1284×2778**, iPad 13" **2048×2732**.

**App icon:** 1024×1024 PNG, no alpha, no rounded mask.

**Name uniqueness:** Apple may reject plain **Sundaily**. Try (≤30): `Sundaily: Sunday Word`, `Sundaily Daily Word`, `Sundaily Together`, `Sundaily 함께묵상`, `Sundaily Pray`. Display name on device can stay **Sundaily**.

### 7. Review notes (paste into App Store Connect)

```
Sundaily (함께묵상) is a small-group prayer & post-sermon meditation app.

Demo / review access:
1. Sign in with Google (reviewer account).
2. Create a group (season) or join with invite code if provided below.
3. Capture this week’s scripture on Capture.
4. Check in on Today after prayer; send “I prayed” to a buddy.
5. Open Group to see prayer footprints and shared points.

Sign-in: Google OAuth only (no password account).
No in-app purchases. No ads. No AI features in the UI.
Support: aftersermon.review@gmail.com
Privacy: https://weekly-word-eight.vercel.app/privacy

Invite code for reviewers (fill before submit): ________
Test Google account (optional if ASC provides sign-in): ________
```

### 8. Export compliance / encryption

- [ ] Answer encryption questions: app uses HTTPS only (standard TLS). Usually qualifies for **exempt** / standard encryption documentation — no proprietary crypto.
- [ ] Confirm no custom encryption beyond OS/TLS.

### 9. Capacitor iOS build (in repo)

Capacitor iOS shell is in the repo (`ios/`, `capacitor.config.ts`). The WebView loads `https://weekly-word-eight.vercel.app` (not a static export). See [SETUP.md](SETUP.md) § App Store (iOS).

- [x] Capacitor packages + `ios/` project committed  
- [ ] `npm run cap:sync` → `npm run cap:open:ios`  
- [ ] Signing & Capabilities → Team; confirm bundle ID `com.aftersermon.app`  
- [ ] Product → Archive → Distribute → App Store Connect  
- [ ] Select build in ASC / TestFlight → Submit for Review  

Do **not** invent certificates or upload without your Apple team credentials.

---

## Pre-submit smoke test (web + future iOS WebView)

- [ ] Google sign-in on production URL  
- [ ] Capture week → shows on Today  
- [ ] Daily check-in works  
- [ ] “마음을 담아 / From the heart” appears after check-in (above Golden Ticket)  
- [ ] Group prayer footprints: distinct arrow colors per person; **no** color legend  
- [ ] Questions board: post/list works; **no** AI reply button  
- [ ] `/privacy` and `/support` load logged-out  
- [ ] Leave group / end season paths still work  

---

## Human next steps (short list)

**Do these in order — automation already hit the wall at signing/accounts:**

1. **Xcode → Settings → Accounts** — add Apple ID (fixes CLI/UI *No Accounts*).  
2. **Signing & Capabilities** — Team for `com.aftersermon.app`; clear “No profiles” (Automatically manage signing).  
3. Optional Dev device: connect iPhone once so a Development profile can register a UDID.  
4. **Product → Archive** → Distribute → App Store Connect (build selection in ASC needs this upload).  
5. ASC metadata: Privacy + Support URLs (already live), paste listing copy below, icon/screenshots, age rating, review notes.  
6. Select uploaded build → TestFlight → Submit for Review.
