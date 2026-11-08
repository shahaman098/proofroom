export const chapters = [
 {label:'Change',title:'Your agent says it works.',body:'Teammate A asks their coding agent to rename one field in the checkout response: total becomes grandTotal. It finishes in 80 seconds and all 25 of its own tests pass.',detail:'Backend · code version fd023c7 · PR #5',signal:'Backend’s own tests: 25 of 25 pass'},
 {label:'Problem',title:'Then a teammate’s app breaks.',body:'The old mobile app, already in the App Store, still looks for the field called total. It’s gone, so customers would see no order total. Teammate A’s own tests never noticed.',detail:'Mobile app v1.2 · looks for “total”, finds nothing',signal:'Verdict: do not ship · 2 of 8 checks failed'},
 {label:'Requirement',title:'A sentence becomes a safety test.',body:'Teammate B told the room: older mobile apps MUST keep working. The checking agent turns that sentence into a test that fails until the problem is fixed.',detail:'Switch room · new test fe4c9c3',signal:'Requirement saved as a failing test'},
 {label:'Fix',title:'Fix it, then check both sides.',body:'The backend agent puts the old total field back next to the new one. The checking agent then re-runs everything against those exact versions of the code.',detail:'Fix b13234f · merged as 405f440 · PR #6',signal:'28 of 28 tests · 10 of 10 checks · all clear'},
 {label:'Approval',title:'A human approves what was checked.',body:'The approval names the exact code that passed. If anyone changes the code afterwards, the approval stops counting and the checks run again.',detail:'b13234f + 405f440 · /approve',signal:'Waiting for a human to approve'},
];
export const clamp = (value,min=0,max=1) => Math.min(max,Math.max(min,value));
const ease = value => value * value * (3 - 2 * value);
const views = [
 [0,500,310,.94], [.1,205,160,1.45], [.3,805,165,1.5],
 [.5,335,295,1.1], [.72,520,390,1.3], [.86,500,310,.9], [1,815,425,1.55],
];
export function storyFrame(progress) {
 const p=clamp(progress);
 const end=views.findIndex(view=>view[0]>=p);
 const right=views[Math.max(1,end)], left=views[Math.max(0,end-1)];
 const t=ease(clamp((p-left[0])/(right[0]-left[0])));
 const [x,y,scale]=[1,2,3].map(index=>left[index]+(right[index]-left[index])*t);
 const chapter=Math.min(4,Math.floor(p*5));
 const blend=chapter===4?0:clamp((p*5-chapter-.75)/.25);
 const weights=chapters.map((_,index)=>index===chapter?1-blend:index===chapter+1?blend:0);
 return {progress:p,x,y,scale,weights,active:blend>.5?chapter+1:chapter,
   request:clamp(p/.18), broken:clamp((p-.18)/.07)*(1-clamp((p-.6)/.08)),
   requirement:clamp((p-.4)/.12), verified:clamp((p-.6)/.15), review:clamp((p-.84)/.12)};
}
export function scrollProgress(top,height,viewport) {
 return height>viewport?clamp(-top/(height-viewport)):0;
}
