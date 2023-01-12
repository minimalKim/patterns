# module pattern

## 모듈

- 기능적 구성 요소(모듈)

## 모듈화

- 코드를 관리에 용이하게 모듈(기능)단위로 분할하는 것

## 모듈화 디자인

- 한 시스템을 여러 개의 기능적 구성 요소(=모듈)들을 조합함으로써 완성하도록 한 설계

- 이러한 설계에 따라 만들어진 시스템을 구성요소를 모듈(module)이라 함

## 프로그래밍에서의 모듈

- 하나의 큰 파일을 기능을 기준으로 재사용 가능한 코드 조각으로 분리하는 것

### 성립 조건

- 모듈은 자신만의 파일 스코프(모듈 스코프)를 가져야 함

### 특징

- 모듈은 모듈 내 데이터 (변수, 함수, 객체)은 기본적으로 비공개 상태 (캡슐화 상태)

  - 개별적 존재로서, 기본적으로는 애플리케이션 및 다른 모듈에서 접근 불가
  - 공개가 필요한 데이터에 한정하여 명시적으로 선택적 공개 가능 (`export`)

- 모듈 사용자는 모듈이 공개한 자산 중 일부 또는 전체을 자신의 스코프 내에 불러들여 재사용(`import`)

## module in JS

### ES6 이전

- ES6 이전 JS는 모듈이 성립하기 위해 필요한 파일 스코프, import, export를 지원하지 않았음

  - 여러개의 파일로 분리한 script들도 하나의 전역을 공유하여, 변수 중복의 문제 발생

- 모듈 시스템을 구현하기 위해 CommonJS와 AMD가 제안됨
  - JS 런타임 환경인 Node.js는 CommonJS를 채택
  - Node.js는 ECMAScript 표준 사양은 아니지만 모듈 시스템을 지원

### ES6 모듈 (ESM)

- ES6에서 클라이언트 사이드 js에서 동작하는 모듈 기능 추가
- IE를 제외한 대부분의 browser에서 사용 가능
- 독자적인 module 스코프를 제공
- HTML script 태그에 `type="module"` attribute를 추가하면, 로드된 자바스크립트 파일은 모듈로서 동작

#### export

- default 키워드를 사용하는 경우 var, let, const 키워드는 사용 불가 하다.

```ts
export default function (x: number) {
  return x + x;
} // 가능
```

```ts
export default function double(x: number) {
  return x + x;
} // 가능
```

```ts
export default (x: number) => x + x; // 가능
```

```ts
export default const double = (x: number) => x + x; // 불가능
```
