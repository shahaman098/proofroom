import {test} from 'node:test';
import assert from 'node:assert/strict';
import {storyFrame,scrollProgress} from './story.js';
test('scroll timeline is reversible and deterministic, including chapter endpoints',()=>{
 const checkpoints=[0,.1,.25,.45,.65,.85,1];
 const forward=checkpoints.map(storyFrame);
 const backward=[...checkpoints].reverse().map(storyFrame).reverse();
 assert.deepEqual(forward,backward);
 assert.equal(storyFrame(0).active,0);assert.equal(storyFrame(1).active,4);
 for(const f of forward){assert.ok(Number.isFinite(f.x)&&Number.isFinite(f.y)&&f.scale>0);assert.ok(Math.abs(f.weights.reduce((a,b)=>a+b,0)-1)<1e-10);}
 assert.equal(storyFrame(.3).broken,1);assert.equal(storyFrame(1).broken,0);
 assert.equal(storyFrame(1).verified,1);assert.equal(storyFrame(1).review,1);
});
test('sticky progress is clamped and recomputes correctly for resized scenes',()=>{
 assert.equal(scrollProgress(100,1600,800),0);assert.equal(scrollProgress(-400,1600,800),.5);
 assert.equal(scrollProgress(-800,1600,800),1);assert.equal(scrollProgress(-1600,1600,800),1);
 assert.equal(scrollProgress(-500,2000,1000),.5);assert.equal(scrollProgress(0,800,800),0);
});
