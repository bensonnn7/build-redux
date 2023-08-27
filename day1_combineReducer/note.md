## Summary and learning

1. use different reducer for diff business

2. state: make a obj to `obj of obj`

```js
  // state with one reducer
  state = { milk: 0 }
  // state with multiple
  state = {
    milkState:{ milk: 0, }
    riceState: { rice: 0,}
  }
```

3. return value of reducer: another reducer
   3.1 we loop through all reducer and execute them
   3.2 param reducerMap is close-overed.
   3.3 here we do not multiple the structure of different reducer, just use it from the reducerMap

```js
function combineReducer(reducerMap) {
  // [milkState, riceState]
  const reducerKeys = Object.keys(reducerMap);

  const reducer = (state = {}, action) => {
    const newState = {};
    // loop through all reducers, and invoke them with right state
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const currentReducer = reducerMap[key];

      const prevState = state[key];

      newState[key] = currentReducer(prevState, action);
    }
  };

  return reducer;
}
```

4. another closure: `let store = createStore(reducer)`
   the combinedReducer fn saved the reducerMap(all reducer), and pass it to createStore

5. How the state is updated?
   every time we invoke the reducer, it will pass the current state, and the reducer will return the new state.

```js
// state.milkState = {} : new milk state
newState[key] = currentReducer(prevState, action);
```

6. the tricker return in hoc: a common pattern
   6.1. it return a function
   6.2 when the fn called, it return a result
   6.3 remember the function we returned will be called so it has return value

```js
function combineReducers(reducerMap) {
  const reducer = (state = {}, action) => {
    const newState = {};
    return newState;
  };

  return reducer;
}
newState[key] = currentReducer(prevState, action);
```

7. this is kind a new way to think of the code and write code.
