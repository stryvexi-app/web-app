"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/app/components/LoginModal";
import SignupModal from "@/app/components/SignUpModal";
/* @ts-ignore */
import "./pricing.css";

type Plan = {
  id: string;
  name: string;
  credits: string;
  price: string;
  description: string;
  note: string;
  featured?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: "100",
    price: "₹99",
    description: "A simple place to begin.",
    note: "For trying out focused career tools",
    features: [
      "100 credits to use across tools",
      "Resume intelligence",
      "Mock interview practice",
      "Coding challenges",
      "Use credits when you need them",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    credits: "300",
    price: "₹249",
    description: "Build a steady preparation rhythm.",
    note: "For regular practice and improvement",
    features: [
      "300 credits to use across tools",
      "Everything in Starter",
      "More resume and interview sessions",
      "Coding practice",
      "Track your preparation progress",
    ],
  },
  {
    id: "career-pro",
    name: "Career Pro",
    credits: "700",
    price: "₹499",
    description: "Make every preparation session count.",
    note: "A balanced choice for active job seekers",
    featured: true,
    features: [
      "700 credits to use across tools",
      "Everything in Growth",
      "More room for mock interviews",
      "Resume and role-fit insights",
      "Consistent skill practice",
    ],
  },
  {
    id: "career-max",
    name: "Career Max",
    credits: "1,600",
    price: "₹999",
    description: "Stay prepared for the long run.",
    note: "For an intensive career preparation journey",
    features: [
      "1,600 credits to use across tools",
      "Everything in Career Pro",
      "Extended interview practice",
      "More resume analysis sessions",
      "Keep building your momentum",
    ],
  },
];

const creditUsage = [
  { tool: "Detailed resume analysis", credits: "40 credits" },
  { tool: "Resume and job description match", credits: "20 credits" },
  { tool: "Mock interview · 5 questions", credits: "40 credits" },
  { tool: "Mock interview · 10 questions", credits: "70 credits" },
  { tool: "Mock interview · 15 questions", credits: "100 credits" },
  { tool: "Mock interview · 20 questions", credits: "130 credits" },
  { tool: "Coding challenge with explanation", credits: "10 credits" },
];

