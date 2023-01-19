type Next = () => Promise<void> | void;

type Middleware<T> = (context: T, next: Next) => Promise<void> | void;

type Pipeline<T> = {
  push: (...middlewares: Middleware<T>[]) => void;
  execute: (context: T) => Promise<void>;
};

// middleware 함수들을 인수로 받는다.
function Pipeline<T>(...middlewares: Middleware<T>[]): Pipeline<T> {
  const stack: Middleware<T>[] = middlewares;
  // 순차적으로 실행해야 할 middleware 함수들

  // middleware 함수 추가
  const push: Pipeline<T>["push"] = (...middlewares) => {
    stack.push(...middlewares);
  };

  const execute: Pipeline<T>["execute"] = async (context) => {
    let prevIndex = -1;

    const runner = async (index: number): Promise<void> => {
      console.log(index);
      if (index === prevIndex) {
        throw new Error("next() called multiple times");
      }

      prevIndex = index;

      const middleware = stack[index];

      if (middleware) {
        await middleware(context, () => {
          // 재귀 함수 선언
          return runner(index + 1);
        });
      }
    };

    // 재귀 함수 호출
    await runner(0);
  };

  return { push, execute };
}

type Context = {
  value: number;
};

// middleware pipeline 생성
const pipeline = Pipeline<Context>(
  // 기본 middleware 함수
  (ctx, next) => {
    console.log(ctx);
    next();
  }
);

// middleware 함수 추가
pipeline.push(
  (ctx, next) => {
    ctx.value = ctx.value + 21;
    next();
  },
  (ctx, next) => {
    ctx.value = ctx.value * 2;
    next();
  }
);

// next가 없는 middleware 함수 추가
pipeline.push((ctx, next) => {
  console.log(ctx);
  // not calling `next()`
});

// 아래 middleware는 호출 되지 않음
pipeline.push((ctx, next) => {
  console.log("this will not be logged");
});

pipeline.execute({ value: 0 });
// { value: 0 }
// { value: 42 }

// reference: https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/
