import React from 'react';
export default function Architecture({compact = false}) {
  return <div className={`architecture ${compact ? 'compact' : ''}`} aria-hidden="true">
    <div className="orbit"/><div className="orbit second"/>
    <div className="connection"><i/></div>
    {[['a','API','BACKEND','a93d1c4'],['b','Client','FRONTEND','f2a901b']].map(([id,name,label,sha]) =>
      <div className={`building building-${id}`} key={id}><div className="building-body">
        <div className="roof"/><div className="face"><span>{label}</span><b>{name}</b><code>{sha}</code><div className="windows"/></div><div className="side"/>
      </div></div>)}
    <div className="bridge"><b>↔</b><span>SWITCH ROOM</span></div>
    <div className="verification-tag">✓ Shared context. Separate repos.</div>
  </div>;
}
