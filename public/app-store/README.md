# App Store screenshots

Value-prop frames for **Sundaily** (KO + EN), composed from the **current app UI** (mountain glass shell + gold accent; mountain landing for login).

> **Do not use** the legacy tiger marketing masters (`public/app-store/app-store-en-*` / `app-store-ko-*`). Those show outdated “After Sermon” branding and invented UI. ASC uploads must come from `/app-store-shots` export captures only.

## Live composer (real UI)

```
http://localhost:3000/app-store-shots
```

Toggle language → review each slide. Export mode (exact pixels):

```
/app-store-shots?export=1&lang=en&asc=daily&w=1284&h=2778
```

Regenerate ASC PNGs:

```bash
npm run dev
npm run asc:shots
sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png
```

## ASC upload-ready (exact Apple sizes)

English slides, captured from the composer — **hero + all 5 tabs**:

| Device | Size | Folder |
| --- | --- | --- |
| **6.5" iPhone** | **1284 × 2778** | `asc/iphone-65-0N-*.png` |
| **13" iPad** | **2048 × 2732** | `asc/ipad-13-0N-*.png` |

Upload order (EN):

| # | File | Tab / screen | Real feature shown |
| --- | --- | --- | --- |
| 1 | `*-01-hero.png` | Landing | Google sign-in — Sundaily, From Sunday to Daily |
| 2 | `*-02-daily.png` | **Daily** | Read · Reflect · One-line + Pray & check |
| 3 | `*-03-sermon.png` | **Sermon** | Chapter + Passage + one-line + practice |
| 4 | `*-04-group.png` | **Group** | Invite 3/8 + prayer footprints |
| 5 | `*-05-archive.png` | **Archive** | Weeks / Days / Month / Year trail |
| 6 | `*-06-me.png` | **Me** | Profile · name · language · nudge · sign out |

Verify before upload:

```bash
sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png
```

## Copy (value props)

**KO — Sundaily**  
1. 주일에 들은 은혜, 매일 나누는 삶 · 주일에서 매일로  
2. 기도한 뒤, 하루를 체크해요  
3. 일요일 말씀을 담아요  
4. 시즌을 정해 함께 걸어요  
5. 한 주를 말씀과 함께한 기록을 돌아봐요  
6. 나 — 프로필과 알림  

**EN — Sundaily**  
1. From Sunday to Daily · Sunday's Word, Daily Life.  
2. Pray — then check in  
3. Capture Sunday’s Word  
4. Walk a season together  
5. Look back on weeks with the Word  
6. Me — profile & reminders  

## App Store Connect upload path

1. [App Store Connect](https://appstoreconnect.apple.com) → your app → **Distribution** → version → **App Store** localization (English / Korean)  
2. **Previews and Screenshots** → iPhone 6.5" and iPad 13"  
3. Drag the `public/app-store/asc/` files in the order above (01→06)  
4. Set **Name** (unique) + **Subtitle** from [APP_STORE.md](../../APP_STORE.md)  
