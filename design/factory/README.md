# factory (method) pattern

## 개요

- 동일한 객체를 생성할 수 있도록 하는 특수 함수

## 구현

- 팩토리 함수는 객체를 반환하는 모든 함수가 될 수 있다.

```js
// factory pattern
const createUser = (firstName, lastName) => ({
  createdAt: Date.now(),
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  hello() {
    return `hello, I'm ${this.fullName}`;
  },
});

const user1 = createUser("Min", "Kim");
const user2 = createUser("Bin", "Jeong");
console.log(user1.hello === user2.hello); // false
```

```js
// 생성자 함수
function User(firstName, lastName) {
  this.createdAt = Date.now();
  this.firstName = firstName;
  this.lastName = lastName;
  this.fullName = `${firstName} ${lastName}`;
  this.hello = function () {
    return `hello, I'm ${this.fullName}`;
  };
}

const user1 = new User("Min", "Kim");
const user2 = new User("Bin", "Jeong");
console.log(user1.hello === user2.hello); // false
```

- 기본적으로 new 키워드를 생략할 시, 에러발생 X. this는 window(전역)에 바인딩 된다.

```js
// 생성자 함수 + prototype
function User(firstName, lastName) {
  if (!new.target) {
    throw new Error("use new keyword");
  }

  this.createdAt = Date.now();
  this.firstName = firstName;
  this.lastName = lastName;
  this.fullName = `${firstName} ${lastName}`;
}

User.prototype.hello = function () {
  return `hello, I'm ${this.fullName}`;
};
// ...some code
User.prototype.hello = function () {
  return `hi, I'm ${this.fullName}`;
};

const user1 = new User("Min", "Kim");
const user2 = new User("Bin", "Jeong");

console.log(user1.hello === user2.hello); // true

const user3 = User("Jin", "Park"); // Uncaught Error: use new keyword
```

- 이미 할당된 User.prototype.hello에 덮어쓰기가 가능하다. (재할당)

```js
// class
class User {
  constructor(firstName, lastName) {
    this.createdAt = Date.now();
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${firstName} ${lastName}`;
  }
  hello() {
    return `hello, I'm ${this.fullName}`;
  }
}

const user1 = new User("Min", "Kim");
const user2 = new User("Bin", "Jeong");

console.log(user1.hello === user2.hello); // true
```

- new 키워드를 생략할 시, 명시적 에러 발생
- 동일 명칭 메소드 선언 불가

## 장점

- 동일한 프로퍼티 및 메소드를 가진 여러 작은 객체를 만들어낼 때 유용

## 단점

- 자바스크립트에서 팩토리 함수는 new 키워드 없이 객체를 만드는 것에서 크게 벗어나지 않는다.

- 하지만 대부분의 상황에서 클래스를 활용하는 편이 메모리를 절약(프로토타입)하는데 효과적이기 때문에, 클래스를 사용하는 것을 권장한다.

참고

- https://refactoring.guru/ko/design-patterns/factory-method
- https://aljjabaegi.tistory.com/617
- https://codiving.kr/92
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
