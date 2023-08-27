// how to use it
// let store = createStore(reducer);
// store.subscribe(() => console.log(store.getState()));
// store.dispatch({ type: 'PUT_MILK' });    // milk: 1


function createStore(reducer) {
  let state;
  let listeners = [];

  function dispatch(action) {
    state = reducer(state, action)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i] as () => void;
      listener()
    }
  }

  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push()
    }
  }

  function getState() {
    return state
  }
  const store = {
    dispatch,
    subscribe,
    getState
  }
  return store
}