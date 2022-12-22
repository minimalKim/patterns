// proxy는
// - 어떤 이의 대리인을 뜻한다.

// proxy 객체는
// - 어떤 객체의 값을 설정하거나 값을 조회할 때 등의 인터렉션을 직접 제어할 수 있도록 한다.

// 요약: 대상 객체에 대하여 읽기(read) 및 쓰기(write)를 직접 제어(하는 객체)

const person = {
  name: "John Doe",
  age: "42",
  nationality: "American",
};

const personProxy = new Proxy(person, {});

// Proxy 클래스의 두 번째 인자는 handler를 의미한다.
//  - handler 객체에서 우리는 인터렉션의 종류에 따른 특정 동작을들 정의할 수 있다.
//  - get, set 메서드를 추가할 수 있다.

// - get: 프로프티에 접근하려고 할 때 실행 됨
// - set: 프로퍼티에 값을 수정하려고 할 때 실행 됨

const personProxy2 = new Proxy(person, {
  get: (obj, prop: keyof typeof person) => {
    console.log(`The value of ${prop} is ${obj[prop]}`);
  },
  set: (obj, prop: keyof typeof person, value: string) => {
    console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
    obj[prop] = value;
    return true;
  },
});

personProxy2.name; // The value of name is John Doe
personProxy2.age = "43"; // Changed age from 42 to 43
console.log(personProxy2); // { name: 'John Doe', age: '43', nationality: 'American' }

// 특징
// 1. 유효성 검사를 구현 시 유용
const validatedProxy = new Proxy(person, {
  get: (obj, prop: keyof typeof person) => {
    if (!obj[prop]) {
      console.log(
        `Hmm.. this property doesn't seem to exist on the target object`
      );
    } else {
      console.log(`The value of ${prop} is ${obj[prop]}`);
    }
  },
  set: (obj, prop: keyof typeof person, value) => {
    if (prop === "name" && value.length < 2) {
      console.log(`You need to provide a valid name.`);
    } else {
      console.log(`Changed ${prop} from ${obj[prop]} to ${value}.`);
      obj[prop] = value;
    }
    return true;
  },
});

validatedProxy.name = ""; // You need to provide a valid name.


// - 그 외 포메팅, 알림, 디버깅 등 유용하게 사용된다.

// 주의!
// - 핸들러 객체에서 Proxy 를 너무 헤비하게 사용하면 앱의 성능에 부정적인 영향을 줄 수 있음
// - Proxy를 사용할 땐 성능문제가 생기지 않을 만한 코드를 사용
// - 예시 찾아보기)


// Reflect
//
// reflect는
// - js에서 제공하는 내장 객체이다.
// - 중간에서 가로챌 수 있는 메서드를 제공하는 내장 객체이다.
// - 생성자로 사용할 수 없어, 호출하거나 new 키워드를 통해 인스턴스를 만들 수 없다.
//    - 모든 속성과 메서드가 정적(static)이다.

// 특징
// - Proxy와 함께 사용하면 대상 객체를 쉽게 조작 가능
// obj[prop] 형태로 프로퍼티에 직접 접근하거나 obj[prop] = value 형태의 코드로 값을 수정하는 대신,
// Reflect.get() 혹은 Reflect.set() 을 활용할 수 있다.

const reflectProxy = new Proxy(person, {
  get: (obj, prop: keyof typeof person) => {
    console.log(`The value of ${prop} is ${Reflect.get(obj, prop)}`);
  },
  set: (obj, prop: keyof typeof person, value) => {
    console.log(`Changed ${prop} from ${obj[prop]} to ${value}`);
    Reflect.set(obj, prop, value);
    return true;
  },
});

// https://levelup.gitconnected.com/when-vue-meets-proxy-402e9e3c6722
