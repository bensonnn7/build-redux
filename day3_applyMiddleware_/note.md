1. the basic structure keep every thing already coded, but add new logic,

```js
function createStore(reducer, enhancer) {
  // 先处理enhancer, 如果enhancer存在并且是函数
  // 我们将createStore作为参数传给他: elegant!!!
  // createStore 还继续做它自己的事情，只不过多了一层 enhancer

  // 他应该返回一个新的createStore给我
  // 我再拿这个新的createStore执行，应该得到一个store
  // 直接返回这个store就行

  // 这样直接大幅度的减少了代码重复
  if (enhancer && typeof enhancer === "function") {
    const newCreateStore = enhancer(createStore);
    // instead out side use createStore, redux will do it
    const newStore = newCreateStore(reducer);
    return newStore;
  }

  // ...rest code

  return store;
}
```

(感觉好像一开始把事情设计对，剩下的就是执行了，这个我之前想的不太一样，我以为就是简单的去修改 dispatch 函数的功能，但是没想到它是这样做的，等搞完研究一下直接去包装 dispatch 函数)

2. So how do we accomplish the above structure?
   lets break it down

```js
// step 1: applyMiddleware return enhancer
function applyMiddleware(middleware) {
  // take original createStore as param, and return enhancer
  return function enhancer(createStore) {};
}

// step 2: enhancer return newCreateStore
function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    // this is like the original way to create store
    return function newCreateStore(reducer) {};
  };
}

// step 3: newCreateStore use passed create store and reducer(like before) return new store(dispatch, getState, subscribe)
function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      // original createStore and reducer
      const newStore = createStore(reducer);
      return newStore;
    };
  };
}

// thanks the nature of closure so we can do this easily
```

3. lets add the actually logic inside applyMiddleware so it can handle the middleware

```js
function applyMiddleware(middleware) {
  return function enhancer(createStore) {
    return function newCreateStore(reducer) {
      // original createStore and reducer
      const newStore = createStore(reducer);

      // 将middleware拿过来执行下，传入store
      // middleware 函数当然需要 store 为参数，获取数据
      const func = middleware(newStore);

      // 解构出原始的dispatch
      const { dispatch } = store;
      // 这里就是上一章说的 decorator pattern
      const newDispatch = func(dispatch);

      return { ...newStore, dispatch: newDispatch };
    };
  };
}
// 接受 store
function middlewareFn(store) {
  // 接收到了 dispatch 了，增强他
  return function decoratorFn(dispatch) {
    // 注意，dispatch 是个函数 是要接受一个参数的！！！
    return function newDispatch(action) {
      middleware logic start
      dispatch()
      middleware logic start
    };
  };
}
```

这里陌生的是：和上一章相比，这里的 decorator 又多了一层函数，因为我们需要返回的是一个新的`函数` 这里需要再理解一下, 这样写代码的方式对我来说很不寻常
