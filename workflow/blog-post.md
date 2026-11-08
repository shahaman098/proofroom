# Two agents, one room: how we caught a bug neither repo's tests could see

> **Published post:** https://dev.to/shahaman098/two-agents-one-room-how-we-caught-a-bug-neither-repos-tests-could-see-5il

Numbers and timestamps come from [`room-transcript.md`](./room-transcript.md) or from re-running the repo at the cited commits.

## The setup

Two teammates, two coding agents, one **Switch** room. One agent works on a small checkout API. The other checks that web and mobile clients still work with it. The room is where you say what you need, hand off work, and show what you tested.

For the hackathon we saved the shipped v1.2 mobile client as `clients/mobile-client-v1.js` in the repo. In the live run one person played both teammates, so both Switch logins used the same account. The two agents were still separate.

## The 80-second change

At 01:30 GMT on 8 Nov, the backend owner asked their agent to rename `total` to `grandTotal` in the checkout response and add tax and shipping breakdown. About 80 seconds later: PR #5, commit `fd023c7`, 25/25 tests passing. We ran that commit again while writing this post: still 25/25.

## The break

Before the mobile release, the checking agent ran tests that mimic the shipped app. Verdict: **do not ship.** The old app still reads `total`, but the API response no longer includes it, so clients get `undefined`. The backend tests never failed.

Why did the tests stay green? The only test that checked `total` was updated in the same commit to check `grandTotal` instead. The PR fixed the test and broke real clients in one step. The checking agent added test commit `fe4c9c3`. It fails on PR #5 (`Received: undefined`) and passes after the fix.

## The fix, and the human in the loop

The backend owner wrote in the room: "My suite was 25/25 and I still broke your clients." The backend agent put `total` back next to `grandTotal` and added a version header. Nothing removed; 28/28 tests (commit `b13234f`, merged as `405f440`). The checker re-ran both repos at those commits and reported all clear. A human typed `/approve`. From the check request at 01:33 to approval at 01:45: 12 minutes.

## Why this needed Switch

- **Requirements lived in chat.** A teammate said older mobile clients must keep working. The checking agent turned that line into a test.
- **Results looked like teammate messages.** Notes named exact commits, so a human could skim and decide.
- **Roles were clear.** Room instructions: the checker never merges, the fixer never approves its own fix, only the human merges.

## Try it

```bash
git clone https://github.com/shahaman098/proofroom
cd proofroom && ./run-demo.sh
```

The UI replays the room story; the live panel calls the real API. Turn on **Replay PR #5** to watch the old client break.
