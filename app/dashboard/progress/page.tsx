"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
/* @ts-ignore*/
import "./progress.css";
import LoadingAnimation from "@/app/components/LoadingAnimation";

type User = {
  name?: string;
  email?: string;
  phone?: string;
  targetRole?: string;
  experience?: string;
  resume?: { originalName?: string };
  profile?: { skills?: string[]; education?: unknown[] };
};
type Challenge = { id: string; title: string; difficulty: "Easy" | "Medium" | "Hard"; topic?: string; xp?: number };
type ChallengeProgress = { status?: "not_started" | "in_progress" | "reviewed" | "completed"; attempts?: number; lastReview?: { reviewedAt?: number } };
type Stats = { xp?: number; currentStreak?: number; longestStreak?: number; completedToday?: number; completedTotal?: number; dailyXp?: number; rank?: number };
type LeaderboardEntry = { userId: string; displayName: string; xp: number; streak?: number; rank?: number; isCurrentUser?: boolean };
type DailyResponse = { success?: boolean; message?: string; date?: string; challenges?: Challenge[]; progress?: Record<string, ChallengeProgress>; stats?: Stats; leaderboards?: { daily?: LeaderboardEntry[]; weekly?: LeaderboardEntry[]; allTime?: LeaderboardEntry[] } };
type Period = "daily" | "weekly" | "allTime";

const LEVELS = ["Easy", "Medium", "Hard"] as const;
const isReviewed = (status?: ChallengeProgress["status"]) => status === "reviewed" || status === "completed";

