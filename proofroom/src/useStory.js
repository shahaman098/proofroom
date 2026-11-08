import {useEffect,useRef,useState} from 'react';
import {clamp,scrollProgress} from './story';
const modeQuery='(max-width: 900px), (prefers-reduced-motion: reduce)';
export function useStory() {
 const root=useRef(null);
 const [manual,setManual]=useState(()=>window.matchMedia(modeQuery).matches);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  const query=window.matchMedia(modeQuery);
  const mode=()=>setManual(query.matches);
  query.addEventListener('change',mode);
  return ()=>query.removeEventListener('change',mode);
 },[]);
 useEffect(()=>{
  if(manual) return;
  let request=0;
  const measure=()=>{
   request=0; const element=root.current;
   if(element) setProgress(scrollProgress(element.getBoundingClientRect().top,element.offsetHeight,element.querySelector('.story-stage').offsetHeight));
  };
  const schedule=()=>{if(!request) request=requestAnimationFrame(measure);};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  const observer=window.ResizeObserver?new ResizeObserver(schedule):null; observer?.observe(root.current);
  measure();
  return ()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);observer?.disconnect();cancelAnimationFrame(request);};
 },[manual]);
 function go(index) {
  const target=clamp(index,0,4)/4;
  // Manual modes show a stable overview; only the selected chapter changes.
  if(manual) setProgress(target);
  else {
   const element=root.current;
   const distance=element.offsetHeight-element.querySelector('.story-stage').offsetHeight;
   window.scrollTo({top:window.scrollY+element.getBoundingClientRect().top+target*distance,behavior:'instant'});
  }
 }
 return {root,manual,progress,go};
}
