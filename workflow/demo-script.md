# Demo script v4 — ProofRoom (one take, under 4 minutes)

> The existing `video/proofroom-demo.mp4` (3:18) predates the live panel and the
> plain-language frontend. Re-record with this script so the video matches what
> a judge will see when they run `./run-demo.sh`.
> Everything shown ran live during the event; the room timestamps (GMT) prove it.

## Before recording

- [ ] Terminal: `./run-demo.sh` running (backend on :3000, frontend on the Vite URL).
- [ ] Browser tab 1: ProofRoom frontend (scroll to the top).
- [ ] Browser tab 2: Switch Console → **#proofroom** room, scrolled to 01:30.
- [ ] Browser tab 3: https://github.com/shahaman098/proofroom/pull/6
- [ ] Port 5173 busy? Stop whatever holds it (`lsof -nP -iTCP:5173 -sTCP:LISTEN`) or open the Network URL Vite prints.
- [ ] Restart the backend right before recording so stock is back to 12 / 8 / 5.

## Beats

1. **Hook (15s)** — frontend title. *"Your agent says the change works. ProofRoom
   checks whether it works for your teammates. Two teammates, two codebases, two
   coding agents, one Switch room."*

2. **The change (20s)** — scroll chapter 1. *"My agent renamed `total` to
   `grandTotal`. 80 seconds, 25 of 25 tests pass. In the old world I ship it."*

3. **The break (45s)** — switch to the Switch room, show 01:33 → 01:38.
   *"My teammate asked their checking agent to test it first, because the old
   mobile app is already in the App Store. Verdict: do not ship. The old app
   asks for `total`, and it's gone. My own tests were green because they'd been
   rewritten to match."*

4. **See it happen for real (45s)** — frontend → **Try it on the real backend**.
   Order 3 mice, Germany, SAVE20 → $62.05, old app works. Tick **Replay PR #5**
   → *"Breaks: missing total."* Say it plainly: *"This is my actual backend. The
   toggle removes one field, which is exactly what PR #5 did."*

5. **The fix (30s)** — room at 01:38–01:39, then PR #6. *"A sentence from a human
   became a failing test. The backend agent put the old field back next to the
   new one: nothing removed. Its own words: the old contract had zero test
   coverage."*

6. **The proof (30s)** — room at 01:43, then frontend **approval replay**: click
   through to Approve. *"28 of 28 tests, 10 of 10 checks, against exact code
   versions. A human says /approve."* Then click **Simulate a new change**:
   *"If the code changes, the approval stops counting."*

7. **Why Switch (20s)** — Room Instructions. *"No dashboard, no CI integration.
   The room carries the requirement, the evidence and the decision. Take Switch
   away and the two agents can't talk."*

8. **Close (10s)** — *"Your agent says it works. ProofRoom checks whether it
   works for your teammates."*

## After the take

- Trim to under 4 minutes.
- Upload (YouTube unlisted), then paste the link into the README's demo-video line.
