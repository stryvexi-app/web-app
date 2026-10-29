
"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type SignupModalProps = {
  open: boolean;
  onClose: () => void;
};

type SignupStep = "details" | "otp" | "success";

export default function SignupModal({ open, onClose }: SignupModalProps) {
  const [step, setStep] = useState<SignupStep>("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    experience: "",
  });

  const [resume, setResume] = useState<File | null>(null);
  const [otp, setOtp] = useState("");

  if (!open) return null;

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function validateForm() {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    if (!/^\+?[0-9\s()-]{10,16}$/.test(form.phone))
      return "Please enter a valid phone number.";
    if (form.password.length < 8)
      return "Your password must contain at least 8 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    if (!form.role.trim()) return "Please enter your target job role.";
    if (!form.experience) return "Please select your experience level.";
    if (!resume) return "Please upload your resume.";
    if (resume.size > 5 * 1024 * 1024)
      return "Your resume must be smaller than 5 MB.";

    return "";
  }

  async function sendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send verification code.");
      }

      setStep("otp");
      setNotice(`We sent a verification code to ${form.email}.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send the verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid or expired verification code.");
      }

      // The backend must confirm verification before account creation.
      if (data.verified !== true) {
        throw new Error("Email verification was not confirmed.");
      }

      await registerAccount();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function registerAccount() {
    const payload = new FormData();

    payload.append("name", form.name.trim());
    payload.append("email", form.email.trim().toLowerCase());
    payload.append("phone", form.phone.trim());
    payload.append("password", form.password);
    payload.append("targetRole", form.role.trim());
    payload.append("experience", form.experience);

    if (resume) {
      payload.append("resume", resume);
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: payload,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to create your account.");
    }

   setStep("success");
setNotice("Your account has been created successfully.");

router.push("/dashboard");
router.refresh();
  }

  async function resendOtp() {
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to resend the code.");
      }

      setNotice("A new verification code has been sent.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to resend the code."
      );
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
    if (loading) return;

    onClose();

    // Reset the form when the modal is closed.
    setStep("details");
    setError("");
    setNotice("");
    setOtp("");
    setResume(null);
  }

  return (
    <div
      className="signup-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <section
        className="signup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
      >
        <button
          type="button"
          className="signup-close"
          onClick={closeModal}
          disabled={loading}
          aria-label="Close signup"
        >
          ×
        </button>

        <div className="signup-brand">
          <span className="signup-brand-mark">///</span>
          STRYVEXI
        </div>

        <p className="signup-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>

        <h2 id="signup-title">
          {step === "details" && <>Let’s get you <em>ready.</em></>}
          {step === "otp" && <>One last <em>check.</em></>}
          {step === "success" && <>You’re on your <em>way.</em></>}
        </h2>

        <p className="signup-subtitle">
          {step === "details" &&
            "Create your career profile. Add your details and resume to get started."}
          {step === "otp" &&
            `Enter the 6-digit code sent to ${form.email}.`}
          {step === "success" &&
            "Your Stryvexi account is ready. Your next move starts now."}
        </p>

        <div className="signup-progress" aria-label={`Signup step ${step === "details" ? 1 : step === "otp" ? 2 : 3} of 3`}>
          <span className={step === "details" ? "current" : "completed"} />
          <span className={step === "otp" ? "current" : step === "success" ? "completed" : ""} />
          <span className={step === "success" ? "current completed" : ""} />
        </div>

        {step === "details" && (
          <form onSubmit={sendOtp}>
            <div className="signup-fields">
              <label>
                Full name
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Phone number
                <input
                  required
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Your phone number"
                />
              </label>

              <label>
                Target job role
                <input
                  required
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  placeholder="e.g. Frontend Developer"
                />
              </label>

              <label>
                Password
                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="At least 8 characters"
                />
              </label>

              <label>
                Confirm password
                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  placeholder="Re-enter password"
                />
              </label>

              <label className="signup-full-field">
                Experience level
                <select
                  required
                  value={form.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                >
                  <option value="">Select your experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="0-2 years">0–2 years</option>
                  <option value="3-5 years">3–5 years</option>
                  <option value="6+ years">6+ years</option>
                </select>
              </label>
            </div>

            <div className="signup-resume-section">
              <div className="signup-resume-heading">
                <strong>Your resume</strong>
                <span>Required · Max 5 MB</span>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="signup-file-input"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const allowed = /\.(pdf|doc|docx)$/i.test(file.name);

                  if (!allowed) {
                    setError("Upload your resume as a PDF, DOC, or DOCX file.");
                    event.target.value = "";
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    setError("Your resume must be smaller than 5 MB.");
                    event.target.value = "";
                    return;
                  }

                  setResume(file);
                  setError("");
                }}
              />

              <button
                type="button"
                className="signup-resume-picker"
                onClick={() => fileRef.current?.click()}
              >
                <span className="signup-upload-icon">↑</span>
                <span className="signup-resume-text">
                  <strong>
                    {resume ? resume.name : "Upload your resume"}
                  </strong>
                  <small>
                    {resume
                      ? `${(resume.size / 1024).toFixed(0)} KB · Click to replace`
                      : "PDF, DOC or DOCX · Click to browse"}
                  </small>
                </span>
                <span className="signup-browse">
                  {resume ? "Change" : "Browse"}
                </span>
              </button>
            </div>

            <p className="signup-privacy">
              Your resume contains personal information. It will be processed
              according to your privacy policy.
            </p>

            {error && <p className="signup-error" role="alert">{error}</p>}
            {notice && <p className="signup-message" role="status">{notice}</p>}

            <button className="signup-submit" type="submit" disabled={loading}>
              {loading ? "Sending verification code..." : "Verify email & continue"}
              <span>{loading ? "…" : "↗"}</span>
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOtp}>
            <div className="signup-otp-panel">
              <div className="signup-otp-icon">✉</div>
              <label className="signup-otp-label" htmlFor="signup-otp">
                Email verification code
              </label>
              <input
                id="signup-otp"
                className="signup-otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                pattern="[0-9]{6}"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
              />
              <p>Check your inbox and spam folder for the code.</p>
            </div>

            {error && <p className="signup-error" role="alert">{error}</p>}
            {notice && <p className="signup-message" role="status">{notice}</p>}

            <button className="signup-submit" type="submit" disabled={loading}>
              {loading ? "Verifying & creating account..." : "Verify & create account"}
              <span>{loading ? "…" : "↗"}</span>
            </button>

            <button
              type="button"
              className="signup-resend"
              onClick={resendOtp}
              disabled={loading}
            >
              Didn’t receive a code? <strong>Resend OTP</strong>
            </button>

            <button
              type="button"
              className="signup-back"
              onClick={() => {
                setStep("details");
                setError("");
                setNotice("");
                setOtp("");
              }}
              disabled={loading}
            >
              ← Back to your details
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="signup-success">
            <div className="signup-success-icon">✓</div>
            <h3>Welcome to Stryvexi.</h3>
            <p>Your email is verified and your account has been created.</p>
            <button className="signup-submit" type="button" onClick={closeModal}>
              Get started <span>↗</span>
            </button>
          </div>
        )}

        <p className="signup-footer">
          OWN YOUR NEXT MOVE. <span>— STRYVEXI</span>
        </p>
      </section>
    </div>
  );
}
