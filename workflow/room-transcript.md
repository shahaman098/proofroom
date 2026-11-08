# Ship Room — live room transcript (Nov 8, 2026)

_Real messages from the demo run. The agent's progress cards (Working… Ns, tool traces) are abbreviated in chat; the full session ran locally via Switch._

---

**[00:23] support (aman):** test via /posts

**[00:24] support (aman):** !invite-agent @ship-engineer.aman

**[00:29] ship-engineer.aman (agent):** Hey! I'm on standby — @ship-engineer.aman to get started.

**[00:30] support (aman):** @ship-engineer.aman Customers say discount codes do nothing. Tried SAVE20 on a 3x mouse cart and got charged full price. Can you take it?

**[00:30] ship-engineer.aman (agent):** @aman I only take instructions from my owner, and this chat account isn't linked to a Switch user yet — so I can't tell whether that's you. If it is, link this account to your Switch user in Switch Console and try again.

**[00:36] support (owner):** @ship-engineer.aman Customers say discount codes do nothing - tried SAVE20 on a 3x mouse cart (3 x 19.99 = 59.97) and got charged full price. Can you take it?

**[00:36] ship-engineer.aman (agent):** Starting a session to handle this — one moment.

**[00:36] ship-engineer.aman (agent):** **Worked for 6m 55s. 35 tool calls.**
✓ 31 done · ✗ 4 failed

**[00:37] ship-engineer.aman (agent):** On it — cloning the repo and reproducing the discount bug now.

**[00:43] ship-engineer.aman (agent):** Done. Here's what I found and fixed:

**Root cause (Bug #1):** `calculateTotal` in `pricing.js` hardcoded `null` instead of forwarding `discountCode` to `applyDiscount` — so every discount code was silently dropped and customers were charged full price. One-character fix: `null` → `discountCode`.

**Also fixed (Bug #2):** The same function returned raw floating-point totals (e.g. `2.1 × 3 = 6.300000000000001`). Added `parseFloat((total).toFixed(2))` so the rounded cents value is what hits the bank charge.

The server endpoint (`/api/checkout`) already passed `discountCode` through correctly, so no change needed there.

**PR:** https://github.com/shahaman098/ship-room/pull/1

**Test run (7/7 pass):**
```
✓ returns 0 for missing or unknown codes
✓ applies percent codes
✓ flat codes never discount below zero
✓ sums items without a code
✓ applies SAVE20 to the reported 3×mouse cart   ← new regression test
✓ rounds total to exactly 2 decimal places       ← new regression test
✓ every code has a supported type and value
```

Waiting for human review before merge.

**[00:43] support (owner):** Reviewed and merged - clean root-cause writeup and the failing test first is exactly right. Pulling the latest build now. https://github.com/shahaman098/ship-room/pull/1

**[00:44] support (owner):** Next one for you: warehouse flagged that customers can order more units than we have in stock - stock goes negative. Can you take that one too?

**[00:47] support (owner):** @ship-engineer.aman bumping this one - warehouse says customers can order more units than we have in stock and stock goes negative. Can you take it?

**[00:47] ship-engineer.aman (agent):** **Working… 3m 51s**
Last: Read
✓ 17 done · ✗ 1 failed

**[00:47] ship-engineer.aman (agent):** On it — pulling the latest main and looking at the stock validation code now.

**[00:51] support (owner):** That one went even faster - reviewed and merged. Two reports, two reviewed PRs, zero IDEs opened. https://github.com/shahaman098/ship-room/pull/2

**[00:51] ship-engineer.aman (agent):** **Queued. Waiting for the agent to start…**
Stops what the agent is working on now. This message stays queued.

