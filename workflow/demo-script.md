# Demo script v3 — ProofRoom (one take, ~3-4 min)

> Record with Cmd+Shift+5 (Record Entire Screen). Everything shown ran live
> during the event — the timestamps in the room prove it.

## Before recording

- [ ] Browser tab 1: http://localhost:53758 — login `user` / `ShipRoomOwner!2026` → **#ship-room**
- [ ] Browser tab 2: https://github.com/shahaman098/proofroom/pull/6 (merged compat PR)
- [ ] Browser tab 3: https://github.com/shahaman098/proofroom-web (repo B)
- [ ] Terminal: backend running (`node server.js` in demo-app)

## Beats

1. **The hook (20s)** — README on screen:
   *"Your agent says the change works. ProofRoom checks whether it works for
   your teammates. Two teammates, two repos, two existing agents — one Switch
   room carrying their requirements, handoffs and decisions."*

2. **The setup (20s)** — scroll the room: teammate A's request
   (*rename total → grandTotal, add taxBreakdown*), the agent's 80-second
   delivery with commit SHA `fd023c7`, PR #5 merged. Backend suite 25/25.
   *"My repo is green. In the old world, I'd ship and my teammate would find
   out next standup."*

3. **THE CENTERPIECE (60s)** — teammate B's requirement
   (*"older mobile clients MUST keep working"*) → the
   **VERDICT CARD — FOUND — BLOCKING**:
   *"Do not ship the mobile release tomorrow. `response.total → undefined`."*
   Say: *"Each repo was green in isolation. The breakage only existed BETWEEN
   the repos — and only the room could see it."*

4. **The convergence (40s)** — teammate A's admission (*"my suite was 25/25
   and I still broke your clients"*) → compat fix: deprecated alias +
   `X-API-Version` + compat tests. Show PR #6 on GitHub — read the agent's
   own line: *"the old contract had zero test coverage."*

5. **The proof (30s)** — final VERDICT CARD — CLEAR:
   *"28/28, contract probes 10/10, total equals grandTotal under DE+SAVE20 —
   verified against exact commits b13234f and 405f440."* Then the human's
   /approve.

6. **Switch is why (20s)** — Switch Console: the room's Instructions (the
   cross-repo contract). *"No dashboard, no CI integration — the room IS the
   product. That's Switch."*

7. **Close (10s)** — *"Your agent says the change works. ProofRoom checks
   whether it works for your teammates."*

## After the take

- Trim to < 4 min with ffmpeg if needed.
- Upload to YouTube (unlisted) → link into README + submission form.
- Suggested title: "ProofRoom — your agent's fix, your teammate's proof (Flip the Switch)"
