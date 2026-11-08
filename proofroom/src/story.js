export const chapters = [
 {label:'Propose',title:'Your repository passes.',body:'The backend agent proposes integer cents. Its own checks pass. Now ask the client team what happens on their side.',detail:'checkout-api · a93d1c4',signal:'Backend checks 3/3 passed'},
 {label:'Discover',title:'Your teammate’s checkout breaks.',body:'The client still reads response.total. A green API test hides a missing field and a broken checkout.',detail:'checkout-client · f2a901b',signal:'Compatibility check failed'},
 {label:'Capture',title:'Shared context becomes a check.',body:'“Older clients must keep working too.” A teammate’s message becomes requirement R2 and a legacy compatibility test.',detail:'Switch room · # release-check',signal:'R2 · Legacy compatibility required'},
 {label:'Verify',title:'Verify the connection.',body:'Keep total and add total_cents. Test both repositories against the same requirements, including the older client.',detail:'c41e8d2 + f2a901b · R2',signal:'Backend 3/3 · Client 3/3 passed'},
 {label:'Review',title:'Approve what actually passed.',body:'Both revisions and their evidence are ready. The human makes the decision. Any new code needs a fresh check.',detail:'c41e8d2 + f2a901b · R2',signal:'Awaiting human approval'},
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
