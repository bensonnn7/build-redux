const initState = {
  milk: 0,
};

export function reducer(state = initState, action) {
  switch (action.type) {
    case "PUT_MILK":
      return { ...state, milk: state.milk + action.payload };
    case "TAKE_MILK":
      return { ...state, milk: state.milk - action.payload };
    default:
      return state;
  }
}

function createStore(reducer, enhancer) {
  let state;
  let listeners = [];

  // basically, give me another store with enhanced dispatch fn
  if (enhancer && typeof enhancer === "function") {
    // another decorator pattern, keep the original createStore, get a enhanced version
    const newCreateStore = enhancer(createStore);
    // we call this line ourself it no middleware,
    // redux will call it for us, still the same logic(so smart)
    const newStore = newCreateStore(reducer);
    return newStore;
  }

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

function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      const newStore = createStore(reducer);

      const { dispatch } = newStore;
      // decorator 1
      const func = middleware(newStore);
      // well, you can't say it not work....
      // const newDispatch = func(dispatch, store);
      // decorator 2
      const newDispatch = func(dispatch);

      return { ...newStore, dispatch: newDispatch };
    };
  };
}

function mid1(store) {
  return function (dispatch) {
    return function (action) {
      const { getState } = store;
      console.group(action.type);
      console.info("dispatching", action);
      let res = dispatch(action);
      console.log("next state", store.getState());
      console.groupEnd();
    };
  };
}

let enhancedStore = createStore(reducer, applyMiddleware(mid1));

// store.subscribe(() => console.log(store.getState()));
enhancedStore.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 1
enhancedStore.dispatch({ type: "PUT_MILK", payload: 2 }); // milk: 3
// store.dispatch({ type: "TAKE_MILK", payload: 1 }); // milk: 2
