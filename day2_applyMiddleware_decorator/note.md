## Summary and learning

1. Redux itself only take care of state update but it provide a way
   for others to insert other logic for example log the state before and after state change

   so we need a way to add others code without effect our redux logic

2. In JS world it is very nature to think that using higher-order-function, third party pass there function into redux, and redux will call it before and after the invoke of their own logic
   hence the basic idea of middleware would be someone pass functions to redux and the dispatch fn will call this function

   ```js
   // so add this to the dispatch function
   function createStore(reducer, middlewareFn) {
     // ... rest of code
     function dispatch(action) {
       // invoke passed fn, assume we only have one for now
       // listOfFn.forEach((fn) => fn());
       middlewareFn();

       state = reducer(state, action);
       for (let i = 0; i < listeners.length; i++) {
         const listener = listeners[i];
         listener();
       }
     }
   }
   const store = createStore(reducer, middlewareFn1);
   ```

3. However, we have a problems here, we can only call the function before or after the reducer fn, but normally we wants to execute our code before `and` after the reducer fn.
   3.1 the easiest way is just pass pass 2 function as one, like middleFn.before, and middleFn.after, place it before and after the reducer function

   ```js
   const middleFn = {
     before: (state) => console.log("logger before", state),
     after: (state) => console.log("logger after", state),
   };
   function createStore(reducer, middleFn) {
     // ... rest of code
     // logic that put
     function dispatch(action) {
       // invoke passed fn
       middleFn.before(state);

       state = reducer(state, action);
       // invoke listener
       middleFn.after(state);
     }
   }
   ```

   it actually works, and very easily fit into my mental model, but we pollute our `dispatch` function and it against single responsibility rule, so we need to keep the dispatch function untouched.

4. Two way to achieve the clean a `dispatch` fn
   4.1 Declare an array that contains a list of function `[f1.before, dispatch, f1.after]`(i think it will also work, and this is more fit into human's thinking process) just like how `Axios` did
   4.2 `Decorator pattern`: attach new behaviors to objects(the dispatch function) by placing it inside special wrapper(our middleware) objects(function) that contain the behaviors.
   <br/>
   basically, we pass the dispatch function into our middleware function, and the middleware function will call it

   ```js
   function dispatch(action) {
     state = reducer(state, action);
     for (let i = 0; i < listeners.length; i++) {
       const listener = listeners[i];
       listener();
     }
   }

   function mid1(dispatch) {
     // logic1 start
     dispatch();
     // logic1 end
   }
   // this will invoke the function directly
   mid1(dispatch);

   // but we wants to enhance the dispatch function, not invoke it directly
   // so we need to return another dispatch function from mid1

   function newDispatch = mid1(dispatch)

   function mid1(dispatch) {
    return function(action) {
      // 1. mid1 logic
      // 2. dispatch(action)
      // 3. mid2 logic
    }
   }
   // remember this format of mid1 function, we are gonna use it in next chapter
   ```

note: decorator is not limit to function but also object. it could add more functionality of a object

with this simple solution, we can explore how we implement the applyMiddleware fn (for now, we only focus on one middleware function)
