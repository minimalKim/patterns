import singletonCounter from "..";

export const RedClick = () => {
  console.log("red", singletonCounter.getCount());
  console.log("red", singletonCounter.increment());
  console.log("red", singletonCounter.increment());
};
