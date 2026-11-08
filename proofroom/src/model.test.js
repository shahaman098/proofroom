import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialState,reducer,canApprove,fingerprint} from './model.js';
test('failure and pending checks block approval; verified revisions allow it',()=>{let s={...initialState};for(let i=0;i<4;i++){assert.equal(canApprove(s),false);assert.deepEqual(reducer(s,{type:'APPROVE'}),s);s=reducer(s,{type:'NEXT'})}assert.equal(canApprove(s),true);const expected=fingerprint(s);s=reducer(s,{type:'APPROVE'});assert.equal(s.step,5);assert.equal(s.approval,expected);s=reducer(s,{type:'CHANGE'});assert.equal(s.approval,null);assert.equal(canApprove(s),false);assert.notEqual(fingerprint(s),expected);assert.deepEqual(reducer(s,{type:'RESET'}),initialState)});

test('reverification retains changed revisions across repeated approval cycles', () => {
 let state = {...initialState};
 for (let step = 0; step < 4; step++) state = reducer(state, {type: 'NEXT'});
 for (let cycle = 0; cycle < 3; cycle++) {
  state = reducer(state, {type: 'APPROVE'});
  const previousApproval = state.approval;
  state = reducer(state, {type: 'CHANGE'});
  const changedRevision = fingerprint(state);
  assert.equal(state.lastApproval, previousApproval, 'history retains the previously approved revisions');
  assert.notEqual(changedRevision, previousApproval);
  state = reducer(state, {type: 'REVERIFY'});
  assert.equal(fingerprint(state), changedRevision);
  assert.equal(state.approval, null);
  assert.equal(canApprove(state), false);
  assert.deepEqual(reducer(state, {type: 'APPROVE'}), state);
  state = reducer(state, {type: 'NEXT'});
  assert.equal(canApprove(state), true);
  assert.equal(fingerprint(state), changedRevision);
 }
});
