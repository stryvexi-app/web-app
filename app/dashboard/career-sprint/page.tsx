
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/app/components/LoadingAnimation";

type JourneyType = "fresher" | "job_switch";

type Activity = {
  day: number;
  week: number;
  title: string;
  description: string;
  duration: number;
  xp: number;
  tool: string;
  href: string;
  action?: string;
};

type Journey = {
  id: JourneyType;
  title: string;
  description: string;
  durationDays: number;
  weeks: string[];
};

type SprintStatus = "active" | "completed" | "expired";

type SprintState = {
  sprintId: string;
  journeyType: JourneyType;
  startedAt: number;
  endsAt: number;
  status: SprintStatus;
  completedDays: Record<
    string,
    { completedAt: number }
  >;
};

type ApiData = {
  success: boolean;
  sprint: SprintState | null;
  journey: Journey | null;
  plan: Activity[] | null;
  currentDay: number;
  completedCount?: number;
  progress?: number;
  message?: string;
};

export default function CareerSprintPage() {
  const router = useRouter();

  const [data, setData] = useState<ApiData | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] =
    useState<JourneyType>("fresher");

  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const totalDays = 60;

  // --------------------------------------------------
  // LOAD SPRINT AND JOURNEYS
  // --------------------------------------------------

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [sprintResponse, journeyResponse] =
        await Promise.all([
          fetch("/api/career-sprint", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/career-sprint/journeys", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

      if (
        sprintResponse.status === 401 ||
        journeyResponse.status === 401
      ) {
        router.replace("/login");
        return;
      }

      const sprintPayload = await sprintResponse.json();
      const journeyPayload = await journeyResponse.json();

      if (!sprintResponse.ok || !sprintPayload.success) {
        throw new Error(
          sprintPayload.message ||
            "Unable to load your career sprint."
        );
      }

      if (!journeyResponse.ok || !journeyPayload.success) {
        throw new Error(
          journeyPayload.message ||
            "Unable to load career journeys."
        );
      }

      setData(sprintPayload);
      setJourneys(journeyPayload.journeys || []);

      if (sprintPayload.sprint) {
        setSelectedJourney(
          sprintPayload.sprint.journeyType
        );

        setSelectedDay(
          Math.min(
            sprintPayload.currentDay || 1,
            totalDays
          )
        );
      } else {
        setSelectedDay(1);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load your career sprint."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  // --------------------------------------------------
  // CURRENT SPRINT DATA
  // --------------------------------------------------

  const sprint = data?.sprint || null;
  const plan = data?.plan || [];
  const completed = sprint?.completedDays || {};

  const completedCount = Object.keys(completed).length;

  const progress = Math.round(
    (completedCount / totalDays) * 100
  );

  const today = Math.min(
    data?.currentDay || 1,
    totalDays
  );

  const isActive = sprint?.status === "active";
  const isExpired = sprint?.status === "expired";
  const isCompleted = sprint?.status === "completed";

  const selected =
    plan.find((item) => item.day === selectedDay);

  const selectedIsCompleted = Boolean(
    completed[String(selectedDay)]
  );

  const selectedIsLocked =
    !isActive || selectedDay > today;

  const totalXp = useMemo(() => {
    return plan.reduce(
      (sum, item) =>
        sum +
        (completed[String(item.day)] ? item.xp : 0),
      0
    );
  }, [plan, completed]);

  const weekProgress = useMemo(() => {
    const weekCount =
      data?.journey?.weeks?.length || 8;

    return Array.from(
      { length: weekCount },
      (_, index) => {
        const week = index + 1;

        const days = plan.filter(
          (item) => item.week === week
        );

        const done = days.filter(
          (item) => completed[String(item.day)]
        ).length;

        return {
          week,
          done,
          total: days.length,
          percent: days.length
            ? Math.round((done / days.length) * 100)
            : 0,
          title:
            data?.journey?.weeks?.[index] ||
            `Week ${week}`,
        };
      }
    );
  }, [plan, completed, data?.journey]);

  // --------------------------------------------------
  // START / COMPLETE SPRINT
  // --------------------------------------------------

  async function mutate(
    action: "start" | "complete",
    dayNumber?: number
  ) {
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const endpoint =
        action === "start"
          ? "/api/career-sprint/start"
          : "/api/career-sprint/complete";

      const body =
        action === "start"
          ? {
              journeyType: selectedJourney,
            }
          : {
              dayNumber,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ||
            "Unable to update your career sprint."
        );
      }

      setData(payload);

      if (action === "start") {
        setSelectedDay(1);

        setNotice(
          "Your 60-day career journey has started. Let's make your next move count!"
        );
      } else {
        setNotice(
          `Day ${dayNumber} completed. Great work!`
        );
      }

      // Refresh to keep journey and sprint data synchronized.
      await load();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to update your career sprint."
      );
    } finally {
      setBusy(false);
    }
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
     <LoadingAnimation/>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <main className="cs-page">
      <div className="cs-wrap">

        {/* HERO */}

        <header className="cs-hero">
          <div className="cs-hero-copy">
            <div className="cs-eyebrow">
              <span />
              THE STRYVEXI CAREER SPRINT
            </div>

            <h1>
              60 Days to Your{" "}
              <em>Next Career Move.</em>
            </h1>

            <p>
              A guided career journey to strengthen
              your skills, improve your resume,
              prepare for interviews and take action
              on real opportunities.
            </p>
          </div>

          <div className="cs-stamp">
            <span>YOUR</span>
            <span>NEXT</span>
            <strong>MOVE.</strong>
            <i>✳</i>
          </div>
        </header>

        {/* ALERTS */}

        {error && (
          <div className="cs-alert" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="cs-notice" role="status">
            {notice}
          </div>
        )}

        {/* NO ACTIVE SPRINT */}

        {!isActive && (
          <section className="cs-start-section">

            {isCompleted && (
              <div className="cs-status-banner completed">
                <strong>Congratulations!</strong>
                <span>
                  You completed your previous career
                  journey. You can now start another one.
                </span>
              </div>
            )}

            {isExpired && (
              <div className="cs-status-banner expired">
                <strong>Your previous sprint has expired.</strong>
                <span>
                  Your completed activities and history
                  have been preserved. Start a new journey
                  when you are ready.
                </span>
              </div>
            )}

            <div className="cs-start-card">
              <div>
                <div className="cs-eyebrow">
                  YOUR CAREER, WITH A PLAN
                </div>

                <h2>
                  One focused action every day.
                </h2>

                <p>
                  Choose the journey that matches your
                  current career stage. Complete one
                  activity each day and track your
                  progress over 60 days.
                </p>

                <div className="cs-start-points">
                  <span>✓ 60 guided activities</span>
                  <span>✓ Eight preparation phases</span>
                  <span>✓ Progress saved automatically</span>
                  <span>✓ Your journey stays locked once started</span>
                </div>
              </div>
            </div>

            <div className="cs-journey-heading">
              <div className="cs-eyebrow">
                SELECT YOUR JOURNEY
              </div>

              <h2>
                Where are you in your career?
              </h2>

              <p>
                Select one journey. You cannot switch
                while your sprint is active.
              </p>
            </div>

            <div className="cs-journeys">
              {journeys.map((journey) => (
                <button
                  key={journey.id}
                  type="button"
                  className={
                    selectedJourney === journey.id
                      ? "cs-journey selected"
                      : "cs-journey"
                  }
                  onClick={() =>
                    setSelectedJourney(journey.id)
                  }
                  disabled={busy}
                >
                  <div className="cs-journey-top">
                    <span className="cs-journey-icon">
                      {journey.id === "fresher"
                        ? "✦"
                        : "↗"}
                    </span>

                    <span className="cs-selection">
                      {selectedJourney === journey.id
                        ? "✓ SELECTED"
                        : "SELECT JOURNEY"}
                    </span>
                  </div>

                  <h3>{journey.title}</h3>

                  <p>{journey.description}</p>

                  <div className="cs-journey-bottom">
                    <span>
                      {journey.durationDays} Days
                    </span>
                    <span>
                      {journey.weeks?.length || 8} Weeks
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              className="cs-primary cs-start-button"
              disabled={busy || journeys.length === 0}
              onClick={() => void mutate("start")}
            >
              {busy
                ? "Starting your journey..."
                : "Start my 60-day journey"}
              <span>↗</span>
            </button>
          </section>
        )}

        {/* ACTIVE SPRINT */}

        {isActive && (
          <>
            {/* OVERVIEW */}

            <section className="cs-overview">
              <div className="cs-overview-top">
                <div>
                  <div className="cs-eyebrow">
                    YOUR JOURNEY IS UNDERWAY
                  </div>

                  <h2>
                    {data?.journey?.title ||
                      "Your Career Journey"}
                  </h2>

                  <p className="cs-subtitle">
                    Day {today} of {totalDays}.
                    Keep moving forward.
                  </p>
                </div>

                <div className="cs-percent">
                  {progress}
                  <small>%</small>
                </div>
              </div>

              <div className="cs-track">
                <span
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="cs-overview-foot">
                <span>
                  {completedCount} of {totalDays} activities
                  completed
                </span>

                <span>
                  {totalDays - completedCount} remaining
                </span>
              </div>

              <div className="cs-stats">
                <div>
                  <strong>{completedCount}</strong>
                  <span>Days completed</span>
                </div>

                <div>
                  <strong>
                    {totalDays - completedCount}
                  </strong>
                  <span>Activities left</span>
                </div>

                <div>
                  <strong>{totalXp}</strong>
                  <span>XP earned</span>
                </div>
              </div>

              <div className="cs-journey-lock">
                <span>🔒</span>
                <div>
                  <strong>
                    {data?.journey?.title}
                  </strong>
                  <small>
                    Your selected journey is locked
                    until this sprint is completed or expires.
                  </small>
                </div>
              </div>
            </section>

            {/* ROADMAP + ACTIVITY */}

            <section className="cs-layout">

              {/* ROADMAP */}

              <div className="cs-roadmap cs-panel">
                <div className="cs-panel-head">
                  <div>
                    <div className="cs-eyebrow">
                      THE 60-DAY ROADMAP
                    </div>

                    <h2>
                      Your preparation journey
                    </h2>
                  </div>

                  <span className="cs-count">
                    {completedCount}/60
                  </span>
                </div>

                {weekProgress.map((week) => (
                  <div
                    className="cs-week"
                    key={week.week}
                  >
                    <div className="cs-week-head">
                      <div>
                        <span>
                          WEEK {week.week}
                        </span>

                        <strong>{week.title}</strong>
                      </div>

                      <small>
                        {week.done}/{week.total} done
                      </small>
                    </div>

                    <div className="cs-week-track">
                      <span
                        style={{
                          width: `${week.percent}%`,
                        }}
                      />
                    </div>

                    <div className="cs-days">
                      {plan
                        .filter(
                          (item) =>
                            item.week === week.week
                        )
                        .map((item) => {
                          const done = Boolean(
                            completed[String(item.day)]
                          );

                          const locked =
                            item.day > today;

                          return (
                            <button
                              key={item.day}
                              type="button"
                              disabled={locked}
                              onClick={() =>
                                setSelectedDay(item.day)
                              }
                              className={`cs-day ${
                                selectedDay === item.day
                                  ? "selected"
                                  : ""
                              } ${done ? "done" : ""} ${
                                locked ? "locked" : ""
                              }`}
                              aria-label={`Day ${item.day}: ${item.title}`}
                            >
                              {done
                                ? "✓"
                                : String(item.day).padStart(
                                    2,
                                    "0"
                                  )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ))}

                <p className="cs-roadmap-note">
                  Missed a day? No problem. Earlier
                  unlocked activities remain available.
                  Your sprint does not reset.
                </p>
              </div>

              {/* ACTIVITY DETAILS */}

              <aside className="cs-activity cs-panel">
                {selected ? (
                  <>
                    <div className="cs-eyebrow">
                      DAY{" "}
                      {String(selected.day).padStart(
                        2,
                        "0"
                      )}
                      {" · "}WEEK {selected.week}
                    </div>

                    <div className="cs-activity-status">
                      {selectedIsCompleted
                        ? "✓ COMPLETED"
                        : selectedIsLocked
                          ? "LOCKED"
                          : "YOUR ACTIVITY"}
                    </div>

                    <h2>{selected.title}</h2>

                    <p>{selected.description}</p>

                    <div className="cs-meta">
                      <span>
                        ◷ {selected.duration} min
                      </span>

                      <span>
                        ✦ {selected.xp} XP
                      </span>
                    </div>

                    <div className="cs-tool">
                      <span>YOUR STRYVEXI TOOL</span>

                      <strong>{selected.tool}</strong>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(selected.href)
                        }
                      >
                        {selected.action ||
                          `Open ${selected.tool}`}{" "}
                        ↗
                      </button>
                    </div>

                    {selectedIsCompleted ? (
                      <div className="cs-completed-note">
                        You completed this activity.
                        You can revisit it anytime.
                      </div>
                    ) : !selectedIsLocked ? (
                      <button
                        className="cs-primary cs-complete"
                        disabled={busy}
                        onClick={() =>
                          void mutate(
                            "complete",
                            selected.day
                          )
                        }
                      >
                        {busy
                          ? "Saving..."
                          : "Mark activity complete"}
                        <span>✓</span>
                      </button>
                    ) : (
                      <div className="cs-locked-note">
                        This activity unlocks on Day{" "}
                        {selected.day} of your sprint.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="cs-empty">
                    <h2>Activities are loading</h2>
                    <p>
                      Your selected journey does not
                      currently contain this activity.
                      Please check the backend plan.
                    </p>
                  </div>
                )}
              </aside>
            </section>
          </>
        )}

        {/* FOOTER */}

        <footer className="cs-footer">
          <span>© 2026 STRYVEXI</span>
          <span>OWN YOUR NEXT MOVE.</span>
        </footer>
      </div>

      {/* STYLES */}

      <style jsx>{`
        .cs-page {
          min-height: 100vh;
          background: #F7F3EA;
          color: #18181b;
          padding: clamp(20px, 3vw, 42px);
          font-family: Inter, Arial, sans-serif;
        }

        .cs-wrap {
          max-width: 1420px;
          margin: 0 auto;
        }

        .cs-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          padding: 18px 0 30px;
        }

        .cs-hero-copy {
          max-width: 820px;
        }

        .cs-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8F1239;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .cs-eyebrow span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8F1239;
        }

        .cs-hero h1 {
          font-size: clamp(34px, 5vw, 60px);
          line-height: 1.04;
          letter-spacing: -.055em;
          margin: 17px 0 12px;
          font-weight: 750;
        }

        .cs-hero h1 em {
          font-family: Georgia, serif;
          font-weight: 500;
          color: #8F1239;
        }

        .cs-hero p {
          max-width: 690px;
          color: #78716c;
          font-size: 15px;
          line-height: 1.8;
          margin: 0;
        }

        .cs-stamp {
          width: 124px;
          height: 124px;
          flex: 0 0 124px;
          border: 1px solid #d8cbbd;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          transform: rotate(7deg);
          color: #5C0A24;
        }

        .cs-stamp span {
          font-size: 10px;
          letter-spacing: 3px;
        }

        .cs-stamp strong {
          font: italic 27px Georgia, serif;
        }

        .cs-stamp i {
          position: absolute;
          right: 2px;
          top: 8px;
          color: #BE123C;
          font-size: 24px;
        }

        .cs-alert,
        .cs-notice {
          padding: 13px 16px;
          border-radius: 12px;
          margin: 0 0 16px;
          font-size: 13px;
        }

        .cs-alert {
          background: #fff0ed;
          color: #9f2d20;
          border: 1px solid #f1c5bd;
        }

        .cs-notice {
          background: #edf8ef;
          color: #25633b;
          border: 1px solid #c9e6d0;
        }

        .cs-start-card,
        .cs-overview,
        .cs-panel {
          background: #FFFCF5;
          border: 1px solid #E7E0D5;
          border-radius: 20px;
          box-shadow: 0 12px 35px rgba(48, 31, 24, .045);
        }

        .cs-start-card {
          padding: clamp(24px, 4vw, 46px);
        }

        .cs-start-card h2,
        .cs-overview h2,
        .cs-panel h2 {
          font-size: clamp(23px, 3vw, 32px);
          letter-spacing: -.04em;
          margin: 10px 0;
        }

        .cs-start-card p,
        .cs-journey-heading p {
          max-width: 650px;
          color: #78716c;
          line-height: 1.7;
          font-size: 14px;
        }

        .cs-start-points {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 22px;
          color: #5C0A24;
          font-size: 12px;
          font-weight: 650;
          margin-top: 22px;
        }

        .cs-journey-heading {
          margin: 35px 0 18px;
        }

        .cs-journey-heading h2 {
          font-size: 27px;
          margin: 10px 0;
        }

        .cs-journeys {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .cs-journey {
          padding: 25px;
          text-align: left;
          border: 1px solid #E7E0D5;
          border-radius: 17px;
          background: #FFFCF5;
          cursor: pointer;
          transition: border .2s, background .2s, transform .2s;
          color: #18181b;
        }

        .cs-journey:hover {
          border-color: #8F1239;
          transform: translateY(-2px);
        }

        .cs-journey.selected {
          border: 2px solid #8F1239;
          background: #f7e9ed;
        }

        .cs-journey:disabled {
          opacity: .6;
          cursor: wait;
        }

        .cs-journey-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cs-journey-icon {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #f7e9ed;
          color: #8F1239;
          font-size: 20px;
        }

        .cs-selection {
          color: #8F1239;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .cs-journey h3 {
          font-size: 22px;
          margin: 22px 0 9px;
        }

        .cs-journey p {
          color: #78716c;
          font-size: 13px;
          line-height: 1.7;
          min-height: 45px;
        }

        .cs-journey-bottom {
          display: flex;
          gap: 9px;
          margin-top: 20px;
        }

        .cs-journey-bottom span {
          color: #5C0A24;
          background: #f7e9ed;
          border-radius: 99px;
          padding: 7px 11px;
          font-size: 10px;
          font-weight: 750;
        }

        .cs-primary {
          border: 0;
          border-radius: 12px;
          background: #8F1239;
          color: white;
          padding: 15px 20px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          white-space: nowrap;
          transition: background .2s, transform .2s;
        }

        .cs-primary:hover {
          background: #5C0A24;
          transform: translateY(-1px);
        }

        .cs-primary:disabled {
          opacity: .6;
          cursor: wait;
          transform: none;
        }

        .cs-primary span {
          margin-left: 12px;
        }

        .cs-start-button {
          margin-top: 22px;
        }

        .cs-status-banner {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 13px;
          line-height: 1.6;
        }

        .cs-status-banner.completed {
          background: #edf8ef;
          color: #25633b;
          border: 1px solid #c9e6d0;
        }

        .cs-status-banner.expired {
          background: #f2eee8;
          color: #6b5542;
          border: 1px solid #e7e0d5;
        }

        .cs-overview {
          padding: 26px 30px;
          margin-bottom: 20px;
        }

        .cs-overview-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .cs-overview h2 {
          margin-bottom: 5px;
        }

        .cs-subtitle {
          color: #78716c;
          font-size: 13px;
          margin: 0 0 15px;
        }

        .cs-percent {
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -.06em;
          color: #8F1239;
        }

        .cs-percent small {
          font-size: 17px;
        }

        .cs-track,
        .cs-week-track {
          height: 9px;
          background: #eee7dd;
          border-radius: 99px;
          overflow: hidden;
        }

        .cs-track span,
        .cs-week-track span {
          display: block;
          height: 100%;
          background: #8F1239;
          border-radius: 99px;
          transition: width .3s;
        }

        .cs-overview-foot {
          display: flex;
          justify-content: space-between;
          color: #78716c;
          font-size: 11px;
          margin-top: 9px;
        }

        .cs-stats {
          display: flex;
          gap: 0;
          margin-top: 23px;
          padding-top: 19px;
          border-top: 1px solid #eee7dd;
        }

        .cs-stats div {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cs-stats strong {
          font-size: 23px;
        }

        .cs-stats span {
          font-size: 11px;
          color: #78716c;
        }

        .cs-journey-lock {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          padding: 13px;
          background: #f7f3ea;
          border: 1px solid #e7e0d5;
          border-radius: 12px;
        }

        .cs-journey-lock div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cs-journey-lock strong {
          font-size: 12px;
        }

        .cs-journey-lock small {
          color: #78716c;
          font-size: 11px;
          line-height: 1.5;
        }

        .cs-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(300px, .8fr);
          gap: 20px;
          align-items: start;
        }

        .cs-panel {
          padding: 24px;
        }

        .cs-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .cs-panel-head h2 {
          font-size: 23px;
          margin-bottom: 0;
        }

        .cs-count {
          font-size: 13px;
          font-weight: 750;
          color: #8F1239;
          background: #f7e9ed;
          padding: 8px 12px;
          border-radius: 99px;
        }

        .cs-week {
          padding: 17px 0;
          border-top: 1px solid #eee7dd;
        }

        .cs-week-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .cs-week-head div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cs-week-head div span {
          font-size: 9px;
          letter-spacing: 1.5px;
          font-weight: 800;
          color: #8F1239;
        }

        .cs-week-head strong {
          font-size: 13px;
        }

        .cs-week-head small {
          font-size: 11px;
          color: #78716c;
        }

        .cs-week-track {
          height: 5px;
          margin-bottom: 14px;
        }

        .cs-days {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
        }

        .cs-day {
          border: 1px solid #e5ddd2;
          background: #fff;
          border-radius: 10px;
          min-height: 43px;
          cursor: pointer;
          color: #5b5551;
          font-size: 11px;
          font-weight: 750;
        }

        .cs-day:hover:not(:disabled) {
          border-color: #8F1239;
        }

        .cs-day.selected {
          background: #8F1239;
          border-color: #8F1239;
          color: white;
          box-shadow: 0 4px 12px #8f123933;
        }

        .cs-day.done:not(.selected) {
          background: #f0f7f0;
          border-color: #b8d7bc;
          color: #28613a;
        }

        .cs-day.locked {
          opacity: .38;
          cursor: not-allowed;
        }

        .cs-roadmap-note {
          font-size: 11px;
          line-height: 1.6;
          color: #78716c;
          margin: 16px 0 0;
        }

        .cs-activity {
          position: sticky;
          top: 20px;
        }

        .cs-activity-status {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #8F1239;
          margin-top: 20px;
        }

        .cs-activity h2 {
          font-size: 26px;
          line-height: 1.15;
          margin: 10px 0;
        }

        .cs-activity > p {
          font-size: 13px;
          line-height: 1.75;
          color: #78716c;
        }

        .cs-meta {
          display: flex;
          gap: 9px;
          margin: 18px 0;
        }

        .cs-meta span {
          font-size: 11px;
          font-weight: 700;
          color: #5C0A24;
          background: #f7e9ed;
          border-radius: 99px;
          padding: 7px 10px;
        }

        .cs-tool {
          padding: 15px;
          background: #f7f3ea;
          border: 1px solid #e7e0d5;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cs-tool > span {
          font-size: 9px;
          letter-spacing: 1.4px;
          color: #78716c;
          font-weight: 800;
        }

        .cs-tool strong {
          font-size: 14px;
        }

        .cs-tool button {
          align-self: flex-start;
          border: 0;
          background: transparent;
          color: #8F1239;
          padding: 0;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        .cs-complete {
          width: 100%;
          margin-top: 16px;
        }

        .cs-completed-note,
        .cs-locked-note {
          font-size: 12px;
          line-height: 1.6;
          padding: 12px;
          border-radius: 10px;
          margin-top: 16px;
        }

        .cs-completed-note {
          background: #edf8ef;
          color: #28613a;
        }

        .cs-locked-note {
          background: #f2eee8;
          color: #78716c;
        }

        .cs-empty {
          padding: 20px 0;
        }

        .cs-empty p {
          color: #78716c;
          font-size: 13px;
          line-height: 1.7;
        }

        .cs-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 35px;
          padding-top: 18px;
          border-top: 1px solid #e7e0d5;
          color: #78716c;
          font-size: 9px;
          letter-spacing: 1.4px;
        }

        @media(max-width: 850px) {
          .cs-layout {
            grid-template-columns: 1fr;
          }

          .cs-activity {
            position: static;
          }

          .cs-stamp {
            width: 92px;
            height: 92px;
            flex-basis: 92px;
          }

          .cs-stamp strong {
            font-size: 21px;
          }
        }

        @media(max-width: 600px) {
          .cs-hero {
            align-items: flex-start;
          }

          .cs-stamp {
            display: none;
          }

          .cs-journeys {
            grid-template-columns: 1fr;
          }

          .cs-overview {
            padding: 20px;
          }

          .cs-panel {
            padding: 18px;
          }

          .cs-days {
            gap: 5px;
          }

          .cs-day {
            min-height: 38px;
            font-size: 10px;
          }

          .cs-stats span {
            font-size: 10px;
          }

          .cs-footer {
            font-size: 8px;
          }
        }
      `}</style>
    </main>
  );
}
