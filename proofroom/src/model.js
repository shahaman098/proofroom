// Demo-only state: verification and approval are not connected to live services.
export const initialState = {step: 0, approval: null, changeCount: 0};

export function revision(state) {
  return {
    backend: state.changeCount > 0 ? `d82ab60-${state.changeCount}` : state.step >= 3 ? 'c41e8d2' : 'a93d1c4',
    frontend: 'f2a901b',
    requirements: state.step >= 2 ? 'R2' : 'R1',
  };
}
export const fingerprint = state => Object.values(revision(state)).join(':');
export const canApprove = state => state.step === 4;

export function reducer(state, action) {
  if (action.type === 'RESET') return {...initialState};
  if (action.type === 'NEXT' && state.step < 4) return {...state, step: state.step + 1};
  if (action.type === 'APPROVE' && canApprove(state)) {
    return {...state, step: 5, approval: fingerprint(state)};
  }
  if (action.type === 'CHANGE' && state.step === 5) {
    return {...state, step: 6, approval: null, changeCount: state.changeCount + 1};
  }
  // Reverification must retain the new revision, rather than restoring old code.
  if (action.type === 'REVERIFY' && state.step === 6) return {...state, step: 3, approval: null};
  return state;
}
