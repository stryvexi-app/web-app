
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
/* @ts-ignore */
import './login.css'

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
};

export default function LoginModal({
  open,
  onClose,
  onSwitchToSignup,
}: LoginModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setError("");
      setShowPassword(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, loading, onClose]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to log in. Please try again.");
      }

      if (data.success !== true) {
        throw new Error(data.message || "Login could not be confirmed.");
      }

      onClose();
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="login-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        className="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          type="button"
          className="login-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close login"
        >
          ×
        </button>

        <div className="login-brand">
          <span className="login-brand-mark">///</span>
          STRYVEXI
        </div>

        <p className="login-eyebrow">WELCOME BACK</p>

        <h2 id="login-title">
          Your next move <em>awaits.</em>
        </h2>

        <p className="login-subtitle">
          Sign in to continue building your career.
        </p>

        <div className="login-accent-line" />

        <form onSubmit={handleSubmit}>
          <div className="login-fields">
            <label htmlFor="login-email">
              Email address
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
              />
            </label>

            <label htmlFor="login-password">
              Password
              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing you in..." : "Sign in"}
            <span>{loading ? "…" : "↗"}</span>
          </button>
        </form>

        <p className="login-switch">
          New to Stryvexi?{" "}
          {onSwitchToSignup ? (
            <button
              type="button"
              onClick={onSwitchToSignup}
              disabled={loading}
            >
              Create an account
            </button>
          ) : (
            <span>Sign up to get started.</span>
          )}
        </p>

        <p className="login-footer">
          OWN YOUR NEXT MOVE. <span>— STRYVEXI</span>
        </p>
      </section>
    </div>
  );
}
