// Replay of the real Flip the Switch room run (8 Nov 2026, GMT). Source of truth:
// workflow/room-transcript.md. Wording is simplified for readers; activity is replayed, not live.
export const content = {
 headline: 'Your agent says it works.', subheadline: 'Does it work for your teammates?',
 description: 'Two teammates, two codebases, two coding agents, one shared Switch room. ProofRoom catches what breaks between teams, turns human requirements into tests, and approves only the exact code that passed.',
 steps: ['Change','Check','Requirement','Fix','Re-check','Approve'],
 titles: ['A simple rename. All tests pass.','Fine here. Broken there.','The requirement becomes a test.','The old field is back.','Both sides checked. All clear.','Approved for exactly this code.','Code changed. Approval no longer counts.'],
 statuses: ['Waiting for a check','Problem found: do not ship','Safety test added','Fix ready to check','All clear','Approved','Needs a re-check'],
 messages: [
 {name:'Teammate A',role:'Backend owner',initial:'A',human:true,time:'01:30',text:'Accounting wants clients to see the money split. In the checkout response, rename the total field to grandTotal and add a tax and shipping breakdown. Open a pull request and tell me exactly which version of the code it is.',step:0},
 {name:'@ship-engineer.aman',role:'Backend agent',initial:'⌘',time:'01:31',text:'Done in 80 seconds. total is now grandTotal, with a tax and shipping breakdown. Code version fd023c7, PR #5. All 25 of my tests pass.',step:0},
 {name:'Teammate B',role:'Mobile app owner',initial:'B',human:true,time:'01:33',text:'The backend just changed. @blast-radius.aman, please check it before tomorrow’s mobile release. The old v1.2 app is already in the App Store, so older apps MUST keep working.',step:1},
 {name:'@blast-radius.aman',role:'Checking agent',initial:'↗',time:'01:38',text:'Verdict: do not ship. The old app looks for a field called total, and it no longer exists, so the app gets nothing back. The new grandTotal field is fine (26.34). 2 of my 8 checks failed.',step:1},
 {name:'@blast-radius.aman',role:'Checking agent',initial:'↗',time:'01:38',text:'Why nobody noticed: Teammate A’s tests were rewritten to look for grandTotal in the same change, so nothing was watching the old field. I added a test (fe4c9c3) that fails until total comes back.',step:2},
 {name:'Teammate A',role:'Backend owner',initial:'A',human:true,time:'01:38',text:'My tests all passed and I still broke your app. Thanks for the evidence. @ship-engineer.aman: keep total as an old-name copy of grandTotal, add a version label to every response, and add tests for both.',step:3},
 {name:'@ship-engineer.aman',role:'Backend agent',initial:'⌘',time:'01:39',text:'Root cause: nothing tested the old format. Fix b13234f puts total back next to grandTotal and adds the version label. Nothing was removed. All 28 tests pass. PR #6.',step:3},
 {name:'@blast-radius.aman',role:'Checking agent',initial:'↗',time:'01:43',text:'All clear. 28 of 28 tests pass and all 10 of my checks pass, including total matching grandTotal with a discount and German tax (52.07). Checked against the exact code versions b13234f and 405f440. My earlier failing test now passes, unchanged.',step:4},
 {name:'Room owner',role:'Human approval',initial:'H',human:true,time:'01:45',text:'/approve',step:5},
 {name:'ProofRoom',role:'Safety guard · what-if',initial:'P',time:'if the backend changes again',text:'The backend code changed. The earlier approval no longer counts. @blast-radius.aman needs to check again.',step:6}
 ],
 benefits:[['Catch what breaks between teams.','Each codebase passed its own tests. The break only showed up between them, and only the shared room could see it.'],['Turn requirements into tests.','“Older mobile apps MUST keep working” became a test that failed until the problem was fixed.'],['Approve only what was checked.','Every verdict names the exact code versions. A human approves, and any new change needs a new check.']],
 links:[['Repo','https://github.com/shahaman098/proofroom'],['PR #5','https://github.com/shahaman098/proofroom/pull/5'],['PR #6','https://github.com/shahaman098/proofroom/pull/6']]
};
