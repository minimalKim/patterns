// singleton은
// 1. 1회에 한하여 인스턴스화가 가능하다
// 2. 헤당 인스턴스를 전역에서 참조 가능하다
//  -> 전역에서 공유되기 때문에 앱의 전역 상태를 관리하기에 적합하다.

// 요약 :앱 전체에서 공유 및 사용되는 단일 인스턴스

interface ICounter {
  getInstance: () => this;
  getCount: () => number;
  increment: () => number;
  decrement: () => number;
}

{
  let counter = 0;

  class Counter implements ICounter {
    getInstance() {
      return this;
    }

    getCount() {
      return counter;
    }

    increment() {
      return counter++;
    }

    decrement() {
      return counter--;
    }
  }

  const counter1 = new Counter();
  const counter2 = new Counter();

  console.log(counter1.getInstance() === counter2.getInstance()); // false
}
// 위의 코드는 여러 개의 인스턴스 생성이 가능하므로 singleton이 아님

{
  let instance: Counter | null = null;
  let counter = 0;

  class Counter implements ICounter {
    constructor() {
      if (instance) {
        throw Error("You can only create one instance");
      }
      instance = this; // Counter { counter: 0 }
    }

    getInstance() {
      return this;
    }

    getCount() {
      return counter;
    }

    increment() {
      return counter++;
    }

    decrement() {
      return counter--;
    }
  }

  const counter1 = new Counter();
  const counter2 = new Counter(); // Error: You can only create one instance
}
// 인스턴스를 1개 이상 생성 시 에러가 발생 -> **==인스턴스를 한 번만 생성==** 하도록 강제

let instance: Counter | null;
let counter = 0;

class Counter implements ICounter {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance");
    }
    instance = this;
  }

  getInstance() {
    return this;
  }

  getCount() {
    return counter;
  }

  increment() {
    return ++counter;
  }

  decrement() {
    return --counter;
  }
}

const singletonCounter = Object.freeze(new Counter());
export default singletonCounter;

// singletonCounter 인스턴스를 export하기 전에 인스턴스를 freeze 한다.

// Object.freeze
// 객체를 동결한다.
// - 프로퍼티 추가 및 삭제와 프로퍼티 어트리뷰트 재정의 금지, 프로퍼티 값 갱신 금지를 의미한다.
// - 즉, 읽기만 가능하다.
// 동결된 객체인지 여부는 Object.isFrozen 메서드로 확인할 수 있다.

// RedButton과  BlueButton에서 동일한 Singleton 인스턴스를 import 할 때, 인스턴스의 counter 값은 양쪽 모듈 파일에서 모두 공유한다.
// - 분리된 파일들에서 메서드를 실행하더라도 카운터가 초기화 되지 않는다.

// 장점
// 1. 메모리 공간 절약
// - 인스턴스를 하나만 만들도록 강제하기 때문

// 단점
// 1. 오버엔지니어링이다.
// - JAVA, C++과는 다르게, Javascript는 클래스를 작성하지 않아도 객체를 생성할 수 있기 때문

// 객체 리터럴로 사용하기
{
  let count = 0;

  const counter = {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
  };

  Object.freeze(counter);
  // export { counter };
}

// 즉시실행함수(IIFE)로 생성하기
// - 생성자가 여러 차례 호출되더라도, 실제로 생성되는 객체는 하나
// - 내부 변수들을 클로저로 이용

