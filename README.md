# ProofRoom 🛡️

**Your agent says the change works. ProofRoom checks whether it works for your teammates.**

> Flip the Switch hackathon submission (WeMakeDevs × DevTools Academy × Switch)
> Track: **Best Business Workflow** · Two repos, two agents, one Switch room

🎬 **Demo video:** [proofroom-demo-v2.mp4 (3m40s)](https://github.com/shahaman098/proofroom/releases/download/demo-v2/proofroom-demo-v2.mp4) — the room's real verdict cards, terminal proof, and a live checkout, captured during the event

## Try it in 60 seconds

```bash
git clone https://github.com/shahaman098/proofroom && cd proofroom
./run-demo.sh        # starts the QuickCart backend and the ProofRoom frontend
```

Open the Vite URL it prints and scroll to **“Try it on the real backend”**:
place an order, then tick **Replay PR #5**. You'll watch the old v1.2 mobile
app break against the real API: the exact failure our two agents caught in
the Switch room.

This shortcut runs the *product*. The *workflow* runs in a Switch room: see
[Reproduce our setup](#reproduce-our-setup-10-minutes). To run the pieces
yourself, see [`proofroom/`](proofroom/).

## How ProofRoom maps to the judging criteria

| Criterion | Where to see it |
|---|---|
| **Use of Switch** | The room *is* the product. Remove it and the two agents can't share requirements or evidence. See [Why Switch is central](#why-switch-is-central-the-project-fails-without-it) and the [full transcript](workflow/room-transcript.md). |
| **Technical execution** | `./run-demo.sh`; backend `28/28`, client contract suite `5/5`, frontend `7/7` tests. The commits named in the walkthrough (`fd023c7`, `b13234f`, `405f440`, `fe4c9c3`) exist on GitHub. |
| **Creativity and impact** | A real cross-team failure (a renamed field breaking shipped mobile apps) that no single repo's tests could see, caught, fixed and approved about 12 minutes after the first check was requested (01:33 → 01:45 GMT). |
| **Presentation** | The [demo video](https://github.com/shahaman098/proofroom/releases/download/demo-v2/proofroom-demo-v2.mp4) (3m40s), the replayed walkthrough in [`proofroom/`](proofroom/), and the live panel. |

## The problem

Every developer has lived this: your coding agent changes an API, your suite
is green, you ship — and a teammate's app breaks later. A change can pass every test in
its own repo and still break someone else's code, because no single repo's tests
can see across the boundary. Agents work alone even when their humans are teammates.

## What ProofRoom does

Two teammates bring their **existing agents** — working in **separate
repositories** — into **one shared Switch room**:

| Teammate | Repo | Agent |
|---|---|---|
| **A — backend** | this repo (QuickCart API, `demo-app/`) | `@ship-engineer.aman` |
| **B — clients** | [`clients/`](clients/) in this repo (web + **legacy mobile v1.2** binaries pinned to the API contract) | `@blast-radius.aman` |

Switch carries their **requirements, handoffs and decisions** in one
conversation. This demo ran **live during the event** (all timestamps GMT):

1. **01:30** — Teammate A asks their agent to rename `total` → `grandTotal`
   and add `taxBreakdown` to the checkout response. Done in **80 seconds** (01:31);
   backend suite 25/25 green; PR #5, commit `fd023c7`, reported in the room.
2. **01:33** — Teammate B orders the contract suite run, with the requirement:
   *"the v1.2 mobile binaries are already shipped to the App Store — older
   mobile clients MUST keep working."*
   At **01:38** the verdict arrives:
   **VERDICT CARD: "FOUND — BLOCKING. Do not ship the mobile release tomorrow."**
   The break, proven with a probe: `response.total → undefined` while
   `response.grandTotal → 26.34 ✓`. Each repo was green in isolation — the
   breakage only existed **between** them, and only the room could see it.
3. **01:38–01:39** — The agents converge through the room. The backend agent's own
   root-cause note admits: *"the old contract had zero test coverage."*
   Compat fix: `total` restored as a deprecated alias + `X-API-Version`
   header + compat tests (PR #6, commit `b13234f`).
4. **01:43** — Teammate B's agent re-runs the contract suite:
   **VERDICT CARD: CLEAR** — 28/28, contract probes 10/10,
   `total === grandTotal` under DE+SAVE20, **verified against exact commits
   `b13234f` and `405f440`**.
5. **01:45** — The room owner: `"/approve — both sides green, evidence against exact
   commits from both agents."` (In the live run one room owner played both teammate roles; the two agents were separate.)

Full transcript: [`workflow/room-transcript.md`](workflow/room-transcript.md).

## Two gates, one contract

The repo has two independent GitHub Actions gates (`.github/workflows/`), plus a
frontend build:

- **`backend`** runs the backend's own suite (`demo-app/`).
- **`client-contract`** starts the backend built from the same commit and runs the
  shipped clients' contract suite (`clients/`) against it.

Same two commits from the room run, run locally against each:

| Backend commit | Backend's own suite | Client contract suite |
|---|---|---|
| `fd023c7` (PR #5, the rename) | **25/25 pass** | **4 of 5 fail** (`total` is missing) |
| `b13234f` (PR #6, the compat fix) | **28/28 pass** | **5/5 pass** |

That is the whole story in one table: the backend gate was green on PR #5 while
the client gate was red, and only the room put the two results side by side. (The
clients' suite is today's `clients/`; during the run it lived in a separate repo
and was folded in later in `0b25a52`.) The workflows run on every push and pull
request once they are on GitHub.

## Earlier the same day: the room's 4 merged bug-fix PRs

Before the cross-repo demo, this same room ran its fix pipeline live —
four reports, four reviewed PRs, each with a failing test written first:

| PR | Fix | Loop time |
|---|---|---|
| [#1](https://github.com/shahaman098/proofroom/pull/1) | Discount codes silently dropped + float rounding | ~7 min |
| [#2](https://github.com/shahaman098/proofroom/pull/2) | Stock over-sell (inventory going negative) | ~4 min |
| [#3](https://github.com/shahaman098/proofroom/pull/3) | Tax computed pre-discount + first **VERDICT CARD**: *"FOUND — two pre-existing security holes"* (negative-qty orders where the store pays the customer) | ~7 min incl. adversarial pass |
| [#4](https://github.com/shahaman098/proofroom/pull/4) | Negative-qty security hole — the verifier's finding became the next report automatically | ~2 min |

The suite grew **5 → 28 tests** through the agents' loops, and passes from a
clean clone.

## Why Switch is central (the project fails without it)

- **One room, two repos, two owners.** The room's **Instructions** (see
  [`workflow/room-instructions.md`](workflow/room-instructions.md)) define the
  cross-repo contract — who owns what, what evidence looks like, who merges.
  Each side has its own gate (the backend suite and the client contract suite,
  see [Two gates](#two-gates-one-contract)) and each agent keeps its own working
  copy. Neither gate sees the other's result, so the room is where the evidence
  comes together.
- **Evidence exchange through chat**: verdict cards with failing output,
  field lists, and commit SHAs flow between agents exactly like teammate
  messages — because in Switch, they *are* teammate messages.
- **Identity & trust**: an agent only takes instructions from its linked owner.
  At 00:30 a chat account not yet linked to a Switch user asked
  `@ship-engineer.aman` for the discount fix, and the agent declined: *"I only
  take instructions from my owner, and this chat account isn't linked to a
  Switch user yet."* The same request, sent from the linked account at 00:36,
  was accepted (see the [transcript](workflow/room-transcript.md)). This is also
  why one linked owner account issued both teammate requests in the live run.
- **Roles in writing**: the Instructions say the verifier never merges, the
  fixer never approves its own fix, and only the human merges.
- **Bundled Mattermost**: both humans join from chat with nothing to install.
- Delete the room and the collaboration doesn't exist — there is no app, no
  dashboard, no CI magic. The room *is* the product.

## Reproduce our setup (10 minutes)

1. Install **Switch Console**: [docs](https://docs.switchagents.ai/switch-rooms/getting-started/install-switch-console) → **Get started** → **On this computer** → **Start** (starts the local server + bundled Mattermost).
2. Choose **Claude Code** as agent provider (your own key/subscription).
3. Create a room, paste [`workflow/room-instructions.md`](workflow/room-instructions.md) into Instructions, add both agents.
4. Backend: `cd demo-app && npm install && npm start` → http://localhost:3000.
   Client: `cd clients && npm install` and run its contract suite with
   `API_BASE=http://localhost:3000 npm test`.
5. Ask teammate A's agent for an API change. Watch teammate B's agent catch
   what your own suite can't.

## Proof it runs

```bash
$ ▶ cd demo-app && npm test
Test Suites: 4 passed, 4 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        0.627 s, estimated 1 s
Ran all test suites.

$ ▶ cd clients && API_BASE=localhost:3000 npm test
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.226 s, estimated 1 s
Ran all test suites.

$ ▶ curl -s -X POST localhost:3000/api/checkout -H 'Content-Type: application/json' -d '{"items":[{"id":"mouse","qty":3}],"discountCode":"SAVE20","region":"DE"}'
{
    "orderId": "ORD-MW77LBR9",
    "region": "DE",
    "regionName": "Germany",
    "subtotal": 59.97,
    "discount": 11.99,
    "discountApplied": "SAVE20",
    "tax": 9.12,
    "shipping": 4.95,
    "taxBreakdown": {
        "tax": 9.12,
        "shipping": 4.95
    },
    "grandTotal": 62.05,
    "total": 62.05
}

$ ▶ gh pr list --state all --limit 6
6	fix: restore total as deprecated alias, add X-API-Version header	fix/backward-compat-total-alias-api-version	MERGED	2026-11-08T01:39:43Z
5	feat: rename total → grandTotal, add taxBreakdown to checkout response	feat/checkout-response-grand-total-breakdown	MERGED	2026-11-08T01:31:29Z
4	fix: negative quantities accepted as valid orders, store pays customer	fix/negative-qty-accepted-as-valid-order	MERGED	2026-11-08T01:15:32Z
3	fix: tax computed on pre-discount subtotal, overcharging discounted orders	fix/tax-computed-on-pre-discount-subtotal	MERGED	2026-11-08T01:01:55Z
2	fix: checkout allows over-stock orders, driving inventory negative	fix/stock-goes-negative	MERGED	2026-11-08T00:49:20Z
1	fix: discount codes silently dropped; totals not rounded to cents	fix/discount-code-not-applied	MERGED	2026-11-08T00:42:05Z
```

_Captured live on the build machine during the event. The `total` alias and `grandTotal` coexist — that is PR #6's compatibility layer at work._

## 🖥️ Frontend workspace (by teammate B)

[`proofroom/`](proofroom/) has two parts:

- **A scroll-driven replay** of the live room run above: the QuickCart API and
  the v1.2 mobile app connected through the Switch room, with the real commits
  (`fd023c7` → `b13234f` + `405f440`, test `fe4c9c3`), the *FOUND — BLOCKING* →
  *CLEAR* verdict cards, and an interactive `/approve` gate that goes stale if a
  new commit lands. This part is a replay and is not connected to live services.
- **A live panel** that talks to the real QuickCart backend: build a cart, pick a
  region and discount code, and it `POST`s to `/api/checkout`. The response is
  checked the way the two real clients check it (`clients/web-client.js`,
  `clients/mobile-client-v1.js`). A toggle replays PR #5 by hiding `total` from
  that same response, so you can watch the old mobile app break against your own
  backend.

```bash
./run-demo.sh                                # backend + frontend in one command
# or run them separately:
cd demo-app && npm install && npm start      # backend → http://localhost:3000
cd proofroom && npm install && npm run dev   # frontend → http://localhost:5173 (proxies /api to the backend)
npm test                                     # 7/7 (includes parity tests against clients/)
```

Without the backend, the live panel shows how to start it; the replay still works.

## More

- [Demo script](workflow/demo-script.md) · [Blog post draft](workflow/blog-post.md) · [#HowISwitch social copy](workflow/social-post.md)
- [Room Instructions](workflow/room-instructions.md) · [Full room transcript](workflow/room-transcript.md)

## Team

- **Aman Kumar Sah** — [@shahaman098](https://github.com/shahaman098) — teammate A, backend + room workflow
- **Benjamin (Benji.)** — [@YBenjaminPCondori](https://github.com/YBenjaminPCondori) — teammate B, frontend workspace ([PR #7](https://github.com/shahaman098/proofroom/pull/7))

Built for the [Flip the Switch hackathon](https://www.wemakedevs.org/hackathons/switch).
Powered by [Switch](https://github.com/sandbox-quantum/switch) 🧡

## 🫡 Steal this room

This repo doubles as a playbook. To run this exact governance setup for your
own team, you need three things — all in this repo:

1. **The contract** — [`workflow/room-instructions.md`](workflow/room-instructions.md):
   two agents, separated duties (fixer never merges, verifier never writes
   the fix, evidence against exact commit SHAs, human approves).
2. **The client contract suite** — [`clients/`](clients/):
   pinned expectations for every client you can't re-release (shipped mobile
   binaries, third-party integrations). This is the tripwire that catches
   cross-repo breakage your own suite can't see.
3. **The verdict card format** — see the transcript: `CLEAR ✅ / FOUND ⚠️`,
   suite counts, probes run, commit SHAs. Copy the format; it makes agent
   output reviewable by humans at a glance.

Total setup cost: one Switch room, one pasted document, ten minutes.
