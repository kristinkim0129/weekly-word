# App Store — listing copy & submission prep

**App (KR):** 함께묵상  
**App (EN):** After Sermon  
**Bundle / product:** weekly-word (web → Capacitor iOS wrapper planned)  
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
| Production web deploy | Done in repo workflow | Verify live after each prod deploy |
| Privacy Policy page (`/privacy`) | Done | Public URL ready for App Store Connect |
| Support page (`/support`) | Done | Public URL ready for App Store Connect |
| Listing copy (EN + KO) below | Draft ready | Paste into App Store Connect |
| Capacitor / `ios/` project | **Not started** | See [SETUP.md](SETUP.md) § App Store (iOS) |
| Apple Developer account | **You** | Paid membership required |
| App Store Connect app record | **You** | Create app, bundle ID, screenshots |
| Age rating questionnaire | **You** | Suggested answers below |
| Screenshots / app icon | **You** | Spec list below |
| TestFlight / review submission | **You** | After iOS build exists |

---

## English (US)

**Name**  
After Sermon

**Subtitle**  
Pray the week together

**Promotional text**  
From Sunday Word to daily prayer with your friends

**Description**

After Sermon — Pray the week together.

Help your Sunday Word guide the week, so you live it more fully to God — with your friends and church.

There are many apps for reading the Bible alone. After Sermon is for what comes next: capturing the sermon’s Word, checking in through daily prayer, and walking the week with people you already know — your cell, small group, or faraway friends in the faith.

• Capture Sunday’s Scripture and keep a short point for the week  
• Meditate privately; share prayer, meditation points, and practice with your group  
• Check in after prayer each day  
• Send a simple “I prayed” to your accountability buddies  
• Walk a season together — not forever scrolling alone  

**Keywords** (100 chars max, comma-separated, no spaces after commas preferred)  
prayer,sermon,bible,church,small group,meditation,accountability,faith,devotional

**Category**  
Primary: Lifestyle (or Lifestyle → Health & Fitness only if you prefer)  
Secondary: Social Networking (optional)

**A note from the founder**  
We’re people who believe community matters.  
We built After Sermon (함께묵상) so the week after the sermon can be lived with friends and church — not in isolation. We want Sunday’s Word to guide the week, prayer to bind us to one another, and life with God to be fuller together.

---

## 한국어

**이름**  
함께묵상

**부제**  
설교 이후, 한 주를 함께

**홍보 문구**  
일요일 말씀에서 매일 기도로 · 친구와 교회와 함께

**설명**

함께묵상 — 설교 이후, 한 주를 함께.

일요일 말씀이 한 주를 인도하게 하고, 친구·교회와 함께 기도하며 하나님 앞에서 더 충만히 살도록 돕습니다.

말씀을 혼자 쌓는 도구는 이미 많습니다. 함께묵상은 그다음을 잇습니다. 설교의 말씀을 담고, 매일 기도로 체크하며, 이미 아는 이름들 — 셀, 소그룹, 멀리 있는 신앙 친구들과 한 주를 걸어가요.

• 일요일 말씀을 담고 한 주의 핵심을 남기기  
• 개인 묵상은 나에게만, 기도·묵상 포인트·실천은 그룹과  
• 기도한 뒤 하루 체크  
• “기도했어”로 서로에게 알리기  
• 시즌을 정해 함께 걷기  

**키워드**  
기도,설교,말씀,교회,소그룹,묵상,셀,신앙,큐티,공동체

**카테고리**  
주: 라이프스타일  
부: 소셜 네트워킹 (선택)

**창업자 노트**  
우리는 공동체가 중요한 사람들입니다.  
말씀을 혼자 쌓는 도구는 이미 많습니다. 함께묵상(After Sermon)은 설교 이후의 한 주를, 친구와 교회 공동체와 함께 살고 싶어서 만들었습니다. 일요일의 말씀이 한 주를 인도하고, 서로 기도하며, 하나님 앞에서 더 충만히 살도록 — 그게 우리가 바라는 전부입니다.

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

### 6. Screenshots & icon (you must produce)

Capture from the **phone-sized** UI (or Simulator after Capacitor). Prefer real Korean + English builds if you localize the store listing.

**Required for modern iPhone submission (typical):**

| Device class | Size (portrait) | Count |
| --- | --- | --- |
| 6.7" / 6.9" display (e.g. iPhone 15/16 Pro Max) | 1290×2796 or current ASC requirement | 3–10 |
| 6.5" (if ASC still asks) | per ASC | as required |

**Suggested shot list (order):**

1. Today — this week’s Word + daily prayer check  
2. Capture — Sunday scripture + brief point  
3. Group — members / season together  
4. Prayer footprints — “I prayed” arrows map  
5. Questions board — ask & share (no AI reply UI)  
6. Join / invite code — start a season with friends  

**App icon:** 1024×1024 PNG, no alpha, no rounded mask (Apple applies mask). Not yet in repo — design and upload in App Store Connect / Xcode asset catalog.

### 7. Review notes (paste into App Store Connect)

```
After Sermon (함께묵상) is a small-group prayer & post-sermon meditation app.

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

### 9. Capacitor iOS build (not in repo yet)

Capacitor is **not** installed; there is no `ios/` folder. Do **not** expect an `.ipa` from this web-only repo until you follow [SETUP.md](SETUP.md) § App Store (iOS). Then:

- [ ] `npx cap add ios` + open Xcode  
- [ ] Set bundle ID, signing team, version/build  
- [ ] Archive → Upload to App Store Connect  
- [ ] TestFlight internal test → Submit for Review  

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

1. Confirm production URLs above still resolve after deploy.  
2. Create Apple Developer + App Store Connect app + bundle ID.  
3. Design 1024 icon + 3–6 screenshots.  
4. Follow Capacitor steps in SETUP.md; archive from Xcode.  
5. Fill Privacy nutrition labels + age rating; paste review notes + invite code.  
6. Submit to App Review (TestFlight first recommended).
