# mixin pattern

## 정의

- 특정 클래스의 부모 클래스가 아니더라도, 해당 클래스에서 사용할 수 있는 메서드를 포함하는 클래스 (in wiki)
  - 상속의 개념이 아닌 포함의 개념
  - 단독으로 사용되지 않고, 기능을 추가하는 목적으로 사용

## JS에서의 상속

- js는 단일 상속만 허용하는 언어, 다중상속을 지원하지 않음
  - js 객체엔 단 하나의 `[[prototype]]`만 존재 가능
  - class는 하나의 class만 상속 가능

## 장점

- 다중 상속: 하나의 클래스가 여러 클래스의 기능을 사용할 수 있도록 함으로써 다중 상속을 위한 매커니즘 제공
- 코드 재사용성: 클래스들 간에 기능 공유에 유용

## 단점

- mixin이 기존 클래스 메서드를 덮어쓰는 현상이 발생할 수 있다.
- 서로 다른 mixin이 동일한 상태 필드를 정의하는 경우, 충돌이 발생할 수 있다.
- base class와 mixin 간 암시적 종속성을 확인하기 힘들다. (base class가 mixin에 종속하거나, mixin이 base class, mixin이 다른 mixin에 종속이 가능하며, 이는 깨지기 쉬움)
  - 동일한 네임스페이스를 공유하며, 동일 스코프에서 동작하기 때문
  - 여러 개의 mixin을 혼합해서 사용하며 서로 종속이 생길 경우, 추적하기 어려워짐 (결합도가 증가)
- React에서는 Mixin 대신 HOC 또는 Hook을 사용할 것을 권장

## 구현

1. `Object.assign(TargetClass.prototype, mixinObject)`

   ```ts
   let sayMixin = {
     say(phrase) {
       alert(phrase);
     },
   };

   let sayHiMixin = {
     __proto__: sayMixin, // (Object.create 또는 Object.setPrototypeOf를 사용해 프로토타입을 설정 가능)

     sayHi() {
       // 부모 메서드 호출
       super.say(`Hi ${this.name}`);
     },
     sayBye() {
       super.say(`Bye ${this.name}`);
     },
   };

   class User {
     constructor(name) {
       this.name = name;
     }
   }

   // 메서드 복사
   Object.assign(User.prototype, sayHiMixin);

   new User("Min").sayHi(); // Hello Min!
   ```

   메서드의 super가 `[[HomeObject]].[[Prototype]]`내에서 부모 메서드를 찾기 때문에, 메서드는 `User.[[Prototype]]`이 아닌 `sayHiMixin.[[Prototype]]`을 검색

   - 메서드들의 내부 프로퍼티인 `[[HomeObject]]`는 sayHiMixin을 참조

2. `const MixinClass = (TargetClass) => class extends TargetClass`

- 생성자(constructor)를 받음
- 생성자를 확장하여 새 기능을 추가한 클래스 생성
- 새 클래스 반환

참고

- https://ko.javascript.info/mixins
- https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
- https://radlohead.gitbook.io/typescript-deep-dive/type-system/mixins
- https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html
