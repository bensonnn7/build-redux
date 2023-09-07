The next question would be how to support multiple middleware.
Something like this

```js
applyMiddleware(
  timeoutScheduler,
  thunk,
  vanillaPromise,
  readyStatePromise,
  logger,
  crashReporter
);
// the cur structure of middleware
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

// lets recall how we decorator when we only have one mid
function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      const newStore = createStore(reducer);
      const func = middleware(newStore);

      const { dispatch } = newStore;
      // this is how we decorator it, so how about i decorate the decorated fn: newDispatch?
      // same idea isn't it?
      // const newDispatch = func(dispatch);

      // the first thing comes to my mind is for loop
      let newDispatch = dispatch;
      for (let i = 0; i < middleware.length; i++) {
        const func = middleware[i](newStore);
        newDispatch = func(newDispatch);
      }

      return { ...newStore, dispatch: newDispatch };
    };
  };
}

// so we just need to decorate the already enhanced newDispatch to anther middleware
// try to ignore how it works, make sure the concept is right, your code should be good, like recursion

// thats why it is very important about the structure of the mid fn
// it has to be take dispatch and return another dispatch
// so we can accomplish the chaining of decoration
const fun1 = (dispatch) => newDispatch1;
const fun2 = (dispatch) => newDispatch2;
const fun3 = (dispatch) => newDispatch3;
```

but of course, we not gonna do it in for loop, we use fp all alone
the first thing come to my mind is another functional programming technique `compose/pipe` which basically is to combine multiple function into one(one's return value become anther's param)

```js
function compose(...func) {
  return funcs.reduce(
    (acc, curFn) =>
      (...args) =>
        acc(curFn(...args))
  );
}

// note: compose will return the "same" function
// it also take the same params
const combinedFn = compose(mid1, mid2, mid3);
// mid1(dispatch)
combinedFn(dispatch);
```

Note: the function we composed is not the most inner dispatch function, but the function take and return dispatch

i originally think the mid1 will invoke the next middleware function, and the dispatch will be the next function

and i do not under that why the return value of mid2 can be the param of mid1, and turns out i completely misunderstand the how decorator works

Decorator: i will execute your passed code, and become a new function

![DECORATOR](IMG_4145.png)

so the next param is not just the individual function, but the enhanced whole function!!

```js
mid1(mid2)
function mid1(next) {
  // logic
  next() //mid2
  // logic after
}
mid2(mid3)
mid1(mid2(mid3))


function mid1(store) {
  // this is the function we are going to decorator, not the one use action as param
  return function (dispatch) {
    return function (action) {
      // ...
    };
  };
}
still think it is quite amazing that how things just perfectly fit and work, like a magic
```

So we can replace the for loop by compose

```js
function applyMiddleware(middlewareList) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      const newStore = createStore(reducer);

      // pass store to all middleware
      const chainOfMid = middlewareList.map((middleware) => middleware(store));
      const enhancedDispatchGen = compose(chainOfMid);

      const { dispatch } = newStore;
      // it is weird, i know, just different how we normal think the process of program
      const newDispatch = enhancedDispatchGen(dispatch);

      return { ...newStore, dispatch: newDispatch };
    };
  };
}
```
