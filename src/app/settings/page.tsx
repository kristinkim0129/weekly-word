"use client";

import { AppShell } from "@/components/AppShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { useApp } from "@/context/AppProvider";
import { THEMES } from "@/lib/themes";

export default function SettingsPage() {
  const {
    state,
    setTheme,
    setNudgeTime,
    setDisplayName,
    setGroupEnabled,
  } = useApp();

  async function enableNotifications() {
    if (!("Notification" in window)) {
      alert("이 브라우저는 알림을 지원하지 않아요.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("Weekly Word", {
        body: `매일 ${state.settings.nudgeTime}에 부드럽게 알려드릴게요.`,
      });
    }
  }

  return (
    <AppShell title="나" subtitle="톤은 부드럽게 · 디자인은 취향대로.">
      <GlassCard>
        <div className="field">
          <label>이름</label>
          <input
            value={state.settings.displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="그룹에 보일 이름"
          />
        </div>
      </GlassCard>

      <GlassCard>
        <p className="pill">파스텔 테마</p>
        <p className="hint" style={{ margin: "8px 0 14px" }}>
          글로시하고 심플한 5가지 파스텔 중 골라보세요.
        </p>
        <div className="theme-grid">
          {THEMES.map((theme) => (
            <div key={theme.id}>
              <button
                type="button"
                className={`theme-swatch ${
                  state.settings.themeId === theme.id ? "active" : ""
                }`}
                style={{ background: theme.swatch, width: "100%" }}
                aria-label={theme.nameKo}
                onClick={() => setTheme(theme.id)}
              />
              <span className="theme-label">{theme.nameKo}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <p className="pill">하루 한 번 알림</p>
        <div className="field" style={{ marginTop: 12 }}>
          <label>원하는 시간</label>
          <input
            type="time"
            value={state.settings.nudgeTime}
            onChange={(e) => setNudgeTime(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-soft"
          style={{ width: "100%" }}
          onClick={enableNotifications}
        >
          알림 권한 허용
        </button>
        <p className="hint" style={{ marginTop: 10 }}>
          알림이 오면 기도하고, 앱에서 체크만 하면 끝이에요.
        </p>
      </GlassCard>

      <GlassCard>
        <div className="row-between">
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>소그룹 모드</p>
            <p className="hint">최대 5명과 함께</p>
          </div>
          <label className="row" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={state.settings.groupEnabled}
              onChange={(e) => setGroupEnabled(e.target.checked)}
            />
            <span className="tiny">
              {state.settings.groupEnabled ? "켜짐" : "꺼짐"}
            </span>
          </label>
        </div>
      </GlassCard>
    </AppShell>
  );
}
