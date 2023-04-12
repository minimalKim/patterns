import { module2 } from "./module2.js";

console.log("this is module 3");

export function module3() {
  return `Module 3, ${module2}`;
}
