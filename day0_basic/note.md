## Summary and learning

0. Reducer: a `pure` function takes 1.current state and 2. action to update state. think it's a factory to update state

1. modular pattern in JS
   create a function to encapsulate certain features, and use closure to save state

2. state got closed over

   1. state
   2. listeners
   3. reducer (this one is not obvious but crucial)

3. expose function that take arguments
   `function dispatch (action) {}`
   this is not fit in my mental module at the first place because i barely use it in daily programming, but it is everywhere in the JS world

4. `state = reducer(state, action)`: this line of code is inside the dispatch function which makes it hard to connect with the way i normally think about function. it use a state that saved by the `createStore` function, and also take a argument from the "outside"(when we call it). it's kind a compound way to fill params. but i do think it is a common pattern in JS world.
