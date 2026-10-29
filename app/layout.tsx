
import type { Metadata, Viewport } from "next";
/* @ts-ignore */
import "./globals.css";

const siteUrl = "https://www.stryvexi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Stryvexi — AI Resume Analysis & Mock Interview Practice",
    template: "%s | Stryvexi",
  },

  description:
    "Prepare for your next job with Stryvexi. Analyze your resume, identify skill gaps, practice AI-powered mock interviews, and build a focused career development plan.",

  applicationName: "Stryvexi",

  keywords: [
    "Stryvexi",
    "AI resume analysis",
    "resume analyzer",
    "resume score",
    "resume improvement",
    "AI mock interview",
    "mock interview practice",
    "job interview preparation",
    "technical interview preparation",
    "career development platform",
    "job search preparation",
    "skill gap analysis",
    "career growth",
    "job switch preparation",
    "resume job description matching",
  ],

  authors: [{ name: "Stryvexi" }],
  creator: "Stryvexi",
  publisher: "Stryvexi",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Stryvexi",
    title: "Stryvexi — Own Your Next Move",
    description:
      "Analyze your resume, practice mock interviews, identify skill gaps, and prepare for your next career opportunity with Stryvexi.",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stryvexi — Own Your Next Move",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Stryvexi — Own Your Next Move",
    description:
      "Get resume insights, practice mock interviews, and prepare for your next career move with Stryvexi.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f1e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
