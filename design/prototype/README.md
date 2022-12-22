# Prototype pattern

## 요약

- 동일 타입의 여러 객체들이 프로퍼티를 공유한다.

## JS와 Prototype

- JS는 명령형(imperative), 함수형(functional), **프로토타입 기반(prototype-based) 객체지향 프로그래밍(OOP)**을 지원하는 멀티 패러다임 프로그래밍 언어이다.

- JS는 프로토타입을 기반으로 상속을 구현한다.
- 생성된 객체의 부모가 되는 객체의 원형을 프로토타입 객체라고 하며, 생성된 객체와 부모 객체와의 참조를 이어주는 링크를 프로토타입 체인이라고 한다.

## Prototype 객체

### 정의

- 어떤 객체의 상위(부모)역할을 하는 객체로서, 다른 객체에 공유 프로퍼티 및 메서드를 제공한다.

### 특징

- 모든 객체는 `[[Prototype]]`이라는 내부 슬롯을 가진다.

  - 해당 슬롯이 가르키는 값은 프로토타입 객체이다.
  - 해당 슬롯에 직접 접근할 수 없지만, `__proto__` 접근자 프로퍼티를 통해 `[[Prototype]]` 내부 슬롯 값(=프로토타입 객체)에 간접적으로 접근이 가능하다.

- 객체가 생성될 때, 객체 생성 방식에 따라 프로토타입 객체가 결정되고, `[[Prototype]]` 내부 슬롯에 저장된다.

- 모든 객체는 단 하나의 프로토타입 객체를 가진다.

- 프로토타입 체인의 최상위 객체는 `Object.prototype`이다.
  - `Object.prototype`의 `[[Prototype]]` 내부 슬롯 값(=프로토타입 객체)은 null이다.

#### `__proto__` 접근자 프로퍼티를 통해 `[[Prototype]]` 내부 슬롯 값 (=프로토타입 객체)에 접근하는 이유

- 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지하기 위해서이다.

  - 순환 참조되는 프로토타입 체인이 형성되는 경우, `__proto__` 접근자 프로퍼티의 setter는 오류를 발생시킨다.

  ```js
  const parent = {};
  const child = {};

  child.__proto__ = parent;
  parent.__proto__ = child; // Uncaught TypeError: Cyclic __proto__ value   at set __proto__ [as __proto__] (<anonymous>)
  ```

#### `__proto__` 접근자 프로퍼티의 사용을 권장하지 않는 경우

- ES5까지는 비표준 (IE11 미만은 지원 되지 않음)
- Object.prototype를 상속받지 않는 객체를 생성할 수 있기 때문에, (ex. 직접 상속) `__proto__` 접근자 프로퍼티를 참조할 수 없는 객체 존재
  - `Object.getPrototypeOf()`, `Object.setPrototypeOf()` 메서드를 사용하는 것을 권장

#### 객체 생성 방식과 프로토타입 객체의 결정

##### 객체 생성 방식

1. 객체 리터럴
2. Object 생성자 함수
3. 생성자 함수
4. Object.create 메서드
5. 클래스 (ES6)

- 프로토타입 객체는 추상 연산 `OrdinaryObjectCreate`에 전달되는 인수에 의해 결정된다.
  - 해당 인수는 객체가 생성되는 시점에 객체 생성 방식에 의해 결정

1. 객체 리터럴

   - 해당 방식으로 생성된 객체는 `Object.prototype`을 프로토타입 객체로 갖는다.

   ```js
   const obj = { x: 1 };
   console.log(obj.__proto__ === Object.prototype); //true,
   // Object.prototype 객체가 constructor를 프로퍼티로 가짐
   console.log(obj.constructor === Object); //true
   ```

2. Object 생성자 함수

   - 해당 방식으로 생성된 객체는 `Object.prototype`을 프로토타입 객체로 갖는다.

   ```js
   const obj = new Object();
   // 객체 리터럴과 달리 빈 객체를 생성 후, 프로퍼티를 추가
   obj.x = 1;
   console.log(obj.__proto__ === Object.prototype); //true,
   console.log(obj.constructor === Object); //true
   ```

3. 생성자 함수

   - 해당 방식으로 생성된 객체는 **생성자 함수의 prototype property에 바인딩 되어있는 객체**를 프로토타입 객체로 갖는다.
     - **생성자 함수의 prototype 프로퍼티에 바인딩 되어있는 객체**의 property는 constructor 뿐이다.
     - **생성자 함수의 prototype 프로퍼티에 바인딩 되어있는 객체**에 프로퍼티 및 메소드가 추가가 가능하다.

   ```js
   function Obj(x) {
     this.x = x;
   }

   const obj = new Obj(1);

   console.log(obj.__proto__ === Object.prototype); //false,
   console.log(obj.__proto__ === Obj.prototype); //true, 생성자 함수의 prototype 프로퍼티에 바인딩 되어있는 객체
   console.log(obj.constructor === Object); //false
   console.log(obj.constructor === Obj); //true

   // 생성자 함수의 prototype 프로퍼티에 바인딩 되어있는 객체에 프로퍼티 및 메소드 추가 가능
   Obj.prototype.twice = function () {
     return this.x * 2;
   };
   ```

   - 생성자 함수 호출 시 동작하는 방식

   1. 빈 객체 생성 빛 this 바인딩

      - 생성자 함수가 **실행되기 전** 빈 객체가 생성됨
      - 해당 객체를 this로 바인딩 (생성자 함수 내부에서 사용되는 this는 해당 객체를 가리킴)
      - 해당 객체의 `[[Prototype]]` 내부 슬롯 값(=프로토타입 객체)는 자신을 생성한 생성자 함수의 `prototype` 프로퍼티에 바인딩 되어있는 객체로 설정

   2. this를 통한 프로퍼티 생성

      - 함수 내에서 this를 사용하여 앞에서 생성된 빈 객체에 동적으로 프로퍼티나 메서드 생성 가능

   3. 객체 리턴

      - 함수 내에서 return 값이 없을 경우, this로 바인딩 되어 생성된 객체가 리턴

## 프로토타입 체인

- 객체에 접근하려는 property가 없을 경우, `[[Protptype]]` 내부 슬롯의 참조를 따라 프로토타입 객체의 property를 순차적으로 검색
- JS가 객체지향 프로그래밍 상속을 구현하도록하는 메커니즘

## 프로토타입 객체 프로퍼티 삭제

```js
const Person = (function () {
  function Person(name) {
    this.name = name;
  }

  Person.prototype.hello = function () {
    console.log("hello");
  };

  return Person;
})();

const me = new Person("Kim");

me.hello = function () {
  console.log("bye");
}; // --> overriding

me.hello(); // "bye"

// 인스턴스 메서드 삭제
delete me.hello;
me.hello(); // "hello"

// 프로토타입 메서드 삭제
delete Person.prototype.hello;
me.hello(); // Uncaught TypeError: me.hello is not a function
```

## 프로토타입 객체 교체

- 상속 관계를 인위적으로 설정하기 위해서는 직접상속이나 Class를 사용하는 것을 권장한다.
