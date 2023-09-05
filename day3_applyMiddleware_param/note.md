From last chapter, we know that the key of adding third party's logic is to enhance the dispatch function, we make it execute our function before and after the real `dispatch` function

we also come up with basic middleware function's structure: a function returns `dispatch` function

```js
function mid1(dispatch) {
  return function (action) {
    // 1. mid1 logic
    // 2. dispatch(action)
    // 3. mid2 logic
  };
}
```

1. For now, lets re-thing the dispatch function because it is the trigger of core logic. how do we achieve it in the bigger picture? the redux provide a smart way to do it,

   1.1 it first separate the concern of basic and enhanced version of store by using early return statement(if)
   1.2 then it re-use the `createStore` inside it, so we can basically remain the same logic but only update the dispatch function(smart)

```js
function createStore(reducer, enhancer) {
  // basically, give me another store with enhanced dispatch fn
  if (enhancer && typeof enhancer === "function") {
    // another decorator pattern, keep the original createStore, get a enhanced version
    const newCreateStore = enhancer(createStore);
    // we call this line ourself it no middleware,
    // redux will call it for us, still the same logic(so smart)
    const newStore = newCreateStore(reducer);
    return newStore;
  }

  // ...rest code

  return store;
}
```

it is really simple and really smart! design the structure first (assume it will function the way i designed using design pattern)

2. So how do we accomplish the above structure? the enhance fn, lets break it down

```js
// step 1: the enhancer fn
function enhancer(createStore) {}

// step 2: it will return a newCreateStore fn
const newCreateStoreFn = enhancer(createStore);
return function enhancer(createStore) {
  // this is like the original way to create store
  return function newCreateStore() {};
};

// step 3: the newCreateStoreFn will take reducer
// return the real store
const newStore = newCreateStore(reducer);
return function enhancer(createStore) {
  // this is like the original way to create store
  return function newCreateStore(reducer) {
    // original createStore and reducer
    const newStore = createStore(reducer);
    return newStore;
  };
};

// step 4: enhance the dispatch
return function enhancer(createStore) {
  return function newCreateStore(reducer) {
    const store = createStore(reducer);
    // get the old store, get dispatch, enhance it

    const { dispatch } = store;
    // wait where is my mid function?
    // i should get is so i can enhance it
    const newDispatch = mid(dispatch);
    return store;
  };
};

// when we need one more param, the function programming
// always wrap by another function

// all functions do only have one parameter. Multi-parameter functions are implemented by
// creating a function that takes the first argument and returns a function
// so it is just a normal thing in fp

// ok i have my middleware fn
function mid1(dispatch) {
  return function (action) {
    // 1. mid1 logic
    // 2. dispatch(action)
    // 3. mid2 logic
  };
}
// step 5, add extra layer above enhancer and return it, so it take one more param
const store = createStore(reducer, applyMiddleware(mid1));
// the enhancer will close-over the param: middleware
function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      const newStore = createStore(reducer);

      const { dispatch } = store;
      // now i can use it enhance dispatch fn
      const newDispatch = middleware(dispatch);

      return { ...newStore, dispatch: newDispatch };
    };
  };
}

// wait, my middleware doesn't has store, how can it use state?
// again, more param(store), one more layer of fn
function mid1(store) {
  return function (dispatch) {
    return function (action) {
      // 1. mid1 logic
      // 2. dispatch(action)
      // 3. mid2 logic
    };
  };
}

// step 6: the final version
function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      const newStore = createStore(reducer);

      const { dispatch } = store;
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
// thats way we need to design the mid1 in this specific pattern
```

once i figure out the param part of functional programming, everything start make sense
