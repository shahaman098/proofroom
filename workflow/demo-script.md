# ProofRoom demo script (v5)

Target length: about 3 min 15 s. About 440 spoken words at a calm 150 words per minute, plus pauses between beats.

How to record: read straight through, face to camera, in one take if you can. Leave about one second of silence between beats (marked `[BEAT]`). That gives me clean cut points. If you stumble, pause, repeat the sentence, and keep going; I'll cut to the clean take.

Every `[SHOW]` line says what is on screen while you say the sentence. All of it is captured live from the real system. Nothing is mocked.

---

## BEAT 1: Hook (about 18 s)

"Your coding agent says the change works. But does it work for your teammates? I'm Aman, and this is ProofRoom: two teammates, two coding agents, and one Switch room."

[SHOW] GitHub repo page, README top. Then the Switch Console app on the #proofroom room.

[BEAT]

## BEAT 2: The change (about 30 s)

"Here's the room from the live run. At 01:30 I asked my backend agent to rename one field in the checkout response, total, to grandTotal. It finished in 80 seconds. And here's the code at that commit, with all 25 of its tests passing."

[SHOW] Room scrolled to 01:30 (request) and 01:31 (agent reply with commit fd023c7). Terminal: `git show --stat fd023c7`, then the backend suite at that commit: `Tests: 25 passed, 25 total`.

[BEAT]

## BEAT 3: The break (about 45 s)

"Now my teammate's side. They asked a second agent to check the change before the mobile release, because the old version 1.2 app is already shipped. At 01:38 the verdict came back: do not ship. Let me prove it. This is my backend at that commit. I send a checkout request. The new field, grandTotal, is there. The old field, total, is gone. And here is the client contract suite against it: four of five tests fail. My own suite was green. This one is red."

[SHOW] Room: 01:33 request, 01:38 verdict card. Terminal: start the backend at fd023c7 on a spare port; `curl` the checkout and pipe through `jq` to show `total` is null and `grandTotal` is 26.34; run the client contract suite: `4 failed, 1 passed`.

[BEAT]

## BEAT 4: Why the tests missed it (about 30 s)

"Why was my suite green? The one test that read total had been rewritten to read grandTotal in the same commit. So the verifier added a regression test. Here it is. On my change it fails: expected total to be defined, received undefined. On the fix, it passes."

[SHOW] Terminal: `git show fe4c9c3` (the test). Run that test file at fd023c7: `1 failed, 25 passed`. Run it at b13234f: `26 passed`.

[BEAT]

## BEAT 5: The fix (about 30 s)

"I asked my agent to keep total as a deprecated alias, add a version header, and add tests for both. That's commit b13234f. Here's the diff: total is back next to grandTotal, and the header is set. Nothing was removed. The suite now has 28 tests, and all 28 pass."

[SHOW] Room 01:38 to 01:39 messages. Terminal: `git show b13234f -- demo-app/server.js`; then `Tests: 28 passed, 28 total`.

[BEAT]

## BEAT 6: Clear, then approve (about 25 s)

"The verifier then re-ran everything against the exact commits and reported clear: twenty-eight of twenty-eight tests and ten of ten contract probes. Here's the client suite against the fixed backend: five of five. Then a human typed approve."

[SHOW] Room: 01:43 CLEAR verdict card, 01:45 `/approve`. Terminal: client contract suite against b13234f: `5 passed, 5 total`.

[BEAT]

## BEAT 7: The frontend on the real backend (about 45 s)

"I also built a frontend that talks to this real backend. I'll order three mice to Germany with the code SAVE20. The backend answers: sixty-two oh five, with the tax and shipping split out. The old mobile app check passes. Now I'll tick replay PR number 5. That removes the total field from this same response, locally, just as PR 5 did. The old app breaks. Missing: total."

[SHOW] Browser at the frontend, "Try it on the real backend" panel. Cart: 3 mice, Germany, SAVE20, place order, `HTTP 200`, `$62.05`, "Works". Tick the toggle: "Breaks: missing total". Briefly show the raw response.

[BEAT]

## BEAT 8: Why Switch (about 25 s)

"This only works because of Switch. The room's instructions say who owns what and who can merge. And agents only take orders from their linked owner. Here, at 00:30, an unlinked account asked my agent for a fix, and it declined. The same request from the linked account was accepted."

[SHOW] Switch Console room Instructions. Room at 00:30: the declined message, then 00:36.

[BEAT]

## BEAT 9: Close (about 12 s)

"Your agent says it works. ProofRoom checks whether it works for your teammates. Clone the repo and run one script to try it yourself."

[SHOW] README quick start on GitHub, then `./run-demo.sh` printing the backend and frontend URLs.

---

## Evidence map (every claim, and where it is proven on screen)

| Claim in the narration | Proven by |
|---|---|
| Rename took 80 seconds, commit `fd023c7`, 25 tests | Room message 01:31 ("Worked for 1m 20s", commit SHA); live `npm test` at `fd023c7`: 25 passed |
| Verdict "do not ship" at 01:38 | Room verdict card, 01:38 |
| `total` is gone, `grandTotal` present | Live `curl` against the backend at `fd023c7` |
| 4 of 5 client tests fail | Live client contract suite run |
| Old test was rewritten in the same commit | `git show fd023c7` diff and the verdict card's explanation |
| Regression test fails then passes | Live runs of the `fe4c9c3` test at `fd023c7` and `b13234f` |
| Fix is alias plus header, 28 tests | `git show b13234f` diff; live `npm test`: 28 passed |
| CLEAR, 10 of 10 probes, then `/approve` | Room cards at 01:43 and 01:45. The 10 probes are the agent's own report, so the script says "reported" |
| 5 of 5 client tests on the fix | Live client suite run |
| $62.05 for 3 mice, DE, SAVE20 | Live panel on the real backend |
| Replay PR 5 breaks the old app | Toggle in the live panel. The script says it removes the field locally |
| Unlinked account declined at 00:30 | Room message at 00:30 and 00:36 |

## Things deliberately not claimed

- Anything about CI passing on GitHub (the workflows have not run there yet).
- Any statistic that is not shown on screen.
- That the approval or room-replay parts of the frontend are live. They are replays and the narration does not call them live.
