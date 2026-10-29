"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/app/components/LoginModal";
import SignupModal from "@/app/components/SignUpModal";
const faqs = [
  {
    q: "Who is Stryvexi for?",
    a: "Stryvexi is being designed for fresh graduates, active job seekers, and working professionals planning their next move—with an initial focus on software, QA, and other IT roles."
  },
  {
    q: "Will it guarantee me a job?",
    a: "No platform can honestly guarantee a hiring outcome. Stryvexi helps you prepare with more clarity: understand role fit, practice relevant questions, and keep your search organised."
  },
  {
    q: "What will I be able to do first?",
    a: "The first release is planned around resume-to-job matching, practical interview preparation, a focused action plan, and simple application tracking."
  },
  {
    q: "Is my resume kept private?",
    a: "Privacy is part of the product plan. The service will explain how uploaded documents are processed, stored, and deleted before you use those features."
  }
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
        A more intentional job search is on the way
        {isLoggedIn ? (
  <button
  type="button"
  className="nav-cta"
  onClick={() => router.push("/dashboard")}
>
  Go to Dashboard <Arrow diagonal />
</button>
) : (
  <a
    href="#"
    onClick={(event) => {
      event.preventDefault();
      setSignupOpen(true);
    }}
  >
    Get Started <Arrow diagonal />
  </a>
)}
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
      className="nav-login"
      onClick={() => setLoginOpen(true)}
    >
      Log in
    </button>

    <button
      type="button"
      className="nav-cta"
      onClick={() => setSignupOpen(true)}
    >
      Get Started <Arrow diagonal />
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
    Your next job
    <em> won’t happen by chance.</em>
    Prepare for it.
  </h1>

  <p className="hero-description reveal reveal-delay-2">
    Stryvexi helps you get ready for your next opportunity with smarter
    resume insights, role-specific interview practice, and a clear plan
    to move your career forward.
  </p>

  <div className="hero-actions reveal reveal-delay-3">
    {isLoggedIn ? (
  <button
  type="button"
  className="nav-cta"
  onClick={() => router.push("/dashboard")}
>
  Go to Dashboard <Arrow diagonal />
</button>
) : (
  <button
    type="button"
    className="button button-dark"
    onClick={() => setSignupOpen(true)}
  >
    Get Started <Arrow diagonal />
  </button>
)}

    <a className="text-link" href="#how-it-works">
      Discover how it works <Arrow />
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
      <strong>Own your next move.</strong>
      <small>Sharpen your resume · Practise interviews · Plan your next step</small>
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
                <strong>Your role match</strong>
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
          <p className="eyebrow">A LITTLE LESS OVERWHELMED</p>
          <h2>Your career isn’t a guessing game.<br /><em>Your preparation shouldn’t be either.</em></h2>
          <div className="intro-bottom">
            <p>There’s a lot to juggle when you’re aiming for a new role. Stryvexi brings the important pieces together, so you can spend less time wondering what to do—and more time doing it.</p>
            <a className="round-link" href="#toolkit" aria-label="Explore the toolkit"><Arrow diagonal /></a>
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
          <p className="eyebrow"><span className="eyebrow-line" /> THE STRYVEXI MINDSET</p>
          <h2>You don’t need to have<br />it all figured out.<br /><em>You need a next step.</em></h2>
          <p className="manifesto-copy">Progress isn’t always a big leap. Sometimes it’s a better answer, a stronger resume line, or showing up to practise one more time.</p>
          <a className="button button-light" href="#waitlist">Start with your next step <Arrow diagonal /></a>
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

      <section className="waitlist section-pad" id="waitlist">
        <div className="waitlist-sticker">YOUR<br />NEXT<br /><i>CHAPTER</i> <span>✳</span></div>
        <div className="waitlist-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> BE FIRST IN LINE</p>
          <h2>Good things happen<br />when you <em>get ready.</em></h2>
          <p>We’re building a more focused way to prepare for your next role. Join the early list and be among the first to see what’s next.</p>
          {submitted ? (
            <div className="success-message" role="status"><span>✓</span><div><strong>You’re on the list.</strong><small>Thanks for your interest. We’ll share the next update with you.</small></div></div>
          ) : (
            <form className="waitlist-form" onSubmit={joinWaitlist}>
              <label className="sr-only" htmlFor="waitlist-email">Your email address</label>
              <input id="waitlist-email" type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button className="button button-dark" type="submit">Keep me posted <Arrow diagonal /></button>
            </form>
          )}
          <small className="form-note">No noise. Just launch news and early access details.</small>
        </div>
        <div className="waitlist-side-note">OWN YOUR NEXT MOVE. <span>— STRYVEXI</span></div>
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
