# App Store screenshots

Value-prop frames for **Sundaily** (KO + EN), composed from the **current app UI** (light glass + gold in-app; mountain landing for login).

> **Do not use** the legacy tiger marketing masters (`public/app-store/app-store-en-*` / `app-store-ko-*`). Those show outdated “After Sermon” branding and invented UI. ASC uploads must come from `/app-store-shots` export captures only.

## Live composer (real UI)

```
http://localhost:3000/app-store-shots
```

Toggle language → review each slide. Export mode (exact pixels):

```
/app-store-shots?export=1&lang=en&asc=hero&w=1284&h=2778
```

Regenerate ASC PNGs:

```bash
npm run dev
node scripts/capture-asc-shots.mjs
sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png
```

## ASC upload-ready (exact Apple sizes)

English slides, captured from the composer:

| Device | Size | Folder |
| --- | --- | --- |
| **6.5" iPhone** | **1284 × 2778** | `asc/iphone-65-0N-*.png` |
| **13" iPad** | **2048 × 2732** | `asc/ipad-13-0N-*.png` |

Upload order (EN):

| # | File | Real feature shown |
| --- | --- | --- |
| 1 | `*-01-hero.png` | Landing / Google sign-in — Sundaily, From Sunday to Daily |
| 2 | `*-02-capture.png` | Sermon tab — Chapter + Passage + one-line + practice |
| 3 | `*-03-daily.png` | Daily tab — Read · Reflect · One-line + Pray & check |
| 4 | `*-04-prayed.png` | Daily tab — Done check + “I prayed” / From the heart |
| 5 | `*-05-footprints.png` | Group tab — invite 3/8 + prayer footprints |

Verify before upload:

```bash
sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png
```

## Copy (value props)

**KO — Sundaily**  
1. 주일에 들은 은혜, 매일 나누는 삶 · 주일에서 매일로  
2. 일요일 말씀을 담아요  
3. 기도한 뒤, 하루를 체크해요  
4. “기도했어”로 이어져요  
5. 시즌을 정해 함께 걸어요  
6. 기도 발자국을 돌아봐요  

**EN — Sundaily**  
1. From Sunday to Daily · Sunday's Word, Daily Life.  
2. Capture Sunday’s Word  
3. Pray — then check in  
4. Send “I prayed”  
5. Walk a season together  
6. See prayer footprints  

## App Store Connect upload path

1. [App Store Connect](https://appstoreconnect.apple.com) → your app → **Distribution** → version → **App Store** localization (English / Korean)  
2. **Previews and Screenshots** → iPhone 6.5" and iPad 13"  
3. Drag the `public/app-store/asc/` files in the order above  
4. Set **Name** (unique) + **Subtitle** from [APP_STORE.md](../../APP_STORE.md)  
