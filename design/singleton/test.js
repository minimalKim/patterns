const SingletonCounter = (() => {
  let instance = null;
  let counter = 0;

  function init() {
    return {
      getInstance: () => instance,
      increment: () => counter++,
      decrement: () => counter--,
      getCount: () => counter,
    };
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
})();

let a = SingletonCounter.getInstance();
let b = SingletonCounter.getInstance();

console.log(a.getCount()); // 0
console.log(b.getCount()); // 0

console.log(a === b); // true

a.increment();

console.log(a.getCount()); // 1
console.log(b.getCount()); // 1
