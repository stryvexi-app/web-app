
"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
/*@ts-ignore*/
import "./resume.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type ResumeAnalysis = {
  id: string;
  targetRole: string;
  fileName: string;
  score: number;
  summary: string;
  strengths: string[];
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
  roleAlignment: string;
  atsSuggestions: string[];
  createdAt: number;
};

export default function ResumeIntelligencePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
const [analyzing, setAnalyzing] = useState(false);

  function selectFile(selectedFile?: File) {
    setError("");
    setNotice("");

    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isValidType =
      extension === "pdf" || extension === "docx";

    if (!isValidType) {
      setError("Please select a PDF or DOCX file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Your file must be smaller than 10 MB.");
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty. Please choose another file.");
      return;
    }

    setFile(selectedFile);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);

    // Allow selecting the same file again after removing it.
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    setFile(null);
    setError("");
    setNotice("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }


async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");
  setNotice("");
  setAnalysis(null);

  if (!file) {
    setError("Upload your resume before continuing.");
    return;
  }

  if (!targetRole.trim()) {
    setError("Enter the job role you are targeting.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", file);
  formData.append("targetRole", targetRole.trim());
  formData.append("jobDescription", jobDescription.trim());

  try {
    setAnalyzing(true);

    const response = await fetch("/api/resume/analyze", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.analysis) {
      throw new Error(result.message || "Resume analysis failed.");
    }

    setAnalysis(result.analysis as ResumeAnalysis);
    setNotice("Your resume analysis is ready.");
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to analyze your resume. Please try again."
    );
  } finally {
    setAnalyzing(false);
  }
}


  const fileSize = file
    ? file.size < 1024 * 1024
      ? `${Math.max(1, Math.round(file.size / 1024))} KB`
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    : "";

  return (
    <main className="resume-page">
      <header className="resume-page-header">
        <div>
          <span className="resume-eyebrow">
            CAREER INTELLIGENCE
          </span>
          <h1>Resume Intelligence</h1>
          <p>
            Turn your experience into a resume that tells a stronger
            professional story.
          </p>
        </div>

        <div className="resume-header-mark" aria-hidden="true">
          <span>▤</span>
          <i />
        </div>
      </header>

      <section className="resume-hero">
        <div className="resume-hero-copy">
          <span className="resume-hero-label">
            <span className="resume-status-dot" />
            YOUR NEXT MOVE STARTS HERE
          </span>

          <h2>
            Your experience.
            <br />
            <span>Your next opportunity.</span>
          </h2>

          <p>
            Upload your resume to prepare for a deeper review of your
            skills, experience, keywords, and alignment with your target
            role.
          </p>

          <div className="resume-hero-points">
            <span><b>01</b> Resume review</span>
            <span><b>02</b> Skills & keywords</span>
            <span><b>03</b> Role alignment</span>
          </div>
        </div>

        <div className="resume-hero-art" aria-hidden="true">
          <div className="resume-art-orbit resume-art-orbit-one" />
          <div className="resume-art-orbit resume-art-orbit-two" />
          <div className="resume-art-document">
            <div className="resume-art-top">
              <span />
              <span />
            </div>
            <div className="resume-art-avatar">S</div>
            <div className="resume-art-line resume-art-line-wide" />
            <div className="resume-art-line resume-art-line-short" />
            <div className="resume-art-section-title" />
            <div className="resume-art-line" />
            <div className="resume-art-line" />
            <div className="resume-art-line resume-art-line-short" />
            <div className="resume-art-section-title" />
            <div className="resume-art-skills">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="resume-art-star">✳</div>
          <div className="resume-art-badge">NEXT MOVE</div>
        </div>
      </section>

      <div className="resume-section-heading">
        <div>
          <span className="resume-eyebrow">STEP 01</span>
          <h2>Prepare your resume</h2>
          <p>Start with your latest resume and the role you want.</p>
        </div>
      </div>

      <form className="resume-workspace" onSubmit={handleSubmit}>
        <section className="resume-panel">
          <div className="resume-panel-heading">
            <div className="resume-panel-icon">↑</div>
            <div>
              <h3>Upload your resume</h3>
              <p>Choose the latest version of your resume.</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            className="resume-file-input"
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            aria-label="Choose resume file"
          />

          {!file ? (
            <div
              className={`resume-dropzone ${dragging ? "is-dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <div className="resume-upload-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15.5v3A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h4>Drop your resume here</h4>
              <p>or choose a file from your device</p>

              <button
                className="resume-secondary-button"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse files
              </button>

              <div className="resume-file-rules">
                <span>PDF or DOCX</span>
                <span>Maximum 10 MB</span>
              </div>
            </div>
          ) : (
            <div className="resume-selected-file">
              <div className="resume-file-type">
                {file.name.toLowerCase().endsWith(".pdf")
                  ? "PDF"
                  : "DOCX"}
              </div>

              <div className="resume-file-details">
                <strong>{file.name}</strong>
                <span>{fileSize} · Selected on this device</span>
                <span className="resume-file-ready">
                  <span /> Ready for upload
                </span>
              </div>

              <button
                className="resume-remove-button"
                type="button"
                onClick={removeFile}
                aria-label="Remove selected resume"
              >
                Remove
              </button>
            </div>
          )}

          <p className="resume-privacy-note">
            <span>♧</span>
            Your resume is securely sent for analysis. The analysis result is saved
to your account so you can access it later.
          </p>
        </section>

        <section className="resume-panel">
          <div className="resume-panel-heading">
            <div className="resume-panel-icon">◎</div>
            <div>
              <h3>Define your target</h3>
              <p>Tell us what kind of opportunity you want.</p>
            </div>
          </div>

          <label className="resume-field">
            <span>Target job role <b>*</b></span>
            <input
              type="text"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="e.g. Senior Full Stack Developer"
              maxLength={150}
            />
            <small>The position you want to apply for.</small>
          </label>

          <label className="resume-field">
            <span>
              Job description <em>OPTIONAL</em>
            </span>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste a job description here to prepare for a role-specific resume comparison..."
              rows={5}
              maxLength={15000}
            />
            <small>
              Add a job description to prepare for keyword and role
              matching.
            </small>
          </label>

          <div className="resume-match-preview">
            <span className="resume-match-preview-icon">✳</span>
            <div>
              <strong>Built around your next move</strong>
              <p>
                Your target role will guide the review once analysis is
                connected.
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="resume-message resume-message-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div
            className="resume-message resume-message-info"
            role="status"
          >
            {notice}
          </div>
        )}

        <div className="resume-submit-row">
          <p>
            <span>✦</span> Your next move deserves a stronger story.
          </p>
          
<button
  className="resume-primary-button"
  type="submit"
  disabled={analyzing}
>
  {analyzing ? "Analyzing your resume..." : "Analyze my resume"}
  {!analyzing && <span>→</span>}
</button>

        </div>
      </form>

    
<section className="resume-insights-section">
  <div className="resume-section-heading">
    <div>
      <span className="resume-eyebrow">
        {analysis ? "ANALYSIS COMPLETE" : "WHAT COMES NEXT"}
      </span>
      <h2>Your resume review</h2>
      <p>
        {analysis
          ? `Analysis for ${analysis.targetRole}`
          : "Upload your resume to see personalized insights."}
      </p>
    </div>
    <span className="resume-coming-soon">
      {analysis ? "REVIEW READY" : "AWAITING RESUME"}
    </span>
  </div>

  {analysis ? (
    <div className="resume-analysis-results">
      <article className="resume-insight-card">
        <div className="resume-insight-icon">◉</div>
        <span className="resume-insight-number">01</span>
        <h3>Resume strength</h3>
        <p>
          <strong>{analysis.score}/100</strong>
        </p>
        <p>{analysis.summary}</p>
        <h4>Strengths</h4>
        <ul>
          {analysis.strengths.map((item, index) => (
            <li key={`strength-${index}`}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="resume-insight-card">
        <div className="resume-insight-icon">⌘</div>
        <span className="resume-insight-number">02</span>
        <h3>Skills &amp; keywords</h3>
        <h4>Matched skills</h4>
        <ul>
          {analysis.matchedSkills.map((item, index) => (
            <li key={`matched-${index}`}>{item}</li>
          ))}
        </ul>
        <h4>Skills to consider developing or highlighting</h4>
        <ul>
          {analysis.missingSkills.map((item, index) => (
            <li key={`missing-${index}`}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="resume-insight-card">
        <div className="resume-insight-icon">↗</div>
        <span className="resume-insight-number">03</span>
        <h3>Improvement plan</h3>
        <h4>Role alignment</h4>
        <p>{analysis.roleAlignment}</p>
        <h4>Recommended improvements</h4>
        <ul>
          {analysis.improvements.map((item, index) => (
            <li key={`improvement-${index}`}>{item}</li>
          ))}
        </ul>
        <h4>ATS suggestions</h4>
        <ul>
          {analysis.atsSuggestions.map((item, index) => (
            <li key={`ats-${index}`}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  ) : (
    <div className="resume-insight-grid">
      <article className="resume-insight-card">
        <div className="resume-insight-icon">◉</div>
        <span className="resume-insight-number">01</span>
        <h3>Resume strength</h3>
        <p>Review structure, clarity, readability, and your professional story.</p>
        <span className="resume-insight-status">Not analyzed yet</span>
      </article>

      <article className="resume-insight-card">
        <div className="resume-insight-icon">⌘</div>
        <span className="resume-insight-number">02</span>
        <h3>Skills &amp; keywords</h3>
        <p>Identify relevant skills and keywords for your target position.</p>
        <span className="resume-insight-status">Not analyzed yet</span>
      </article>

      <article className="resume-insight-card">
        <div className="resume-insight-icon">↗</div>
        <span className="resume-insight-number">03</span>
        <h3>Improvement plan</h3>
        <p>Get actionable recommendations for a stronger resume.</p>
        <span className="resume-insight-status">Not analyzed yet</span>
      </article>
    </div>
  )}
</section>


      <footer className="resume-footer">
        <span>STRYVEXI</span>
        <span>OWN YOUR NEXT MOVE.</span>
      </footer>
    </main>
  );
}
