# 함께묵상 · After Sermon

**설교 이후, 한 주를 함께**  
*After Sermon — Pray the week together*

일요일 말씀이 한 주를 인도하게 하고, 친구·교회와 함께 기도하며 살아가는 앱.

왜 만들었는지는 [`PURPOSE.md`](./PURPOSE.md), 스토어 카피는 [`APP_STORE.md`](./APP_STORE.md).

---

## 이런 사람에게

- 셀·소그룹처럼 **교회 안에서** 같이 한 주를 살고 싶은 사람
- 멀리 살아도 **accountability buddy**로 신앙을 잇고 싶은 친구들
- 개인 묵상은 지키되, 기도·실천은 **서로에게 열어** 두고 싶은 사람

---

## 무엇을 하나요

| 흐름 | 내용 |
| --- | --- |
| **기록** | 일요일 말씀을 담고, 포인트·첫인상·메모를 남긴다 (개인) |
| **나눔** | 기도제목·묵상 포인트·실천은 그룹에 공개한다 |
| **오늘** | 기도한 뒤 체크하고, 친구에게 “기도했어”를 보낸다 |
| **함께** | 초대 코드로 그룹·시즌을 만든다 |
| **보관** | 지나간 주의 말씀을 돌아본다 |

---

## 기술 스택

- Next.js · React · TypeScript · Tailwind · Supabase · Google 로그인

```bash
npm install
cp .env.example .env.local
npm run dev
```

[http://localhost:3000](http://localhost:3000) → 언어 선택 → 로그인 → 말씀 담기 → 그룹.

CUJ 스토리보드: [http://localhost:3000/storyboard](http://localhost:3000/storyboard)  
App Store 스크린샷(한·영 value props): [http://localhost:3000/app-store-shots](http://localhost:3000/app-store-shots) · PNG는 `public/app-store/`

설정은 [`SETUP.md`](./SETUP.md).

---

## 문서

| 문서 | 내용 |
| --- | --- |
| [`PURPOSE.md`](./PURPOSE.md) | 목적 · 창업자 노트 |
| [`PURPOSE.en.md`](./PURPOSE.en.md) | Purpose (English) |
| [`APP_STORE.md`](./APP_STORE.md) | App Store 타이틀·설명 |
| [`README.en.md`](./README.en.md) | English overview |
| [`SETUP.md`](./SETUP.md) | Supabase · OAuth · Vercel |

---

[English](./README.en.md)
