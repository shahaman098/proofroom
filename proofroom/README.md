# ProofRoom frontend
React + JavaScript + Vite. A reference-inspired editorial landing page and interactive, simulated cross-repository verification workflow.

## Run
Use Node 20.19+ or 22.12+. Run `npm ci`, then `npm run dev`. `npm run build` creates `dist`. `npm test` checks approval guards and stale revision behavior.

## Edit
- `src/content.js`: copy, steps, messages and benefits.
- `src/style.css`: design tokens and responsive styles.
- `src/model.js`: pure demo state transitions, revision identifiers and approval eligibility. Replace this local simulation boundary with an authenticated service for a real integration.
- `src/main.jsx`: reusable UI and page sections.

All activity is simulated. No real Switch, GitHub, test execution, identity verification, or external approval is connected. Frontend approval guards demonstrate behavior; a production coordinator must enforce these rules server-side.

Reference: supplied screenshots of lance.live. Original ProofRoom content and CSS illustrations; no reference-site images, logos, testimonials or certification claims are reused.
