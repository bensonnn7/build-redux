function createStore(reducer, middleFnV2) {
  let state;
  let listeners = [];

  function subscribe(callback) {
    listeners.push(callback);
  }

  function dispatch(action) {
    middleFn.before(state);
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
    middleFn.after(state);
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
});

const middleFn = {
  before: (state) => console.log("logger before", state),
  after: (state) => console.log("logger after", state),
};
let store = createStore(reducer, middleFn);

// store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 1
store.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 2
