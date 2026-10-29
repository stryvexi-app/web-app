"use client";

import Editor from "@monaco-editor/react";
import { useCallback, useEffect, useMemo, useState } from "react";
/* @ts-ignore */
import "./daily-challenges.css";
import LoadingAnimation from "@/app/components/LoadingAnimation";

type Difficulty = "Easy" | "Medium" | "Hard";
type Challenge = {
  id: string; date: string; title: string; difficulty: Difficulty; topic: string;
  estimatedMinutes: number; xp: number; description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[]; starterCode: string; hints: string[];
};
type ChallengeState = {
  code?: string; status?: "not_started" | "in_progress" | "reviewed" | "completed";
  attempts?: number;
  lastReview?: {
    summary: string; strengths: string[]; improvements: string[]; complexity: string; reviewedAt: number;
    executionStatus: "ai_simulated_not_executed" | "not_run"; overallAssessment?: "promising" | "needs_work" | "uncertain";
    confidence?: "low" | "medium" | "high";
    testResults?: { name: string; expectedOutput: string; predictedOutput: string; verdict: "likely_pass" | "likely_fail" | "uncertain"; explanation: string }[];
  };
};
type ApiPayload = {
  success?: boolean; message?: string; date?: string; challenges?: Challenge[];
  progress?: Record<string, ChallengeState>;
  stats?: { xp: number; currentStreak: number; longestStreak?: number; completedToday: number; completedTotal: number; dailyXp?: number; rank?: number };
  leaderboards?: { daily: LeaderboardEntry[]; weekly: LeaderboardEntry[]; allTime: LeaderboardEntry[] };
};
type LeaderboardEntry = { userId: string; displayName: string; xp: number; streak?: number; rank?: number; isCurrentUser?: boolean };
const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const DEFAULT_STATS = { xp: 0, currentStreak: 0, longestStreak: 0, completedToday: 0, completedTotal: 0, dailyXp: 0, rank: 0 };

