## 개요

- 노드 서버에서 HTML을 여러 조각으로 나누어 생성되는대로 클라이언트에 전달한다. - 필요한 부분만 선택적으로 렌더링하여 성능을 개선한다.

## 배경

- 기존의 React SSR 방식
  1.  서버에서 전체 앱의 데이터를 받는다.(Data Fetching)
  2.  서버에서 전체 앱을 HTML로 렌더링한 후 Response로 전송한다.
  3.  브라우저에서 해당 HTML를 파싱 & 렌더링한다. (사이트 조작은 불가)
  4.  브라우저가 서버에서 JS 번들을 요청한다.
  5.  브라우저가 요소들을 [[Hydrate]]한다.
- 문제점
  - 각 단계가 완료되어야만 다음 단계로 갈 수 있음 (병목 현상)

## 기능 (React 18 Suspense + Lazy Load)

- **HTML을 내보내기전에 서버에서 모든 데이터가 로딩될 때 까지 기다릴 필요가 없다.**
  - 대신, HTML을 보낼 수 있는 상황이라면 바로 HTML을 보내고, 나머지부분은 준비되는 대로 스트리밍 할 수 있다.
- **hydration을 하기 위해 모든 자바스크립트 코드가 로드 될 때 까지 기다릴 필요가 없다.**
  - 대신 SSR과 함께 코드 스플릿을 사용할 수 있다. 이렇게 하면 서버 HTML은 그대로 보존할 수 있고, 리액트는 관련 코드가 로드될 때 추가로 hydration 한다.
- **페이지와 상호작용하기 위해 모든 컴포넌트가 hydration 되는 것을 기다릴 필요가 없다.**
  - 대신 선택적 hydration을 사용하여 사용자가 상호작용하는 컴포넌트에 우선순위를 지정하고 조기에 hydration을 수행할 수 있다.

## in React

#### 16버전에서 Streaming을 지원하기 시작

- ex) `renderToNodeStream(deprecated)`, `renderToStaticNodeStream`

  - React Tree를 Node.js의 Readable Stream 데이터로 변환한다. (서버 전용)
  - `renderToString(SSR)` VS `renderToNodeStream(Streaming SSR)`

  - 코드 예시

    ```jsx
    app.get('/', (req, res) => {
        const endHTML = "</div></body></html>";
        const indexFile = path.resolve('./build/index.html');

        fs.readFile(indexFile, 'utf8', (err, data) => {
                if (err) {
                  console.error('Something went wrong:', err);
                  return res.status(500).send('Failed to load the app.');
            }

            // React 앱을 삽입해야 하는 HTML을 분할하고 첫 번째 부분을 클라이언트에 보냅니다.
            const beginHTML = data.replace('</div></body></html>', '');
            res.write(beginHTML);

            // `renderToNodeStream`을 사용하여 애플리케이션을 스트림으로 렌더링하고 이를 응답으로 파이프합니다.
            const appStream = ReactDOMServer.renderToNodeStream(<App />);
            appStream.pipe(res, { end: 'false' });

            // 서버가 렌더링을 완료하면 나머지 HTML을 보냅니다.
            appStream.on('end', () => {
                response.end(endHTML);
            )};
        });
    });
    ```

    - 단점: 서버는 클라이언트에 전송을 시작하기 전에 전체 HTML 구조가 생성될 때까지 기다려야 한다.
      - Data Fetching을 기다릴 수 없고, 스트림이 끝날 때까지 전체 HTML 콘텐츠를 버퍼링 반쪽짜리 Streaming

### 18버전 이후 Streaming (Selective Hydration)

- 목적
  - 사용자가 상호작용하는 내용에 따라 SSR의 우선순위를 지정할 수 있도록 하는 것
