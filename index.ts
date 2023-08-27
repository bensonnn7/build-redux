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
  let state: S ;
  let listeners: Array<() => void> = [];

  function dispatch(action: Action) {
    state = reducer(state, action)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i] as () => void;
      listener()
    }
  }
  function subscribe(listener: () => void): Unsubscribe {
    if (typeof listener === 'function') {
      listeners.push(listener);

      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    }
    return () => {};
  }

  function getState() {
    return state
  }

  const store: Store<S> = {
    dispatch,
    subscribe,
    getState
  }

  return store
}


const initState = {
  milk: 0
};

function reducer(state = initState, action: Action) {
  switch (action.type) {
    case 'PUT_MILK':
      return {...state, milk: state.milk + action.payload};
    case 'TAKE_MILK':
      return {...state, milk: state.milk - action.payload};
    default:
      return state;
  }
}
let store = createStore(reducer);
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'PUT_MILK', payload: 1 });    // milk: 1