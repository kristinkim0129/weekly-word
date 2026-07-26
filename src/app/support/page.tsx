import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support · Sundaily",
  description: "Support for Sundaily (함께묵상)",
};

export default function SupportPage() {
  return (
    <div className="phone-shell" style={{ maxWidth: 640, paddingBottom: 48 }}>
      <header className="app-header">
        <p className="brand">Sundaily · 함께묵상</p>
        <h1 className="page-title">Support</h1>
        <p className="page-sub">고객지원</p>
      </header>

      <main className="app-main" style={{ gap: 20 }}>
        <section className="glass-card legal-block">
          <h2>English</h2>
          <p>
            Need help with Sundaily (함께묵상)? Email us and we’ll get back
            as soon as we can.
          </p>
          <p>
            <a href="mailto:aftersermon.review@gmail.com">
              aftersermon.review@gmail.com
            </a>
          </p>
          <p className="tiny">
            Please include your account email (Google sign-in), device/OS if
            relevant, and a short description of the issue. For account or data
            deletion requests, say so clearly in the subject line.
          </p>
          <p className="tiny">
            Common topics: signing in, joining a group with an invite code,
            daily check-in, leaving a season.
          </p>
        </section>

        <section className="glass-card legal-block">
          <h2>한국어</h2>
          <p>
            함께묵상(Sundaily) 이용에 도움이 필요하시면 이메일로 문의해
            주세요. 확인 후 답변드리겠습니다.
          </p>
          <p>
            <a href="mailto:aftersermon.review@gmail.com">
              aftersermon.review@gmail.com
            </a>
          </p>
          <p className="tiny">
            Google 로그인에 쓰는 계정 이메일, (가능하면) 기기/OS, 증상 설명을
            함께 보내주시면 더 빠르게 도와드릴 수 있어요. 계정·데이터 삭제
            요청은 제목에 그 내용을 적어 주세요.
          </p>
          <p className="tiny">
            자주 묻는 주제: 로그인, 초대 코드로 그룹 참여, 하루 체크인, 시즌
            나가기.
          </p>
        </section>

        <p className="tiny">
          <Link href="/privacy">Privacy Policy / 개인정보 처리방침 →</Link>
        </p>
      </main>
    </div>
  );
}
