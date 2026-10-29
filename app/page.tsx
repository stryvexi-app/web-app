"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/app/components/LoginModal";
import SignupModal from "@/app/components/SignUpModal";
const faqs = [
  {
    q: "What is Stryvexi?",
    a: "Stryvexi is a career preparation platform that helps you improve your resume, practise interviews, build your skills through daily challenges, and track your progress.",
  },
  {
    q: "Who can use Stryvexi?",
    a: "Stryvexi is designed for fresh graduates, job seekers, and working professionals who want to improve their skills and prepare for their next career opportunity.",
  },
  {
    q: "How do I get started?",
    a: "Create an account using the signup option. Once you sign in, open your dashboard to explore the available career tools and start preparing.",
  },
  {
    q: "Can Stryvexi guarantee me a job?",
    a: "No platform can guarantee a job offer. Stryvexi provides tools to help you prepare, practise, identify areas for improvement, and work towards your career goals.",
  },
  {
    q: "Is Stryvexi available to use now?",
    a: "Yes. You can create an account and start using the features currently available in Stryvexi. Some tools or capabilities may vary as the platform continues to improve.",
  },
  {
    q: "How do I access my account again?",
    a: "Select Log in on the homepage and sign in using your registered credentials.",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();
useEffect(() => {
  let cancelled = false;

  async function checkAuth() {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = response.ok ? await response.json() : null;

      if (!cancelled) {
        setIsLoggedIn(
          response.ok && Boolean(data?.user)
        );
      }
    } catch {
      if (!cancelled) setIsLoggedIn(false);
    }
  }

  checkAuth();

  return () => {
    cancelled = true;
  };
}, []);

  function joinWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <main>
      <LoginModal
  open={loginOpen}
  onClose={() => setLoginOpen(false)}
  onSwitchToSignup={() => {
    setLoginOpen(false);
    setSignupOpen(true);
  }}
/>
      <SignupModal
  open={signupOpen}
  onClose={() => setSignupOpen(false)}
/>
      <div className="announcement">
        <span className="announcement-dot" />
           Your next career move starts with better preparation.
      </div>

      <header className="site-header">
        <a href="#" className="brand" aria-label="Stryvexi home">
          <BrandMark />
          <span>STRYVEXI<span className="brand-period">.</span></span>
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span />
        </button>

        <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#toolkit" onClick={() => setMenuOpen(false)}>The toolkit</a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>FAQs</a>
           
{isLoggedIn ? (
  <button
  type="button"
  className="nav-cta"
  onClick={() => router.push("/dashboard")}
>
  Go to Dashboard <Arrow diagonal />
</button>
) : (
  <>
    <button
      type="button"
      className="nav-cta"
      onClick={() => setLoginOpen(true)}
    >
      Login <Arrow diagonal />
    </button>
  </>
)}

        </nav>
      </header>

      <section className="hero">
       <div className="hero-copy">
 <div className="eyebrow reveal">
  <span className="eyebrow-line" />
  YOUR NEXT CAREER MOVE STARTS HERE
</div>

<h1 className="reveal reveal-delay-1">
  Get ready for your next job.
  <em> Show up with confidence.</em>
</h1>

<p className="hero-description reveal reveal-delay-2">
  Build a stronger resume, practise for interviews, identify your skill
  gaps, and track your career progress—all in one place with Stryvexi.
</p>

<div className="hero-actions reveal reveal-delay-3">
  {isLoggedIn === true ? (
    <button
      type="button"
      className="button button-dark"
      onClick={() => router.push("/dashboard")}
    >
      Open My Dashboard <Arrow diagonal />
    </button>
  ) : (
    <button
      type="button"
      className="button button-dark"
      onClick={() => setSignupOpen(true)}
    >
      Create Your Free Account <Arrow diagonal />
    </button>
  )}

  <a className="text-link" href="#toolkit">
    Explore Features <Arrow />
  </a>
</div>

  <div className="hero-proof reveal reveal-delay-3">
    <div className="proof-avatars" aria-hidden="true">
      <span>R</span>
      <span>A</span>
      <span>K</span>
      <span>+</span>
    </div>

    <div>
  <strong>Your goals. Your preparation. Your next move.</strong>
  <small>
    Resume insights · Mock interviews · Daily challenges · Career progress
  </small>
</div>
  </div>
</div>

        <div className="hero-art" aria-label="Illustration of a personal career preparation dashboard">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="sun-disc" />
          <div className="art-label label-top"><span className="label-dot" /> YOUR NEXT MOVE, IN FOCUS</div>
          <div className="dashboard-card">
            <div className="dashboard-top">
              <div>
                <span className="mini-kicker">YOUR CAREER SNAPSHOT</span>
                <h3>Frontend Developer</h3>
              </div>
              <div className="status-pill"><span /> In progress</div>
            </div>
            <div className="match-row">
              <div className="match-ring"><span>82<small>%</small></span></div>
              <div className="match-copy">
                <strong>ATS Score</strong>
                <p>You’re closer than you think. Here’s where to focus next.</p>
              </div>
            </div>
            <div className="divider-line" />
            <div className="card-section-heading"><span>YOUR NEXT STEPS</span><span>02 / 04</span></div>
            <div className="task-row">
              <span className="task-check checked">✓</span>
              <span className="task-text"><strong>Review resume gaps</strong><small>Completed just now</small></span>
              <span className="task-tick">✓</span>
            </div>
            <div className="task-row">
              <span className="task-check">2</span>
              <span className="task-text"><strong>Practise React fundamentals</strong><small>15 min practice session</small></span>
              <span className="task-arrow">↗</span>
            </div>
            <div className="task-row muted-task">
              <span className="task-check">3</span>
              <span className="task-text"><strong>Polish your project story</strong><small>Up next</small></span>
            </div>
            <div className="dashboard-bottom"><span className="sparkle">✳</span> Small steps. Serious momentum.</div>
          </div>
          <div className="floating-note note-top">
            <span className="note-icon">✳</span>
            <span><strong>Clearer direction</strong><small>One step at a time</small></span>
          </div>
          <div className="floating-note note-bottom">
            <span className="note-icon note-icon-terracotta">↗</span>
            <span><strong>Ready when you are</strong><small>Your plan, your pace</small></span>
          </div>
          <div className="art-stamp">OWN<br />YOUR<br /><i>NEXT.</i></div>
          <div className="art-label label-bottom">CAREER CLARITY, NOT CAREER CHAOS <span>✳</span></div>
        </div>
        <div className="hero-bottom-line"><span>01 / A BETTER WAY TO GET READY</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="ticker" aria-label="Stryvexi capabilities">
        <div className="ticker-track">
          {[0, 1].map((n) => (
            <div className="ticker-set" key={n} aria-hidden={n === 1}>
              <span>RESUME INTELLIGENCE</span><i>✳</i><span>INTERVIEW PRACTICE</span><i>✳</i><span>CAREER ACTION PLAN</span><i>✳</i><span>APPLICATION TRACKER</span><i>✳</i>
            </div>
          ))}
        </div>
      </section>

      <section className="intro section-pad" id="how-it-works">
        <div className="section-index">01 <span>— THE APPROACH</span></div>
        <div className="intro-content">
         <p className="eyebrow">A CLEARER WAY TO PREPARE</p>

<h2>
  Your career isn’t a guessing game.
  <br />
  <em>Make your next move with a plan.</em>
</h2>

<div className="intro-bottom">
  <p>
    Preparing for a new role takes more than sending resumes.
    Stryvexi brings career profile building, resume insights,
    interview practice, and progress tracking together so you
    know what to work on next.
  </p>

  <a
    className="round-link"
    href="#toolkit"
    aria-label="Explore Stryvexi features"
  >
    <Arrow diagonal />
  </a>
</div>
        </div>
      </section>

      <section className="toolkit section-pad" id="toolkit">
        <div className="section-heading">
          <div>
            <div className="section-index">02 <span>— YOUR CAREER TOOLKIT</span></div>
            <h2>Everything you need.<br /><em>Nothing you don’t.</em></h2>
          </div>
          <p>Four focused tools. One calmer, clearer path to your next opportunity.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-card-large">
            <div className="feature-meta"><span>01 / GET THE STORY STRAIGHT</span><span className="feature-icon">↗</span></div>
            <div className="resume-visual">
              <div className="resume-sheet">
                <div className="resume-head"><span className="resume-avatar">PK</span><div><b>Priya Kumar</b><small>Frontend Developer</small></div><span className="resume-score">82%</span></div>
                <div className="resume-rule" />
                <span className="resume-line long" /><span className="resume-line medium" />
                <div className="resume-highlight"><span>✓</span> Strong React experience <b>+12</b></div>
                <div className="resume-highlight resume-highlight-warn"><span>!</span> Add measurable impact <b>Focus</b></div>
                <span className="resume-line medium" /><span className="resume-line short" />
              </div>
              <div className="resume-orbit">ROLE<br />MATCH</div>
            </div>
            <h3>Know where you stand.</h3>
            <p>See how your resume lines up with a role, spot the gaps, and get useful suggestions you can make your own.</p>
            <span className="feature-foot">RESUME INTELLIGENCE</span>
          </article>

          <article className="feature-card feature-card-dark">
            <div className="feature-meta"><span>02 / GET IN THE ROOM READY</span><span className="feature-icon">↗</span></div>
            <div className="interview-visual">
              <div className="sound-wave">{[18, 34, 24, 46, 58, 34, 68, 44, 25, 50, 36, 18, 42, 28, 54, 30, 16].map((h, i) => <span key={i} style={{ height: `${h}px` }} />)}</div>
              <div className="interview-question"><span>QUESTION 04</span><p>“Tell me about a time you solved a difficult problem.”</p><small>Behavioural · 02:14 elapsed</small></div>
              <div className="recording-dot"><span /> PRACTICE IN PROGRESS</div>
            </div>
            <h3>Practise with purpose.</h3>
            <p>Build confidence with technical, behavioural, and scenario-based questions tailored to your target role.</p>
            <span className="feature-foot">INTERVIEW STUDIO</span>
          </article>

          <article className="feature-card feature-card-plan">
            <div className="feature-meta"><span>03 / MAKE PROGRESS VISIBLE</span><span className="feature-icon">↗</span></div>
            <div className="plan-visual">
              <div className="plan-header"><span>YOUR 7-DAY SPRINT</span><b>WEEK 01</b></div>
              <div className="plan-progress"><span /></div>
              <div className="plan-day"><span className="day-done">✓</span><div><b>Resume refresh</b><small>Monday · 15 min</small></div><em>DONE</em></div>
              <div className="plan-day"><span className="day-done">✓</span><div><b>React practice</b><small>Tuesday · 20 min</small></div><em>DONE</em></div>
              <div className="plan-day active-day"><span>03</span><div><b>Mock interview</b><small>Today · 25 min</small></div><em>UP NEXT</em></div>
            </div>
            <h3>Turn intention into action.</h3>
            <p>A manageable preparation plan helps you focus on the right things, one realistic step at a time.</p>
            <span className="feature-foot">CAREER ACTION PLAN</span>
          </article>

          <article className="feature-card feature-card-cream">
            <div className="feature-meta"><span>04 / KEEP THE DETAILS TOGETHER</span><span className="feature-icon">↗</span></div>
            <div className="tracker-visual">
              <div className="tracker-title">APPLICATIONS <span>THIS MONTH ↗</span></div>
              <div className="tracker-number">08 <small>roles in motion</small></div>
              <div className="tracker-table">
                <div><span className="company-mark mark-one">n</span><b>Northstar</b><em className="tag-applied">Applied</em></div>
                <div><span className="company-mark mark-two">v</span><b>Verve Labs</b><em className="tag-interview">Interview</em></div>
                <div><span className="company-mark mark-three">m</span><b>Mono Studio</b><em className="tag-saved">Saved</em></div>
              </div>
            </div>
            <h3>Keep your search in sync.</h3>
            <p>Track applications, interviews, and follow-ups in one place—without another spreadsheet spiral.</p>
            <span className="feature-foot">APPLICATION TRACKER</span>
          </article>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-grain" />
        <div className="manifesto-content">
          <p className="eyebrow">
  <span className="eyebrow-line" /> YOUR NEXT CHAPTER STARTS NOW
</p>

<h2>
  You don’t need
  <br />
  all the answers.
  <br />
  <em>You need a next step.</em>
</h2>

<p className="manifesto-copy">
  Build confidence one step at a time. Improve your resume,
  practise your interviews, and keep moving towards the role you want.
  Your next move starts with what you do today.
</p>

<button
  type="button"
  className="button button-light"
  onClick={() =>
    isLoggedIn ? router.push("/dashboard") : setSignupOpen(true)
  }
>
  {isLoggedIn ? "Go to My Dashboard" : "Get Started Today"}
  <Arrow diagonal />
</button>
        </div>
        <div className="manifesto-number">S<span>/</span>01</div>
        <div className="manifesto-sun" />
      </section>

      <section className="steps section-pad">
        <div className="section-index">03 <span>— HOW IT COMES TOGETHER</span></div>
        <div className="steps-layout">
          <div className="steps-heading">
            <h2>Clarity first.<br /><em>Momentum follows.</em></h2>
            <p>A simple loop to keep you moving forward, without turning your job search into a second full-time job.</p>
          </div>
          <div className="steps-list">
            <div className="step-item"><span className="step-num">01</span><div><h3>Get clear on the goal.</h3><p>Choose a role, bring your resume, and understand what the opportunity calls for.</p></div><span className="step-symbol">↗</span></div>
            <div className="step-item"><span className="step-num">02</span><div><h3>Work on what matters.</h3><p>Use relevant feedback and interview practice to focus on your highest-impact gaps.</p></div><span className="step-symbol">✳</span></div>
            <div className="step-item"><span className="step-num">03</span><div><h3>Keep your momentum.</h3><p>Follow a practical plan, track the roles you pursue, and see your progress add up.</p></div><span className="step-symbol">↗</span></div>
          </div>
        </div>
      </section>

      <section className="waitlist section-pad" id="get-started">
  <div className="waitlist-sticker">
    YOUR<br />NEXT<br /><i>CHAPTER</i> <span>✳</span>
  </div>

  <div className="waitlist-copy">
    <p className="eyebrow">
      <span className="eyebrow-line" /> YOUR CAREER JOURNEY STARTS HERE
    </p>

    <h2>
      Your next opportunity.
      <br />
      <em>Start preparing today.</em>
    </h2>

    <p>
      Create your Stryvexi account and start working on your career goals.
      Explore resume insights, practise interviews, take daily challenges,
      and follow your progress in one place.
    </p>

    <div className="hero-actions">
      {isLoggedIn === true ? (
        <button
          type="button"
          className="button button-dark"
          onClick={() => router.push("/dashboard")}
        >
          Open My Dashboard <Arrow diagonal />
        </button>
      ) : (
        <>
          <button
            type="button"
            className="button button-dark"
            onClick={() => setLoginOpen(true)}
          >
            Get Started Now <Arrow diagonal />
          </button>
        </>
      )}
    </div>
  </div>

  <div className="waitlist-side-note">
    OWN YOUR NEXT MOVE. <span>— STRYVEXI</span>
  </div>
</section>

      <section className="faq section-pad" id="faq">
        <div className="section-index">04 <span>— GOOD QUESTIONS</span></div>
        <div className="faq-layout">
          <div><h2>A few things<br /><em>you might be wondering.</em></h2><p>Still curious? We’ll keep adding answers as Stryvexi takes shape.</p></div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className={openFaq === index ? "faq-item faq-open" : "faq-item"} key={faq.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                  <span>{faq.q}</span><span className="faq-toggle">{openFaq === index ? "−" : "+"}</span>
                </button>
                {openFaq === index && <p>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <a href="#" className="brand brand-footer"><BrandMark /><span>stryvexi<span className="brand-period">.</span></span></a>
          <p>Own your next move.</p>
          <a className="footer-back-top" href="#">BACK TO TOP ↑</a>
        </div>
        <div className="footer-bottom"><span>© 2026 STRYVEXI. ALL RIGHTS RESERVED.</span><span>MADE FOR WHAT’S NEXT <i>✳</i></span><a href="mailto:hello@stryvexi.com">SAY HELLO ↗</a></div>
      </footer>
    </main>
  );
}
