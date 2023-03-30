# 리소스 로딩 순서 최적화

## Core Web Vitals? Web Vitals?

### Web Vitals

- Google에서 개발한 사용자 경험을 측정하는 웹 성능 지표이다.

- Web Vitals 개선을 통해 웹사이트는 사용자 경험을 향상시키고 검색 엔진 최적화(SEO)을 개선할 수 있다.

- Core Web Vitals 이외의 Web Vitals는 경험의 더 큰 부분을 담당하고, Core Web Vitals를 대체하거나 보완하는 역할을 한다.

  - 로딩속도 측정

    - Time to First Byte(최초 바이트까지의 시간, TTFB)
    - First Contentful Paint(최초 콘텐츠풀 페인트, FCP)
    - LCP와 함께 문제(각각 느린 서버 응답 시간 또는 렌더링 차단 리소스 문제)를 진단하는 데 유용하다.

  - 상호작용(응답성) 측정
    - 총 차단 시간(TBT)
    - Time to Interactive(상호 작용까지의 시간, TTI)
    - FID에 영향을 줄 잠재적인 상호 작용 문제를 파악하고 진단하는 데 필수적이다.
    - 그러나 필드에서 측정할 수 없고 사용자 중심 결과를 반영하지도 않기 때문에 Core Web Vitals 세트에 속하지는 않는다.

