# ProofRoom frontend

React + JavaScript + Vite. A scroll-driven replay of the real ProofRoom room run (8 Nov 2026, source: `../workflow/room-transcript.md`), followed by an interactive approval demo: `/approve` against exact commits, and a what-if where a new commit makes the approval stale.

## Run

Requires Node 20.19+ or 22.12+. Run `npm ci`, then `npm run dev`. `npm test` runs the approval, scroll-timeline and client-contract tests. `npm run build` creates `dist`.

## Walkthrough

Desktop uses a two-viewport section with a one-viewport sticky scene. Scroll position drives camera transforms, connection-path drawing, requirement/evidence reveals, card crossfades and chapter indicators. There is no time-based playback or wheel interception: reverse scrolling returns to the same frame. The interactive demo occupies the third viewport, including its footer.

The presentation has five chapters: propose (PR #5, `fd023c7`) → discover (*FOUND — BLOCKING*, `response.total → undefined`) → capture (requirement becomes regression test `fe4c9c3`) → verify (PR #6, `b13234f` + `405f440`, 28/28, 10/10 probes) → review (`/approve`). Chapter buttons, previous/next and Left/Right/Home/End keyboard navigation move through this presentation only. They never dispatch approval actions.

At widths of 900px or less, or with `prefers-reduced-motion: reduce`, the walkthrough becomes a manual chapter carousel with stable readable illustrations. Horizontal touch gestures change chapters without cancelling vertical scrolling. No camera animation runs in this mode. The manual section can be shorter than the two-screen desktop version.

Desktop sections have a 560px minimum viewport height. Mobile manual sections have an 850px minimum to preserve readable content and controls on short screens. Below unusually short window heights or at enlarged text settings, accessibility takes precedence over a strict three-screen limit. Conversation histories and expanded evidence remain accessible inside scrollable panels.

## Live backend panel

`src/Live.jsx` + `src/contract.js` call the real QuickCart API (`GET /api/products`, `POST /api/checkout`) through Vite's `/api` proxy (`vite.config.js`, target `http://localhost:3000`, override with `QUICKCART_URL`; for a separately hosted API set `VITE_API_BASE`). Responses are checked with the same field lists as `clients/mobile-client-v1.js` and `clients/web-client.js`; `src/contract.test.js` fails if they drift apart. The "Replay PR #5" toggle removes `total` locally from the real response and is labelled as such.

## Source

- `src/Walkthrough.jsx`: chapter cards, navigation, swipe gestures and page composition.
- `src/Workspace.jsx`: original SVG workspace and static manual-mode illustrations.
- `src/useStory.js`: passive scroll/resize observers, one-shot requestAnimationFrame updates and responsive/reduced-motion mode changes.
- `src/story.js`: pure camera keyframes, drawing progress, chapter transitions and scroll geometry.
- `src/story.css`: sticky workspace, information cards and responsive/manual layouts.
- `src/Demo.jsx`: separate conversation/evidence interface and human decision controls.
- `src/model.js`: approval guards, revision identifiers, stale-decision invalidation and re-verification.
- `src/content.js`: demo conversation content.
- `src/useReveal.js`: optional demo heading entrance; reduced-motion aware.
- `src/style.css`: shared visual tokens and demo styles.

## Verification

- Four regression tests cover approval guards/history, changed-revision retention, reversible/deterministic timeline states and resize geometry.
- Desktop browser: pinned scene, wheel-driven forward/backward movement, paused-frame stability and chapter synchronisation. Returning from progress 0.6496 to 0.5 restored the exact camera transform.
- Desktop 1363×936: 2808px document height (three screens), no horizontal overflow.
- Mobile iframe 390×844: 1694px document height; 320×568: 1418px. No horizontal overflow or clipped chapter cards.
- Tablet iframe 768×1024: 2048px document height. Live resizing between desktop/tablet and changed viewport height recomputed mode and camera geometry.
- Keyboard chapter controls, mobile demo tabs, approval, stale-approval blocking and re-verification were exercised in the browser. Presentation navigation left the demo at its initial proposed state.
- Reduced-motion logic was tested with an emulated matchMedia preference and rendered static illustrations. No OS setting was changed. Physical touch gestures were not tested on a touch device.

All activity is a replay of the recorded run. The step-6 "approval stale" state never happened live; it shows the guard (`405f440+1` is a hypothetical next commit). Switch rooms, GitHub, agent execution and tests are not connected to live services. A real coordinator must enforce approval rules server-side.
