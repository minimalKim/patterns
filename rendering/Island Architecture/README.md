## 요약

- “아일랜드”(파편화 된 UI)의 상호작용을 위한 스크립트들은 독립적으로 클라이언트에 전송되고 hydrate되며 그 외 나머지 페이지들은 정적 HTML로 렌더링하게 된다.

  - 순전히 정적인 HTML을 유지할 수 있으므로, 페이지의 나머지 부분을 제외하고 독립적으로 hydrate될 수 있는 섬을 만드는 것

- SSR: 모든 컴포넌트들을 함께 렌더링 및 hydrate 한다.
- Progressive Hydration: 모든 구성 요소를 렌더링하고, 주요 구성 요소를 먼저 수화한 다음 다른 구성 요소를 적극적으로 수화한다.
- Islands Architecture: 정적 컴포넌트들은 서버에서 렌더된 HTML이다. 스크립트는 대화형 구성 요소에만 필요하다.

  - 컴포넌트 기반의 아키텍쳐로 정적/동적 아일랜드가 있는 구획화된 뷰를 만드는 것을 제안한다.

  * 정적 구역은 상호작용이 필요없는 HTML로써 **hydration을 할 필요가 없다.**
  * 동적 구역은 HTML과 렌더링 후 이를 hydration하기 위한 스크립트의 조합이다.

### in React18

- React 18에서 `pipeToNodeWritable`를 통해 streaming SSR 방식으로 전달된 컴포넌트들은 정적이더라도 모두 기본적인 js 파일을 가진다.(hydrate 또는 VDOM 재생성이 된다.)

- 정적 컨텐츠들은 상태가 없으며 이벤트를 발생하지도 않기 때문에 렌더링 후 rehydration할 필요가 없다.
- 렌더링 후 버튼, 필터, 검색과 같은 동적 컨텐츠들은 각각의 이벤트 핸들러를 연결되어야 한다.
  - **VirtualDOM은 클라이언트 측에서 재생성**되며 이런 재생성, rehydration, 이벤트 핸들링 함수들은 클라이언트에 보내야 하는 자바스크립트의 크기를 키운다.
- hydration 구조가 페이지의 위에서부터 아래로 진행된다.
  - 페이지 자체에서 각 컴포넌트의 hydration이 스케쥴링된다.

## 특징

- 페이지 별로 서버 사이드 렌더링을 하게 되며 각 페이지는 각각의 정적 컨텐츠를 포함하고 있다.
  - 렌더링된 HTML들은 동적 컨텐츠에 대해서는 placeholder로 렌더링한다.
  - 동적 컨텐츠 placeholder는 서버 렌더링 결과와 이를 클라이언트에서 hydrate하기 위한 스크립트를 포함한다.
- 각 컴포넌트들은 각자의 hydration 스크립트를 가지고 있으며 이는 페이지 내의 다른 스크립트들과 별개로 비동기로 실행된다.

### Astro

- 브라우저에 JS를 제공하지 않는다. 기본적으로 ==정적==으로 생성된다.
  - Next.js는 정적으로 렌더링된 HTML에서 여전히 JavaScript를 유지한다. (hydration)
- 동적 컨텐츠에대해서는 부분수화를 진행한다.
  - 나머지 정적 사이트를 방해하지 않고 필요한 개별 구성 요소만 수화한다.
- 수화하는 방식을 지정할 수 있다.
  - `<MyComponent client:load/>`: 페이지 로드 시 구성 요소 JavaScript를 즉시 수화
  - `<MyComponent client:idle/>`: 페이지가 초기 로드로 완료되고 [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)이벤트가 발생하면 구성 요소 JavaScript를 수화한다.
  - `<MyComponent client:visible/>`: 구성 요소가 사용자의 뷰포트에 들어가면 구성 요소 JavaScript를 수화한다. [IntersectionObserver](https://blog.logrocket.com/lazy-loading-using-the-intersection-observer-api/)가시성을 추적하기 위해 내부적으로 사용한다.
  - `<MyComponent client:media={string}/>`: 특정 [CSS 미디어 쿼리가](https://blog.logrocket.com/choose-between-media-container-queries/) 충족되면 구성 요소 JavaScript를 수화한다.
  - `<MyComponent client:only={string}/>`: HTML 서버 렌더링을 건너뛰고 클라이언트에서만 렌더링한다. 구성 요소는 빌드 시 건너뛰므로 클라이언트 측 API에 전적으로 의존한다.

### Gatsby

- Gatsby 5부터 부분 수화를 사용할 수 있다.
  - 부분 수화는 Island Architecture일까?
    - 최종 결과(상호작용의 섬)는 동일하지만, 도달하는 방법은 (ex. Astro's Islands와 Gatsby의 Partial Hydration) 간에 다르다.
      ![[Pasted image 20230322021442.png]]
    - (좌측) React는 대부분의 페이지가 static인 경우에도 전체 페이지를 하이드레이트해야 하므로 상호 작용이 실제로 필요하지 않은 사이트 부분에 대해 클라이언트에 JavaScript를 보낸다.
      - React는 **VDOM 노드를 생성**하고 **코드를 평가**해야 한다.
    - (우측) 부분 수화를 사용하면 대화형 부분에 대해서만 JavaScript를 보내고 해당 부분을 수화하도록 React에 지시한다. -> React ServerComponent로 구현이 가능하다. (동적이고 인터랙티브한 서버 측 렌더링을 위해 사용)

**참고**

- https://astro.build/play
- https://dev.to/foxy17/why-everyone-is-talking-about-astro-and-island-architecture-1762
- https://www.gatsbyjs.com/docs/conceptual/partial-hydration
- https://www.gatsbyjs.com/docs/conceptual/partial-hydration/#why-react-server-components
- https://blog.logrocket.com/understanding-astro-islands-architecture/
