---
aliases: [SSR, 서버사이드렌더링]
---

# 개요

모든 요청에 대해 ==서버(또는 서버리스)에서 HTML을 생성==할 수 있다.

1. 브라우저에서 HTML을 요청
2. 서버(또는 서버리스)에서 (렌더링 가능한)페이지 HTML를 생성
   - HTML이 빌드 타임에 생성되는 SSG와 달리, 요청마다 HTML을 서버에서 생성하게 된다.
3. 브라우저가 해당 HTML를 파싱 & 렌더링 -> (사이트 조작은 불가)
4. 브라우저가 서버에서 JS 번들을 요청
5. 브라우저가 요소들을 [[Hydrate]]

---

# 구현

### Vanilla

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Time</title>
  </head>
  <body>
    <div>
      <h1>Hello, world!</h1>
      <b
        >It is
        <div id="currentTime"></div
      ></b>
    </div>
  </body>
</html>
```

```jsx
function tick() {
  var d = new Date();
  var n = d.toLocaleTimeString();
  document.getElementById("currentTime").innerHTML = n;
}
setInterval(tick, 1000);
```

- HTML이 서버에서 렌더링 되어 내려온 뒤. 시간은 클라이언트 측 자바스크립트 함수 `tick()`에 의해 생성

## SSR 지원 Frameworks

- Next.js, Remix 및 Astro와 같은 React Framework를 통해 SSR을 쉽게 구현 가능하다.

### React

- React는 브라우저뿐만이 아니라, 서버에서도 실행이 가능하다.
  - React 컴포넌트를 서버에서 렌더링이 가능하다.
- 서버 측에서 앱을 렌더링할 때, 서버에서 리액트 컴포넌트의 HTML을 렌더링하고, 클라이언트에서 non-interactive한 HTML을 [[hydrate]]하는 방법이 필요하다.

  ```jsx
  // server
  app.get("/", (req, res) => {
    const app = ReactDOMServer.renderToString(<App />);
  });
  ```

  ```jsx
  // client
  ReactDOM.hydrate(<App />, document.getElementById("root"));
  ```

- 서버 측에서 HTML을 렌더링하기위해 `ReactDOMServer.renderToString()`[공식문서](https://ko.reactjs.org/docs/react-dom-server.html#rendertostring)메서드를 사용할 수 있다.

  - 해당 함수는 React 요소에 해당하는 **HTML 문자열을 반환**한다.
  - 생성된 HTML은 빠른 페이지 로드를 위해 클라이언트에 렌더링에 사용된다.
  - `ReactDOM.hydreateRoot()` 메서드로 [[hydrate]]가 가능하다.

  - 서버 측 `.js` 파일은 HTML컨텐츠를 생성하고, 클라이언트 측 `.js` 파일은 이를 [[hydrate]]한다.

### Next.js

- Next는 추가구성 없이 [[Pre-rendering and Data Fetching]]을 지원한다.
- `getServerSideProps` 메서드를 사용하여 페이지를 서버사이드 렌더링 가능하다.
  - 해당 메서드는 모든 요청에서 실행되며, 동적으로 생성될 페이지에 props를 전달한다.

```js
import { Listings, ListingsSkeleton } from "../components";

export default function Home(props) {
  return <Listings listings={props.listings} />;
}

export async function getServerSideProps({ req, res }) {
  const res = await fetch("https://my.cms.com/listings");
  const listings = await res.json();

  return {
    props: { listings },
  };
}
```

- Next.js 에서의 사전 렌더링에는 두가지 방식이 있다.

1. SSG
   - **사용자 요청에 상관없이 페이지를 미리 렌더링할 수 있는 경우**!
   - 페이지를 한 번 빌드하고, ==CDN에서 제공==할 수 있으므로 가능한 한 정적 생성을 사용하는 것이 권장
   - 요청이 있을 때마다 서버에서 페이지를 렌더링 하는 것보다 훨씬 빠름
     - 마케팅 페이지
     - 블로그 게시물
     - 전자상거래 제품 목록
     - 도움말 및 설명서
2. SSR
   - **사용자 요청에 따라 최신화된 페이지를 보여줘야하는 경우!**
   - 페이지에 자주 업데이트되는 데이터가 표시되고 페이지 콘텐츠가 모든 요청에서 변경
   - 속도는 느려지지만 미리 렌더링된 페이지는 항상 최신 상태
     - 첫 번째 바이트까지의 시간([[TTFB]]) 은 서버가 모든 요청에 ​​대해 결과를 계산해야 하고 추가 구성 없이 CDN에서 결과를 캐시할 수 없기 때문에 보다 느리다.
   - 자주 업데이트되는 데이터는 CSR을 선택적으로 도입하기

---

# 성능

- [[TTFB]]: 페이지가 주문형으로 생성되어야 함으로, 느릴 수 있다.
- [[FCP]]: HTML이 파싱 및 렌더링 되면 발생
  -  [[Client Side Rendering|CSR]]과 다르게 JS 파싱 완료 이전에 기본 컨텐츠를 볼 수 있다. 👍
- [[LCP]]: 큰 이미지 및 비디오가 없는 경우, [[FCP]]와 동시에 발생 가능
- [[TTI]]: HTML이 렌더링 된 이후, JS가 다운로드, 파싱 및 실행되어 이벤트 핸들러를 요소에 바인딩한 후 발생 가능
  - JS의 크기를 줄일 수록[[FCP]]와 [[TTI]]의 갭을 줄일 수 있다. (인터렉트 가능 시간 줄이기)

---

# 장점 👍

1. 개인화된 페이지
   - 사용자 쿠키와 같은 요청기반 데이터가 필요한 페이지에 유용 #LS
2. 렌더링 차단
   - 인증 기반 페이지 생성을 차단할 수 있음 #LS

# 단점 👎

1. 긴 초기 로드([[TTFB]])

   - ==사용자가 요청할 때마다 서버에서 페이지가 생성==되어야 하므로, 화면에 렌더링까지 시간이 걸릴 수 있다.
     - 아래와 같은 상황에 서버의 응답이 지연될 수 있다.
       - 동시에 아주 많은 사용자들이 데이터 로딩을 시작한다
       - 네트워크가 느리다
       - 서버 코드가 최적화되어 있지 않다
   - 최적화 #LS 1. 데이터베이스 쿼리 최적화 - 서버와 데이터베이스 사이의 거리가 먼 경우 연결을 설정하고 데이터를 검색하는 데 시간이 걸릴 수 있음 2. `Cache-Control`응답에 헤더를 추가

2. 전체 페이지 새로고침
   - SSR에서는 SPA가 어렵다.
   - 특정 인터렉션은 전체 페이지 새로고침이 필요할 수 있다

## 관련 아티클

- 어서 와, SSR은 처음이지? - 도입 편 https://d2.naver.com/helloworld/7804182
- [ Next.js의 렌더링 과정(Hydrate) 알아보기](https://www.howdy-mj.me/next/hydrate)

참고
https://javascriptpatterns.vercel.app/patterns/rendering-patterns/server-side-rendering
https://developer.mozilla.org/ko/docs/Learn/Server-side/First_steps/Introduction
