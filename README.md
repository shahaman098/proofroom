# ProofRoom 🛡️

**Your agent says the change works. ProofRoom checks whether it works for your teammates.**

> Flip the Switch hackathon submission (WeMakeDevs × DevTools Academy × Switch)
> Track: **Best Business Workflow** · Two repos, two agents, one Switch room

🎬 **Demo video:** _link lands here before deadline_ <!-- TODO -->

## The problem

Every developer has lived this: your coding agent changes an API, your suite
is green, you ship — and a teammate's frontend breaks an hour later. **40% of
AI-assisted fixes break something adjacent**, and no single repo's tests can
see across the boundary. Agents work alone even when their humans are teammates.

## What ProofRoom does

Two teammates bring their **existing agents** — working in **separate
repositories** — into **one shared Switch room**:

| Teammate | Repo | Agent |
|---|---|---|
| **A — backend** | this repo (QuickCart API, `demo-app/`) | `@ship-engineer.aman` |
| **B — clients** | [`shahaman098/proofroom-web`](https://github.com/shahaman098/proofroom-web) (web + **legacy mobile v1.2** binaries pinned to the API contract) | `@blast-radius.aman` |

Switch carries their **requirements, handoffs and decisions** in one
conversation. This demo ran **live during the event** (all timestamps GMT):

1. **01:31** — Teammate A asks their agent to rename `total` → `grandTotal`
   and add `taxBreakdown` to the checkout response. Done in **80 seconds**;
   backend suite green; PR #5 merged with commit `fd023c7` reported in the room.
2. **01:37** — Teammate B orders the contract suite run, with the requirement:
   *"the v1.2 mobile binaries are already shipped to the App Store — older
   mobile clients MUST keep working."*
   → **VERDICT CARD: "FOUND — BLOCKING. Do not ship the mobile release tomorrow."**
   The break, proven with a probe: `response.total → undefined` while
   `response.grandTotal → 26.34 ✓`. Each repo was green in isolation — the
   breakage only existed **between** them, and only the room could see it.
3. **01:39** — The agents converge through the room. The backend agent's own
   root-cause note admits: *"the old contract had zero test coverage."*
   Compat fix: `total` restored as a deprecated alias + `X-API-Version`
   header + compat tests (PR #6, commit `b13234f`).
4. **01:44** — Teammate B's agent re-runs the contract suite:
   **VERDICT CARD: CLEAR** — 28/28, contract probes 10/10,
   `total === grandTotal` under DE+SAVE20, **verified against exact commits
   `b13234f` and `405f440`**.
5. **01:45** — Human: `"/approve — both sides green, evidence against exact
   commits from both agents."`

Full transcript: [`workflow/room-transcript.md`](workflow/room-transcript.md).

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
  Neither agent can see the other's CI; the room is the only shared context.
- **Evidence exchange through chat**: verdict cards with failing output,
  field lists, and commit SHAs flow between agents exactly like teammate
  messages — because in Switch, they *are* teammate messages.
- **Identity & trust**: the room knows which human is which teammate
  (unlinked accounts are refused by the agent — on record in the transcript).
- **Bundled Mattermost**: both humans join from chat with nothing to install.
- Delete the room and the collaboration doesn't exist — there is no app, no
  dashboard, no CI magic. The room *is* the product.

## Reproduce our setup (10 minutes)

1. Install **Switch Console**: [docs](https://docs.switchagents.ai/switch-rooms/getting-started/install-switch-console.html) → **Get started** → **On this computer** → **Start** (starts the local server + bundled Mattermost).
2. Choose **Claude Code** as agent provider (your own key/subscription).
3. Create a room, paste [`workflow/room-instructions.md`](workflow/room-instructions.md) into Instructions, add both agents.
4. Backend: `cd demo-app && npm install && npm start` → http://localhost:3000.
   Client: `cd proofroom-web && npm install` and run its contract suite with
   `API_BASE=http://localhost:3000 npm test`.
5. Ask teammate A's agent for an API change. Watch teammate B's agent catch
   what your own suite can't.

## Team

- **Aman Kumar Sah** — [@shahaman098](https://github.com/shahaman098) (solo build; the workflow is designed for two teammates)

Built for the [Flip the Switch hackathon](https://www.wemakedevs.org/hackathons/switch).
Powered by [Switch](https://github.com/sandbox-quantum/switch) 🧡

## 🫡 Steal this room

This repo doubles as a playbook. To run this exact governance setup for your
own team, you need three things — all in this repo:

1. **The contract** — [`workflow/room-instructions.md`](workflow/room-instructions.md):
   two agents, separated duties (fixer never merges, verifier never writes
   the fix, evidence against exact commit SHAs, human approves).
2. **The client contract suite** — [`proofroom-web`](https://github.com/shahaman098/proofroom-web):
   pinned expectations for every client you can't re-release (shipped mobile
   binaries, third-party integrations). This is the tripwire that catches
   cross-repo breakage your own suite can't see.
3. **The verdict card format** — see the transcript: `CLEAR ✅ / FOUND ⚠️`,
   suite counts, probes run, commit SHAs. Copy the format; it makes agent
   output reviewable by humans at a glance.

Total setup cost: one Switch room, one pasted document, ten minutes.
