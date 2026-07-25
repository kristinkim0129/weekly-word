import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support · After Sermon",
  description: "Support for After Sermon (함께묵상)",
};

export default function SupportPage() {
  return (
    <div className="phone-shell" style={{ maxWidth: 640, paddingBottom: 48 }}>
      <header className="app-header">
        <p className="brand">After Sermon · 함께묵상</p>
        <h1 className="page-title">Support</h1>
        <p className="page-sub">고객지원</p>
      </header>

      <main className="app-main" style={{ gap: 20 }}>
        <section className="glass-card legal-block">
          <h2>English</h2>
          <p>
            Need help with After Sermon? Email us and we’ll get back to you as
            soon as we can.
          </p>
          <p>
            <a href="mailto:aftersermon.review@gmail.com">
              aftersermon.review@gmail.com
            </a>
          </p>
          <p className="tiny">
            Please include your account email and a short description of the
            issue.
          </p>
        </section>

        <section className="glass-card legal-block">
          <h2>한국어</h2>
          <p>
            함께묵상 이용에 도움이 필요하시면 이메일로 문의해 주세요. 확인 후
            답변드리겠습니다.
          </p>
          <p>
            <a href="mailto:aftersermon.review@gmail.com">
              aftersermon.review@gmail.com
            </a>
          </p>
          <p className="tiny">
            계정 이메일과 증상 설명을 함께 보내주시면 더 빠르게 도와드릴 수
            있어요.
          </p>
        </section>

        <p className="tiny">
          <Link href="/privacy">Privacy Policy / 개인정보 처리방침 →</Link>
        </p>
      </main>
    </div>
  );
}
