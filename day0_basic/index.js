function createStore(reducer) {
  let state;
  let listeners = [];

  function subscribe(callback) {
    listeners.push(callback);
  }

  function dispatch(action) {
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function getState() {
    return state;
  }

  const store = {
    subscribe,
    dispatch,
    getState,
  };

  return store;
}

const initState = {
  milk: 0,
};

function reducer(state = initState, action) {
  switch (action.type) {
    case "PUT_MILK":
      return { ...state, milk: state.milk + action.payload };
    case "TAKE_MILK":
      return { ...state, milk: state.milk - action.payload };
    default:
      return state;
  }
}

let store = createStore(reducer);
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 1
store.dispatch({ type: "PUT_MILK", payload: 2 }); // milk: 3
store.dispatch({ type: "TAKE_MILK", payload: 1 }); // milk: 2
