1. How we gonna to achieve that?

2. Here is a draft version of what we gonna do

```js
function middleware1() {
  // logic1 start

  // middleware2();
  reducer();

  // logic1 end
}
// function middleware2() {
//   // logic2 start

//   const resMiddleware3 = middleware3();

//   // logic2 end
// }

// function middleware3(integratedFn) {
//   // last middleware
//   // logic3 start,

//   // invoke reducer()

//   // logic3 end

//   // this will return to the resMiddleware3
//   return;
// }
```

3. the next question would be how could we mix them into one? like one line of code will execute all my middleware
   if we trying to accomplish this, it needs to pass other's function into our middleware fn just like middleware1 execute middleware2,