- 구현

  - **서버에서 HTML을 스트리밍** : 이를 위해 `renderToString` 대신 `pipeToNodeWritable`을 사용
    - react 18 버전의  `pipeToNodeWritable` 덕분에, `<Suspense>`와 함께 lazy 컴포넌트를 사용할 수 있게 되었다. (이전에는 lazy 컴포넌트와 `<Suspense>`를 서버 사이드 렌더링에서 사용 불가)
  - **클라이언트에서 선택적 hydration** : 이를 위해 [`hydrateRoot`](https://github.com/reactwg/react-18/discussions/5)를 사용하고 `<Suspense>`로 감싼다.
  - 예시

    ```jsx
    <Layout>
      <NavBar />
      <Sidebar />
      <RightPane>
        <Post />
        <Suspense fallback={<Spinner />}>
          <Comments />
        </Suspense>
      </RightPane>
    </Layout>
    ```

    ```html
    // client에서 받은 초기 HTML
    <main>
      <nav>
        <!--NavBar -->
        <a href="/">Home</a>
      </nav>
      <aside>
        <!-- Sidebar -->
        <a href="/profile">Profile</a>
      </aside>
      <article>
        <!-- Post -->
        <p>Hello world</p>
      </article>
      <section id="comments-spinner">
        <!-- Spinner -->
        <img width="400" src="spinner.gif" alt="Loading..." />
      </section>
    </main>
    ```

    - 초기 HTML을 더 빠르게 로딩할 수 있다.

    ```html
    <!-- Comments 컴포넌트가 준비되면 아래 HTML을 추가로 보냄 -->
    <!-- HTML을 올바른 위치에 삽입하기 위한 최소한의 인라인 script 태그가 포함되어 있다. -->
    <div hidden id="comments">
      <!-- Comments -->
      <p>First comment</p>
      <p>Second comment</p>
    </div>
    <script>
      // This implementation is slightly simplified
      document
        .getElementById("sections-spinner")
        .replaceChildren(document.getElementById("comments"));
    </script>
    ```

    - 특정 부분의 HTML만을 스트리밍하여 보낼 수 있다.

  - #### 모든 코드가 로드되기 전에 페이지를 hydration하기

    ```js
    // - Comments 자바스크립트 코드가 모두 로딩되기 전까지 앱에서 hydration을 진행할 수 없다.
    // - 메인 번들에서 Comments 컴포넌트 코드를 분할할 수 있다.
    // - Comments가 로드되기전에 애플리케이션에 hydration을 진행할 수 있다.

    import { lazy } from "react";

    const Comments = lazy(() => import("./Comments.js"));

    // ...

    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>;
    ```

    - 17 이전 버전에서 해당 방법은 SSR에서는 동작하지 않았다.

      - SSR에서 코드 스플릿 컴포넌트를 제외하거나, 코드를 모두 로딩한 후 hydration하거나 둘 중 하나

    - `<Suspense>`를 통해 댓글 위젯이 로드되기전에 애플리케이션에 hydrate 가능하다. - 또는 자바스크립트 코드 로딩이 Comment HTML 스트림보다 빨리 끝난다면, 나머지 페이지를 우선 hydration 한다.

  - #### 모든 구성 요소가 hydrate되기 전에 페이지와 상호 작용

    - React는 ==사용자 상호 작용==을 기반으로 화면의 가장 긴급한 부분을 우선 순위로 지정한다.

### `React.lazy`

```js
// lazy 컴포넌트
const OtherComponent = React.lazy(() => import("./OtherComponent"));
```

- 동적 `import` 를 사용하여 컴포넌트를 렌더링할 수 있게 해주는 함수

#### 특징

- lazy 컴포넌트는 반드시 `<Suspense>` 컴포넌트 하위에서 렌더링되어야만 한다.
- 아래처럼 react-router와 함께 페이지 기준으로 코드를 나누기 위해 사용되기도 한다.

```jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

- default exports만 지원하기 때문에, named exports를 사용하고자 한다면 default로 이름을 재정의한 중간 모듈을 생성해야한다.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from "react";
const MyComponent = lazy(() => import("./MyComponent.js"));
```

- 사용하지 않는 컴포넌트는 가져오지 않도록 treeshaking이 가능하다.

참고

- https://blog.logrocket.com/streaming-ssr-with-react-18/
- https://github.com/reactwg/react-18/discussions/130
- https://github.com/reactwg/react-18/discussions/37#discussion-3397355
- https://codesandbox.io/s/kind-sammet-j56ro?file=/src/App.js
- https://yceffort.kr/2021/09/react-18-ssr-architecture
- [React 18을 준비하세요.](https://medium.com/naver-place-dev/react-18%EC%9D%84-%EC%A4%80%EB%B9%84%ED%95%98%EC%84%B8%EC%9A%94-8603c36ddb25)
