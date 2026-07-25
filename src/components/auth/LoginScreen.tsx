"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthProvider";
import { useLocale } from "@/context/LocaleProvider";

type Mode = "signin" | "signup";

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 18.5c.6-3.2 2.8-4.8 5.5-4.8s4.9 1.6 5.5 4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M14.2 18.5c.4-2.2 1.8-3.4 3.8-3.4 1.4 0 2.5.6 3.2 1.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
  } = useAuth();
  const { t } = useLocale();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"email" | "google" | "reset" | null>(
    null,
  );
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading("email");
    setError("");
    setInfo("");
    try {
      if (mode === "signin") {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
        setInfo(t("login.checkEmail"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.fail"));
    } finally {
      setLoading(null);
    }
  }

  async function onGoogle() {
    setLoading("google");
    setError("");
    setInfo("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.fail"));
      setLoading(null);
    }
  }

  async function onForgot() {
    if (!email.trim()) {
      setError(t("login.emailRequired"));
      return;
    }
    setLoading("reset");
    setError("");
    setInfo("");
    try {
      await resetPassword(email.trim());
      setInfo(t("login.resetSent"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.fail"));
    } finally {
      setLoading(null);
    }
  }

  const primaryLabel =
    loading === "email"
      ? t("login.working")
      : mode === "signup"
        ? t("login.createAccount")
        : t("login.signIn");

  return (
    <div className="landing-shell">
      <div className="landing-bg" aria-hidden>
        <Image
          src="/landing-bg.png"
          alt=""
          fill
          priority
          sizes="430px"
          className="landing-bg-img"
        />
        <div className="landing-bg-veil" />
      </div>

      <div className="landing-content">
        <header className="landing-hero">
          <Image
            src="/logo-icon.png"
            alt=""
            width={52}
            height={48}
            className="landing-logo-mark"
            priority
          />
          <h1 className="landing-title">{t("brand")}</h1>
          <p className="landing-slogan">{t("login.tagline")}</p>
        </header>

        <form className="landing-card" onSubmit={onEmailSubmit}>
          <div className="landing-card-head">
            <span className="landing-people-bubble" aria-hidden>
              <PeopleIcon />
            </span>
            <div className="landing-card-head-copy">
              <p className="landing-card-title">{t("login.start")}</p>
              <p className="landing-card-blurb">{t("login.blurb")}</p>
            </div>
          </div>

          <button
            type="button"
            className="landing-google"
            onClick={onGoogle}
            disabled={loading === "google"}
          >
            <GoogleGlyph />
            <span>
              {loading === "google"
                ? t("login.googleLoading")
                : t("login.google")}
            </span>
          </button>

          <div className="landing-or" role="separator">
            <span>{t("login.orContinue")}</span>
          </div>

          <label className="landing-field">
            <span className="landing-field-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6.5h16v11H4v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="m4.5 7 7.5 6 7.5-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              placeholder={t("login.emailPh")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="landing-field">
            <span className="landing-field-icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 10V7.5a4 4 0 0 1 8 0V10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              placeholder={t("login.passwordPh")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {mode === "signin" ? (
            <button
              type="button"
              className="landing-forgot"
              onClick={onForgot}
              disabled={loading === "reset"}
            >
              {loading === "reset" ? t("login.sending") : t("login.forgot")}
            </button>
          ) : (
            <div className="landing-forgot-spacer" />
          )}

          <button
            type="submit"
            className="landing-primary"
            disabled={loading === "email"}
          >
            <span>{primaryLabel}</span>
            <svg
              className="landing-primary-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 12h12M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {error ? <p className="landing-error">{error}</p> : null}
          {info ? <p className="landing-info">{info}</p> : null}

          <p className="landing-switch">
            {mode === "signin" ? (
              <>
                {t("login.noAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setInfo("");
                  }}
                >
                  {t("login.createAccount")}
                </button>
              </>
            ) : (
              <>
                {t("login.hasAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setInfo("");
                  }}
                >
                  {t("login.signIn")}
                </button>
              </>
            )}
          </p>
        </form>

        <p className="landing-privacy">{t("login.privacy")}</p>
      </div>
    </div>
  );
}

/** Dev fallback when Supabase env is missing */
export function ConfigMissingScreen() {
  const { t } = useLocale();
  return (
    <AppShell title={t("config.title")} subtitle={t("config.subtitle")}>
      <GlassCard>
        <p className="hint">{t("config.body")}</p>
        <p className="hint" style={{ marginTop: 10 }}>
          {t("config.setup")}
        </p>
      </GlassCard>
    </AppShell>
  );
}
