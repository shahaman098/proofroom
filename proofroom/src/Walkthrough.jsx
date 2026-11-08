import React,{useRef} from 'react';
import {chapters,storyFrame} from './story';
import {useStory} from './useStory';
import Workspace from './Workspace';
export default function Walkthrough(){
 const {root,manual,progress,go}=useStory();
 const frame=storyFrame(progress);
 const touch=useRef(null);
 function key(event){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?4:Math.max(0,Math.min(4,frame.active+(event.key==='ArrowRight'?1:-1)));
  go(next); root.current.querySelectorAll('.chapter-nav button')[next].focus();
 }
 return <section className={`walkthrough ${manual?'manual':''}`} ref={root} id="top" aria-label="ProofRoom walkthrough" data-progress={progress.toFixed(4)} data-chapter={frame.active+1}>
  <div className="story-stage" id="walkthrough">
   <header className="nav"><a className="logo" href="#top" aria-label="ProofRoom home"><span className="mark" aria-hidden="true"><i/><i/><i/></span>PROOFROOM</a><nav aria-label="Main navigation"><a href="#walkthrough">The walkthrough</a><a href="#demo">Try the demo ↗</a></nav></header>
   <div className="story-intro"><div><p className="eyebrow">YOUR AGENTS. ONE SHARED ROOM.</p><h1>Good alone.<em> Proven together.</em></h1></div><p>Catch the break between repositories.<br/>Approve the exact code that passed.</p></div>
   <div className="story-layout" onTouchStart={e=>{touch.current=[e.touches[0].clientX,e.touches[0].clientY];}} onTouchEnd={e=>{if(!manual||!touch.current)return;const [x,y]=touch.current;const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;touch.current=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3)go(Math.max(0,Math.min(4,frame.active+(dx<0?1:-1))));}} onTouchCancel={()=>{touch.current=null;}}>
    <div className="story-cards" aria-label="Walkthrough explanation">
     {chapters.map((chapter,index)=>{
      const selected=index===frame.active;
      const opacity=manual?(selected?1:0):frame.weights[index];
      return <article key={chapter.label} className="story-card" aria-hidden={!selected} style={{opacity,transform:manual?'none':`translateY(${(1-opacity)*12}px)`,pointerEvents:selected?'auto':'none'}}>
       <p className="chapter-kicker">0{index+1} / {chapter.label.toUpperCase()}</p><h2>{chapter.title}</h2><p className="chapter-body">{chapter.body}</p><code>{chapter.detail}</code><div className={`chapter-signal ${index===1?'warning':''}`}><span aria-hidden="true">{index===1?'×':index===4?'○':'✓'}</span>{chapter.signal}</div>
       {index===4&&<a className="story-cta" href="#demo" tabIndex={selected?0:-1}>Make the call in the demo <span aria-hidden="true">↗</span></a>}
      </article>;
     })}
    </div>
    <div className="scene-viewport"><div className="scene-topline"><span>LIVE CONCEPT / NOT CONNECTED</span><span>0{frame.active+1} — 05</span></div><Workspace frame={frame} manual={manual}/><div className="scene-caption"><span>API ↔ Switch ↔ Client</span><span>{manual?'Swipe to explore':'Scroll to move through the workspace'} ↓</span></div></div>
   </div>
   <div className="story-bottom"><nav className="chapter-nav" aria-label="Walkthrough chapters" onKeyDown={key}>{chapters.map((chapter,index)=><button key={chapter.label} aria-label={`Chapter ${index+1}: ${chapter.label}`} aria-current={index===frame.active?'step':undefined} onClick={()=>go(index)}><span>0{index+1}</span><b>{chapter.label}</b></button>)}</nav><div className="story-arrows"><button aria-label="Previous chapter" disabled={frame.active===0} onClick={()=>go(frame.active-1)}>←</button><button aria-label="Next chapter" disabled={frame.active===4} onClick={()=>go(frame.active+1)}>→</button></div></div>
   <div className="story-footnote"><span>Simulated walkthrough · Powered by Switch</span><span role="status" className="sr-only">Chapter {frame.active+1}: {chapters[frame.active].label}</span><span>{manual?'Choose a chapter':'Scroll down to explore. Scroll back to rewind.'}</span></div>
   <div className="story-meter" aria-hidden="true"><i style={{transform:`scaleX(${progress})`}}/></div>
  </div>
 </section>;
}
