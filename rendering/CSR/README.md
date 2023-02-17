---
aliases: [CSR, 클라이언트사이드렌더링]
---

## 개요

- 서버는 최소한의 HTML만 렌더링한다.
- 로직, 데이터, 라우팅을 통한 페이지 전환은 모두 클라이언트(브라우저)에서 실행되는 JavaScript에 의해 처리된다.

1. 클라이언트(브라우저)에서 HTML을 서버에 요청 (request)
2. 서버에서 최소한의 뼈대가 되는 HTML를 응답 (response)
   - `script`, `meta`, `link` 등의 태그를 포함하며, **빈 컨텐츠**의 `index.html` 파일
3. 클라이언트(브라우저)에서 HTML 파싱(구문분석)을 진행하다`<script>` 태그를 만나면, 파싱을 멈춘 후 내부 JS 코드를 실행하거나 `src` attribute에 정의된 JS파일을 서버에 요청하여 로드하게 된다.
4. JS 코드를 로드, 파싱, 실행을 하게된다. 실행 시 DOM들을 트리에 동적으로 추가하는 로직들을 통해 UI가 그려지게된다.

## 구현

1. JS를 통해 DOM을 동적으로 추가할 수 있는 엘리먼트가 포함된 뼈대 HTML파일

```html
<html>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
    // 도는 defer 속성
  </body>
</html>
```

2. DOM method와 api를 통해 데이터, ui를 동적으로 렌더링하는 JS파일을 통해 UI를 생성한다.

```js
const root = document.getElementById("root");

// DOM manipulation
root.appendChild(...)
```

## 성능

- [[TTFB]]: 초기 HTML에는 최소한의 뼈대만 포함되어있으므로, 빠르다👍
- [[FCP]]: 텍스트나 이미지가 출력되기시작하는 순간은 JavaScript 번들이 콘텐츠를 다운로드, 파싱 및 실행한 후에 가능
- [[LCP]]: 큰 이미지 및 비디오가 없는 경우, [[FCP]]와 동시에 발생 가능
- [[TTI]]: HTML이 렌더링 된 이후, JS가 다운로드, 파싱 및 실행되어 이벤트 핸들러를 요소에 바인딩한 후 발생 가능

## 장점 👍

1. 즉시 UI interactive가 가능

   - [[FCP]]와 [[TTI]]가 동일한 시점에 이뤄지기 때문에, 렌더링된 콘텐츠는 즉시 interactive 가능하다.

2. 매끄러운 UI

   - 페이지 새로고침을 하지않고, 부분적인 UI 업데이트가 가능하다.

3. 단일 서버 왕복
   - 전체 웹앱에 필요한 JS가 첫번째 요청에서 다운도르 된다. (code splitting이 없다는 가정)
     - 라우팅 시 페이지 렌더를 위해 서버에 새로운 요청 생성이나 서버에서 별도의 처리 X

## 단점 👎

1. js 번들 크기

   - 여러 페이지를 포함하고 기능이 커질 수록, JS 번들이 비례하여 커진다.
   - 브라우저가 처음 컨텐츠를 렌더링 할 때 JavaScript를 로드하고 처리한 이후 [[FCP]]가 시작되므로, 빈 페이지를 보는 시간이 늘어난다.

2. SEO
   - 큰 번들과 많은 api 요청은 웹 크롤러가 색인을 생성할 수 있을 만큼 콘텐츠가 빠르게 렌더링 되지 않을 수 있다.

## 성능 개선을 위해 시도해보기

### 번들크기 관리

- minified되고 gzipped되었을 때 최소 ==100~170KB== 정도로 잡기
- 그 외의 코드들은 필요에 따라 로드하도록 구성해야함

### 프리로딩

```jsx
<link rel="preload" as="script" href="critical.js">
```

    - 브라우저는 미리 로드된 리소스를 캐시하므로 필요 시 즉시 사용할 수 있다.

![[Pasted image 20230217102406.png]] - Pacifico 글꼴은 [`@font-face`](https://web.dev/reduce-webfont-size/#defining-a-font-family-with-@font-face)) 규칙을 사용하여 스타일시트에 지정됩니다. 브라우저는 스타일시트 다운로드 및 구문 분석을 완료한 이후에만 글꼴 파일을 로드한다.
![[Pasted image 20230217102644.png]] - 해당 리소스를 preload하면, 브라우저에서 로드 우선순위를 지정하여 미리 로드가 가능하다.

### 지연로딩

- 이미지는 대부분의 웹사이트에서 가장 많이 요청되는 assets이며 일반적으로 다른 리소스보다 더 많은 대역폭을 차지한다.
- 해당 이미지 리소스를 필요할 때 로드하도록 지연시킬 수 있다.
  - [Intersection Observer API](https://developer.chrome.com/blog/intersectionobserver/) 사용
  - `scroll`, `resize` 또는 `orientationchange` [이벤트 핸들러](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/#using_event_handlers_the_most_compatible_way) 사용
  - <img loading=lazy> `<img loading=lazy>`사용 (WebKit(Safari) 구현은 [진행 중](https://bugs.webkit.org/show_bug.cgi?id=200764))

### 코드 스플리팅

- Webpack과 같은 모듈 번들러에 의해 지원되며 동적으로 로드 가능한 여러 번들을 만들어 낼 수 있다.

### 서비스워커를 이용한 앱 쉘 캐싱

- 앱내 최소한의 UI를 구성하는 HTML, CSS, JavaScript를 캐싱하는 것
- 서비스 워커를 이용하면 오프라인에서도 이 캐시를 이용할 수 있다.
- 껍데기 UI는 미리 보이고, 나머지 필요 데이터는 점진적으로 불러올 수 있어 네이티브 앱을 이용하는것과 비슷한 사용자 경험을 제공할 수 있다.

## 관련 아티클

- [중요한 자산을 미리 로드하여 로딩 속도 향상](https://web.dev/i18n/ko/preload-critical-assets/)
- [웹용 브라우저 수준 이미지 지연 로딩](https://web.dev/i18n/ko/browser-level-image-lazy-loading/)
- [Service worker를 사용해 PWA를 오프라인에서 동작하게 만들기](https://developer.mozilla.org/ko/docs/Web/Progressive_web_apps/Offline_Service_workers)
- [서비스 워커 캐싱 및 HTTP 캐싱](https://web.dev/i18n/ko/service-worker-caching-and-http-caching/)
- 브라우저는 어떻게 동작하는가? https://d2.naver.com/helloworld/59361
