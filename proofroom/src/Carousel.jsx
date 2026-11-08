import React, {useRef, useState} from 'react';
import Architecture from './Architecture';
import {useReveal} from './useReveal';
const slides = [
  ['01 / CONNECT','Separate repos. Shared context.','Bring both agents into one room. Let the API team and the client team see the same change.','connect'],
  ['02 / CHALLENGE','Green alone. Broken together.','A passing API test can hide a failing checkout. Check what the other repository actually consumes.','failure'],
  ['03 / CAPTURE','Turn a conversation into a check.','“Older clients must keep working.” Attach that requirement to the next verification run.','requirement'],
  ['04 / VERIFY','Approve the code that passed.','Review both revisions and their evidence. A new change needs a new check and a fresh decision.','verified'],
];
function Illustration({type}) {
 if(type==='connect') return <Architecture compact/>;
 if(type==='failure') return <div className="illustration"><div className="result-line">API tests <b>✓ PASS</b></div><div className="result-line failed">Client checkout <b>× FAIL</b></div><code>response.total → undefined</code><span className="illustration-note">The break lives between repositories.</span></div>;
 if(type==='requirement') return <div className="illustration"><span className="eyebrow">HUMAN REQUIREMENT · R2</span><blockquote>“Keep older clients<br/>working too.”</blockquote><div className="result-line">Legacy compatibility <b>+ CHECK</b></div></div>;
 return <div className="illustration"><span className="seal">✓</span><div className="revision-pair"><code>c41e8d2</code><span>+</span><code>f2a901b</code></div><div className="result-line">Requirements R2 <b>6/6 PASS</b></div><span className="illustration-note">Two revisions. One informed decision.</span></div>;
}
export default function Carousel() {
 const [active,setActive]=useState(0);
 const track=useRef(null);
 const reveal=useReveal();
 function go(index) {
  const next=(index+slides.length)%slides.length;
  const element=track.current;
  const card=element.children[next];
  element.scrollTo({left:card.offsetLeft-element.children[0].offsetLeft,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 function keyDown(event) {
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  go(event.key==='Home'?0:event.key==='End'?3:active+(event.key==='ArrowRight'?1:-1));
 }
 function sync() {
  const element=track.current;
  const stride=element.children[1].offsetLeft-element.children[0].offsetLeft;
  setActive(Math.min(3,Math.max(0,Math.round(element.scrollLeft/stride))));
 }
 return <section id="workflow" className="screen workflow" ref={reveal} aria-labelledby="workflow-title">
  <div className="section-heading"><div><p className="eyebrow">02 / HOW IT WORKS</p><h2 id="workflow-title">A better way<br className="desktop-break"/> to work together.</h2></div><p className="section-note">Independent work.<br/>Collective confidence.</p></div>
  <div className="carousel" role="region" aria-roledescription="carousel" aria-label="How ProofRoom works" onKeyDown={keyDown}>
   <div className="carousel-track" ref={track} onScroll={sync} tabIndex={0} aria-label="Feature slides. Swipe or use arrow keys.">
    {slides.map(([label,title,body,type],index)=><article className="feature-card" key={type} role="group" aria-roledescription="slide" aria-label={`${index+1} of 4: ${title}`} aria-hidden={active!==index}>
      <div className="feature-visual"><Illustration type={type}/></div><div className="feature-copy"><p className="eyebrow">{label}</p><h3>{title}</h3><p>{body}</p></div>
    </article>)}
   </div>
   <div className="carousel-controls"><span aria-live="polite" aria-atomic="true">0{active+1} <span className="muted">/ 04</span></span><div className="dots">{slides.map((slide,index)=><button key={slide[3]} aria-label={`Show feature ${index+1}: ${slide[1]}`} aria-current={index===active?'true':undefined} onClick={()=>go(index)}><i/></button>)}</div><div className="arrows"><button aria-label="Previous feature" onClick={()=>go(active-1)}>←</button><button aria-label="Next feature" onClick={()=>go(active+1)}>→</button></div></div>
  </div>
 </section>;
}
