import React, {useEffect, useReducer, useRef, useState} from 'react';
import {content} from './content';
import {initialState,reducer,revision,canApprove} from './model';
import {useReveal} from './useReveal';
export default function Demo() {
 const [state,dispatch]=useReducer(reducer,initialState);
 const [panel,setPanel]=useState('conversation');
 const log=useRef(null); const reveal=useReveal(); const rev=revision(state);
 useEffect(()=>{if(log.current) log.current.scrollTop=log.current.scrollHeight;},[state.step,panel]);
 const stale=state.step===6, passed=state.step===4||state.step===5;
 const blocked=state.step===1||state.step===2;
 const backend=stale?'Out of date':state.step>=3?'28 of 28 pass':'25 of 25 pass';
 const client=stale?'Out of date':passed?'10 of 10 pass':blocked?'Failed · 2 of 8 checks':state.step===3?'Waiting to re-run':'Not run yet';
 const output=stale?`The earlier all-clear is out of date.\nNew backend code: ${rev.backend}\nThe old-app check must run again.`:passed?'PASS  old field "total" is present and equals grandTotal (26.34)\nPASS  total equals grandTotal with discount + German tax (52.07)\nPASS  tax and shipping breakdown present\nPASS  version label on every response\nTests: 28 of 28 · Checks: 10 of 10\nChecked against code versions b13234f + 405f440':state.step===3?'Fix b13234f: old field "total" restored.\nBackend tests: 28 of 28 pass.\nOld-app check: waiting to re-run.':blocked?'Request: checkout with 1 mouse\nFAIL  old field "total" → missing (undefined)\nPASS  new field "grandTotal" → 26.34\nFAIL  total equals grandTotal (cannot compare)\nNew test fe4c9c3 fails: expected total to exist, got undefined':'Backend tests: 25 of 25 pass\nOld-app check: not run yet';
 function messageText(message) {
  if(message.step===5) {
   const [backend,frontend] = state.lastApproval.split(':');
   return `/approve — both sides are green, backed by evidence for the exact code versions (${backend}${backend==='b13234f'?' and 405f440':''}; test ${frontend}). The mobile release ships tomorrow.`;
  }
  if(message.step===6) return `The backend code changed (now ${rev.backend}). The earlier approval no longer counts. @blast-radius.aman needs to check again.`;
  return message.text;
 }
 function switchPanel(event) {
  if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
   event.preventDefault(); const next=event.key==='Home'?'conversation':event.key==='End'?'evidence':panel==='conversation'?'evidence':'conversation';
   setPanel(next); document.getElementById(`tab-${next}`).focus();
  }
 }
 return <section id="demo" className="screen demo-section" ref={reveal} aria-labelledby="demo-heading">
  <div className="section-heading"><div><p className="eyebrow">THE PROOF IS IN THE ROOM</p><h2 id="demo-heading">Watch. Verify. Decide.</h2></div><span className="simulation">Interactive replay · Not connected to live services</span></div>
  <div className="demo-shell">
   <header className="demo-header"><span><i className="room-dot"/> # proofroom</span><span className="muted">Switch room · Flip the Switch · PR #5 → #6</span></header>
   <div className="demo-title"><h3>{content.titles[state.step]}</h3><span className={`status ${stale||state.step===1?'error':''} ${state.step===5?'success':''}`} role="status">{content.statuses[state.step]}</span></div>
   <ol className="demo-progress" aria-label="Progress">{content.steps.map((step,index)=><li key={step} className={Math.min(state.step,5)>=index?'active':''} aria-current={Math.min(state.step,5)===index?'step':undefined}><span>0{index+1}</span><b>{step}</b></li>)}</ol>
   <div className="panel-tabs" role="tablist" aria-label="Demo panels">{['conversation','evidence'].map(name=><button key={name} id={`tab-${name}`} role="tab" aria-selected={panel===name} aria-controls={`panel-${name}`} tabIndex={panel===name?0:-1} onClick={()=>setPanel(name)} onKeyDown={switchPanel}>{name}</button>)}</div>
   <div className="demo-panels">
    <div id="panel-conversation" className={`conversation demo-panel ${panel==='conversation'?'selected':''}`} role="tabpanel" aria-labelledby="tab-conversation">
     <div className="panel-caption">SHARED CONVERSATION <span>2 teammates · 2 agents</span></div>
     <div className="chat-log" ref={log} tabIndex={0} aria-label="Conversation history, scroll to read earlier messages">
      {content.messages.filter(message=>message.step<=state.step).map((message,index)=><article className="message" key={index}><span className={`avatar ${message.human?'human':''}`}>{message.initial}</span><div><header><b>{message.name}</b><small>{message.role}</small>{message.time&&<small className="stamp">{message.step===6?message.time:`${message.time} GMT`}</small>}</header><p>{messageText(message)}</p></div></article>)}
     </div>
    </div>
    <div id="panel-evidence" className={`evidence demo-panel ${panel==='evidence'?'selected':''}`} role="tabpanel" aria-labelledby="tab-evidence" tabIndex={0}>
     <div className="panel-caption">EVIDENCE <span>{state.step>=2?'Updated with old-app rule':'Original request'}</span></div>
     <div className="repos">{[['Backend code version',rev.backend],['Old-app test version',rev.frontend]].map(([name,sha])=><div key={name}><span>{name}</span><code>{sha==='none'?'not written yet':state.changeCount>0&&name==='Backend code version'?`${sha} (what-if)`:sha}</code></div>)}</div>
     <div className="requirements"><b>Requirements</b><p>✓ Rename total to grandTotal</p><p>✓ Show tax and shipping separately</p>{state.step>=2&&<p>+ Older mobile apps MUST keep working</p>}{state.step>=3&&<p>+ Keep the old total field, add a version label</p>}</div>
     <div className="checks"><p><span>Backend’s own tests</span><b>{backend}</b></p><p><span>Old mobile app check</span><b className={blocked||stale?'failed':''}>{client}</b></p></div>
     <details><summary>See technical details <span>＋</span></summary><pre>{output}</pre></details>
    </div>
   </div>
   <div className="decision"><p>{state.step===5?'Approved for exactly this code.':stale?'The code changed. Check again before approving.':canApprove(state)?'All clear on these exact versions. Review the evidence, then approve.':'Approval needs an all-clear from the checking agent.'}</p><button className="approve" disabled={!canApprove(state)} onClick={()=>dispatch({type:'APPROVE'})}>{state.step===5?'✓ Approved':'Approve this tested code'}<span aria-hidden="true">↗</span></button></div>
   <div className="demo-controls"><button className="restart" onClick={()=>{dispatch({type:'RESET'});setPanel('conversation');}}>↺ Restart demo</button><span className="step-count">0{Math.min(state.step+1,6)} / 06</span>{state.step<4?<button className="primary" onClick={()=>dispatch({type:'NEXT'})}>Next step <span aria-hidden="true">→</span></button>:state.step===5?<button className="primary" onClick={()=>dispatch({type:'CHANGE'})}>Simulate a new change <span aria-hidden="true">↗</span></button>:stale?<button className="primary" onClick={()=>dispatch({type:'REVERIFY'})}>Re-check <span aria-hidden="true">↻</span></button>:<span className="review-hint">Your decision ↑</span>}</div>
  </div>
  <footer><span>PROOFROOM</span><span>Replay of the live room run · 8 Nov 2026 · No live integrations</span>{content.links.map(([label,href])=><a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}<a href="#top" aria-label="Back to top">↑</a></footer>
 </section>;
}
