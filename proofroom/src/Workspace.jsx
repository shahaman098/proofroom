import React from 'react';
import {chapters} from './story';
function ManualScene({frame}) {
 const chapter=chapters[frame.active];
 const labels=['Backend','Mobile app v1.2','Switch room','Verification','Human review'];
 const code=['total → grandTotal\n+ tax and shipping split\nversion fd023c7 · 25 of 25 tests','Old app looks for “total”\nand gets nothing back','“Older mobile apps MUST\nkeep working.”\n\nNew test fe4c9c3 · failing','total: 26.34\ngrandTotal: 26.34\nversion label added','Backend: b13234f\nMerged: 405f440\n28/28 tests · 10/10 checks\nAll clear'];
 return <div className="workspace-svg static-workspace" data-camera="static" role="img" aria-label={`${labels[frame.active]}: ${chapter.signal}`}>
  <div className="static-window"><div className="window-bar"><i/><i/><i/><span>PROOFROOM / 0{frame.active+1}</span></div><div className="static-content"><p>{labels[frame.active]}</p><pre>{code[frame.active]}</pre><span className={frame.active===1?'static-fail':''}>{chapter.signal}</span></div></div>
  <div className="static-route"><span>API</span><i/><span>SWITCH</span><i/><span>CLIENT</span></div>
 </div>;
}
const outline='#839978';
function Panel({x,y,title,kind,children,highlight=0}) {
 return <g transform={`translate(${x} ${y})`}>
  <rect width="260" height="180" rx="8" fill="#121d16" stroke={outline} strokeOpacity={.4+highlight*.6}/>
  <path d="M0 35H260" stroke={outline} strokeOpacity=".4"/>
  <circle cx="15" cy="18" r="3" fill={outline}/><circle cx="26" cy="18" r="3" fill={outline} opacity=".5"/><circle cx="37" cy="18" r="3" fill={outline} opacity=".25"/>
  <text x="54" y="22" className="svg-caption">{kind}</text>
  <text x="17" y="65" className="svg-title">{title}</text>{children}
 </g>;
}
function Trace({d,progress,color='#b6ce9f'}) {
 return <><path d={d} fill="none" stroke={outline} strokeOpacity=".2" strokeWidth="1"/>
 <path d={d} fill="none" stroke={color} strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress}/></>;
}
export default function Workspace({frame,manual}) {
 if(manual) return <ManualScene frame={frame}/>;
 const f=frame;
 const camera=manual?'translate(0 0) scale(1)':`translate(${500-f.x*f.scale} ${310-f.y*f.scale}) scale(${f.scale})`;
 return <svg className="workspace-svg" viewBox="0 0 1000 620" role="img" aria-labelledby="workspace-name workspace-desc" data-camera={manual?'500,310,1':`${f.x.toFixed(2)},${f.y.toFixed(2)},${f.scale.toFixed(3)}`}>
  <title id="workspace-name">ProofRoom verification workspace</title><desc id="workspace-desc">Two teammates' agents connect through a shared Switch room. The renamed total field breaks the shipped v1.2 mobile clients. The requirement becomes a test, the API is repaired and both sides are verified against exact commits before the human approves.</desc>
  <defs><pattern id="workspace-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#799168" strokeOpacity=".12" strokeWidth=".6"/></pattern></defs>
  <g transform={camera} className="camera-group">
   <rect x="-1500" y="-1000" width="4000" height="2800" fill="url(#workspace-grid)"/>
   <g fill="none" stroke={outline} strokeOpacity=".18"><path d="M20 20H980V600H20Z"/><path d="M5 310H995M500 5V615" strokeDasharray="3 8"/><circle cx="500" cy="310" r="280"/></g>
   <Trace d="M300 155H370" progress={f.request}/><Trace d="M630 155H700" progress={f.request} color={f.broken>.3?'#d99b80':'#b6ce9f'}/>
   <Trace d="M500 245V300H200V365" progress={f.requirement}/><Trace d="M200 545V575H500V545" progress={f.requirement}/>
   <Trace d="M170 245V325H500V365" progress={f.verified}/><Trace d="M830 245V325H500V365" progress={f.verified}/><Trace d="M630 455H700" progress={f.review}/>
   <Panel x={40} y={65} title="Backend" kind="TEAMMATE A" highlight={f.active===0?1:0}>
    <text x="17" y="91" className="svg-muted">⌘ Backend agent</text>
    <rect x="16" y="105" width="228" height="34" rx="4" fill="#203120"/>
    <text x="25" y="126" className="svg-code">{'total → grandTotal'}</text>
    <text x="17" y="160" className="svg-pass">✓ 25 of 25 tests pass</text>
   </Panel>
   <Panel x={370} y={65} title="Switch room" kind="SHARED CONTEXT" highlight={f.active===2?1:0}>
    <text x="17" y="91" className="svg-muted"># proofroom</text>
    <path d="M17 112H242M17 130H190M17 148H218" stroke={outline} strokeOpacity=".3"/>
    <g opacity={f.requirement}><rect x="13" y="103" width="234" height="62" rx="4" fill="#2b3a28"/><text x="23" y="123" className="svg-small">“Older mobile apps MUST</text><text x="23" y="144" className="svg-small">keep working.”</text></g>
   </Panel>
   <Panel x={700} y={65} title="Mobile app" kind="TEAMMATE B · v1.2" highlight={f.active===1?1:0}>
    <text x="17" y="91" className="svg-muted">↗ Checking agent</text><text x="17" y="120" className="svg-code">looks for “total”</text>
    <text x="17" y="153" className="svg-muted" opacity={1-Math.max(f.broken,f.verified)}>Check not run yet</text>
    <text x="17" y="153" className="svg-fail" opacity={f.broken}>× Field missing · app breaks</text>
    <text x="17" y="153" className="svg-pass" opacity={f.verified}>✓ 10 of 10 checks pass</text>
   </Panel>
   <Panel x={40} y={365} title="Requirements" kind="ACCEPTANCE CRITERIA" highlight={f.requirement}>
    <text x="17" y="94" className="svg-muted">✓ Tax + shipping shown</text>
    <g opacity={f.requirement}><rect x="203" y="47" width="39" height="25" rx="12" fill="#a8bd92"/><text x="214" y="63" fill="#172518" fontSize="10">NEW</text><text x="17" y="123" className="svg-pass">+ Old apps keep working</text><text x="17" y="151" className="svg-muted">+ Keep old field + label</text></g>
   </Panel>
   <Panel x={370} y={365} title="Verification" kind="BOTH SIDES CHECKED" highlight={f.verified}>
    <text x="17" y="94" className="svg-muted" opacity={1-f.verified}>Waiting for evidence</text>
    <g opacity={f.verified}><text x="17" y="94" className="svg-code">total: 26.34</text><text x="17" y="116" className="svg-code">grandTotal: 26.34</text><path d="M17 129H240" stroke={outline} strokeOpacity=".3"/><text x="17" y="153" className="svg-pass">✓ Tests + checks all pass</text></g>
   </Panel>
   <Panel x={700} y={365} title="Human review" kind="DECISION · HUMAN" highlight={f.review}>
    <text x="17" y="94" className="svg-muted">Exact code. Shared evidence.</text>
    <g opacity={f.review}><text x="17" y="119" className="svg-code">b13234f + 405f440</text><text x="17" y="146" className="svg-pass">All clear · 28/28 · 10/10</text><text x="17" y="167" className="svg-small">Waiting for approval</text></g>
   </Panel>
   <g className="commit-marker"><circle cx="170" cy="278" r="4"/><text x="183" y="282">{f.verified>.5?'b13234f':'fd023c7'}</text><g opacity={Math.max(f.broken,f.verified)}><circle cx="830" cy="278" r="4"/><text x="843" y="282">fe4c9c3</text></g></g>
   <text x="42" y="42" className="svg-caption">PROOFROOM / SHARED WORKSPACE</text>
  </g>
 </svg>;
}
