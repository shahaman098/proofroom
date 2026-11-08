# ProofRoom demo script (v6)

Target length: about 3 min 15 s, plus pauses between beats.

How to record: talk it, don't read it. Say it in your own words if that feels more natural, as long as the facts stay the same (the numbers, the commit names, the timestamps). Face to camera, one take if you can. Leave about one second of silence between beats (marked `[BEAT]`). That gives me clean cut points. If you stumble, pause, repeat the sentence, and keep going; I'll cut to the clean take.

Every `[SHOW]` line says what is on screen while you say the sentence. All of it is captured live from the real system. Nothing is mocked.

---

## BEAT 1: Hook (about 18 s)

"You know that moment when your coding agent says "done, tests pass" and you just ship it? That's what this project is about. I'm Aman, and ProofRoom puts two teammates' agents in one Switch room, so someone actually checks the change before it goes out."

[SHOW] GitHub repo page, README top. Then the Switch Console app on the #proofroom room.

[BEAT]

## BEAT 2: The change (about 30 s)

"Here's what happened in the room. At 01:30 I asked my backend agent to rename one field in the checkout response: total becomes grandTotal. Eighty seconds later it was done, and all 25 of its tests passed. I can run them right here, on that exact commit. Green."

[SHOW] Room scrolled to 01:30 (request) and 01:31 (agent reply with commit fd023c7). Terminal: `git show --stat fd023c7`, then the backend suite at that commit: `Tests: 25 passed, 25 total`.

[BEAT]

## BEAT 3: The break (about 45 s)

"But my teammate's agent wasn't convinced. The old mobile app is already out in the App Store, so it checked that first, and at 01:38 it came back with: don't ship this. Here's why. This is my backend at that commit. I ask for a checkout, and grandTotal is there, but total? Gone. The old app reads total. And the client tests agree: four out of five fail. My tests were green. Theirs were red."

[SHOW] Room: 01:33 request, 01:38 verdict card. Terminal: start the backend at fd023c7 on a spare port; `curl` the checkout and pipe through `jq` to show `total` is null and `grandTotal` is 26.34; run the client contract suite: `4 failed, 1 passed`.

[BEAT]

## BEAT 4: Why the tests missed it (about 30 s)

"So why didn't my tests catch it? Because the one test that checked total had been rewritten to check grandTotal, in the same commit. Nothing was watching the old field anymore. So the verifier added a test for it. On my change, it fails: total is undefined. After the fix, it passes."

[SHOW] Terminal: `git show fe4c9c3` (the test). Run that test file at fd023c7: `1 failed, 25 passed`. Run it at b13234f: `26 passed`.

[BEAT]

## BEAT 5: The fix (about 30 s)

"So I told my agent: keep total as an alias, add a version header, and write tests for both. That's this commit. Look at the diff: total is back next to grandTotal, and nothing was removed. All 28 tests pass."

[SHOW] Room 01:38 to 01:39 messages. Terminal: `git show b13234f -- demo-app/server.js`; then `Tests: 28 passed, 28 total`.

[BEAT]

## BEAT 6: Clear, then approve (about 25 s)

"Then the verifier checked everything again against those exact commits and said all clear. That's 28 tests, plus its ten contract checks, by its own count. And here are the client tests against the fixed backend: five out of five. After that, I approved it."

[SHOW] Room: 01:43 CLEAR verdict card, 01:45 `/approve`. Terminal: client contract suite against b13234f: `5 passed, 5 total`.

[BEAT]

## BEAT 7: The frontend on the real backend (about 45 s)

"I also built a frontend on top of the real backend. Let's order three mice to Germany with the code SAVE20. Sixty-two oh five, with tax and shipping broken out, and the old-app check passes. Now watch: I tick "replay PR 5". That just removes the total field from this same response, right here in the browser, the way PR 5 did. And now the old app breaks. Missing: total."

[SHOW] Browser at the frontend, "Try it on the real backend" panel. Cart: 3 mice, Germany, SAVE20, place order, `HTTP 200`, `$62.05`, "Works". Tick the toggle: "Breaks: missing total". Briefly show the raw response.

[BEAT]

## BEAT 8: Why Switch (about 25 s)

"So why does this need Switch? Because the room holds everything: the requirement, the evidence, the decision. The instructions spell out who owns what, and that only a human merges. And agents only take orders from their owner. Here, at 00:30, an account that wasn't linked asked for a fix, and my agent said no. The same request from the linked account at 00:36 went through."

[SHOW] Switch Console room Instructions. Room at 00:30: the declined message, then 00:36.

[BEAT]

## BEAT 9: Close (about 12 s)

"So that's ProofRoom. Your agent says it works. This checks whether it works for your teammates. Clone the repo, run one script, and try it yourself."

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
