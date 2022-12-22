import singletonCounter from "../index";

test("incrementing 1 time should be 1", () => {
  singletonCounter.increment();
  expect(singletonCounter.getCount()).toBe(1);
});

// 초기화가 되지 않음
test("incrementing 3 extra times should be 4", () => {
  singletonCounter.increment();
  singletonCounter.increment();
  singletonCounter.increment();
  expect(singletonCounter.getCount()).toBe(4);
});

test("decrementing 1  times should be 3", () => {
  singletonCounter.decrement();
  expect(singletonCounter.getCount()).toBe(3);
});
