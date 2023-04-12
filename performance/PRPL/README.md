# PRPL Pattern

## 개요

- 프리캐싱, 지연로딩, 라운드트립 최소화를 통해 **초기 로드**를 최적화한다.

아래 항목의 첫글자를 딴 것이다.

- **Push** (or **preload**) the most important resources (첫 페이지에 중요한 리소스는 push 혹은 preload 한다)
- **Render** the initial route as soon as possible (첫 페이지를 빠르게 렌더한다)
- **Pre-cache** remaining routes (첫 페이지 외의 라우팅을 프리 캐시한다)
- **Lazy-load** other routes and non-critical assets (다른 중요하지 않는 리소스는 지연로딩한다)

\*라운트 트립: 클라이언트와 서버간의 데이터 왕복 과정을 의미

---

## 구현

### 중요한 리소스 미리 로드 (P)

![img](https://web-dev.imgix.net/image/admin/tgcMfl3HJLmdoERFn7Ji.png?auto=format&w=1490)

- Lighthouse는 특정 리소스을 분석하고 가져오는 게 늦어지는 경우 위와 같이 표시한다.

#### A. 리소스 힌트 preload를 사용

```html
<link rel="preload" as="style" href="css/style.css" />
```

- HTML 문서의 헤드에 rel="preload"를 포함한 `<link>` 태그를 추가하여 중요한 리소스를 미리 로드한다.
- 브라우저에 가능한 한 빨리 리소스를 요청하도록 지시한다.

#### B. HTTPS/2 server push 사용

- HTTP/2 프로토콜에서는 서버가 클라이언트의 요청 없이 리소스를 미리 보내는 기능인 Server Push를 제공한다.
- 최초 HTML이 다운도르 되는 시점에 이루어지기 때문에 preload에 비해 훨씬 빠르게 중요 리소스들을 다운도르 할 수 있다.

  //

### 최대한 빠르게 초기 경로를 렌더링 (R) + 지연 로드(L)

![img](https://web-dev.imgix.net/image/admin/gvj0jlCYbMdpLNtHu0Ji.png?auto=format&w=1600)

- 사이트에서 픽셀을 화면에 렌더링하는 순간인 FP(First Paint)를 지연시키는 리소스가 있는 경우 경고한다.

#### 구현

- 초기 렌더링에 필요한 JS, CSS와 Lazy-load할 리소스를 구분한다.

#### script async, defer

![img](https://i.stack.imgur.com/OovG7.png)

- 초기 렌더링에 필요하지 않은 JS파일들은 async, defer을 추가하여 lazy-load한다.

#### CSS 최적화

- 브라우저는 CSS가 구문 분석되고 CSSSOM이 만들어지기까지 렌더링을 멈추므로, CSS가 렌더링 순위가 가장 높으며, 렌더링을 가장 방해하는 리소스이다.
- CSS가 자바스크립트보다 렏더링에 있어 더 높은 우선순위를 가진다.

```html
<link
  rel="stylesheet"
  type="text/css"
  media="screen and (min-device-width: 781px)"
  href="style_desktop.css"
/>

<link
  rel="stylesheet"
  type="text/css"
  media="screen and (max-device-width: 780x)"
  href="style_mobile.css"
/>
```

- 미디어 쿼리 조건과 함께 기입시, 조건에 맞지 않는 파일은 다운로드 하지 않는다.

#### A. 초기 렌더링에 필요한 JS인라인, CSS 인라인

- FP를 개선하기 위해 Lighthouse는 중요한 JavaScript를 **인라인**하고 async를 사용하여 나머지는 연기할 뿐만 아니라 스크롤 없이 볼 수 있는 부분에서 사용되는 중요한 CSS를 **인라인**할 것을 권장한다.

##### 장점

- 이는 렌더링 차단 자산을 가져오기 위한 서버와의 왕복 통신을 제거함으로써 성능을 향상시킨다.

##### 단점

- 인라인 코드는 개발 관점에서 유지 관리하기가 더 어려우며 브라우저에서 별도로 캐시할 수 없다.

#### B. 초기 HTML 서버 사이드 렌더링(Server-Side Rendering, SSR)

##### 장점

- 스크립트를 계속 가져오고, 구문 분석하고, 실행하는 동안 사용자에게 즉시 콘텐츠가 표시

##### 단점

- HTML 파일의 페이로드가 크게 증가하여 응용 프로그램이 대화형이 되어 사용자 입력에 응답하는 데 걸리는 시간(TTI)인 상호 작용까지의 시간이 나빠질 수 있음

//

### 자산 사전 캐시(P)

- 다음 요청을 예상하여 서버에서 필요한 리소스를 미리 다운도르하여 캐시하는 방식이다.

#### A. Service Web Worker 사용

![img](https://web-dev.imgix.net/image/admin/xv1f7ZLKeBZD83Wcw6pd.png?auto=format&w=1600)

Service Web Worker는 프록시 역할(브라우저와 웹 서버 간의 네트워크 요청을 가로채고 처리할 수 있음)을 하여 반복 방문 시 서버가 아닌 캐시에서 자산을 직접 가져올 수 있다.

1. 웹 애플리케이션에 Service Worker를 등록

   ```js
   const registerServiceWorker = async () => {
     if ("serviceWorker" in navigator) {
       try {
         // 사이트에 대한 서비스 워커를 등록
         const registration = await navigator.serviceWorker.register("/sw.js", {
           // 앱 원본 아래의 모든 콘텐츠를 의미하는 를 지정(default)
           scope: "/",
         });
         if (registration.installing) {
           console.log("Service worker installing");
         } else if (registration.waiting) {
           console.log("Service worker installed");
         } else if (registration.active) {
           console.log("Service worker active");
         }
       } catch (error) {
         console.error(`Registration failed with ${error}`);
       }
     }
   };

   // …

   registerServiceWorker();
   ```

2. 캐시할 파일 목록 작성

   ```js
   [
     "/",
     "/index.html",
     "/style.css",
     "/app.js",
     "/image-list.js",
     "/star-wars-logo.jpg",
     "/gallery/bountyHunters.jpg",
     "/gallery/myLittleVader.jpg",
     "/gallery/snowTroopers.jpg",
   ];
   ```

   - 일반적으로 HTML, CSS, JavaScript, 이미지 등의 정적 리소스

3. Service Worker 설치 및 캐시를 생성

   ```js
   const addResourcesToCache = async (resources) => {
     // 사이트 리소스 캐시의 버전 1이 될 이라는 새캐시를 만든다.
     const cache = await caches.open("v1");
     // 생성된 캐시에서 addAll() 함수를 호출한다.
     await cache.addAll(resources);
   };

   self.addEventListener("install", (event) => {
     //  waitUntil() 내부 코드가 성공적으로 발생할 때까지 서비스 워커가 설치되지 않는다.
     event.waitUntil(
       addResourcesToCache([
         "/",
         "/index.html",
         "/style.css",
         "/app.js",
         "/image-list.js",
         "/star-wars-logo.jpg",
         "/gallery/bountyHunters.jpg",
         "/gallery/myLittleVader.jpg",
         "/gallery/snowTroopers.jpg",
       ])
     );
   });
   ```

4. 네트워크 요청 처리

- 리소스들이 캐시되었으므로 서비스 작업자에게 캐시된 콘텐츠로 작업을 수행하도록 지시해야한다.
- fetch 이벤트로 구현할 수 있다.

  ```js
  const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
    // 일반 네트워크 요청으로 대체
    return fetch(request);
  };

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      // custom content goes here
      // ex.
      cacheFirst({
        request: event.request,
        preloadResponsePromise: event.preloadResponse,
        fallbackUrl: "./gallery/myLittleVader.jpg",
      });
    );

    // or URL이 네트워크 요청의 URL과 일치하는 리소스로 응답 가능
    //   event.respondWith(caches.match(event.request));
  });
  ```

  - service worker에 이벤트 리스너를 연결한 다음, fetch 이벤트에서 respondWith() 메서드를 호출하여 HTTP 응답을 하이재킹하고 자신의 콘텐츠로 업데이트할 수 있다.

- 사용자가 오프라인일 때 애플리케이션을 사용할 수 있을 뿐만 아니라 반복 방문 시 페이지 로드 시간이 빨라진다.

참고

- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
