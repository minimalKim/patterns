페이지에서 덜 중요한 부분의 JS로딩을 지연시킨다.

## 문제점

- 기존 [[Server Side Rendering|SSR]], [[Static Rendering|SSG]] 가지는 [[FCP]]애서 [[TTI]]까지의 시간에서는 UI가 Paint되나, 인터렉션이 되지 않는다.
  - -> 모든 앱이 한번에 hydrate되도록 하는 대신, 앱의 일정 부분 또는 DOM노드마다 점진적으로 진행할 수 있도록 한다.

## 요구사항

1. 모든 컴포넌트에 대해 SSR을 사용한다.
2. 코드 스플리팅을 통해, 개별 컴포넌트 혹은 부분별로 코드를 나눌 수 있어야 한다.
3. 분할된 코드들에 대한 hydration순서를 개발자가 정의할 수 있어야 한다.
4. 이미 hydrate된 코드들에 대하여 사용자의 입력을 막으면 안된다.
5. Hydration이 지연된 분할코드에 대하여 로딩 스피너등을 사용할 수 있어야 한다.

## 구현

### React 동시성 모드

- 동시성 모드는 점진적 hydration을 구현하는데 사용할 수 있다.
- 사용자의 입력에 반응해야 하는 우선순위가 높은 작업이 들어올 경우 React는 hydration 작업을 일시적으로 멈추고 사용자 입력을 받아들이는 작업으로 전환한다.
- [lazy()](https://reactjs.org/docs/code-splitting.html#reactlazy)와 [Suspense()](https://www.notion.so/Progressive-Hydration-ebb26786b1f24dde93115b562b710222)는 로딩 상태를 변수로 제공한다.
- 해당 변수를 사용해 분리된 코드들이 로드중일 때 스피너를 화면에 보여줄 수 있다.

- 참고 영상 : https://deview.kr/2021/sessions/518
- [참고](<https://deview.kr/data/deview/session/attach/1_Inside%20React%20(%E1%84%83%E1%85%A9%E1%86%BC%E1%84%89%E1%85%B5%E1%84%89%E1%85%A5%E1%86%BC%E1%84%8B%E1%85%B3%E1%86%AF%20%E1%84%80%E1%85%AE%E1%84%92%E1%85%A7%E1%86%AB%E1%84%92%E1%85%A1%E1%84%82%E1%85%B3%E1%86%AB%20%E1%84%80%E1%85%B5%E1%84%89%E1%85%AE%E1%86%AF).pdf>)

참고
[React Query와 함께 Concurrent UI Pattern을 도입하는 방법](https://tech.kakaopay.com/post/react-query-2/)
https://youthfulhps.dev/react/react-concurrent-mode-01/
https://maxkim-j.github.io/posts/suspense-argibraic-effect/

https://velog.io/@superlipbalm/everything-you-need-to-know-about-concurrent-react
