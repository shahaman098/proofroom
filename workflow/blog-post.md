# Two agents, one room: how we caught a bug neither repo's tests could see

> **Published post:** set the live URL in [`submission-links.md`](./submission-links.md) (not this file).

*Draft for the Flip the Switch Best Blog track. Every number below comes from our
room transcript (`workflow/room-transcript.md`) or from re-running the code.*

## The setup

Two teammates, two coding agents, one **Switch** room. One agent owns the
backend (a small checkout API). The other checks that the clients (a web page and
an older mobile app, represented in the repo by a pinned fixture,
`clients/mobile-client-v1.js`, that stands in for the shipped v1.2 binaries) still
work against it. The room is where their requirements, handoffs and evidence
meet. In the live run one room owner played both teammate roles, so the two
human "teammates" were the same account; the two agents were separate.

## The 80-second change

At 01:30 (GMT, 8 Nov) the backend owner asked their agent to rename one field in
the checkout response, `total` to `grandTotal`, and add a tax and shipping
breakdown. 80 seconds later: PR #5, commit `fd023c7`, 25 of 25 tests green. We
re-ran the suite at that commit while writing this post: still 25 of 25.

## The break

The second teammate role asked the checking agent to test it before the mobile
release. Its verdict: **do not ship.** The old app reads `total`; the new
response doesn't have it, so the app gets `undefined`. The backend's own suite could not see this.

The part we find most interesting is why the tests stayed green. The only test
that read `total` had been rewritten to read `grandTotal` in the same commit. The
change erased the check on the old behaviour while breaking the old behaviour.
The checking agent added a regression test, `fe4c9c3`. We ran it against both
versions: it fails on PR #5 (`Received: undefined`) and passes on the fix.

## The fix, and the human in the loop

The backend owner replied in the room: "my suite was 25/25 and I still broke your
clients." The backend agent put `total` back next to `grandTotal` and added a
version header: nothing removed, 28 of 28 tests (commit `b13234f`, merged as
`405f440`). The checking agent re-ran everything against those exact commits and
reported all clear. A human typed `/approve`. From the check request (01:33) to
approval (01:45): 12 minutes.

## Why this needed Switch

- **The requirement lived in chat.** "Older mobile clients MUST keep working" was a
  sentence from a person. The checking agent turned it into a test.
- **Evidence moved like teammate messages.** Verdicts named exact commits, so a
  human could read them at a glance.
- **Roles were written down.** The room's Instructions say the verifier never merges
  anything, the fixer never approves its own fix, and only the human merges.

## Try it

Clone the repo and run `./run-demo.sh`. The page has a panel that calls the real
backend; tick "Replay PR #5" to watch the old app break.

Repo: https://github.com/shahaman098/proofroom
