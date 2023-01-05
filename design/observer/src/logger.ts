import { observable } from "./observable";

const dateLogger = (data: any) => {
  console.log(`${Date.now()} ${data}`);
};

const emojiLogger = (data: any) => {
  console.log(`🐶🐱🐹 ${data}`);
};

observable.subscribe(dateLogger);
observable.subscribe(emojiLogger);

observable.notify("start!");
setTimeout(() => {
  observable.notify("end!");
}, 3000);