export default function DailyChallengesPage() {
  const [data, setData] = useState<ApiPayload | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [codeById, setCodeById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"daily" | "weekly" | "allTime">("weekly");

  const loadChallenges = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/daily-challenges/today", { cache: "no-store", credentials: "same-origin" });
      const payload = (await response.json()) as ApiPayload;
      if (!response.ok || !payload.success) throw new Error(payload.message || "Unable to load today's challenges.");
      setData(payload);
      setSelectedId((current) => current || payload.challenges?.[0]?.id || "");
      const initial: Record<string, string> = {};
      for (const challenge of payload.challenges || []) initial[challenge.id] = payload.progress?.[challenge.id]?.code || challenge.starterCode;
      setCodeById((current) => ({ ...initial, ...current }));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load challenges."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadChallenges(); }, [loadChallenges]);

  const challenges = data?.challenges || [];
  const selected = useMemo(() => challenges.find((item) => item.id === selectedId) || challenges[0], [challenges, selectedId]);
  const progress = data?.progress || {};
  const stats = data?.stats || DEFAULT_STATS;
  const selectedProgress = selected ? progress[selected.id] : undefined;
  const currentCode = selected ? codeById[selected.id] ?? selected.starterCode : "";
  const saveCode = async (challengeId: string, code: string) => {
    setCodeById((current) => ({ ...current, [challengeId]: code }));
    try {
      await fetch("/api/daily-challenges/progress", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ challengeId, code }),
      });
    } catch { /* A failed draft save does not disable the editor. */ }
  };

  const requestReview = async () => {
    if (!selected) return;
    setSubmitting(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/daily-challenges/submit", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin",
        body: JSON.stringify({ challengeId: selected.id, code: currentCode }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "Could not review your solution.");
      setData((current) => current ? {
        ...current, progress: { ...(current.progress || {}), [selected.id]: payload.progress }, stats: payload.stats || current.stats,
      } : current);
      setMessage(payload.reward?.awarded ? `AI review ready. +${payload.reward.xp} XP earned for for reviewing this challenge!` : "AI review ready. XP for this challenge was already claimed today, or this review did not earn a new reward. Code was not executed; predictions are estimates.");
      await loadChallenges();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not review your solution."); }
    finally { setSubmitting(false); }
  };

  const doneCount = DIFFICULTIES.filter((difficulty) => {
    const item = challenges.find((challenge) => challenge.difficulty === difficulty);
    return (
      item &&
      ["reviewed", "completed"].includes(
        progress[item.id]?.status || ""
      )
    );
  }).length;

  return (
    <main className="dc-page">

      <div className="dc-wrap">
        <header className="dc-hero">
          <div>
            <div className="dc-eyebrow">Stryvexi · Daily practice</div>
            <h1 className="dc-heading">Make progress, one challenge at a time.</h1>
            <p className="dc-muted">Three levels. Real interview-style problems. A stronger you every day.</p>
            <p className="dc-muted dc-small">{data?.date ? `Challenge set · ${data.date}` : "Your daily challenge set"}</p>
          </div>
          <div className="dc-stats">
            <div className="dc-stat"><span className="dc-stat-label">TOTAL XP</span><strong>⚡ {stats.xp}</strong><span className="dc-small dc-muted">{stats.dailyXp || 0} XP today</span></div>
            <div className="dc-stat"><span className="dc-stat-label">CURRENT STREAK</span><strong>🔥 {stats.currentStreak}</strong><span className="dc-small dc-muted">Best: {stats.longestStreak || 0} days</span></div>
            <div className="dc-stat"><span className="dc-stat-label">DAILY PROGRESS</span><strong>{doneCount}/3</strong><span className="dc-small dc-muted">Challenges reviewed</span></div>
          </div>
        </header>

        <section className="dc-leaderboard">
          <div className="dc-lb-head"><div><div className="dc-eyebrow">COMMUNITY RANKINGS</div><h2>Compete with the Stryvexi community</h2><div className="dc-muted dc-small">Earn 5 XP per distinct challenge reviewed (up to 15 daily). AI predictions are not verified code execution.</div></div>
            <div className="dc-periods" role="tablist" aria-label="Leaderboard period">
              <button className={`dc-period ${leaderboardPeriod === "daily" ? "active" : ""}`} onClick={() => setLeaderboardPeriod("daily")}>Today</button>
              <button className={`dc-period ${leaderboardPeriod === "weekly" ? "active" : ""}`} onClick={() => setLeaderboardPeriod("weekly")}>This week</button>
              <button className={`dc-period ${leaderboardPeriod === "allTime" ? "active" : ""}`} onClick={() => setLeaderboardPeriod("allTime")}>All time</button>
            </div>
          </div>
          {(() => { const entries = data?.leaderboards?.[leaderboardPeriod] || []; return entries.length ? entries?.map((entry, index) => <div key={entry.userId} className={`dc-lb-row ${entry.isCurrentUser ? "dc-lb-you" : ""}`}><div className="dc-lb-rank">{entry.isCurrentUser && !entry.rank ? "YOU" : entry.rank || index + 1}</div><div><div className="dc-lb-name">{entry.displayName}{entry.isCurrentUser ? " · You" : ""}</div><div className="dc-lb-meta">🔥 {entry.streak || 0} day streak</div></div><div className="dc-lb-xp">{entry.xp} XP</div></div>) : <div className="dc-lb-empty">You're early! Complete your first challenge review to start the rankings.</div>; })()}
        </section>

        {error && <div className="dc-error" role="alert">{error} {error.toLowerCase().includes("authentication") || error.toLowerCase().includes("log in") ? <a href="/login">Log in</a> : null}</div>}
        {message && <div className="dc-success" role="status">{message}</div>}
       {loading ? (
  <LoadingAnimation />
) : (
          <div className="dc-grid">
            <aside className="dc-card dc-list">
              <h2>Today&apos;s challenges</h2>
              <p className="dc-muted dc-small" style={{ marginTop: -4 }}>Complete each level at your own pace.</p>
              {DIFFICULTIES?.map((difficulty) => {
                const item = challenges.find((challenge) => challenge.difficulty === difficulty);
                if (!item) return null;
                const state = progress[item.id];
                return <button key={item.id} className={`dc-challenge ${selected?.id === item.id ? "active" : ""}`} onClick={() => { setSelectedId(item.id); setMessage(""); setError(""); setShowHints(false); }}>
                  <span className={`dc-tag ${difficulty.toLowerCase()}`}>{difficulty}</span>
                  <div className="dc-challenge-title"><span>{item.title}</span><span>{state?.status === "completed" ? "✓" : "→"}</span></div>
                  <div className="dc-muted dc-small">{item.topic} · {item.estimatedMinutes} min · {item.xp} XP</div>
                  <div className="dc-muted dc-small" style={{ marginTop: 8 }}>{state?.status === "completed" ? "Completed" : state?.status === "reviewed" ? "AI reviewed" : "Ready to start"}</div>
                </button>;
              })}
              <div className="dc-callout" style={{ margin: "14px 0 0" }}><strong>Practice honestly.</strong><br />AI creates and caches challenge test cases, then estimates how your code may behave. These are not actual execution results.</div>
            </aside>
            {selected ? <section className="dc-panel dc-detail">
              <div className="dc-detail-top">
                <span className={`dc-tag ${selected.difficulty.toLowerCase()}`}>{selected.difficulty}</span>
                <h2>{selected.title}</h2>
                <p className="dc-muted">{selected.topic} · {selected.estimatedMinutes} minutes · {selected.xp} XP</p>
                <p>{selected.description}</p>
              </div>
              <div className="dc-content">
                <div className="dc-problem">
                  <h2>Examples</h2>
                  {selected.examples?.map((example, index) => <div className="dc-example" key={index}>
                    <div className="dc-muted dc-small">Example {index + 1}</div><p><strong>Input</strong></p><code>{example.input}</code>
                    <p><strong>Output</strong></p><code>{example.output}</code>{example.explanation && <p className="dc-muted dc-small">{example.explanation}</p>}
                  </div>)}
                  <h2 style={{ marginTop: 20 }}>Constraints</h2><ul>{selected.constraints?.map((item) => <li key={item}>{item}</li>)}</ul>
                  <button className="dc-btn" onClick={() => setShowHints((v) => !v)}>{showHints ? "Hide hints" : "Show hints"}</button>
                  {showHints && <ul className="dc-hints">{selected.hints?.map((hint) => <li key={hint}>{hint}</li>)}</ul>}
                </div>
                <div className="dc-editor">
                  <div className="dc-editor-head"><div><strong>Solution editor</strong><div className="dc-muted dc-small">JavaScript · Monaco Editor</div></div><span className="dc-tag">Draft autosave</span></div>
                  <div className="dc-editor-wrap"><Editor height="100%" language="javascript" theme="vs-dark" value={currentCode} onChange={(value) => { void saveCode(selected.id, value ?? ""); }} options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, scrollBeyondLastLine: false, tabSize: 2, wordWrap: "on" }} /></div>
                  <div className="dc-callout"><strong>AI test simulation.</strong> We generate and cache extra test cases, then ask AI to reason through your code against them. No code is executed, so predictions can be wrong. This AI review can award participation XP, but not verified completion XP.</div>
                  <div className="dc-actions">
                    <button className="dc-btn" onClick={() => { void saveCode(selected.id, currentCode); setMessage("Draft save requested."); }}>Save draft</button>
                    <button className="dc-btn primary" onClick={() => void requestReview()} disabled={submitting || !currentCode.trim()}>{submitting ? "Reviewing…" : "Get AI Result"}</button>
                  </div>
                  {selectedProgress?.lastReview && <div className="dc-result">
                    <h3>AI code review & test simulation</h3><p>{selectedProgress.lastReview.summary}</p>
                    <p className="dc-muted dc-small">AI assessment: {selectedProgress.lastReview.overallAssessment || "review complete"} · Confidence: {selectedProgress.lastReview.confidence || "not provided"} · Code execution: not performed · {new Date(selectedProgress.lastReview.reviewedAt).toLocaleString()}</p>
                    {selectedProgress.lastReview.testResults?.length ? <><strong>Predicted test-case results</strong><p className="dc-muted dc-small">These are AI predictions, not real test runs. Test inputs are kept on the server; this view shows case labels and predicted outcomes.</p><div>{selectedProgress.lastReview.testResults?.map((test, index) => <div className="dc-example" key={`${test.name}-${index}`}><div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}><strong>{test.name}</strong><span className="dc-tag">{test.verdict.replace("_", " ")}</span></div><p className="dc-muted dc-small">Expected: <code>{test.expectedOutput}</code></p><p className="dc-muted dc-small">AI-predicted: <code>{test.predictedOutput}</code></p><p>{test.explanation}</p></div>)}</div></> : null}
                    <strong>What looks good</strong><ul>{selectedProgress.lastReview.strengths?.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    <strong>Improvements to consider</strong><ul>{selectedProgress.lastReview.improvements?.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    <strong>Complexity assessment</strong><p>{selectedProgress.lastReview.complexity}</p>
                  </div>}
                </div>
              </div>
            </section> : <div className="dc-panel" style={{ padding: 24 }}>No challenges are available right now.</div>}
          </div>
        )}
      </div>
    </main>
  );
}
