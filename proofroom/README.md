# ProofRoom frontend

React + JavaScript + Vite. A three-screen landing page and interactive, simulated cross-repository verification workflow.

## Run

Use Node 20.19+ or 22.12+. Run `npm ci`, then `npm run dev`. `npm run build` creates `dist`. `npm test` checks approval guards, stale revisions, re-verification and approval history.

## Structure

- `src/main.jsx`: hero and three-section page composition.
- `src/Architecture.jsx`: CSS building illustrations.
- `src/Carousel.jsx`: manual feature carousel with native horizontal swipe, previous/next buttons, indicators, arrow keys and Home/End navigation. Its state is independent of verification.
- `src/Demo.jsx`: conversation/evidence panels, mobile keyboard tabs and persistent approval controls. Long histories and expanded test output remain accessible in scrollable panels.
- `src/useReveal.js`: one-time IntersectionObserver reveals; content remains visible without observer support.
- `src/style.css`: responsive layout, design tokens and reduced-motion styles.
- `src/content.js`: workflow copy and messages.
- `src/model.js`: pure demo transitions, revision identifiers and approval eligibility.

## Layout and accessibility

Each main section uses `100svh`, including its navigation/footer, so normal viewport heights total three screens. A 560px minimum per section preserves readable controls on unusually short windows or enlarged text instead of clipping content. Native carousel scrolling uses proximity snapping; the document scrolls freely. Reduced-motion preferences disable reveals and smooth scrolling.

Browser QA covered 1363×936 desktop and iframe viewports of 768×1024, 390×844 and 320×568 (classic scrollbars reduce content width). All measured three viewport heights without horizontal document overflow. Checked mouse/keyboard carousel controls, mobile tabs, approval gating, code-change invalidation and re-verification. Physical touch gestures and an OS-level reduced-motion preference were not emulated; these use native overflow scrolling and CSS/media-query support respectively.

All activity is simulated. No real Switch, GitHub, test execution, identity verification or external approval is connected. Production approval rules must be enforced server-side.

Visual direction follows the supplied lance.live-inspired architectural brief. The reference website returned HTTP 403 during retrieval; this is an original implementation, not a verified reproduction of its animation.
