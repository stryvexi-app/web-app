import type { Metadata } from "next";
/*@ts-ignore*/
import "./globals.css";

export const metadata: Metadata = {
  title: "Stryvexi — Own Your Next Move",
  description:
    "A sharper way to prepare for your next role. Match your resume to the job, practice interviews, and build a focused job-switch plan.",
  applicationName: "Stryvexi",
  themeColor: "#f5f1e8",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}