# Stryvexi landing page

A polished, responsive Next.js landing page for Stryvexi — “Own Your Next Move.”

## Design direction
- Warm paper / ink / terracotta palette (no generic purple-blue AI gradient)
- Editorial serif accents, restrained mono labels, paper-like product mockups
- CSS motion, ticker, animated dashboard, responsive mobile navigation, FAQ accordion
- Resume intelligence, interview practice, career action plan, and application tracker sections

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Important: waitlist form
The waitlist form currently provides a front-end confirmation only. Connect it to your preferred email platform, database, or API route before collecting real signups. The email address is not currently sent or stored anywhere.

## Customise
- Update metadata in `app/layout.tsx`.
- Change the palette in `app/globals.css` under `:root`.
- Update copy and FAQ content in `app/page.tsx`.
