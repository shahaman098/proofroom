import React from 'react';
import {createRoot} from 'react-dom/client';
import Architecture from './Architecture';
import Carousel from './Carousel';
import Demo from './Demo';
import {useReveal} from './useReveal';
import './style.css';
function Hero() {
 const reveal=useReveal();
 return <section id="top" className="screen hero" ref={reveal} aria-labelledby="hero-title">
  <header className="nav"><a className="logo" href="#top" aria-label="ProofRoom home"><span className="mark" aria-hidden="true"><i/><i/><i/></span>PROOFROOM</a><nav aria-label="Main navigation"><a href="#workflow">How it works</a><a href="#demo">Enter the room <span aria-hidden="true">↗</span></a></nav></header>
  <div className="hero-content"><div className="hero-copy"><p className="eyebrow">01 / YOUR AGENTS. ONE SHARED ROOM.</p><h1 id="hero-title">Your agent says <br/>it works.<br/><em>Does it work for<br className="desktop-break"/> your teammates?</em></h1><p className="description">Catch breaking changes across repositories.<br className="desktop-break"/> Turn shared context into tests, then approve<br className="desktop-break"/> the exact code that passed.</p><a className="primary" href="#demo">Try the interactive demo <span aria-hidden="true">↗</span></a></div><Architecture/></div>
  <div className="hero-bottom"><span>Powered by Switch. Built on evidence.</span><a href="#workflow" aria-label="Explore how it works">Scroll to connect ↓</a></div>
 </section>;
}
function App(){return <main><Hero/><Carousel/><Demo/></main>;}
createRoot(document.getElementById('root')).render(<App/>);