{
  interface Counter {
    getCount: () => number;
    increment: () => number;
    decrement: () => number;
  }

  const SingletonCounter = (() => {
    let instance: Counter | null = null;
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
}

// static 키워드를 사용한 Singleton class
{
  class DefaultSingleton {
    private counter;

    constructor() {
      this.counter = 0;
    }

    getInstance() {
      return this;
    }

    getCount() {
      return this.counter;
    }

    increment() {
      return ++this.counter;
    }

    decrement() {
      return --this.counter;
    }
  }

  interface Counter {
    getCount: () => number;
    increment: () => number;
    decrement: () => number;
  }

  class SingletonCounter implements Counter {
    private static instance: SingletonCounter | null = null;

    private counter = 0;

    constructor() {
      if (SingletonCounter.instance) {
        return SingletonCounter.instance;
      }
      SingletonCounter.instance = this;
      this.counter = 0;
    }

    getInstance(): SingletonCounter {
      return this;
    }

    getCount(): number {
      return this.counter;
    }

    increment(): number {
      return ++this.counter;
    }

    decrement(): number {
      return --this.counter;
    }
  }

  const a = new SingletonCounter();
  const b = new SingletonCounter();

  console.log(a.getCount()); // 0
  console.log(b.getCount()); // 0

  console.log(a === b); // true

  a.increment();

  console.log(a.getCount()); // 1
  console.log(b.getCount()); // 1
}

// 2. 까다로운 테스팅
// - 인스턴스를 단 한번만 생성 할 수 있기 때문에, 모든 테스트들은 이전 테스트에서 만들어진 전역 인스턴스를 수정할 수 밖에 없음
//    - 이전 테스트에 종속되는 문제 (실행 순서가 중요)
//    - 하나의 테스트가 끝나면 인스턴스의 변경사항들을 초기화 해 주어야 함

// velog.io/@sms8377/Structure-%EC%8B%B1%EA%B8%80%ED%86%A4-%ED%8C%A8%ED%84%B4%EA%B3%BC-%EB%AC%B8%EC%A0%9C%EC%A0%90

// 3. 명확하지 않은 의존
// - 여러 Singleton 인스턴스들이 앱애서 공유될 때 직접 수정할 수 있게 되고, 예외로 이뤄질 수 있음

// - 객체지향에서 지켜야할 SOLID이 원칙은 클래스의 의존성을 Interface에 두는 것으로 권장한다.
//  - 클래스의 구현이 변경되어도 이를 사용한 코드는 큰 영향을 받지 않음 (동일 인터페이스 이므로)
//  - 그러나 singleton을 사용하는 대부분 인터페이스가 아닌,

export class SuperCounter {
  count: number;

  constructor() {
    this.count = 0;
  }

  increment() {
    singletonCounter.increment();
    return (this.count += 100);
  }

  decrement() {
    singletonCounter.decrement();
    return (this.count -= 100);
  }
}

const counter2 = new SuperCounter();

counter2.increment();
counter2.increment();
counter2.increment();

console.log("Counter in counter.js: ", singletonCounter.getCount());

// 전역 동작
// - Singleton 인스턴스는 앱의 전체에서 참조할 수 있어햐 함
// - 전역 스코프에서 전역 변수를 접근 가능 -> 전역 변수는 앱 전체에서 접근 가능
//    -> 전역 변수는 반드시 같은 동작을 구현하는데 사용해야 함
// - 전역 변수가 잘못된 값으로 덮여쓰여질 경우, 해당 변수를 참조하는 구현들이 모두 예외를 발생시킴

// React의 상태 관리
// - React에선 전역 상태 관리를 위해 Singleton 객체를 만드는 대신 Redux나 React Context를 자주 사용함
// - Singleton과의 차이점
//    - Singleton은 인스턴스의 값을 직접 수정 가능
//    - 위의 도구들은 읽기 전용 상태를 제공함
//      - Redux에서는 오직 컴포넌트에서 dispatcher를 통해 넘긴 actions에 대해 실행된 순수함수 reducer를 통해서만 상태를 업데이트 가능

//      -> 전역 상태의 단점은 여전하나, 컴포넌트가 직접 상태를 업데이트하게 두는 것이 아니며, 개발자가 의도한 대로 수정되도록 함

// https://medium.com/@anchen.li/is-react-context-singleton-4c8756b8ad4e
// https://tecoble.techcourse.co.kr/post/2020-11-07-singleton/
