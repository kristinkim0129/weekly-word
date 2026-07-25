import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · After Sermon",
  description: "Privacy Policy for After Sermon (함께묵상)",
};

export default function PrivacyPage() {
  return (
    <div className="phone-shell" style={{ maxWidth: 640, paddingBottom: 48 }}>
      <header className="app-header">
        <p className="brand">After Sermon · 함께묵상</p>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-sub">Last updated: July 24, 2026</p>
      </header>

      <main className="app-main" style={{ gap: 20 }}>
        <section className="glass-card legal-block">
          <h2>English</h2>
          <p>
            After Sermon (“the App”) helps you capture Sunday’s Word, pray
            through the week, and walk with friends and church. This policy
            explains what we collect and how we use it.
          </p>

          <h3>Information we collect</h3>
          <ul>
            <li>
              <strong>Account:</strong> When you sign in with Google, we receive
              your account identifier and basic profile info (such as name and
              email) via our auth provider (Supabase).
            </li>
            <li>
              <strong>App content you create:</strong> Scripture notes, brief
              points, thoughts, prayer check-ins, group posts, and related
              activity you enter in the App.
            </li>
            <li>
              <strong>Group membership:</strong> Group name, invite relationship,
              and content you choose to share with your group.
            </li>
          </ul>

          <h3>How we use information</h3>
          <ul>
            <li>To provide and sync your personal and group experience</li>
            <li>To show accountability signals (e.g. “I prayed”) to your group</li>
            <li>To secure accounts and prevent abuse</li>
          </ul>

          <h3>Sharing</h3>
          <p>
            Personal meditation content is intended to stay private to you.
            Prayer requests, meditation points, practice, and check-ins you
            share are visible to members of your group. We do not sell your
            personal information.
          </p>
          <p>
            We use service providers to operate the App (for example Supabase for
            authentication and database hosting, and Google for sign-in). They
            process data only to provide those services.
          </p>

          <h3>Retention & deletion</h3>
          <p>
            We keep your data while your account is active. You may request
            account or data deletion by contacting us at the email below.
          </p>

          <h3>Children</h3>
          <p>
            The App is not directed to children under 13. If you believe a child
            has provided personal information, contact us and we will delete it.
          </p>

          <h3>Your choices</h3>
          <p>
            You can leave a group/season in the App. To request account or data
            deletion, email us; we will process the request within a reasonable
            time.
          </p>

          <h3>Contact</h3>
          <p>
            Questions about privacy:{" "}
            <a href="mailto:aftersermon.review@gmail.com">
              aftersermon.review@gmail.com
            </a>
          </p>
        </section>

        <section className="glass-card legal-block">
          <h2>한국어</h2>
          <p>
            함께묵상(After Sermon, “본 앱”)은 일요일 말씀을 담고, 한 주 동안
            기도하며, 친구·교회와 함께 걷기 위한 서비스입니다. 본 정책은 수집하는
            정보와 이용 방법을 설명합니다.
          </p>

          <h3>수집하는 정보</h3>
          <ul>
            <li>
              <strong>계정:</strong> Google 로그인 시 인증 제공자(Supabase)를 통해
              계정 식별자 및 기본 프로필 정보(이름, 이메일 등)를 받습니다.
            </li>
            <li>
              <strong>이용자가 작성한 내용:</strong> 성경 본문·한 줄 핵심·생각,
              기도 체크인, 그룹 게시글 등 앱에 입력한 내용
            </li>
            <li>
              <strong>그룹 정보:</strong> 그룹명, 초대/멤버십, 그룹에 공유하기로
              선택한 내용
            </li>
          </ul>

          <h3>이용 목적</h3>
          <ul>
            <li>개인·그룹 기능 제공 및 동기화</li>
            <li>그룹 내 책임 나눔(예: “기도했어”) 표시</li>
            <li>계정 보안 및 부정 이용 방지</li>
          </ul>

          <h3>공유</h3>
          <p>
            개인 묵상은 원칙적으로 본인에게만 보입니다. 기도제목·묵상 포인트·실천·
            체크인 등 공유한 내용은 그룹 멤버에게 보일 수 있습니다. 개인정보를
            판매하지 않습니다.
          </p>
          <p>
            서비스 운영을 위해 Supabase(인증·데이터베이스), Google(로그인) 등
            처리위탁 사업자를 이용할 수 있습니다.
          </p>

          <h3>보관 및 삭제</h3>
          <p>
            계정이 유지되는 동안 데이터를 보관합니다. 앱에서 그룹/시즌을 나갈 수
            있습니다. 계정 또는 데이터 삭제는 아래 이메일로 요청해 주시면 합리적
            기간 내에 처리합니다.
          </p>

          <h3>아동</h3>
          <p>
            본 앱은 만 13세 미만 아동을 대상으로 하지 않습니다. 아동의 개인정보가
            수집된 것으로 보이면 문의해 주세요. 삭제하겠습니다.
          </p>

          <h3>문의</h3>
          <p>
            <a href="mailto:aftersermon.review@gmail.com">
              aftersermon.review@gmail.com
            </a>
          </p>
        </section>

        <p className="tiny">
          <Link href="/support">Support / 고객지원 →</Link>
        </p>
      </main>
    </div>
  );
}
