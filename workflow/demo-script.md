# Demo script v2 — the adversarial triad (one take, ~3-4 min)

> Record with Cmd+Shift+5 (Record Entire Screen). Everything shown is real —
> it ran live during the event. Follow the beats; every quote is in the room.

## Before recording

- [ ] Refresh the transcript if the 4th loop (negative-qty fix) has landed:
      `node scripts/export-transcript.js` in the workspace, then commit+push.
- [ ] Browser tab 1: http://localhost:53758 — log in as `user` /
      `ShipRoomOwner!2026` → open **#ship-room**
- [ ] Browser tab 2: PR #3 on GitHub
- [ ] Terminal (or browser tab 3): `node server.js` in demo-app → QuickCart

## Beats

1. **The hook (20s)** — README triad diagram on screen:
   *"Anyone can ask an AI agent to patch a bug. But who checks the blast
   radius? Ship Room is two agents and one human in one Switch room — a
   fixer and an adversarial verifier with separated duties."*

2. **The loop (60s)** — #ship-room transcript, scroll slowly through:
   - the DE tax report → coder: *Root cause: computeTax called with the
     pre-discount subtotal…* → PR #3
   - **THE CENTERPIECE — the VERDICT CARD**: *FOUND — tax fix is correct,
     but two pre-existing security holes… Negative qty accepted as a valid
     order — the store pays the customer.* Say: *"The verifier confirmed the
     fix across four regions, added its own edge test to the branch — and
     found a security hole nobody asked about."*

3. **Human judgment on camera (40s)** — read the /approve message aloud:
   *"/approve #3 — the tax fix is sound… The two holes are pre-existing, so
   they ship as new reports, not blockers."* Then GitHub: PR #3 merged, show
   the verifier's commit: *"test: adversarial regression — flat discount +
   FR VAT tax ordering."*

4. **The flywheel (20s)** — back to the room: the coder already picked up
   the verifier's finding: *"On it — reproducing the negative-qty hole now."*
   *"The adversarial finding became the next work item — in the same room,
   with no human copy-pasting."*

5. **Switch is why (20s)** — Switch Console: the room's Instructions (the
   triad contract). *"This contract — fixer never merges, verifier never
   writes the fix, human approves — lives in the room itself. That's Switch."*

6. **The proof (20s)** — QuickCart: 3× mouse + SAVE20 + region DE → the tax
   line is now on the discounted amount. *"Reported bug to verified fix to
   filed follow-up, zero IDEs opened. Ship Room — built on Switch."*

## After the take

- Trim with ffmpeg; keep under 4 minutes.
- Upload to YouTube (unlisted) → link into README + submission form.
