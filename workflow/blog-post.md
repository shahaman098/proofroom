# Two agents, one room: how we caught a bug neither repo's tests could see

> **Published post:** https://dev.to/shahaman098/two-agents-one-room-how-we-caught-a-bug-neither-repos-tests-could-see-5il

Numbers and timestamps come from [`room-transcript.md`](./room-transcript.md) or from re-running the repo at the cited commits.

## The setup

Two teammates, two coding agents, one **Switch** room. One agent owns a small checkout API. The other checks that web and mobile clients still work against it. The room is where requirements, handoffs, and evidence meet.

For the hackathon we pinned the shipped v1.2 mobile client as `clients/mobile-client-v1.js` in the repo. In the live run one person played both teammate roles, so both Switch identities shared an account. The two agents were still separate.

## The 80-second change

At 01:30 GMT on 8 Nov, the backend owner asked their agent to rename `total` to `grandTotal` in the checkout response and add tax and shipping breakdown. About 80 seconds later: PR #5, commit `fd023c7`, 25/25 tests green. We re-ran that commit while drafting this post: still 25/25.

## The break

Before the mobile release, the checking agent ran the client contract suite. Verdict: **do not ship.** The old app reads `total`; the new JSON drops the field, so shipped clients get `undefined`. The backend suite never failed.

Why did the tests stay green? The only test that asserted `total` was updated in the same commit to assert `grandTotal` instead. The change removed the old check while breaking old clients. The checking agent added regression test `fe4c9c3`. It fails on PR #5 (`Received: undefined`) and passes on the fix.

## The fix, and the human in the loop

The backend owner replied in the room: "My suite was 25/25 and I still broke your clients." The backend agent restored `total` beside `grandTotal` and added a version header. Nothing removed; 28/28 tests (commit `b13234f`, merged as `405f440`). The checker re-ran both repos against those commits and reported all clear. A human typed `/approve`. From the check request (01:33) to approval (01:45): 12 minutes.

## Why this needed Switch

- **Requirements lived in chat.** A teammate wrote that older mobile clients must keep working. The checking agent turned that sentence into a test.
- **Evidence looked like teammate messages.** Verdicts cited exact commits, so a human could skim and decide.
- **Roles were explicit.** Room Instructions: the verifier never merges, the fixer never approves its own fix, only the human merges.

## Try it

```bash
git clone https://github.com/shahaman098/proofroom
cd proofroom && ./run-demo.sh
```

The UI replays the room story; the live panel calls the real API. Turn on **Replay PR #5** to watch the old client break.
