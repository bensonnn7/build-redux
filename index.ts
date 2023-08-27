type Action = {
  type: string;
  payload?: any; // You can adjust the payload type as needed
};

type Reducer<S> = (state: S, action: Action) => S;

type Unsubscribe = () => void;

type Store<S> = {
  dispatch: (action: Action) => void;
  subscribe: (listener: () => void) => Unsubscribe;
  getState: () => S;
};

// function createStore(reducer) {
function createStore<S>(reducer: Reducer<S>): Store<S> {
  let state: S;
  let listeners: Array<() => void> = [];

  function dispatch(action: Action) {
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i] as () => void;
      listener();
    }
  }

  function subscribe(listener: () => void): Unsubscribe {
    if (typeof listener === "function") {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    }
    return () => {};
  }

  function getState() {
    return state;
  }

  const store: Store<S> = {
    dispatch,
    subscribe,
    getState,
  };

  return store;
}

const initState = {
  milk: 0,
};

function reducer(state = initState, action: Action) {
  switch (action.type) {
    case "PUT_MILK":
      return { ...state, milk: state.milk + action.payload };
    case "TAKE_MILK":
      return { ...state, milk: state.milk - action.payload };
    default:
      return state;
  }
}

// step 1: basic redux
// let store = createStore(reducer);
// store.subscribe(() => console.log(store.getState()));
// store.dispatch({ type: "PUT_MILK", payload: 1 }); // milk: 1

// step 2: combine reducer
const initMilkState = {
  milk: 0,
};

function milkReducer(state = initMilkState, action: Action) {
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

function riceReducer(state = initRiceState, action: Action) {
  switch (action.type) {
    case "PUT_RICE":
      return { ...state, rice: state.rice + action.payload };
    case "TAKE_RICE":
      return { ...state, rice: state.rice - action.payload };
    default:
      return state;
  }
}

type ReducerMap<S> = {
  [key: string]: Reducer<S>;
};
function combineReducers<S>(reducerMap: ReducerMap<S>): Reducer<S> {
  const reducerKeys = Object.keys(reducerMap);

  const reducer: Reducer<S> = (state, action: Action) => {
    const newState = {} as S;
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducerMap[key];
      const prevState = state[key] as any;
      newState[key] = reducer(prevState, action);
    }
    return newState;
  };

  return reducer;
}
