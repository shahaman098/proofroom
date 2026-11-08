import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {V1_CONTRACT_FIELDS, checkV1, checkV2, renderSummary, replayPr5} from './contract.js';
const require = createRequire(import.meta.url);
const mobile = require('../../clients/mobile-client-v1.js');
const web = require('../../clients/web-client.js');

// The response the backend returns at b13234f / 405f440 (copied from a real run).
const real = {orderId:'ORD-MW791ODV',region:'US',regionName:'United States',subtotal:19.99,discount:0,discountApplied:null,tax:1.4,shipping:4.95,taxBreakdown:{tax:1.4,shipping:4.95},grandTotal:26.34,total:26.34};

test('contract fields match the real v1.2 mobile client', () => {
  assert.deepEqual(V1_CONTRACT_FIELDS, mobile.V1_CONTRACT_FIELDS);
});
test('checkV1 agrees with the real client on the fixed and the PR #5 response', () => {
  assert.equal(checkV1(real).ok, true); assert.equal(mobile.assertV1Contract(real), true);
  const broken = replayPr5(real);
  assert.deepEqual(checkV1(broken), {ok:false, missing:['total']});
  assert.throws(() => mobile.assertV1Contract(broken), /Missing: total/);
});
test('summary card text matches the real web client; new fields detected', () => {
  assert.equal(renderSummary(real), web.renderSummary(real));
  assert.equal(renderSummary(replayPr5(real)), web.renderSummary(replayPr5(real)));
  assert.equal(checkV2(real).ok, true);
});
