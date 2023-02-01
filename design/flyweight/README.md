# flyweight

## 개요

- 다수의 유사한 객체 생성이 필요할 때, 메모리 절약을 위해 최대한 **존재하는 인스턴스를 재사용**해서 사용하는 형태

## 적용

- 수많은 유사한 객체를 생성해야 할 때
- 객체에 여러 객체간에 공유할 수 있는 중복상태가 있을 경우

## 구조

- Flyweight

  - 많이 생성되기 때문에 공유되어 사용되면 좋을 객체
  - 또는 공유되면 좋을 데이터를 가지는 객체 (클래스)

- FlyweightFactory

  - Flyweight 풀(=리스트)를 생성 및 관리한다.
  - 기존에 생성된 플라이웨이트를 살펴보고 검색 기준과 일치하는 기존 Flyweight를 반환하거나, 없다면 새로 생성하는 역할을 수행한다. (getOrCreate)

- Client
  - FlyweightFactory를 통해 Flyweight를 사용하는 주체.
  - 공유될 수 없는 개별적인 상태에 대한 정보를 가진다.

## 장점

- 대량의 객체를 만들어 낼 때, 메모리를 많이 사용하는 문제를 해결한다.

## 단점

- FlyweightFactory가 기존에 재사용가능한 Flyweight를 찾거나 계산하는 런타임 비용이 발생할 수 있다.

## singleton과의 비교

- 유사점
  - FlyweightFactory가 관리하는 Flyweight를 단 하나로 줄일 수 있다면 Singleton과 유사하다.
- 차이점
  - Singleton 인스턴스는 하나만 있어야 하지만, Flyweight 상태가 다른 여러 개가 존재할 수 있다.
  - Singleton 객체는 변경 가능하다. Flyweight 객체는 변경할 수 없다. (객체가 공유되어 사용되기 때문에 권장하지 X)

## in js

- js에서는 prototype을 사용하여 객체 생성시, prototype 객체를 공유하여 사용할 수 있으므로, 메모리 비용을 줄이는 효과를 낼 수 있다.

- ts-morph

- ts-morph 와 같은 많은 라이브러리에서 사용되며, getOrCreate과 같은 접두사를 붙이기도 한다.
- https://github.com/dsherret/ts-morph/blob/latest/packages/common/src/collections/KeyValueCache.ts#L29

참고

- https://refactoring.guru/design-patterns/flyweight
- https://www.dofactory.com/javascript/design-patterns/flyweight
- https://seunghun-kim.gitbooks.io/learning-javascript-design-patterns/content/09.javascript-design-patterns/the-flyweight-pattern.html
- https://www.zerocho.com/category/JavaScript/post/57bbb0a3f6f59c170071d2e2
- https://jsmanifest.com/power-of-flyweight-design-pattern-in-javascript/
- https://has3ong.github.io/programming/designpattern-flyweight/
