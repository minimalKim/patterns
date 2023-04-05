# Import on Visibility

## 개요

- 중요하지 않은 컴포넌트를 뷰포트에 표시될 때 로드한다.

## 목적

- 즉시 필요하지 않는 코드들을 분리한다.

## 구현

1. Intersection Observer API 사용하기

```js
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // 가시성의 변화가 있으면 관찰 대상 전체에 대한 콜백이 실행되므로,
    // 관찰 대상의 교차 상태가 false일(보이지 않는) 경우 실행하지 않음.
    if (!entry.isIntersecting) {
      // isIntersecting: 관찰 대상의 교차 상태(Boolean)
      return;
    }
    // 관찰 대상의 교차 상태가 true일(보이는) 경우 실행.
    // ...

    // 위 실행을 처리하고(1회) 관찰 중지
    observer.unobserve(entry.target);
  });
}, options);
```

### 관련 React Library

- [react-intersection-observer](https://www.npmjs.com/package/react-intersection-observer)
- [react-lazyload]
- [react-loadable-visibility]

```jsx
import { Suspense, lazy } from "react";
import { useInView } from "react-intersection-observer";
const Listing = lazy(() => import("./components/Listing"));

function ListingCard(props) {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      <Suspense fallback={<div />}>{inView && <Listing />}</Suspense>
    </div>
  );
}
```

- react-intersection-observer구성 요소가 뷰포트에 표시되는지 여부를 쉽게 감지하는 데 사용할 수 있는 React hook을 제공한다. ([예시](https://stackblitz.com/edit/node-kkt7mj?file=src%2FApp.js))

## 장점

- 더 빠른 초기로드
  - 모듈을 동적으로 가져오기 때문에, 초기 번들 크기가 줄어든다.
  - 클라이언트가 다운로드 및 실행을 많이 할 필요가 없기 때문에 초기로드가 줄어들어 대역폭이 절약된다.

## 단점

- 레이아웃 변경
  - 대체 구성요소와 마지막으로 렌더링 되는 구성요소의 크기가 많이 다른 경우 레이아웃 변경이 발생할 수 있으니 주의
