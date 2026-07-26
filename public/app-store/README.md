# App Store screenshots

Value-prop frames for **Sundaily** (KO + EN).

## Live composer (real UI)

```
http://localhost:3000/app-store-shots
```

Toggle language → capture each 9:16 slide.

## Generated marketing PNGs

| # | Korean | English |
| --- | --- | --- |
| 1 Hero | `app-store-ko-01-hero.png` | `app-store-en-01-hero.png` |
| 2 Capture | `app-store-ko-02-capture.png` | `app-store-en-02-capture.png` |
| 3 Daily check | `app-store-ko-03-daily.png` | `app-store-en-03-daily.png` |
| 4 I prayed | `app-store-ko-04-prayed.png` | `app-store-en-04-prayed.png` |
| 5 Season | `app-store-ko-05-season.png` | `app-store-en-05-season.png` |
| 6 Footprints | `app-store-ko-06-footprints.png` | `app-store-en-06-footprints.png` |

## ASC upload-ready (exact Apple sizes)

English marketing frames, resized/composed for App Store Connect Media Manager:

| Device | Size | Folder |
| --- | --- | --- |
| **6.5" iPhone** | **1284 × 2778** | `asc/iphone-65-0N-*.png` |
| **13" iPad** | **2048 × 2732** | `asc/ipad-13-0N-*.png` |

Upload order (EN):

1. `*-01-hero.png`
2. `*-02-capture.png`
3. `*-03-daily.png`
4. `*-04-prayed.png`
5. `*-05-footprints.png`

Verify before upload: `sips -g pixelWidth -g pixelHeight public/app-store/asc/*.png`

Source masters remain 1024×1536 (`app-store-en-*.png`). Re-export from `/app-store-shots` if you want newer Sundaily copy on the frames.

## Copy (value props)

**KO — Sundaily**  
1. 주일에 들은 은혜, 매일 나누는 삶  
2. 일요일 말씀을 담아요  
3. 기도한 뒤, 하루를 체크해요  
4. “기도했어”로 이어져요  
5. 시즌을 정해 함께 걸어요  
6. 기도 발자국을 돌아봐요  

**EN — Sundaily**  
1. From Sunday to Daily  
2. Capture Sunday’s Word  
3. Pray — then check in  
4. Send “I prayed”  
5. Walk a season together  
6. See prayer footprints  
