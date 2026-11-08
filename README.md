# ProofRoom

A change can pass every test in its own repo and still break someone else's code. ProofRoom puts two teammates' coding agents in one [Switch](https://github.com/sandbox-quantum/switch) room so the break gets caught before anyone approves.

Built for the [Flip the Switch hackathon](https://www.wemakedevs.org/hackathons/switch), Best Business Workflow track.

## Submission links

Live URLs for optional tracks (edit [`workflow/submission-links.md`](workflow/submission-links.md) when posts are up):

| Track | Live URL | Draft in repo |
|-------|----------|---------------|
| Best Blog | [DEV Community post](https://dev.to/shahaman098/two-agents-one-room-how-we-caught-a-bug-neither-repos-tests-could-see-5il) | [`workflow/blog-post.md`](workflow/blog-post.md) |
| #HowISwitch | see submission-links | [`workflow/social-post.md`](workflow/social-post.md) |

## What happened

Two teammates, one Switch room, two existing agents:

| Role | Code | Agent |
|---|---|---|
| Teammate A, backend | `demo-app/` (QuickCart checkout API) | `@ship-engineer.aman` |
| Teammate B, clients | `clients/` (web client and the pinned v1.2 mobile client) | `@blast-radius.aman` |

The run below happened in the room on 8 Nov 2026 (times are GMT). The full log is in [`workflow/room-transcript.md`](workflow/room-transcript.md).

- **01:30** Teammate A asks their agent to rename `total` to `grandTotal` and add a `taxBreakdown`. 80 seconds later: PR #5, commit `fd023c7`, 25 of 25 tests pass.
- **01:33** Teammate B asks the other agent to check it before the mobile release, because the v1.2 app is already shipped and older clients must keep working.
- **01:38** The verifier reports `FOUND, BLOCKING`. The probe shows `response.total` is `undefined` while `response.grandTotal` is `26.34`. The backend suite stayed green because the one test that read `total` had been rewritten to read `grandTotal` in the same commit. The verifier adds a failing regression test, `fe4c9c3`.
- **01:38 to 01:39** Teammate A asks for a fix. The backend agent puts `total` back as a deprecated alias, adds an `X-API-Version` header and compat tests (PR #6, commit `b13234f`). Its root-cause note: the old contract had no test coverage.
- **01:43** The verifier reports `CLEAR`: 28 of 28 tests, 10 of 10 contract probes, `total` equals `grandTotal` under DE tax with `SAVE20`, checked against `b13234f` and the merge commit `405f440`.
- **01:45** The room owner types `/approve`.

In the live run one linked owner account issued both teammates' requests. The two agents were separate.

## Two gates, one contract

The repo has two independent GitHub Actions workflows in `.github/workflows/`, plus a frontend build:

- `backend` runs the backend's own suite.
- `client-contract` starts the backend built from the same commit and runs the clients' contract suite against it.

Run locally against the two commits from the room:

| Backend commit | Backend suite | Client contract suite |
|---|---|---|
| `fd023c7` (PR #5, the rename) | 25 of 25 pass | 4 of 5 fail, `total` is missing |
| `b13234f` (PR #6, the fix) | 28 of 28 pass | 5 of 5 pass |

The backend gate was green on PR #5 while the client gate was red. The room is where those two results were put side by side. The clients' suite shown is today's `clients/`; during the run it lived in a separate repo and was folded in later (`0b25a52`).

## Try it

```bash
git clone https://github.com/shahaman098/proofroom && cd proofroom
./run-demo.sh
```

This starts the backend on port 3000 and the frontend through Vite. Open the URL Vite prints and scroll to "Try it on the real backend". Build a cart, place an order, then tick "Replay PR #5". The checks run on the real response, the same way `clients/web-client.js` and `clients/mobile-client-v1.js` check it, and you can watch the old mobile app break when `total` goes missing. The toggle removes `total` locally from the real response; it does not change the backend.

Above the live panel is a scroll-driven replay of the room run, and below it an approval demo where a new commit makes an earlier `/approve` stale. Those two parts are replays, not connected to live services. Without the backend running, the live panel shows how to start it.

To run the pieces separately:

```bash
cd demo-app && npm install && npm start      # backend, http://localhost:3000
cd proofroom && npm install && npm run dev   # frontend, proxies /api to the backend
```

Needs Node 20.19+ or 22.12+. Tests: `npm test` in `demo-app/` (28), `clients/` (5, with the backend running and `API_BASE=http://localhost:3000`) and `proofroom/` (7).

## How Switch is used

- **Shared requirements.** The v1.2 requirement was a sentence typed in the room. The verifier turned it into a test.
- **Evidence in chat.** Verdict cards with failing output, field lists and commit SHAs moved between the agents as ordinary room messages.
- **Written roles.** The room's [Instructions](workflow/room-instructions.md) say the verifier never merges, the fixer never approves its own fix, and only the human merges. Each agent keeps its own working copy.
- **Identity.** An agent only takes instructions from its linked owner. At 00:30 an account not yet linked to a Switch user asked `@ship-engineer.aman` for a fix, and the agent declined: "I only take instructions from my owner, and this chat account isn't linked to a Switch user yet." The same request from the linked account at 00:36 was accepted.

Without the room there is nowhere for the two agents to exchange the requirement and the evidence.

## Run the room yourself

1. Install Switch Console ([docs](https://docs.switchagents.ai/switch-rooms/getting-started/install-switch-console)): Get started, On this computer, Start. This starts the local server and a bundled Mattermost.
2. Choose Claude Code as the agent provider.
3. Create a room, paste [`workflow/room-instructions.md`](workflow/room-instructions.md) into Instructions, and add both agents.
4. Start the backend (`cd demo-app && npm install && npm start`) and install the clients (`cd clients && npm install`).
5. Ask teammate A's agent for an API change and watch teammate B's agent check it.

## Earlier in the same room

Before the cross-repo run, the room handled four bug reports as four reviewed PRs, each with a failing test first. The backend suite grew from 5 to 28 tests.

| PR | Fix |
|---|---|
| [#1](https://github.com/shahaman098/proofroom/pull/1) | Discount codes silently dropped, plus float rounding |
| [#2](https://github.com/shahaman098/proofroom/pull/2) | Stock could go negative |
| [#3](https://github.com/shahaman098/proofroom/pull/3) | Tax computed before the discount; the verifier's first card found two security holes |
| [#4](https://github.com/shahaman098/proofroom/pull/4) | Negative-quantity orders accepted, so the store paid the customer |

## Repository layout

| Path | What it is |
|---|---|
| `demo-app/` | QuickCart checkout API and its tests |
| `clients/` | Web client, pinned v1.2 mobile client and the contract suite |
| `proofroom/` | Frontend: room replay, live backend panel, approval demo |
| `workflow/` | Room Instructions, transcript, demo script, [submission links](workflow/submission-links.md), blog/social drafts |
| `run-demo.sh` | Starts the backend and frontend together |

## Reusing the setup

Three files carry the workflow: the [Instructions](workflow/room-instructions.md), the client contract suite in `clients/` (pinned expectations for clients you can't re-release), and the verdict-card format visible in the transcript (CLEAR or FOUND, suite counts, probes, commit SHAs).

## Team

- Aman Kumar Sah ([@shahaman098](https://github.com/shahaman098)), teammate A, backend and room workflow
- Benjamin ([@YBenjaminPCondori](https://github.com/YBenjaminPCondori)), teammate B, frontend ([PR #7](https://github.com/shahaman098/proofroom/pull/7))
