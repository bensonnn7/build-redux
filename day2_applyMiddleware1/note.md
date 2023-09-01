## Summary and learning

1. Redux itself only take care of state update but it provide a way
   for others to insert other logic for example log the state before and after state change

   so we need a why to add others code without effect our own logic

2. In JS world it is very nature to think that using higher-order-function, third party pass
   there function into redux, and redux will call it before and after the invoke of reducer

   so what does those middleware needs, the `state` for sure because they need state to do something
   hence the basic idea of middleware would be someone pass functions to redux
   and the dispatch fn will call this function

   ```js
   function middlewareFn(state) {
     // i will do something
   }
   function middlewareFn2(state) {
     // i will do something
   }
   function reducer() {}
   // so add this to the dispatch function
   function createStore(reducer, listOfFn) {
     // ... rest of code
     function dispatch(action) {
       // invoke passed fn
       listOfFn.forEach((fn) => fn());

       state = reducer(state, action);
       for (let i = 0; i < listeners.length; i++) {
         const listener = listeners[i];
         listener();
       }
     }
   }
   const store = createStore(reducer, [middlewareFn1, middlewareFn2]);
   ```

3. However, we have a problems here, we can only call the function before or after the reducer fn,
   but normally we wants to execute our code before `and` after the reducer fn.
   The nature way to think of this is the the `Onion architecture` `binary tree` `recursion`
   ![Alt text](image.png)

4. How this model works?
   1. it will call first part of the middleware function (that we passed in not sure if it is passed)
   2. and calls the next function(the function repeatedly do 1 and 2)
   3. after it comeback like a recursion, it call the second part of the function
   4. but one function is a whole, how can we call the separate part of the function? no we can't
      unless we integrate other's code inside our code like a sandwich

We are gonna talk more about this tmr
