# Route Based Splitting

- 현재 경로를 기반으로 컴포넌트를 동적으로 로드한다.

## 개요

- 애플리케이션에 여러 페이지가 있는 경우, 동적 가져오기를 사용하여 현재 경로에 필요한 리소스만 로드한다.

- 초기 번들에서 경로를 기반으로 코드 분할을 할 수 있다.

- 사용자가 실제로 해당 페이지로 이동할 때까지 번들 로드를 연기할 수 있다.

## 구현

### React

- `react-router`를 사용하는 경우, `Switch` component를 `React.Suspense`로 감싼다.
- route 되는 컴포넌트들을 `React.lazy`로 import 한다.

#### ver5

```jsx
import React, { lazy, Suspense } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

const App = lazy(() => import("./App"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));

ReactDOM.render(
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
      </Switch>
    </Suspense>
  </Router>,
  document.getElementById("root")
);
```

#### ver6

- [예시](https://stackblitz.com/edit/node-axfpog?file=src%2Findex.js)

```jsx
ReactDOM.render(
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route
            index
            path="/"
            element={
              <React.Suspense fallback={<div />}>
                <App />
              </React.Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <React.Suspense fallback={<div />}>
                <About />
              </React.Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <React.Suspense fallback={<div />}>
                <Contact />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  </Router>
);
```

## 장점

- 초기 번들 크기가 줄어든다.
- 라우팅 시 로딩은 유저에게 익숙한 경험이기 때문에 최적의 타이밍이다.
