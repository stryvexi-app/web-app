import Link from "next/link";
/* @ts-ignore */
import "./policy-pages.css";

type PolicyLayoutProps = {
  eyebrow: string;
  title: string;
  accent: string;
  updated?: string;
  children: React.ReactNode;
};

function BrandMark() {
  return (
    <span className="policy-brand-mark" aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

export default function PolicyLayout({
  eyebrow,
  title,
  accent,
  updated = "30 October 2026",
  children,
}: PolicyLayoutProps) {
  return (
    <main className="policy-site">
      <div className="policy-announcement">
        <span className="policy-announcement-dot" />
        Your next career move starts with better preparation.
      </div>

      <header className="policy-header">
        <Link href="/" className="policy-brand" aria-label="Stryvexi home">
          <BrandMark />
          <span>STRYVEXI<span className="policy-brand-period">.</span></span>
        </Link>
        <nav className="policy-nav" aria-label="Legal navigation">
          <Link href="/contact">Contact</Link>
          <Link href="/terms-and-conditions">Terms</Link>
          <Link href="/refund-and-cancellation">Refunds</Link>
          <Link href="/" className="policy-nav-cta">Back to home <span>↗</span></Link>
        </nav>
      </header>

      <section className="policy-hero">
        <div className="policy-eyebrow"><span /> {eyebrow}</div>
        <h1>{title}<em>{accent}</em></h1>
        <div className="policy-hero-bottom">
          <span>STRYVEXI / LEGAL & SUPPORT</span>
          <span>LAST UPDATED: {updated.toUpperCase()}</span>
        </div>
      </section>

      <div className="policy-content-wrap">
        <aside className="policy-aside">
          <span className="policy-aside-kicker">IN THIS SECTION</span>
          <Link href="/contact">01 — Contact Us</Link>
          <Link href="/terms-and-conditions">02 — Terms & Conditions</Link>
          <Link href="/refund-and-cancellation">03 — Refunds & Cancellations</Link>
          <div className="policy-aside-note">
            <span>✳</span>
            Own your next move.
          </div>
        </aside>
        <article className="policy-content">{children}</article>
      </div>

      <footer className="policy-footer">
        <div className="policy-footer-top">
          <Link href="/" className="policy-brand policy-brand-footer">
            <BrandMark />
            <span>STRYVEXI<span className="policy-brand-period">.</span></span>
          </Link>
          <p>Own your next move.</p>
          <Link href="#" className="policy-back-top">BACK TO TOP ↑</Link>
        </div>
        <div className="policy-footer-bottom">
          <span>© 2026 STRYVEXI. ALL RIGHTS RESERVED.</span>
          <span>MADE FOR WHAT’S NEXT <i>✳</i></span>
          <a href="mailto:contact@stryvexi.com">SAY HELLO ↗</a>
        </div>
      </footer>
    </main>
  );
}
