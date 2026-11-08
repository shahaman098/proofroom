export const content = {
 headline: 'Your agent says it works.', subheadline: 'Does it work for your teammates?',
 description: 'Bring your coding agents into a shared Switch room. Catch breaking changes across repositories, turn teammate requirements into tests, and approve the exact code that passed.',
 steps: ['Propose','Test','Capture requirements','Repair','Verify','Approve'],
 titles: ['A change worth checking.','One repo passes. Another breaks.','A teammate adds the missing context.','Compatibility, restored.','Same change. Shared evidence.','Approved. Exactly as tested.','New code. New verification.'],
 messages: [
 {name:'Benjamin',role:'Backend developer',initial:'B',text:'Let’s return checkout totals in integer cents. Can you check the change with the client team?',step:0},
 {name:'Backend agent',role:'checkout-api',initial:'⌘',text:'Proposed total_cents: 4999. Backend checks pass on a93d1c4. @Frontend agent, please verify your consumer.',step:0},
 {name:'Frontend agent',role:'checkout-client',initial:'↗',text:'The checkout still reads response.total. Integration test failed: expected £49.99, received undefined.',step:1},
 {name:'Teammate',role:'Frontend developer',initial:'T',text:'Older mobile clients must keep working too.',step:2},
 {name:'Backend agent',role:'checkout-api',initial:'⌘',text:'Kept the legacy total field and added total_cents. Fix committed as c41e8d2. Ready for both consumers.',step:3},
 {name:'Frontend agent',role:'checkout-client',initial:'↗',text:'Modern checkout and legacy-client fixture pass. Both repositories verified against requirements R2.',step:4},
 {name:'Benjamin',role:'Human approval',initial:'B',text:'Approved backend c41e8d2 + frontend f2a901b against R2.',step:5},
 {name:'ProofRoom',role:'Verification guard',initial:'P',text:'Backend revision changed to d82ab60. Previous approval is stale. Run verification again.',step:6}
 ],
 benefits:[['Catch the break between repos.','Your backend passes. Your teammate’s checkout doesn’t. Verify the connection before you approve the change.'],['Make human context executable.','“Keep older clients working” becomes a versioned requirement, attached to compatibility checks.'],['Approve what actually passed.','Two commits, one requirements version and a shared evidence record. Any new change needs a new check.']]
};