export default function MyProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [daily, setDaily] = useState<DailyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("weekly");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const [meResponse, dailyResponse] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include", cache: "no-store" }),
        fetch("/api/daily-challenges/today", { credentials: "include", cache: "no-store" }),
      ]);
      if (meResponse.status === 401 || dailyResponse.status === 401) {
        router.replace("/login");
        return;
      }
      const [meData, dailyData] = await Promise.all([meResponse.json(), dailyResponse.json()]);
      if (!meResponse.ok || !meData.user) throw new Error(meData.message || "Unable to load your profile.");
      if (!dailyResponse.ok || !dailyData.success) throw new Error(dailyData.message || "Unable to load your challenge progress.");
      setUser(meData.user);
      setDaily(dailyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load your progress.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => { void load(); }, [load]);

  const stats = daily?.stats || {};
  const challenges = daily?.challenges || [];
  const progress = daily?.progress || {};
  const reviewedCount = LEVELS.filter((level) => {
    const challenge = challenges.find((item) => item.difficulty === level);
    return challenge && isReviewed(progress[challenge.id]?.status);
  }).length;
  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const completed = [
      Boolean(user.name), Boolean(user.email), Boolean(user.phone),
      Boolean(user.targetRole), Boolean(user.experience), Boolean(user.resume?.originalName),
      Boolean(user.profile?.skills?.length), Boolean(user.profile?.education?.length),
    ].filter(Boolean).length;
    return Math.round((completed / 8) * 100);
  }, [user]);
  const entries = daily?.leaderboards?.[period] || [];
  const currentEntry = entries.find((entry) => entry.isCurrentUser);
  const displayRank = currentEntry?.rank ?? (period === "daily" ? stats.rank : undefined);

  if (loading) return (
   <LoadingAnimation />
  );

  if (error && !daily) return (
    <main className="sp-page sp-loading">
      <div className="sp-error-panel" role="alert"><h2>We couldn’t load your progress</h2><p>{error}</p>
        <button className="sp-button sp-button-primary" onClick={() => void load()}>Try again</button>
      </div>
    </main>
  );

  return (
    <main className="sp-page">
      <div className="sp-container">
        <header className="sp-hero">
          <div>
            <div className="sp-eyebrow"><span className="sp-eyebrow-dot" /> YOUR GROWTH, AT A GLANCE</div>
            <h1>My Progress.</h1>
            <p>Small wins compound. See how far you’ve come and where to go next.</p>
            <div className="sp-date">Daily snapshot {daily?.date ? `· ${daily.date}` : ""}</div>
          </div>
          <button className="sp-button sp-button-outline" disabled={refreshing} onClick={() => void load(true)}>{refreshing ? "Refreshing…" : "↻ Refresh progress"}</button>
        </header>

        {error && <div className="sp-error-inline" role="alert">{error}</div>}

        <section className="sp-metrics" aria-label="Your progress statistics">
          <article className="sp-metric"><span className="sp-metric-label">TOTAL XP</span><div className="sp-metric-value">{stats.xp ?? 0}<span className="sp-metric-glyph">✦</span></div><p>Participation points earned</p></article>
          <article className="sp-metric"><span className="sp-metric-label">CURRENT STREAK</span><div className="sp-metric-value">{stats.currentStreak ?? 0}<span className="sp-metric-unit">days</span></div><p>Best streak: {stats.longestStreak ?? 0} days</p></article>
          <article className="sp-metric"><span className="sp-metric-label">TODAY’S XP</span><div className="sp-metric-value">+{stats.dailyXp ?? 0}</div><p>Earned from daily reviews</p></article>
          <article className="sp-metric"><span className="sp-metric-label">CHALLENGES REVIEWED</span><div className="sp-metric-value">{stats.completedTotal ?? 0}</div><p>Total recorded reviews</p></article>
        </section>

        <section className="sp-columns">
          <article className="sp-panel sp-daily-panel">
            <div className="sp-panel-heading"><div><div className="sp-eyebrow">01 / DAILY PRACTICE</div><h2>Today’s challenge journey</h2><p>Review all three levels to build momentum.</p></div><div className="sp-count">{reviewedCount}<span> / 3</span></div></div>
            <div className="sp-progress-track" role="progressbar" aria-label="Challenges reviewed today" aria-valuemin={0} aria-valuemax={3} aria-valuenow={reviewedCount}><span style={{ width: `${(reviewedCount / 3) * 100}%` }} /></div>
            <div className="sp-levels">
              {LEVELS.map((level, index) => {
                const challenge = challenges.find((item) => item.difficulty === level);
                const state = challenge ? progress[challenge.id] : undefined;
                const complete = isReviewed(state?.status);
                return <div className="sp-level" key={level}>
                  <div className={`sp-level-number ${complete ? "sp-level-done" : ""}`}>{complete ? "✓" : String(index + 1).padStart(2, "0")}</div>
                  <div className="sp-level-info"><strong>{challenge?.title || `${level} challenge`}</strong><span>{level}{challenge?.topic ? ` · ${challenge.topic}` : ""}</span></div>
                  <span className={`sp-status ${complete ? "sp-status-done" : ""}`}>{complete ? "Reviewed" : state?.status === "in_progress" ? "In progress" : "Not started"}</span>
                </div>;
              })}
            </div>
            <button className="sp-button sp-button-primary" onClick={() => router.push("/dashboard/challenges")}>Continue daily challenges <span>↗</span></button>
            <p className="sp-footnote">AI reviews count as participation, not verified code execution.</p>
          </article>

          <article className="sp-panel sp-profile-panel">
            <div className="sp-panel-heading"><div><div className="sp-eyebrow">02 / CAREER READINESS</div><h2>Career profile strength</h2><p>Your foundation for the next opportunity.</p></div></div>
            <div className="sp-profile-visual"><div className="sp-profile-ring" style={{ "--sp-percent": `${profileCompletion}%` } as React.CSSProperties}><div><strong>{profileCompletion}%</strong><span>COMPLETE</span></div></div></div>
            <div className="sp-profile-details"><div><span>Target role</span><strong>{user?.targetRole || "Not set"}</strong></div><div><span>Resume</span><strong>{user?.resume?.originalName ? "Uploaded" : "Not uploaded"}</strong></div><div><span>Skills added</span><strong>{user?.profile?.skills?.length ?? 0}</strong></div></div>
            <button className="sp-button sp-button-outline sp-full-width" onClick={() => router.push("/dashboard/profile")}>Improve career profile <span>↗</span></button>
          </article>
        </section>

        <section className="sp-panel sp-leaderboard">
          <div className="sp-panel-heading sp-leaderboard-heading"><div><div className="sp-eyebrow">03 / COMMUNITY</div><h2>Leaderboard standings</h2><p>See how your practice stacks up with the community.</p></div>
            <div className="sp-tabs" role="group" aria-label="Leaderboard period">
              {(["daily", "weekly", "allTime"] as const).map((value) => <button key={value} type="button" className={period === value ? "sp-tab active" : "sp-tab"} aria-pressed={period === value} onClick={() => setPeriod(value)}>{value === "daily" ? "Today" : value === "weekly" ? "This week" : "All time"}</button>)}
            </div>
          </div>
          <div className="sp-leaderboard-content">
            <div className="sp-rank-card"><span>YOUR RANK</span><strong>{displayRank ? `#${displayRank}` : "—"}</strong><p>{displayRank ? "Keep up the momentum!" : "Review a challenge to join the rankings."}</p></div>
            <div className="sp-rank-list">
              {entries.length ? entries.slice(0, 8).map((entry, index) => <div className={`sp-rank-row ${entry.isCurrentUser ? "sp-rank-you" : ""}`} key={entry.userId}><span className="sp-rank-position">{entry.rank ?? index + 1}</span><div className="sp-rank-person"><strong>{entry.displayName}{entry.isCurrentUser ? " · You" : ""}</strong><small>{entry.streak ?? 0} day streak</small></div><strong className="sp-rank-xp">{entry.xp} XP</strong></div>) : <p className="sp-empty">No leaderboard entries yet. Your first review can get you started.</p>}
            </div>
          </div>
        </section>

        <section className="sp-next"><div><div className="sp-eyebrow">KEEP MOVING FORWARD</div><h2>Your next move starts <em>today.</em></h2><p>Turn your practice into confidence, one session at a time.</p></div><div className="sp-next-links"><button onClick={() => router.push("/dashboard/challenges")}>Daily challenges ↗</button><button onClick={() => router.push("/dashboard/mocks")}>Mock interviews ↗</button><button onClick={() => router.push("/dashboard/resume")}>Resume intelligence ↗</button></div></section>
        <footer className="sp-footer"><span>© 2026 STRYVEXI</span><span>OWN YOUR NEXT MOVE.</span></footer>
      </div>
    </main>
  );
}
