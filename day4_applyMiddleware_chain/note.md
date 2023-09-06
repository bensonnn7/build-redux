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
      // how we decorate the dispatch
      const { dispatch } = newStore;
      const newDispatch = func(dispatch);

      // or we can do
      for (let i = 0; i < middleware; i++) {}

      return { ...newStore, dispatch: newDispatch };
    };
  };
}

// so we just need to decorate the already enhanced newDispatch to anther middleware
// enhanced it again!

// so the input is dispatch function and output is enhanced dispatch function
const fun1 = (dispatch) => newDispatch1;
const fun2 = (dispatch) => newDispatch2;
const fun3 = (dispatch) => newDispatch3;
```

the first thing come to my mind is another functional programming technique `compose/pipe` which basically is to combine multiple function into one(one's return value become anther's param)

我理解返回值当作下一个参数
但是我不理解的是他咋做到
靠，好像是上一层不是那个 action 层

```js
const combinedFn = compose(mid1, mid2, mid3);
combinedFn(dispatch);

// 第一次其实执行的是
(func1, func2) => (...args) => func1(fun2(...args))
// 这次执行完的返回值是下面这个，用个变量存起来吧
const temp = (...args) => func1(fun2(...args))

// 我们下次再循环的时候其实执行的是
(temp, func3) => (...args) => temp(func3(...args));
// 这个返回值是下面这个，也就是最终的返回值，其实就是从func3开始从右往左执行完了所有函数
// 前面的返回值会作为后面参数
(...args) => temp(func3(...args));

// 再看看上面这个方法，如果把dispatch作为参数传进去会是什么效果
(dispatch) => temp(func3(dispatch));

// 然后func3(dispatch)返回的是newDispatch3，这个又传给了temp(newDispatch3)，也就是下面这个会执行
(newDispatch3) => func1(fun2(newDispatch3))

// 上面这个里面用newDispatch3执行fun2(newDispatch3)会得到newDispatch2
// 然后func1(newDispatch2)会得到newDispatch1
// 注意这时候的newDispatch1其实已经包含了newDispatch3和newDispatch2的逻辑了，将它拿出来执行这三个方法就都执行了

```

```
// lets do a simple example
function mid1(next) {
  console.log("mid1 start");
  // mid2();
  next();
  console.log("mid1 end");
}
function mid2(next) {
  console.log("mid2 start");
  // mid3();
  next();
  console.log("mid2 end");
}
function mid3(next) {
  console.log("mid3 start");
  // dispatch();
  next();
  console.log("mid3 end");
}
function dispatch() {
  console.log("i am dispatch");
  return;
}

// like
mid1(mid2);
mid2(mid3);
mid3(dispatch);
// there are two problems
// 1. we wants to combine those function into only one
// 2. how does the mid functions get the reference of next function

// maybe we can do something like
mid1(mid2(mid3));
// mid2(mid3) looks fine
// but the param of mid1 is return value of mid2 not mid2

```
