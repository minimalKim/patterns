# Bundle Splitting

## 개요

- 코드를 작고 재사용 가능한 수준으로 쪼갠다.

## Bundler

- 애플리케이션을 하나 또는 여러개의 파일로 묶어서 다른 환경 (ex.브라우저)에서 코드를 실행할 수 있도록 한다.
- 코드를 함께 묶기 시작하는 entry 파일을 받는다.
- 다른 파일에서 모듈을 가져오는 경우,번들러는 묘듈을 모두 번들에 포함하기 위해 순회한다.

## Complier

- 컴파일러는 JavaScript(또는 TypeScript) 코드를 현재 및 이전 브라우저나 환경에서 이전 버전과 호환될 수 있는 다른 버전의 JavaScript로 변환한다.
- ex) ES 2022의 #private 접근 제어자를 지원하지 않는 브라우저 (ex.IE)인 경우 babel과 같은 도구로 transpile 필요

- babel과 tsc가 주로 사용된다.

## Minifiers

![img](https://javascriptpatterns.vercel.app/performance-patterns/introduction/2.png)

- 특정 구성에 따라 JavaScript 파일의 크기를 줄일 수 있다.(예: 주석 제거, 변수 및 함수 이름 축소, 공백 제거 등).
- 가독성을 희생하지 않고 훨씬 더 작은 번들 크기와 더 빠른 실행을 가질 수 있으며, JavaScript는 정확히 동일한 방식으로 실행되고 작동된다.

- Terser, Uglify

## Combination

- Webpack과 같은 번들러로 작업할 때 Babel과 같은 컴파일러를 포함하도록 Webpack을 구성하고 Terser minifier와 같은 최적화를 추가해야한다.

- 아래에 도구는 해당 단계를 결합이 가능하다.
  - SWC - Rust 기반 컴파일러, 번들러 및 Minifier
  - ESBuild - Go 기반 컴파일러, 번들러 및 Minifier - JavaScript, CSS, TypeScript, and JSX built-in
    Bundles ESM and CommonJS modules
    Tree shaking, minification, and source maps
    Local server, watch mode, and plugins
    - code splitting 및 CSS와 관련된 처리가 아직 미비합니다.
    - esbuild는 es5 이하의 문법을 아직 100% 지원하지 않습니다.

#### 참고

- compile: 한 언어로 작성된 소스 코드를 다른 언어로 변환
  es)
  Java -> bytecode
  c -> assembly

- transpile:
  한 언어로 작성된 소스 코드를 비슷한 수준의 추상화를 가진 다른 언어로 변환
  ex)
  es6 코드 -> es5 코드로 변환하는 경우
  c++ -> c
  coffescript -> javascript

- transpiler 다른 말로 source to source compiler 라고도 설명하기도 하며, 컴파일러의 일종이다. (또한 혼용되어 많이 사용된다.)

## Tree Shaking

- 사용되지 않는 코드를 제거하여 번들 크기를 줄일 수 있다.
- 번들러는 해당 코드를 자동으로 감지하여 최종 번들에서 이 코드를 제외할 수 있다.

### 특징

- ES2015의 모듈 구문(import, export)으로 정의된 모듈들만 tree-shaking이 가능하다.
  - 즉, 모듈을 import하는 방법이 tree-shaking 가능 여부를 결정짓게 된다.

### 동작

- 앱의 시작이 되는 파일부터 새로운 섹션들에 닿게 될 때 까지 사이드 이펙트로 관련된 트리의 각 노드 끝 부분까지 탐색한다.
  - 해당 탐색 과정이 끝나면 자바스크립트 번들에는 이렇게 탐색된 부분들만 포함된다.
  - 탐색되지 않은 부분은 번들에 포함되지 않고 남게 된다.

```js
import { read } from 'utilities';⁣⁣
⁣⁣
eventHandler = (e) => {⁣⁣
    read({ book: e.target.value })⁣⁣
}
```

```js
export function read(props) {⁣⁣
    return props.book⁣⁣
}⁣⁣
⁣⁣
export function nap(props) { // 번들에서 제외⁣⁣
    return props.winks⁣⁣
}
```

### Side Effect

ES6 모듈을 import하는 경우 해당 모듈은 즉시 실행된다. 이 때 참조하는 코드가 export하는 것을 참조하지 않더라도 그 코드 내부에서 전역에 무언가 영향을 줄 수 있다 (예를 들면 폴리필 추가, 전역 스타일시트 추가 등..) 이를 side effect라 한다.

```js
import { module3 } from "./module3.js";

console.log(`All imported modules:`);
```

```js
import { module2 } from "./module2.js";

console.log("this is module 3"); // 위에서 export된 module3이 참조되지 않아도 실행된다.

export function module3() {
  return `Module 3, ${module2}`;
}
```
