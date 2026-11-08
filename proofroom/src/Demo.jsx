import React, {useEffect, useReducer, useRef, useState} from 'react';
import {content} from './content';
import {initialState,reducer,revision,canApprove} from './model';
import {useReveal} from './useReveal';
const statuses=['Proposed','Changes required','Verification stale','Ready to verify','Awaiting approval','Approved','Approval stale'];
export default function Demo() {
 const [state,dispatch]=useReducer(reducer,initialState);
 const [panel,setPanel]=useState('conversation');
 const log=useRef(null); const reveal=useReveal(); const rev=revision(state);
 useEffect(()=>{if(log.current) log.current.scrollTop=log.current.scrollHeight;},[state.step,panel]);
 const stale=state.step===6, passed=state.step===4||state.step===5;
 const backend=stale?'Stale':state.step===3?'Pending':'3/3 passed';
 const client=stale?'Stale':passed?'3/3 passed':state.step===1||state.step===2?'Failed':'Pending';
 const output=stale?`Previous results are stale.\nNew backend: ${rev.backend}\nVerification required.`:passed?'PASS modern checkout: £49.99\nPASS legacy total: 49.99\nPASS cents value: 4999\nAPI 3/3 · Client 3/3':state.step===3?'Repair ready.\nBoth repository checks pending.':state.step>=1?'FAIL renders checkout total\nExpected: £49.99\nReceived: undefined\nresponse.total is missing':'API unit checks: 3/3 passed\nConsumer verification pending';
 function messageText(message) {
  if(message.step===5) {
   const [backend,frontend,requirements] = state.lastApproval.split(':');
   return `Approved backend ${backend} + frontend ${frontend} against ${requirements}.`;
  }
  if(message.step===6) return `Backend revision changed to ${rev.backend}. Previous approval is stale. Run verification again.`;
  if(message.step===3) return `Kept the legacy total field and added total_cents. Candidate ${state.step===6 ? state.lastApproval.split(':')[0] : rev.backend} is ready for both consumers.`;
  return message.text;
 }
 function switchPanel(event) {
  if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
   event.preventDefault(); const next=event.key==='Home'?'conversation':event.key==='End'?'evidence':panel==='conversation'?'evidence':'conversation';
   setPanel(next); document.getElementById(`tab-${next}`).focus();
  }
 }
 return <section id="demo" className="screen demo-section" ref={reveal} aria-labelledby="demo-heading">
  <div className="section-heading"><div><p className="eyebrow">03 / THE PROOF IS IN THE ROOM</p><h2 id="demo-heading">Watch. Verify. Decide.</h2></div><span className="simulation">Interactive demo · Simulated activity</span></div>
  <div className="demo-shell">
   <header className="demo-header"><span><i className="room-dot"/> # release-check</span><span className="muted">Switch room / PR-001</span></header>
   <div className="demo-title"><h3>{content.titles[state.step]}</h3><span className={`status ${stale||state.step===1?'error':''} ${state.step===5?'success':''}`} role="status">{statuses[state.step]}</span></div>
   <ol className="demo-progress" aria-label="Verification progress">{content.steps.map((step,index)=><li key={step} className={Math.min(state.step,5)>=index?'active':''} aria-current={Math.min(state.step,5)===index?'step':undefined}><span>0{index+1}</span><b>{step}</b></li>)}</ol>
   <div className="panel-tabs" role="tablist" aria-label="Demo panels">{['conversation','evidence'].map(name=><button key={name} id={`tab-${name}`} role="tab" aria-selected={panel===name} aria-controls={`panel-${name}`} tabIndex={panel===name?0:-1} onClick={()=>setPanel(name)} onKeyDown={switchPanel}>{name}</button>)}</div>
   <div className="demo-panels">
    <div id="panel-conversation" className={`conversation demo-panel ${panel==='conversation'?'selected':''}`} role="tabpanel" aria-labelledby="tab-conversation">
     <div className="panel-caption">SHARED CONVERSATION <span>2 people · 2 agents</span></div>
     <div className="chat-log" ref={log} tabIndex={0} aria-label="Conversation history, scroll to read earlier messages">
      {content.messages.filter(message=>message.step<=state.step).map((message,index)=><article className="message" key={index}><span className={`avatar ${message.role.includes('developer')||message.role==='Human approval'?'human':''}`}>{message.initial}</span><div><header><b>{message.name}</b><small>{message.role}</small></header><p>{messageText(message)}</p></div></article>)}
     </div>
    </div>
    <div id="panel-evidence" className={`evidence demo-panel ${panel==='evidence'?'selected':''}`} role="tabpanel" aria-labelledby="tab-evidence" tabIndex={0}>
     <div className="panel-caption">VERIFICATION RECORD <span>{rev.requirements}</span></div>
     <div className="repos">{[['checkout-api',rev.backend],['checkout-client',rev.frontend]].map(([name,sha])=><div key={name}><span>{name}</span><code>{sha}</code></div>)}</div>
     <div className="requirements"><b>Acceptance criteria · {rev.requirements}</b><p>✓ Return totals in integer cents</p>{state.step>=2&&<p>+ Preserve the legacy total field</p>}</div>
     <div className="checks"><p><span>Backend checks</span><b>{backend}</b></p><p><span>Client compatibility</span><b className={client==='Failed'?'failed':''}>{client}</b></p></div>
     <details><summary>Inspect test output <span>＋</span></summary><pre>{output}</pre></details>
    </div>
   </div>
   <div className="decision"><p>{state.step===5?'Approved for these exact revisions.':stale?'Code changed. Verify again before approving.':canApprove(state)?'Both repos passed. Review evidence, then approve.':'Approval needs passing checks for both revisions.'}</p><button className="approve" disabled={!canApprove(state)} onClick={()=>dispatch({type:'APPROVE'})}>{state.step===5?'✓ Approved':'Approve tested revisions'}<span aria-hidden="true">↗</span></button></div>
   <div className="demo-controls"><button className="restart" onClick={()=>{dispatch({type:'RESET'});setPanel('conversation');}}>↺ Restart demo</button><span className="step-count">0{Math.min(state.step+1,6)} / 06</span>{state.step<4?<button className="primary" onClick={()=>dispatch({type:'NEXT'})}>Next step <span aria-hidden="true">→</span></button>:state.step===5?<button className="primary" onClick={()=>dispatch({type:'CHANGE'})}>Change code <span aria-hidden="true">↗</span></button>:stale?<button className="primary" onClick={()=>dispatch({type:'REVERIFY'})}>Re-verify <span aria-hidden="true">↻</span></button>:<span className="review-hint">Your decision ↑</span>}</div>
  </div>
  <footer><span>PROOFROOM</span><span>Concept frontend · No live integrations</span><a href="#top" aria-label="Back to top">↑</a></footer>
 </section>;
}
