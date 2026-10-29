
"use client";

import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {useSpeechRecognition,} from "react-speech-recognition";
/*@ts-ignore*/
import "./mocks.css";
import LoadingAnimation from "@/app/components/LoadingAnimation";

type InterviewSession = {
  id: string;
  targetRole: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  questions: Question[];
  totalQuestions: number;
};

type AnswerFeedback = {
  question: string | undefined;
  questionIndex: number;
  score: number;
  feedback: string;
  suggestedAnswer: string;
  candidateAnswer: string;
};

type InterviewReport = {
  overallScore: number;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  communicationFeedback: string;
  technicalFeedback: string;
  answers: AnswerFeedback[];
  completedAt?: number;
};

type Screen = "setup" | "interview" | "report";
type MainTab = "practice" | "history";

type HistoryItem = {
  id: string;
  targetRole: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  questionCount: number;
  status: string;
  createdAt?: number;
  completedAt?: number;
  overallScore?: number | null;
};

type HistoryDetail = HistoryItem & {
  questions: Question[];
  answers?: { questionIndex: number; answer: string; submittedAt?: number }[];
  report?: InterviewReport;
};

type Question = {
  question: string;
  focus: string;
};

export default function MockInterviewPage() {
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("1–3 years");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Medium");

  const [screen, setScreen] = useState<Screen>("setup");
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [report, setReport] = useState<InterviewReport | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [questionCount, setQuestionCount] = useState(10);

  const [activeTab, setActiveTab] = useState<MainTab>("practice");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedHistory, setSelectedHistory] = useState<HistoryDetail | null>(null);
  const [historyDetailLoading, setHistoryDetailLoading] = useState(false);

  const recognitionRef = useRef<any>(null);
  const {
  transcript,
  listening,
  resetTranscript,
  browserSupportsSpeechRecognition,
  isMicrophoneAvailable,
} = useSpeechRecognition();

  const currentQuestion = session?.questions[questionIndex];
  const answeredCount = questionIndex;
  const progress = session
    ? (answeredCount / session.totalQuestions) * 100
    : 0;

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition may already have stopped.
      }
    };
  }, []);

  async function startInterview(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!targetRole.trim()) {
      setError("Enter the role you want to practice for.");
      return;
    }

    try {
      setBusy(true);

      const response = await fetch("/api/mock-interviews/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            targetRole: targetRole.trim(),
            experienceLevel,
            interviewType,
            difficulty,
            questionCount,
          }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.session) {
        throw new Error(result.message || "Unable to start interview.");
      }

      setSession(result.session);
      setQuestionIndex(0);
      setAnswer("");
      setReport(null);
      setScreen("interview");
      setActiveTab("practice");
      setNotice("Your interview is ready. Take a breath and begin.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to start interview."
      );
    } finally {
      setBusy(false);
    }
  }

  async function loadHistory() {
    setHistoryLoading(true);
    setHistoryError("");
    setSelectedHistory(null);

    try {
      const response = await fetch("/api/mock-interviews/history", {
        method: "GET",
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to load previous interviews.");
      }

      setHistory(Array.isArray(result.sessions) ? result.sessions : []);
    } catch (err) {
      setHistoryError(
        err instanceof Error ? err.message : "Unable to load previous interviews."
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  async function openHistoryItem(item: HistoryItem) {
    setHistoryDetailLoading(true);
    setHistoryError("");
    setSelectedHistory(null);

    try {
      const response = await fetch(
        `/api/mock-interviews/${encodeURIComponent(item.id)}`,
        { method: "GET", cache: "no-store" }
      );
      const result = await response.json();

      if (!response.ok || !result.success || !result.session) {
        throw new Error(result.message || "Unable to load this interview report.");
      }

      setSelectedHistory(result.session);
    } catch (err) {
      setHistoryError(
        err instanceof Error ? err.message : "Unable to load this interview report."
      );
    } finally {
      setHistoryDetailLoading(false);
    }
  }

  function showHistoryTab() {
    setActiveTab("history");
    void loadHistory();
  }

  function showPracticeTab() {
    setActiveTab("practice");
    setSelectedHistory(null);
    setHistoryError("");
  }

const startRecording = async () => {
  setError("");

  if (!browserSupportsSpeechRecognition) {
    setError(
      "Speech recognition is not supported in this browser. Please use Chrome or type your answer."
    );
    return;
  }

  try {
    resetTranscript();

    await SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  } catch {
    setError("Unable to start the microphone. Please check microphone permissions.");
  }
};

const stopRecording = async () => {
  await SpeechRecognition.stopListening();

  // Preserve the final recognized text in the editable answer.
  setAnswer((previous) => {
    const spokenText = transcript.trim();

    if (!spokenText) return previous;

    return [previous.trim(), spokenText]
      .filter(Boolean)
      .join(" ");
  });

  resetTranscript();
};


async function submitAnswer() {
  if (!session || !currentQuestion || busy) return;

  setError("");
  setNotice("");

  const submittedAnswer = answer.trim();

  if (!submittedAnswer) {
    setError("Record or type your answer before continuing.");
    return;
  }

  if (submittedAnswer.length > 12000) {
    setError("Your answer is too long. Please shorten it.");
    return;
  }

  try {
    setBusy(true);

    if (listening) {
      await stopRecording();
    }

    const response = await fetch("/api/mock-interviews/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session.id,
        questionIndex,
        answer: submittedAnswer,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to save your answer.");
    }

    const totalQuestions =
      result.totalQuestions ?? session.totalQuestions;

    if (questionIndex < totalQuestions - 1) {
      setAnswer("");
      setQuestionIndex((previous) => previous + 1);
      setNotice("");
    } else {
      await completeInterview(session.id);
    }
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Unable to submit your answer."
    );
  } finally {
    setBusy(false);
  }
}

  async function completeInterview(sessionId: string) {
    setNotice("All answers saved. Preparing your final AI report…");

    const response = await fetch("/api/mock-interviews/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.report) {
      throw new Error(result.message || "Unable to prepare your final report.");
    }

    setReport(result.report);
    setScreen("report");
    setNotice("");
  }

  function resetInterview() {
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore already stopped recognition.
    }

    setSession(null);
    setReport(null);
    setQuestionIndex(0);
    setAnswer("");
    setError("");
    setNotice("");
    setScreen("setup");
  }

  return (
    <main className="mock-page">
      <div className="mock-container">
      <header className="mock-header">
        <div>
          <span className="mock-eyebrow">CAREER GROWTH</span>
          <h1>Mock Interviews</h1>
          <p>
            Practice with purpose. Build confidence. Walk into your next
            interview prepared.
          </p>
        </div>
        <div className="mock-header-icon" aria-hidden="true">✳</div>
      </header>

      {screen === "setup" && (
        <nav className="mock-tabs" aria-label="Mock interview sections">
          <button
            type="button"
            className={`mock-tab ${activeTab === "practice" ? "active" : ""}`}
            onClick={showPracticeTab}
            aria-selected={activeTab === "practice"}
            role="tab"
          >
            <span aria-hidden="true">✦</span>
            Practice interview
          </button>
          <button
            type="button"
            className={`mock-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={showHistoryTab}
            aria-selected={activeTab === "history"}
            role="tab"
          >
            <span aria-hidden="true">◷</span>
            Previous interviews
          </button>
        </nav>
      )}

      {error && <div className="mock-message mock-error" role="alert">{error}</div>}
      {notice && <div className="mock-message mock-notice" role="status">{notice}</div>}

      {screen === "setup" && activeTab === "practice" && (
        <>
          <section className="mock-hero">
            <div>
              <span className="mock-pill">
                  {questionCount} QUESTIONS · AI EVALUATION
              </span>
              <h2>Your next interview<br /><span>starts here.</span></h2>
              <p>
                A focused practice session tailored to your target role.
                Answer aloud, review your transcript, and receive your
                performance report after all {questionCount} questions.
              </p>
              <div className="mock-hero-points">
                <span>01 · Speak naturally</span>
                <span>02 · Complete {questionCount} questions</span>
                <span>03 · Get your final report</span>
              </div>
            </div>
            <div className="mock-hero-visual" aria-hidden="true">
              <div className="mock-orbit" />
              <div className="mock-visual-card">
                <span className="mock-visual-icon">◉</span>
                <strong>Interview mode</strong>
                <span>Voice-enabled practice</span>
                <div className="mock-wave">
                  {Array.from({ length: 19 }, (_, i) => (
                    <i key={i} style={{ height: `${12 + ((i * 17) % 35)}px` }} />
                  ))}
                </div>
                <span className="mock-visual-tag">YOUR MOMENT TO SHINE</span>
              </div>
            </div>
          </section>

          <section className="mock-setup-card">
            <div className="mock-section-title">
              <span className="mock-step">STEP 01</span>
              <h2>Configure your interview</h2>
              <p>Choose the interview that matches your next opportunity.</p>
            </div>

            <form onSubmit={startInterview}>
              <label className="mock-field mock-field-full">
                <span>Target job role <b>*</b></span>
                <input
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  placeholder="e.g. Senior Full Stack Developer"
                  maxLength={150}
                  required
                />
              </label>

              <div className="mock-form-grid">
                <label className="mock-field">
                  <span>Experience level</span>
                  <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    <option>Fresher</option>
                    <option>1–3 years</option>
                    <option>3–5 years</option>
                    <option>5–8 years</option>
                    <option>8+ years</option>
                  </select>
                </label>

                <label className="mock-field">
                  <span>Interview type</span>
                  <select value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                    <option>Mixed</option>
                    <option>Technical</option>
                    <option>Behavioral</option>
                    <option>HR</option>
                  </select>
                </label>

                <label className="mock-field">
                  <span>Difficulty</span>
                  <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </label>
                <label className="mock-field">
  <span>Number of questions</span>
  <select
    value={questionCount}
    onChange={(event) => setQuestionCount(Number(event.target.value))}
  >
    <option value={5}>5 questions</option>
    <option value={10}>10 questions</option>
    <option value={15}>15 questions</option>
    <option value={20}>20 questions</option>
  </select>
</label>

                <div className="mock-question-count">
                  <span>Session length</span>
                  <strong>{questionCount}</strong>
                  <small>Final report after your last answer</small>
                </div>
              </div>

              <div className="mock-privacy">
                <span>◈</span>
                <p>
                  Your answers are transcribed into text and saved with your
                  interview session. This version does not record or store audio.
                </p>
              </div>

              <button className="mock-primary-button" type="submit" disabled={busy}>
                {busy ? "Preparing your interview…" : "Start mock interview"}
                {!busy && <span>→</span>}
              </button>
            </form>
          </section>
        </>
      )}

      {screen === "setup" && activeTab === "history" && (
        <section className="mock-history">
          {!selectedHistory ? (
            <>
              <div className="mock-history-heading">
                <div>
                  <span className="mock-step">YOUR PROGRESS</span>
                  <h2>Previous interviews - {history.length}</h2>
                  <p>Revisit your questions, answers, scores, and AI feedback.</p>
                </div>
                <button
                  type="button"
                  className="mock-secondary-button"
                  onClick={() => void loadHistory()}
                  disabled={historyLoading}
                >
                  {historyLoading ? "Refreshing…" : "↻ Refresh"}
                </button>
              </div>

              {historyError && (
                <div className="mock-message mock-error" role="alert">{historyError}</div>
              )}

              {historyLoading ? (
  <LoadingAnimation />
) : history.length === 0 ? (
                <div className="mock-history-empty">
                  <span className="mock-history-empty-icon">✦</span>
                  <h3>Your story starts with the first interview</h3>
                  <p>Completed sessions will appear here with your answers and personalised feedback.</p>
                  <button
                    type="button"
                    className="mock-primary-button"
                    onClick={showPracticeTab}
                  >
                    Start your first interview <span>→</span>
                  </button>
                </div>
              ) : (
                <div className="mock-history-list">
                  {history.map((item) => (
                    <article className="mock-history-card" key={item.id}>
                      <div className="mock-history-card-top">
                        <span className={`mock-history-status ${item.status === "completed" ? "completed" : ""}`}>
                          {item.status === "completed" ? "● Completed" : "● In progress"}
                        </span>
                        <span className="mock-history-date">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(undefined, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Date unavailable"}
                        </span>
                      </div>
                      <h3>{item.targetRole || "Mock interview"}</h3>
                      <p className="mock-history-meta">
                        {item.interviewType} · {item.difficulty} · {item.experienceLevel}
                      </p>
                      <div className="mock-history-card-bottom">
                        <div className="mock-history-stat">
                          <strong>{item.questionCount}</strong>
                          <span>Questions</span>
                        </div>
                        <div className="mock-history-stat">
                          <strong>{item.overallScore == null ? "—" : `${item.overallScore}/100`}</strong>
                          <span>Overall score</span>
                        </div>
                        <button
                          type="button"
                          className="mock-secondary-button"
                          onClick={() => void openHistoryItem(item)}
                          disabled={historyDetailLoading}
                        >
                          {historyDetailLoading ? "Loading…" : "View review →"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="mock-history-detail">
              <button
                type="button"
                className="mock-back-button"
                onClick={() => setSelectedHistory(null)}
              >
                ← Back to interview history
              </button>

              {historyError && (
                <div className="mock-message mock-error" role="alert">{historyError}</div>
              )}

              <div className="mock-history-detail-heading">
                <span className="mock-pill">PAST INTERVIEW REVIEW</span>
                <h2>{selectedHistory.targetRole}</h2>
                <p>
                  {selectedHistory.interviewType} · {selectedHistory.difficulty} ·{" "}
                  {selectedHistory.experienceLevel}
                </p>
              </div>

              {selectedHistory.report ? (
                <>
                  <div className="mock-history-score-panel">
                    <div>
                      <span>OVERALL SCORE</span>
                      <strong>{selectedHistory.report.overallScore}<small>/100</small></strong>
                    </div>
                    <p>{selectedHistory.report.overallFeedback}</p>
                  </div>

                  <div className="mock-report-grid">
                    <article className="mock-report-card">
                      <span className="mock-step">WHAT WENT WELL</span>
                      <h3>Your strengths</h3>
                      <ul>
                        {selectedHistory.report.strengths?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </article>
                    <article className="mock-report-card">
                      <span className="mock-step">NEXT STEPS</span>
                      <h3>Areas to improve</h3>
                      <ul>
                        {selectedHistory.report.improvements?.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </article>
                    <article className="mock-report-card">
                      <span className="mock-step">COMMUNICATION</span>
                      <h3>Communication feedback</h3>
                      <p>{selectedHistory.report.communicationFeedback}</p>
                    </article>
                    <article className="mock-report-card">
                      <span className="mock-step">ROLE KNOWLEDGE</span>
                      <h3>Technical feedback</h3>
                      <p>{selectedHistory.report.technicalFeedback}</p>
                    </article>
                  </div>

                  <div className="mock-answer-review">
                    <div className="mock-section-title">
                      <span className="mock-step">QUESTION-BY-QUESTION REVIEW</span>
                      <h2>Review your answers</h2>
                      <p>Compare your original response with the AI feedback and suggested answer.</p>
                    </div>
                    {(selectedHistory.report.answers || []).map((item, index) => (
                      <details className="mock-review-item" key={`${selectedHistory.id}-${item.questionIndex ?? index}`}>
                        <summary>
                          <span className="mock-review-number">
                            {((item.questionIndex ?? index) + 1).toString().padStart(2, "0")}
                          </span>
                          <span className="mock-review-title">
                            {item.question || selectedHistory.questions?.[item.questionIndex ?? index]?.question || `Question ${(index + 1)}`}
                          </span>
                          <strong>{item.score}/100</strong>
                        </summary>
                        <div className="mock-review-content">
                          <h4>Your answer</h4>
                          <p>{item.candidateAnswer || "No answer recorded for this question."}</p>
                          <h4>AI feedback</h4>
                          <p>{item.feedback}</p>
                          <h4>Example of a stronger answer</h4>
                          <p>{item.suggestedAnswer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mock-history-empty">
                  <h3>{selectedHistory.status === "completed" ? "Report not available" : "This interview is still in progress"}</h3>
                  <p>
                    {selectedHistory.status === "completed"
                      ? "This session does not contain a saved report yet."
                      : "Only submitted answers are available until the interview is completed."}
                  </p>
                  {selectedHistory.status !== "completed" && selectedHistory.answers?.length ? (
                    <div className="mock-history-answers">
                      {selectedHistory.answers.map((item) => (
                        <article key={item.questionIndex} className="mock-review-content">
                          <h4>Question {(item.questionIndex + 1)}</h4>
                          <p>{selectedHistory.questions?.[item.questionIndex]?.question}</p>
                          <h4>Your answer</h4>
                          <p>{item.answer}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {screen === "interview" && session && currentQuestion && (
        <section className="mock-room">
          <div className="mock-room-top">
            <div>
              <span className="mock-eyebrow">LIVE PRACTICE SESSION</span>
              <h2>{session.targetRole}</h2>
              <p>{session.interviewType} interview · {session.difficulty}</p>
            </div>
            <span className="mock-session-badge">● IN PROGRESS</span>
          </div>

          <div className="mock-progress">
            <div className="mock-progress-label">
              <span>Question {questionIndex + 1} of {session.totalQuestions}</span>
              <span>{Math.round(progress)}% completed</span>
            </div>
            <div className="mock-progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
            <div className="mock-progress-dots">
              {session.questions.map((_, index) => (
                <span
                  key={index}
                  className={index < questionIndex ? "done" : index === questionIndex ? "active" : ""}
                />
              ))}
            </div>
          </div>

          <article className="mock-question-card">
            <span className="mock-step">QUESTION {(questionIndex + 1).toString().padStart(2, "0")}</span>
            <h2>{currentQuestion.question}</h2>
            <p className="mock-question-hint">
              Speak as you would to a real interviewer. Your answer will not
              be evaluated until the final report.
            </p>
          </article>

          <section className="mock-answer-card">
            <div className="mock-answer-heading">
              <div>
                <h3>Your answer</h3>
                <p>Use voice input or type your response below.</p>
              </div>
              <span className={listening ? "mock-mic-status listening" : "mock-mic-status"}>
                {listening ? "Listening" : "Voice input"}
              </span>
            </div>

          <div className="mock-voice-controls">
  {!listening ? (
    <button type="button" onClick={startRecording}>
      🎙️ Start speaking
    </button>
  ) : (
    <button type="button" onClick={stopRecording}>
      ⏹ Stop speaking
    </button>
  )}

  <span>
    {listening ? "Listening…" : "Microphone stopped"}
  </span>
</div>

{listening && (
  <div className="mock-live-transcript" aria-live="polite">
    {transcript || "Speak your answer. Your words will appear here…"}
  </div>
)}

{!browserSupportsSpeechRecognition && (
  <p>
    Speech recognition is unavailable in this browser. You can type your answer instead.
  </p>
)}

{browserSupportsSpeechRecognition && !isMicrophoneAvailable && (
  <p>Please allow microphone access to answer by voice.</p>
)}

            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Your spoken answer will appear here. You can also type or edit your answer..."
              rows={8}
              maxLength={12000}
              disabled={busy}
            />

            <div className="mock-answer-footer">
              <span>Review your transcript before submitting.</span>
              <span>{answer.length}/12000</span>
            </div>

            <div className="mock-submit-row">
              <button
                type="button"
                className="mock-text-button"
                onClick={resetInterview}
                disabled={busy}
              >
                End session
              </button>
              <button
  type="button"
  className="mock-primary-button"
  onClick={submitAnswer}
  disabled={busy || !answer.trim()}
>
  {busy
    ? "Saving answer…"
    : questionIndex === session.totalQuestions - 1
      ? "Finish & generate report"
      : "Submit & next question"}
  {!busy && <span>→</span>}
</button>
            </div>
          </section>
        </section>
      )}

      {screen === "report" && report && (
        <section className="mock-report">
          <div className="mock-report-hero">
            <span className="mock-pill">INTERVIEW COMPLETE</span>
            <h2>Your performance report</h2>
            <p>
  You completed {session?.totalQuestions ?? report.answers.length} questions.
  Here's your feedback.
</p>
            <div className="mock-score">
              <strong>{report.overallScore}</strong>
              <span>/100</span>
            </div>
            <p className="mock-score-caption">Overall interview score</p>
            <p className="mock-report-summary">{report.overallFeedback}</p>
          </div>

          <div className="mock-report-grid">
            <article className="mock-report-card">
              <span className="mock-step">01 · WHAT WENT WELL</span>
              <h3>Your strengths</h3>
              <ul>
                {report.strengths.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </article>
            <article className="mock-report-card">
              <span className="mock-step">02 · NEXT STEPS</span>
              <h3>Areas to improve</h3>
              <ul>
                {report.improvements.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </article>
            <article className="mock-report-card">
              <span className="mock-step">03 · COMMUNICATION</span>
              <h3>Communication feedback</h3>
              <p>{report.communicationFeedback}</p>
            </article>
            <article className="mock-report-card">
              <span className="mock-step">04 · ROLE KNOWLEDGE</span>
              <h3>Technical feedback</h3>
              <p>{report.technicalFeedback}</p>
            </article>
          </div>

          <div className="mock-answer-review">
            <div className="mock-section-title">
              <span className="mock-step">QUESTION-BY-QUESTION REVIEW</span>
              <h2>Learn from every answer</h2>
              <p>Use these suggestions to prepare for your next attempt.</p>
            </div>
            {report.answers.map((item) => (
              <details className="mock-review-item" key={item.questionIndex}>
                <summary>
                  <span className="mock-review-number">
                    {(item.questionIndex + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="mock-review-title">
                    {item.question || session?.questions[item.questionIndex]?.question || `Question ${item.questionIndex + 1}`}
                  </span>
                  <strong>{item.score}/100</strong>
                </summary>
                <div className="mock-review-content">
  <h4>Your answer</h4>
  <p>{item.candidateAnswer || "No answer recorded."}</p>

  <h4>Feedback</h4>
  <p>{item.feedback}</p>

  <h4>Example of a stronger answer</h4>
  <p>{item.suggestedAnswer}</p>
</div>
              </details>
            ))}
          </div>

          <button className="mock-primary-button" onClick={resetInterview}>
            Start another interview <span>→</span>
          </button>
        </section>
      )}
    </div>
    </main>
  );
}
