
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  targetRole?: string;
  experience?: string;
  resume?: {
    originalName?: string;
    extractedText?: string;
    uploadedAt?: number;
  };
  profile?: {
    skills?: string[];
    education?: unknown[];
    experience?: unknown[];
    projects?: unknown[];
    certifications?: unknown[];
  };
};

const navItems = [
  { label: "Overview", icon: "◫", href: "/dashboard" },
  { label: "My Career Profile", icon: "◎", href: "/dashboard/profile" },
  { label: "Resume Intelligence", icon: "▤", href: "/dashboard/resume" },
  { label: "Mock Interviews", icon: "◇", href: "/dashboard/mocks" },
  { label: "Daily Challenges", icon: "✳", href: "/dashboard/challenges" },
  { label: "My Progress", icon: "↗", href: "/dashboard/progress" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your profile.");
        }

        if (active) setUser(data.user);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

if (loading) {
  return (
    <main
      className="sp-page sp-loading"
      role="status"
      aria-live="polite"
    >
      <div className="sp-loader">
        <span className="sp-loader-ring" />
        <span className="sp-loader-center">S</span>
      </div>

      <h2>Preparing your next move</h2>
<p>Your career journey starts with one step. Let’s make it count.</p>
      <div className="sp-loading-track">
        <span />
      </div>
    </main>
  );
}

  if (error || !user) {
    return (
      <main className="dashboard-loading">
        <div className="dashboard-error">
          <h2>We couldn't load your dashboard.</h2>
          <p>{error || "Please sign in again."}</p>
          <button onClick={() => router.replace("/login")}>
            Return to login
          </button>
        </div>
      </main>
    );
  }

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";
  const skills = user.profile?.skills || [];

  const completedSections = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(user.phone),
    Boolean(user.targetRole),
    Boolean(user.experience),
    Boolean(user.resume?.originalName),
    skills.length > 0,
    Boolean(user.profile?.education?.length),
  ].filter(Boolean).length;

  const profileCompletion = Math.round((completedSections / 8) * 100);

  
return (
  <div className="stry-content">
    <section className="stry-welcome">
      <div>
        <p className="stry-eyebrow">
          <span /> YOUR NEXT CHAPTER STARTS HERE
        </p>
        <h1>
          Welcome back, <em>{firstName}.</em>
        </h1>
        <p className="stry-welcome-copy">
          A little progress today can change what’s possible tomorrow.
          Let’s make your next move count.
        </p>
      </div>

      <div className="stry-welcome-stamp">
        <span>YOUR</span>
        <span>NEXT</span>
        <em>MOVE.</em>
        <i>✳</i>
      </div>
    </section>

    <section className="stry-stats">
      <article className="stry-stat-card">
        <div className="stry-stat-top">
          <span>CAREER PROFILE</span>
          <span className="stry-stat-icon">◎</span>
        </div>
        <strong>{profileCompletion}%</strong>
        <div className="stry-progress-track">
          <span style={{ width: `${profileCompletion}%` }} />
        </div>
        <p>Profile completion</p>
      </article>

      <article className="stry-stat-card">
        <div className="stry-stat-top">
          <span>TARGET ROLE</span>
          <span className="stry-stat-icon">↗</span>
        </div>
        <strong className="stry-stat-role">
          {user.targetRole || "Not set yet"}
        </strong>
        <p>Your next career destination</p>
      </article>

      <article className="stry-stat-card">
        <div className="stry-stat-top">
          <span>RESUME</span>
          <span className="stry-stat-icon">▤</span>
        </div>
        <strong className="stry-stat-role">
          {user.resume?.originalName ? "Uploaded" : "Not uploaded"}
        </strong>
        <p>
          {user.resume?.originalName ||
            "Add your resume to get started"}
        </p>
      </article>
    </section>

    <section className="stry-grid">
      <article className="stry-panel stry-profile-panel">
        <div className="stry-panel-heading">
          <div>
            <p className="stry-eyebrow">01 / YOUR FOUNDATION</p>
            <h2>Your career profile</h2>
          </div>
          <button
            className="stry-text-button"
            onClick={() => router.push("/dashboard/profile")}
          >
            Edit profile ↗
          </button>
        </div>

        <div className="stry-user-summary">
          <div className="stry-large-avatar">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user.name || "Your name"}</h3>
            <p>{user.email}</p>
            <span className="stry-experience-tag">
              {user.experience || "Experience not added"}
            </span>
          </div>
        </div>

        <div className="stry-detail-list">
          <div>
            <span>Target role</span>
            <strong>{user.targetRole || "Add your target role"}</strong>
          </div>
          <div>
            <span>Phone</span>
            <strong>{user.phone || "Not provided"}</strong>
          </div>
          <div>
            <span>Technical skills</span>
            <strong>
              {skills.length
                ? `${skills.length} skills added`
                : "Add your skills"}
            </strong>
          </div>
        </div>

        <button
          className="stry-outline-button"
          onClick={() => router.push("/dashboard/profile")}
        >
          Complete your profile <span>→</span>
        </button>
      </article>

      <article className="stry-panel stry-next-panel">
        <div className="stry-panel-heading">
          <div>
            <p className="stry-eyebrow">02 / YOUR NEXT STEPS</p>
            <h2>Build your momentum</h2>
          </div>
          <span className="stry-decorative-star">✳</span>
        </div>

       
<div className="stry-actions-list">
  <button
    type="button"
    className="stry-action-row"
    onClick={() => router.push("/dashboard/profile")}
  >
    <span className="stry-action-number">01</span>
    <span className="stry-action-copy">
      <strong>Complete your career profile</strong>
      <small>Add skills, education and projects</small>
    </span>
    <span className="stry-action-arrow">↗</span>
  </button>

  <button
    type="button"
    className="stry-action-row"
    onClick={() => router.push("/dashboard/resume")}
  >
    <span className="stry-action-number">02</span>
    <span className="stry-action-copy">
      <strong>Review your resume insights</strong>
      <small>Understand your strengths and gaps</small>
    </span>
    <span className="stry-action-arrow">↗</span>
  </button>

  <button
    type="button"
    className="stry-action-row"
    onClick={() => router.push("/dashboard/mocks")}
  >
    <span className="stry-action-number">03</span>
    <span className="stry-action-copy">
      <strong>Start a mock interview</strong>
      <small>Practice for your target role</small>
    </span>
    <span className="stry-action-arrow">↗</span>
  </button>

  <button
    type="button"
    className="stry-action-row"
    onClick={() => router.push("/dashboard/challenges")}
  >
    <span className="stry-action-number">04</span>
    <span className="stry-action-copy">
      <strong>Take today's challenge</strong>
      <small>Build your skills one day at a time</small>
    </span>
    <span className="stry-action-arrow">↗</span>
  </button>
</div>

      </article>
    </section>

    <section className="stry-bottom-banner">
      <div>
        <p className="stry-eyebrow">A REMINDER FROM STRYVEXI</p>
        <h2>
          You don’t need all the answers.{" "}
          <em>Just your next step.</em>
        </h2>
        <p>
          Keep learning, keep practicing, and let your progress add up.
        </p>
      </div>
      <span className="stry-banner-star">✳</span>
    </section>

    <footer className="stry-dashboard-footer">
      <span>© 2026 STRYVEXI</span>
      <span>OWN YOUR NEXT MOVE.</span>
    </footer>
  </div>
);

}
