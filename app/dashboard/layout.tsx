
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  name?: string;
  email?: string;
};

const navItems = [
  { label: "Overview", icon: "◫", href: "/dashboard" },
  { label: "My Career Profile", icon: "◎", href: "/dashboard/profile" },
  { label: "Resume Intelligence", icon: "▤", href: "/dashboard/resume" },
  { label: "Mock Interviews", icon: "◇", href: "/dashboard/mocks" },
  { label: "Daily Challenges", icon: "✳", href: "/dashboard/challenges" },
  { label: "My Progress", icon: "↗", href: "/dashboard/progress" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const currentPage =
    navItems.find((item) =>
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname.startsWith(item.href)
    ) ?? navItems[0];

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.replace("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to verify your session.");
        }

        const data = await response.json();

        if (!cancelled) {
          setUser(data.user ?? data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          router.replace("/");
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/");
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading your workspace...</p>
      </div>
    );
  }
  function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

  return (
    <main className="stry-dashboard">
      <aside className="stry-sidebar">
        <div className="stry-brand">
          
<Link
  href="/"
  className="brand stry-dashboard-brand"
  aria-label="Stryvexi home"
>
  <BrandMark />
  <span>
    STRYVEXI<span className="brand-period">.</span>
  </span>
</Link>

        </div>

        <div className="stry-sidebar-caption">WORKSPACE</div>

        <nav className="stry-nav">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <button
                key={item.href}
                type="button"
                className={`stry-nav-item${active ? " active" : ""}`}
                onClick={() => router.push(item.href)}
              >
                <span className="stry-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="stry-sidebar-bottom">
          <div className="stry-sidebar-note">
            <strong>Your next chapter starts here.</strong>
            <p>Build your skills. Track your growth. Get career-ready.</p>
          </div>

          <button
            type="button"
            className="stry-logout"
            onClick={logout}
          >
            <span>↪</span>
            <span>Log out</span>
          </button>
        </div>

        <div className="stry-sidebar-footer">
          Stryvexi · Your career companion
        </div>
      </aside>

      <section className="stry-main">
        <header className="stry-topbar">
          <div>
            <div className="stry-breadcrumb">
              STRYVEXI WORKSPACE / {currentPage.label.toUpperCase()}
            </div>
            <div className="stry-topbar-subtitle">
              Your career, in focus.
            </div>
          </div>

          <button
            type="button"
            className="stry-avatar"
            title={user?.name || user?.email || "My profile"}
            onClick={() => router.push("/dashboard/profile")}
          >
            {(user?.name || user?.email || "U")
              .trim()
              .charAt(0)
              .toUpperCase()}
          </button>
        </header>

        {children}
      </section>
    </main>
  );
}
