# Ship Room 🚢

**A Switch room where customer bug reports become reviewed pull requests — without anyone opening an IDE.**

> Flip the Switch hackathon submission (WeMakeDevs × DevTools Academy × Switch)
> Track: **Best Business Workflow**

🎬 **Demo video:** _coming right after the final take_ <!-- TODO: embed link -->

## The problem

When a customer bug comes in through support chat, the path to a fix crosses
three tools and two handoffs: chat → ticket → engineer's IDE → PR → back to
chat. The person who reported the bug has no visibility into the middle, and
small bugs die in the queue.

## The workflow

**Ship Room** is one chat room (team chat, bundled Mattermost) with one
on-call AI agent (Claude Code) connected through **Switch**. A teammate
reports a bug in plain English, and the agent runs a fixed loop:

```
 report in room ─▶ reproduce ─▶ failing test ─▶ smallest fix ─▶ full suite ─▶ PR ─▶ human review & merge ─▶ confirm in room
      ▲                                                                                                        │
      └──────────────────────────────── the room is the whole interface ───────────────────────────────────────┘
```

The human never touches a terminal; the agent never merges its own code.
One real task, completed by one person and one agent, together — exactly
what the hackathon brief asks for.

## Why Switch is central (the project fails without it)

- **The room is the interface.** No dashboard, no CLI. Room **Instructions**
  (see [`workflow/room-instructions.md`](workflow/room-instructions.md)) define
  the entire loop — reproduce → test → fix → PR → report — and are inherited
  by every agent that joins. Delete the room and there is no product.
- **Bundled Mattermost** means any teammate can join from chat with nothing
  to install — that's the business value: support and PM report bugs where
  they already live.
- **Switch Console** runs the agent locally against the repo, so the fix
  pipeline works on private code without any cloud copy.
- Aliases (`!set-alias`), agent invites (`!invite-agent`) and room-scoped
  instructions are used throughout the demo.

## What's in this repo

| Path | What it is |
|---|---|
| `demo-app/` | **QuickCart** — tiny checkout service with 3 intentionally seeded bugs (discount dropped, float rounding, no stock check). Tests pass out of the box; the buggy behaviors are deliberately uncovered. |
| `workflow/room-instructions.md` | The exact instructions pasted into the Switch room — the heart of the workflow. |
| `workflow/demo-script.md` | Beat-by-beat script of the demo video. |
| `demo-app/pricing.js` | The pricing engine the agent fixes — see the seeded-bug comments. |
| Pull requests | **The agent's real PRs from the live demo are right here in this repo** — open the PR list and judge the loop by its output. |

## Reproduce our setup (10 minutes)

1. Install **Switch Console**: [docs.switchagents.ai — install](https://docs.switchagents.ai/switch-rooms/getting-started/install-switch-console.html) → open it → **Get started** → **On this computer** → **Start** (this starts the local server + bundled Mattermost).
2. Choose **Claude Code** as the agent when prompted (needs your own Anthropic API key or subscription).
3. Create a room: **Your Rooms → Create room** → pick Mattermost → name it *Ship Room* → paste [`workflow/room-instructions.md`](workflow/room-instructions.md) into Instructions → add your agent.
4. Clone this repo somewhere the agent can reach, and start the app:
   ```bash
   cd demo-app && npm install && npm start   # http://localhost:3000
   ```
5. In the Ship Room channel, report a bug in plain English. Try:
   > Customers say discount codes do nothing. Tried SAVE20 on a 3× mouse cart and got charged full price.
6. Review the PR the agent opens. Merge it. That's the whole loop.

## The seeded bugs

QuickCart is a real, runnable service — the bugs are real too, just planted
so the demo is reproducible for judges:

1. **Discount codes silently dropped** — `calculateTotal()` never passes the
   code through; customers pay full price while the UI confirms the code.
2. **Float rounding** — totals like `59.97000000000001` go straight to the charge.
3. **No stock check** — you can order more units than exist; stock goes negative.

## Team

- **Aman Kumar Sah** — [@shahaman098](https://github.com/shahaman098)

## Licenses & credits

Built for the [Flip the Switch hackathon](https://www.wemakedevs.org/hackathons/switch).
Powered by [Switch](https://github.com/sandbox-quantum/switch) 🧡