- [참고](https://web.dev/vitals/)

### Core Web Vitals

- Web Vitals의 하위 집합으로, 웹 페이지에서 가장 중요한 사용자 경험 측정 지표를 나타낸다.
- Lighthouse 또는 Web Vitals Chrome 확장 프로그램 등으로 측정 가능하다.

![img](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg)

- 웹사이트의 **로딩 속도**, **상호작용(응답성)**, **안정성**을 측정한다.

- 아래 세 가지 주요 성능 지표로 구성된다.

  - LCP: 뷰포트에서 가장 큰 콘텐츠 요소가 표시되는 시점
    - 로딩 성능을 측정한다. (스크롤 없이 볼 수 있는 부분)
    - 우수한 사용자 경험을 제공하려면 페이지가 처음으로 로딩된 후 2.5초 이내에 LCP가 발생해야 한다.
    - hero Image가 로드되지 않으면 계속 늘어질 것이다.
    - 해당 값 측정 시, 페이지 상호 작용이 바로 가능해져야 하기 때문에(FID) 자바스크립트들이 모두 다운로드되고 분석되고 준비가 되어 있거나 혹은 이미 실행되어 있어야 한다.

  ![img](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg)

  - FID: 최초 입력 지연
    - 응답성을 측정한다.
    - 사용자가 웹페이지에서 첫 상호작용을 할 때 웹사이트가 반응하는 속도이다.
    - 우수한 사용자 경험을 제공하려면 페이지의 FID가 100밀리초 이하여야 한다.

  ![img](https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg)

  - CLS: 시각적 안정성을 측정
    - 사용자가 웹페이지에서 스크롤 하다 클릭 시, 마지막 순가에 레이아웃이 변동되어 원치 않는 부분을 클릭 하는 경우
    - 우수한 사용자 경험을 제공하려면 페이지에서 0.1 이하의 CLS를 유지해야 함 (0에 가까울 수록 좋음)

## User-Centric Performance Metrics

Core Web Vitals는 웹 페이지의 세 가지 핵심 성능 지표에 초점을 맞춘 반면, User-centric performance metrics는 사용자가 웹 페이지를 사용하는 동안 경험하는 시간과 관련된 다양한 지표를 측정하며, 두 지표 모두 웹 페이지의 전반적인 성능을 개선하는 데 도움이 된다.

[참고](https://web.dev/user-centric-performance-metrics/)

## 리소스 순서 처리

- 이러한 지표들을 잘 최적화하기 위해서는 각 지표들과 연관된 각기 다른 리소스들이 어떤 관계를 갖는지를 잘 이해해야한다.
  - ex. FCP, LCP, FID는 나열된 순서대로 측정되므로, 각 지표 달성을 위한 리소스들 역시 순서대로 제공되어야 한다.
    - 1. FCP측정 시. 뒤 이어 LCP가 측정되기 위해 hero image가 사용가능하도록 준비되어 있어야 한다.
    - 2. LCP측정 시. 페이지 상호 작용이 바로 가능해져야 하기 때문에(FID) 자바스크립트들이 모두 다운로드되고 분석되고 준비가 되어 있거나 혹은 이미 실행되어 있어야 한다.

## 리소스 별 최적화

- 리소스 순서를 최적화하려면 서빙되는 리소스 자체도 최적으로 제공되어 빠르게 로드될 수 있도록 해야 한다.
- 중요한 CSS는 인라인되어야 하며. 이미지들은 적합한 사이즈로 리사이즈되어야 하고 JS는 코드 스플리팅이 적용되어 점진적으로 클라이언트에 전달되어야 한다.

### 중요 CSS

- FCP에 필요한 최소 CSS
- 사용자가 접속하였을 때 첫번째로 보게되는 곳을 구성하는 CSS
- 별도의 파일로 포함되기 보다 HTML 자체에 인라인으로 포함되는것이 좋다.
- 해당 라우팅 경로에 필요한 CSS에 대해서 주어진 시간 안에 다운로드되어야 하며. 중요 CSS들은 모두 올바르게 분리가 되어 있어야 한다.

- 인라이닝이 불가한 경우 중요 CSS들은 문서 다운로드와 동시에 preload되어 서빙될 수도 있다.
- CSS를 받아오는 데 지연이 생기거나 잘못된 순서로 CSS를 받아올 경우 FCP와 LCP에 영향을 줄 수 있다. 이런 상황을 예방하기 위해 인라이닝 되지 않은 CSS들은 우선순위가 부여되어야 하며 퍼스트 파티 JS, ATF 이미지들보다 먼저 로드되도록 조정해야 한다.

- HTTP/2에선 크리티컬 CSS가 안티 패턴이다.

### 폰트

- 중요 폰트를 위한 CSS역시 인라인처리 되어야 한다.
- 인라이닝이 어려울 경우 스크립트는 preconnect처리되어 로드되어야 한다.

  - 구글 폰트와 같은 외부 도메인에서 로드하여 지연이 발생하는 경우 FCP에 악영향을 미친다.
  - Preconnect는 브라우저에게 이런 리소스들을 받기 위한 연결을 먼저 시도하도록 할 수 있다.

- 폰트 인라이닝 역시 HTML을 크게 만들어 초기화를 지연시키고 다른 중요 리소스의 다운로드를 방해할 수 있다.

- [폰트 폴백 처리](https://css-tricks.com/css-basics-fallback-font-stacks-robust-web-typography/)를 통해 FCP를 방해하지 않고 텍스트를 바로 볼 수 있도록 할 수도 있다.
  - 폰트가 로드되기 전과 로드 후의 레이아웃이 틀어져 CLS를 유발할 수 있다.

#### 참고

- [중요 CSS 추출](https://web.dev/i18n/ko/extract-critical-css/)

  ![img](https://web-dev.imgix.net/image/admin/RVU3OphqtjlkrlAtKLEn.png?auto=format&w=845)

  - 인라인 중요 CSS 예시

  ![img](https://web-dev.imgix.net/image/admin/NdQz49RVgdHoh3Fff0yr.png?auto=format&w=845)

  - 위는 3G 연결에서 렌더링 차단 CSS가 있는 페이지(상단)와 인라인 중요 CSS가 있는 동일한 페이지(하단) 로드 비교한 사진이다.
  - FCP(First Contentful Paint)가 불량하고 Lighthouse 감사에서 "렌더링 차단 리소스 제거" 기회가 표시되는 경우 중요 CSS를 사용하는 것이 좋다.

- [HTTP/2 Push와의 비교](https://www.bronco.co.uk/our-ideas/should-i-combine-http-2-push-and-inline-critical-css/)

  - HTTP/2 푸시는 HTML을 구문 분석할 때 자산을 요청하는 브라우저보다 먼저 자산을 브라우저에 자동으로 푸시할 수 있는 기능이다.
  - 사전 로드를 사용하는 것과 비슷하지만 훨씬 빠르다.
  - HTTP2를 지원하는 서버가 필요하다.
  - HTTP2/Push를 사용할 수 있는 경우, Critical CSS를 사용하였을때보다 속도가 빠르므로, Critical CSS을 사용할 필요가 없다

#### 관련 라이브러리

- [Critical](https://github.com/addyosmani/critical)
  - 스크롤 없이 볼 수 있는 CSS를 추출, 축소 및 인라인하며 npm 모듈로 사용할 수 있다.
  - 여러 화면 해상도에 대해 중요 CSS 추출을 지원한다.

### ATF(Above the Fold) 이미지

- 뷰포트 내에 존재하여 페이지 로드 시 사용자에게 처음 표시되는 이미지 (ex.hero image)

- 모든 ATF이미지들은 크기가 명시되어 있어야 한다.
  - 그렇지 않으면 렌더링될 때 레이아웃의 변경이 일어나기 때문에 CLS에 악영향을 준다.
  - placeholder의 크기와 로드된 이미지의 크기가 다를 경우 교체되는 과정에서 LCP가 다시 트리거 될 수 있다

### BTF(Below the Fold) 이미지들

- 페이지 로드 직후 뷰포트에 보여지지 않는 이미지
- lazy loading을 적용하여 1P JS나 페이지 내에 중요하게 사용되는 3P 스크립트가 로드되는것을 방해하지 않도록 한다.
  - 만약 BTF이미지가 1P JS나 중요한 3P 리소스보다 일찍 로드될 경우 FID가 지연될 수 있다.

### 1P JavaScript

- 앱의 상호작용이 준비되는것에 관련 된다.
- **1P JS들은 ATF이미지의 전에 로드되어야 하며, 3P JS보다 먼저 메인스레드에서 실행되어야 한다.**
  - 서버 렌더링 환경에서 1P JS는 FCP 나 LCP자체를 방해하지 않는다.

### 3P JavaScript

- HTML의 <head> 에 동기적으로 포함된 3P스크립트는 CSS 및 폰트 파싱을 블록하여 FCP에 악영향을 준다.
  - 또한 HTML본문의 파싱을 지연시킨다. --> 유의하여 처리하여야한다.

---

## 크롬이 다양한 리소스를 로드할 때 적용되는 우선순위

<table>
<thead>
<tr>
<th></th>
<th>레이아웃 차단</th>
<th>레이아웃 차단 단계에서 로드</th>
<th>@cols=3:레이아웃 차단 단계에서 한 번에 하나씩 로드</th>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Blink 우선순위</strong></td>
<td><strong>매우 높음</strong></td>
<td><strong>높음</strong></td>
<td><strong>중간</strong></td>
<td><strong>낮음</strong></td>
<td><strong>매우 낮음</strong></td>
</tr>
<tr>
<td><strong>개발자 도구 우선순위</strong></td>
<td><strong>가장 높음</strong></td>
<td><strong>높음</strong></td>
<td><strong>중간</strong></td>
<td><strong>낮음</strong></td>
<td><strong>가장 낮음</strong></td>
</tr>
<tr>
<td></td>
<td>주요 리소스</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td>CSS*** (조기**)</td>
<td></td>
<td>CSS*** (지연**)</td>
<td></td>
<td>CSS (불일치)</td>
</tr>
<tr>
<td></td>
<td></td>
<td>스크립트 (조기** 또는 프리로드 스캐너가 아닐 때)</td>
<td>스크립트 (**지연)</td>
<td>스크립트 (비동기)</td>
<td></td>
</tr>
<tr>
<td></td>
<td>폰트</td>
<td>폰트 (preload)</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>import</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>이미지 (뷰포트 내)</td>
<td></td>
<td>이미지</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td>미디어</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td>SVG 문서</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td>prefetch</td>
</tr>
<tr>
<td></td>
<td></td>
<td>preload*</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>XSL</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td>XHR (동기)</td>
<td>XHR/fetch* (비동기)</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td>favicon</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

\* "as"를 사용하는 preload 또는 "type"을 사용하는 fetch는 요청하는 유형의 우선순위를 사용한다 (예: preload as="stylesheet"는 가장 높은 우선순위를 사용함). "as"가 없으면 XHR처럼 동작한다.

\*\* "조기"는 preload 되지 않은 이미지가 요청되기 전에 요청되는 것으로 정의된다. ("지연"은 이후)

\*\*\* 미디어 유형이 일치하지 않는 CSS는 preload 스캐너에서 가져오지 않고 주요 파서가 해당 구문에 접근할 때만 처리가 된다. 이는 일반적으로 매우 늦게 가져오므로 "지연" 우선순위를 의미한다.

- CSS와 폰트들은 가장 높은 우선순위를 갖는다. 이는 중요 CSS와 폰트를 우선순위 처리하는데 도움이 된다.
- 스크립트는 문서에서 어느 위치에 포함되었는지 그리고 async, defer, blocking(일반적인 스크립트 포함 방법) 적용 여부에 따라 다른 우선 순위를 갖는다. 첫 번째 이미지(또는 문서의 초기 이미지) 전에 요청된 Blocking스크립트는 첫 번째 이미지 다음에 요청된 Blocking스크립트보다 높은 우선순위를 갖는다. async, defer, injected 스크립트는 문서의 어디에 포함되던 가장 낮은 순위를 갖는다. 따라서 async, defer 속성을 적절히 사용하여 여러 스크립트간의 우선순위를 지정할 수 있다.
- 뷰포트에 표시되는 이미지는 뷰포트에 보이지 않는 이미지보다 우선순위가 높다. 이는 BTF이미지보다 ATF에 우선순위를 두는 것에 도움이 된다.

## 이상적인 리소스 로딩 순서

### 1. 3P 가 없는 경우

#### 개선 전 로딩 순서

<table>
<thead>
<tr>
<th>브라우저 메인스레드 이벤트 순서</th>
<th></th>
<th>리소스의 네트워크 요청 순서</th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>HTML을 파싱함</td>
<td>인라이닝 처리된 작은 1P 스크립트</td>
<td>1</td>
</tr>
<tr>
<td>2</td>
<td>인라이닝 처리된 작은 1P 스크립트 실행</td>
<td>인라이닝된 중요 CSS (외부 리소스일 경우 Preload)</td>
<td>2</td>
</tr>
<tr>
<td></td>
<td></td>
<td>인라이닝된 중요 폰트 (외부 리소스일 경우 Preconnect)</td>
<td>3</td>
</tr>
<tr>
<td>3</td>
<td>FCP 리소스들을 파싱함 (중요 CSS, 폰트)</td>
<td>LCP 이미지 (외부 리소스일 경우 Preconnect)</td>
<td>4</td>
</tr>
<tr>
<td><strong>First Contentful Paint (FCP)</strong></td>
<td></td>
<td>폰트들 (인라이닝 된 폰트 CSS로부터 (Preconnect))</td>
<td>5</td>
</tr>
<tr>
<td>4</td>
<td>LCP 리소스를 렌더함 (Hero image, text)</td>
<td>중요하지 않은 (async) CSS</td>
<td>6</td>
</tr>
<tr>
<td></td>
<td></td>
<td>상호작용을 위한 1P JS들</td>
<td>7</td>
</tr>
<tr>
<td></td>
<td></td>
<td>ATF 이미지들 (Preconnect)</td>
<td>8</td>
</tr>
<tr>
<td><strong>Largest Contentful Paint (LCP)</strong></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>BTF 이미지들</td>
<td>9</td>
</tr>
<tr>
<td>5</td>
<td>중요한 ATF 이미지를 렌더함</td>
<td></td>
<td></td>
</tr>
<tr>
<td><strong>화면이 완성되어 보여짐</strong></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>6</td>
<td>중요하지 않은 (async) CSS 를 파싱함</td>
<td></td>
<td></td>
</tr>
<tr>
<td>7</td>
<td>1P JS 실행하고 hydration 처리</td>
<td>지연로딩되는 JS 코드들</td>
<td>10&nbsp;</td>
</tr>
<tr>
<td><strong>First Input Delay (FID)</strong></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

#### 참고

- https://web.dev/learn-core-web-vitals/
- https://yceffort.kr/2021/09/critical-request-and-prioritise-requests
- https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit#heading=h.ua1godj1atee
- https://web.dev/priority-hints/
