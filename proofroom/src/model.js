// Replay-only state: verification and approval are not connected to live services.
export const initialState = {step: 0, approval: null, changeCount: 0};

// Real commits from the room run: fd023c7 (PR #5, rename), b13234f (PR #6, compat fix),
// fe4c9c3 (verifier's contract test). The step-6 revision is hypothetical: one extra commit on top of 405f440.
export function revision(state) {
  return {
    backend: state.changeCount > 0 ? `405f440+${state.changeCount}` : state.step >= 3 ? 'b13234f' : 'fd023c7',
    frontend: state.step >= 1 ? 'fe4c9c3' : 'none',
    requirements: state.step >= 2 ? 'old-apps' : 'initial',
  };
}
export const fingerprint = state => Object.values(revision(state)).join(':');
export const canApprove = state => state.step === 4;

export function reducer(state, action) {
  if (action.type === 'RESET') return {...initialState};
  if (action.type === 'NEXT' && state.step < 4) return {...state, step: state.step + 1};
  if (action.type === 'APPROVE' && canApprove(state)) {
    return {...state, step: 5, approval: fingerprint(state), lastApproval: fingerprint(state)};
  }
  if (action.type === 'CHANGE' && state.step === 5) {
    return {...state, step: 6, approval: null, changeCount: state.changeCount + 1};
  }
  // Reverification must retain the new revision, rather than restoring old code.
  if (action.type === 'REVERIFY' && state.step === 6) return {...state, step: 3, approval: null};
  return state;
}
