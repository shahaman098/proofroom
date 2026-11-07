# Demo script — one clean take (~3 minutes)

> Record with Cmd+Shift+5 (macOS screen recording). Capture the whole screen:
> half Mattermost room, half browser/terminal. Follow beats in order; every
> chat message you send is quoted below.

## Setup before recording

- [ ] QuickCart running at localhost:3000 (`npm start` in demo-app) — leave a
      cart showing the wrong total on screen
- [ ] Ship Room open in Mattermost (bundled with Switch)
- [ ] GitHub repo open in a browser tab (pull requests page)
- [ ] Test suite clean run in a terminal tab

## Beats

1. **The problem (30s)** — QuickCart in the browser: add 3× Silent Mouse,
   type `SAVE20`, checkout. Point at the charge: full price, code ignored.
   *Voiceover: "Support just got this report from a customer."*

2. **The report (15s)** — in Ship Room, send:
   > @ship-engineer Customers say discount codes do nothing. Tried SAVE20 on
   > a 3× mouse cart and got charged full price. Can you take it?
   *(Alias of your agent — check `!list-aliases`.)*

3. **The loop (90s)** — let the agent work; do NOT cut. It should reproduce,
   write the failing test, fix, run the suite, open the PR, and post the
   summary in the room. If a step takes long, that's fine — real work.

4. **Human review (30s)** — open the PR in the browser, read the diff aloud
   for two sentences, click **Merge**. Back in the room, send:
   > Reviewed and merged. Pulling the latest build now.
   *(In the room, ask the agent to pull the fix into its working copy and
   re-run the suite — shows the loop closes.)*

5. **Close (15s)** — browser: QuickCart again, same cart, `SAVE20` → now
   20% off. *Voiceover: "Report to reviewed PR, without anyone opening an
   IDE. That's Ship Room — built on Switch."*

## After the take

- Trim with ffmpeg if needed; keep it under 4 minutes.
- Upload to YouTube (unlisted is fine) → put the link in the README + submission form.
