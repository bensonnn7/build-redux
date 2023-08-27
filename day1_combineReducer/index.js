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

const initMilkState = {
  milk: 0,
};
function milkReducer(state = initMilkState, action) {
  switch (action.type) {
    case "PUT_MILK":
      return { ...state, milk: state.milk + action.payload };
    case "TAKE_MILK":
      return { ...state, milk: state.milk - action.payload };
    default:
      return state;
  }
}

const initRiceState = {
  rice: 0,
};
function riceReducer(state = initRiceState, action) {
  switch (action.type) {
    case "PUT_RICE":
      return { ...state, rice: state.rice + action.payload };
    case "TAKE_RICE":
      return { ...state, rice: state.rice - action.payload };
    default:
      return state;
  }
}

function combineReducers(reducerMap) {
  const reducerKeys = Object.keys(reducerMap);

  const reducer = (state = {}, action) => {
    const newState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const currentReducer = reducerMap[key];

      const prevState = state[key];

      newState[key] = currentReducer(prevState, action);
    }
    return newState;
  };

  return reducer;
}

const reducer = combineReducers({
  milkState: milkReducer,
  riceState: riceReducer,
});

let store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 1
store.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 2
store.dispatch({ type: "TAKE_MILK", payload: 1 }); // milk: 1

store.dispatch({ type: "PUT_RICE", payload: 1 }); // rice: 1
store.dispatch({ type: "PUT_RICE", payload: 1 }); // rice: 2
store.dispatch({ type: "TAKE_RICE", payload: 1 }); // rice: 1
