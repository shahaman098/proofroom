import React, {useCallback, useEffect, useState} from 'react';
import {checkV1, checkV2, renderSummary, replayPr5, getProducts, checkout} from './contract';

const REGIONS = [['US','United States · 7% tax'],['UK','United Kingdom · 20% tax'],['DE','Germany · 19% tax'],['FR','France · 20% tax']];
const CODES = [['','No discount code'],['SAVE10','SAVE10 · 10% off'],['SAVE20','SAVE20 · 20% off'],['WELCOME5','WELCOME5 · $5 off']];

export default function Live() {
 const [products,setProducts]=useState(null);
 const [offline,setOffline]=useState(false);
 const [qty,setQty]=useState({});
 const [region,setRegion]=useState('US');
 const [code,setCode]=useState('');
 const [replay,setReplay]=useState(false);
 const [busy,setBusy]=useState(false);
 const [result,setResult]=useState(null);

 const load=useCallback(async()=>{
  try {setProducts(await getProducts()); setOffline(false);} catch {setProducts(null); setOffline(true);}
 },[]);
 useEffect(()=>{load();},[load]);

 async function place() {
  const items=Object.entries(qty).filter(([,n])=>n>0).map(([id,n])=>({id,qty:n}));
  if(!items.length) {setResult({error:'Add at least one item to the cart.'}); return;}
  setBusy(true);
  try {
   const res=await checkout({items,region,discountCode:code||undefined});
   setResult(res.ok?{res}:{error:res.body.error||`Backend answered ${res.status}`});
   load();
  } catch {setResult({error:'Could not reach the backend.'}); setOffline(true);}
  setBusy(false);
 }

 // The checks run on the real response; the toggle only removes `total` locally to replay what PR #5 did.
 const order=result?.res&&(replay?replayPr5(result.res.body):result.res.body);
 const v1=order&&checkV1(order), v2=order&&checkV2(order);

 return <section id="live" className="live-section" aria-labelledby="live-heading">
  <div className="section-heading"><div><p className="eyebrow">NOT A REPLAY</p><h2 id="live-heading">Try it on the real backend.</h2></div><span className="simulation">Calls your QuickCart API · {offline?'offline':products?'connected':'connecting…'}</span></div>
  {offline&&<div className="live-offline" role="alert"><b>The QuickCart backend isn’t running.</b><p>Start it in a second terminal, then retry:</p><pre>cd demo-app && npm install && npm start</pre><button className="restart" onClick={load}>↻ Retry connection</button></div>}
  {products&&<div className="live-grid">
   <div className="live-card">
    <p className="panel-caption">1 · BUILD A CART <span>live stock</span></p>
    {products.map(p=><label key={p.id} className="live-row"><span><b>{p.name}</b><small>${p.price.toFixed(2)} · {p.stock} in stock</small></span><input type="number" min="0" inputMode="numeric" value={qty[p.id]??0} aria-label={`Quantity of ${p.name}`} onChange={e=>setQty({...qty,[p.id]:Math.max(0,parseInt(e.target.value,10)||0)})}/></label>)}
    <label className="live-field">Region<select value={region} onChange={e=>setRegion(e.target.value)}>{REGIONS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    <label className="live-field">Discount<select value={code} onChange={e=>setCode(e.target.value)}>{CODES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
    <button className="primary live-go" disabled={busy} onClick={place}>{busy?'Placing order…':'Place order on the real backend'}<span aria-hidden="true">→</span></button>
   </div>
   <div className="live-card" aria-live="polite">
    <p className="panel-caption">2 · WHAT THE BACKEND SENT BACK {result?.res&&<span>HTTP {result.res.status} · X-API-Version {result.res.version??'none'}</span>}</p>
    {!result&&<p className="live-hint">Place an order. Your cart goes to <code>POST /api/checkout</code>, and the answer is checked the way your two real clients check it.</p>}
    {result?.error&&<p className="live-error" role="alert">Backend said: {result.error}</p>}
    {order&&<>
     <label className="live-toggle"><input type="checkbox" checked={replay} onChange={e=>setReplay(e.target.checked)}/> Replay PR #5: hide the old <code>total</code> field (done locally on this response)</label>
     <div className="checks live-checks">
      <p><span>Web checkout page</span><b className={String(order.total)==='undefined'?'failed':''}>{renderSummary(order)}</b></p>
      <p><span>Old mobile app v1.2</span><b className={v1.ok?'':'failed'}>{v1.ok?'Works: every field it needs is there':`Breaks: missing ${v1.missing.join(', ')}`}</b></p>
      <p><span>New fields (grandTotal, taxBreakdown)</span><b className={v2.ok?'':'failed'}>{v2.ok?'Present':`Missing ${v2.missing.join(', ')}`}</b></p>
      <p><span>Money split</span><b>${order.subtotal} − ${order.discount} discount + ${order.tax} tax + ${order.shipping} shipping = ${order.grandTotal}</b></p>
     </div>
     <details><summary>Raw response from the backend <span>＋</span></summary><pre>{JSON.stringify(order,null,1)}</pre></details>
    </>}
   </div>
  </div>}
 </section>;
}
