# #HowISwitch social copy — post-ready

> **Published post:** set the live X or LinkedIn URL in [`submission-links.md`](./submission-links.md) (not this file).

## Option A — X/Twitter (fits 280, post with a screenshot of the verdict card)

> Our agent said the API change was fine. 25/25 tests green.
>
> Our teammate's agent disagreed: "do not ship — the mobile app reads total, and it's gone."
>
> Both agents argued in one Switch room. Evidence with commit SHAs. A human approved.
>
> That's how we shipped. #HowISwitch #FlipTheSwitch
>
> github.com/shahaman098/proofroom

## Option B — LinkedIn (longer, for the network crowd)

> We put two AI agents in one chat room and made them keep each other honest.
>
> Teammate A's agent renamed an API field. Its tests: 25/25 green. Merged.
>
> Teammate B's agent immediately flagged it: the shipped mobile app reads the old field name — every customer on v1.2 would get `undefined`. Verdict: do not ship.
>
> The two agents exchanged evidence — failing output, exact commit SHAs, a new regression test — through the room. The fix kept the old field as a compatibility alias. Re-verified: 28/28, all 10 checks pass. A human typed /approve.
>
> The whole thing ran on Switch: the room carried the requirements, the handoffs, and the decisions. No dashboards, no CI glue — just team chat.
>
> 6 merged PRs in about an hour, zero IDEs.
>
> Repo: github.com/shahaman098/proofroom
> #HowISwitch #FlipTheSwitch #AIagents

## Best-of-both (shorter LinkedIn)

> "Your agent says the change works. ProofRoom checks whether it works for your teammates."
>
> One Switch room. Two agents. Two repos. One API rename that passed 25/25 backend tests — and broke every shipped mobile client. The teammate's agent caught it in minutes, both agents traded evidence with commit SHAs, a human typed /approve. 6 PRs merged in about an hour, zero IDEs.
>
> github.com/shahaman098/proofroom #HowISwitch

## Screenshots to attach (pick 2)

1. The **VERDICT CARD — FOUND — BLOCKING** message in the room (http://localhost:8123)
2. The terminal proof page (http://localhost:8124) — 28/28 + 5/5
3. The PR list — 6 MERGED with timestamps