const faqs = [
  {
    q: "What are credits?",
    a: "Credits are used to access selected Stryvexi tools, such as detailed resume analysis, resume-to-role matching, mock interviews, and coding challenges. The credits required are shown for each activity.",
  },
  {
    q: "Can I use credits across different tools?",
    a: "Yes. Your available credits can be used across supported Stryvexi tools. Each activity uses the number of credits displayed before you start.",
  },
  {
    q: "Do I get anything for free?",
    a: "Stryvexi may provide free access to selected starter activities. Sign in to see the free features and current usage available to your account.",
  },
  {
    q: "Do unused credits expire?",
    a: "Please check the validity shown at checkout before purchasing. The applicable validity period will be displayed with the selected pack.",
  },
  {
    q: "Can I get a refund?",
    a: "Refund eligibility is governed by the Stryvexi Refunds & Cancellations Policy. Please review that policy before making a purchase.",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className="sp-arrow" aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function BrandMark() {
  return (
    <span className="sp-brand-mark" aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
        if (!cancelled) setIsLoggedIn(response.ok && Boolean(data?.user));
      } catch {
        if (!cancelled) setIsLoggedIn(false);
      }
    }

    checkAuth();
    return () => { cancelled = true; };
  }, []);

  function handlePlanAction() {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      setSignupOpen(true);
    }
  }

  return (
    <main className="sp-pricing">
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />

      <div className="sp-pricing-announcement">
        <span className="sp-pricing-dot" />
        YOUR NEXT CAREER MOVE STARTS WITH BETTER PREPARATION.
      </div>

      <header className="sp-pricing-header">
        <a href="/" className="sp-pricing-brand" aria-label="Stryvexi home">
          <BrandMark />
          <span>STRYVEXI<span>.</span></span>
        </a>
        <nav className="sp-pricing-nav" aria-label="Pricing navigation">
          <a href="/#toolkit">The toolkit</a>
          <a href="/#faq">FAQs</a>
          <a href="/contact">Contact</a>
          {isLoggedIn ? (
            <button type="button" onClick={() => router.push("/dashboard")}>Go to Dashboard <Arrow diagonal /></button>
          ) : (
            <button type="button" onClick={() => setLoginOpen(true)}>Login <Arrow diagonal /></button>
          )}
        </nav>
      </header>

      <section className="sp-pricing-hero">
        <p className="sp-pricing-eyebrow"><span /> SIMPLE, FLEXIBLE PRICING</p>
        <p className="sp-pricing-index">STRYVEXI / PLANS 01—04</p>
        <h1>Put your next move<br />within <em>reach.</em></h1>
        <p className="sp-pricing-intro">
          Choose a credit pack that fits the way you prepare. Use it across resume
          intelligence, interview practice, and coding challenges.
        </p>
        <a href="#plans" className="sp-pricing-scroll">EXPLORE THE PLANS <span>↓</span></a>
        <div className="sp-pricing-orbit sp-pricing-orbit-one" />
        <div className="sp-pricing-orbit sp-pricing-orbit-two" />
        <span className="sp-pricing-stamp">OWN<br />YOUR<br /><em>NEXT.</em></span>
      </section>

      <section className="sp-pricing-plans" id="plans">
        <div className="sp-pricing-section-head">
          <div>
            <p className="sp-pricing-eyebrow"><span /> CHOOSE YOUR STARTING POINT</p>
            <h2>More clarity.<br /><em>Less second-guessing.</em></h2>
          </div>
          <p>One credit balance for the tools that help you prepare for what’s next.</p>
        </div>

        <div className="sp-pricing-grid">
          {plans.map((plan, index) => (
            <article className={`sp-plan-card${plan.featured ? " is-featured" : ""}`} key={plan.id}>
              {plan.featured && <div className="sp-plan-ribbon">MOST POPULAR</div>}
              <div className="sp-plan-topline">
                <span>0{index + 1} / {plan.name.toUpperCase()}</span>
                <span className="sp-plan-spark">✳</span>
              </div>
              <h3>{plan.name}</h3>
              <p className="sp-plan-description">{plan.description}</p>
              <div className="sp-plan-price">
                <strong>{plan.price}</strong>
                <span>one-time</span>
              </div>
              <div className="sp-plan-credit"><strong>{plan.credits}</strong> credits</div>
              <p className="sp-plan-note">{plan.note}</p>
              <div className="sp-plan-rule" />
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><span>✓</span>{feature}</li>
                ))}
              </ul>
              <button type="button" className="sp-plan-button" onClick={handlePlanAction}>
                {isLoggedIn ? "Continue to dashboard" : "Get started"} <Arrow diagonal />
              </button>
            </article>
          ))}
        </div>
        <p className="sp-pricing-footnote">
          All prices are in INR. Credit requirements and pack validity are shown before purchase.
          Taxes, if applicable, are displayed at checkout.
        </p>
      </section>

      <section className="sp-pricing-usage">
        <div className="sp-pricing-usage-intro">
          <p className="sp-pricing-eyebrow"><span /> KNOW WHAT YOU’RE USING</p>
          <h2>Every credit has<br /><em>a clear purpose.</em></h2>
          <p>See how credits are used across the core preparation tools.</p>
        </div>
        <div className="sp-credit-list">
          {creditUsage.map((item, index) => (
            <div className="sp-credit-row" key={item.tool}>
              <span className="sp-credit-number">0{index + 1}</span>
              <strong>{item.tool}</strong>
              <span>{item.credits}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sp-pricing-free">
        <div className="sp-free-mark">✳</div>
        <div>
          <p className="sp-pricing-eyebrow"><span /> START BEFORE YOU SPEND</p>
          <h2>Try Stryvexi.<br /><em>Find your rhythm.</em></h2>
          <p>Create an account to explore the free activities currently available to you. You can choose a credit pack whenever you’re ready.</p>
        </div>
        <button type="button" onClick={() => isLoggedIn ? router.push("/dashboard") : setSignupOpen(true)}>
          {isLoggedIn ? "Open dashboard" : "Create a free account"} <Arrow diagonal />
        </button>
      </section>

      <section className="sp-pricing-faq">
        <div className="sp-pricing-faq-heading">
          <p className="sp-pricing-eyebrow"><span /> THE DETAILS</p>
          <h2>Good to know<br /><em>before you begin.</em></h2>
          <p>Have another question? <a href="/contact">Talk to our team <Arrow diagonal /></a></p>
        </div>
        <div className="sp-pricing-faq-list">
          {faqs.map((faq, index) => (
            <div className="sp-pricing-faq-item" key={faq.q}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                <span>{faq.q}</span><i>{openFaq === index ? "−" : "+"}</i>
              </button>
              {openFaq === index && <p>{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="sp-pricing-footer">
        <div className="sp-pricing-footer-top">
          <a href="/" className="sp-pricing-brand sp-pricing-brand-footer"><BrandMark /><span>STRYVEXI<span>.</span></span></a>
          <p>Own your next move.</p>
          <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>BACK TO TOP ↑</a>
        </div>
        <div className="sp-pricing-footer-bottom">
          <span>© 2026 STRYVEXI. ALL RIGHTS RESERVED.</span>
          <div>
            <a href="/contact">CONTACT US</a>
            <a href="/terms-and-conditions">TERMS &amp; CONDITIONS</a>
            <a href="/refund-and-cancellation">REFUNDS &amp; CANCELLATIONS</a>
          </div>
          <span>MADE FOR WHAT’S NEXT <i>✳</i></span>
          <a href="mailto:contact@stryvexi.com">SAY HELLO ↗</a>
        </div>
      </footer>
    </main>
  );
}
