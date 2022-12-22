import singletonCounter from "..";

export const BlueClick = () => {
  console.log("blue", singletonCounter.getCount());
  console.log("blue", singletonCounter.decrement());
  console.log("blue", singletonCounter.decrement());
};
