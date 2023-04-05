# Import On Interaction

## 개요

- 중요하지 않은 리소스는 사용자의 상호작용에 따라 필요해질 때 로드하도록 한다.

## 목적

- 즉시 필요하지 않는 코드들을 분리한다.
  - 서드파티 js 등 해당 js파일의 파싱 및 실행 비용이 큰 경우 메인 스레드를 블록 할 수 있다.
    - 가능하다면 3P(서드파티) 스크립트는 async나 defer (또는 다른 방법들)을 활용하여 1P(퍼스트파티) 코드들이 로드되는것을 방해하지 않도록 하는 것을 권장한다.
    - 해당 3P(서드파티) 스크립트가 중요할 시, 지연 로딩 패턴을 적용하는 것을 추천한다.
  - 해당 스레드 블록으로인해 FID나 TTI를 지연시킬 수 있다.

## 예시

### 리소스를 로드하는 시점들

1. 유저가 컴포넌트에 처음 클릭했을 때
2. 스크롤하여 컴포넌트가 뷰포트에 들어왔을 때(Import on Visibility)
3. requestIdleCallback을 통해 브라우저 프로세스가 쉬고 있는 상태일 때

### 리소스를 로드하는 방법들

1. Eager - 리소스를 즉시 불러옴 (스크립트를 불러오는 일반적인 방법)
2. Lazy (Route-based) - 특정 경로를 탐색할 때 로드한다
3. Lazy (On interaction) - 사용자가 UI를 클릭했을 때 불러온다 (예를 들면 "채팅 시작하기")

   - ex. Google Docs 공유하기 버튼 클릭 까지 스크립트를 지연시킴

4. Lazy (In viewport) - 사용자가 스크롤을 움직여 컴포넌트가 뷰포트에 들어올 때 로드한다
5. Prefetch - 우선순위를 높여 로드하되, 중요한 리소스보다는 늦게 로드되도록 한다
6. Preload - 중요 리소스로 지정하여 즉시 받도록 한다

### 파사드UI

- 실제 컴포넌트의 기본 동작만을 구현한 경량 컴포넌트 혹은 더 단순하게 스크린샷을 쓰는 단순한 "프리뷰" 혹은 "플레이스홀더" ui를 의미한다.

- 유저가 "프리뷰"(파사드 UI) 를 클릭할 때 코드를 포함한 리소스를 불러오기 시작한다.

#### 파사드UI 예시

- [YouTube Lite Embed](https://github.com/paulirish/lite-youtube-embed)

  - 해당 라이브러리는 YouTube 비디오 ID를 받아 최소한의 썸네일과 플레이 버튼을 렌더하는 커스텀 엘리먼트를 제공한다.
  - 엘리먼트를 클릭하면 YouTube의 임베드 코드를 그때서야 로드하기 시작하고. 이는 사용자가 플레이버튼을 누르지 않으면 불필요한 리소스 비용을 소비하지 않아도 된다.

- 인증

  - 클라이언트 사이드 JavaScript SDK를 이용하여 인증을 지원해야 하는 경우
  - 사용자가 로그인 페이지에 진입하지 않아도 이를 로드하게 하면 무거운 JS를 다운받게 되며 그에 따른 비용이 사용된다.
  - 로그인 버튼을 누를 때 다운로드 받게 하여 메인 스레드를 블록하지 않도록 가능하다.

- [채팅 위젯(Calibre)](https://calibreapp.com/blog/fast-live-chat)

  - HTML과 CSS만 포함한 "가짜" 라이브 챗 버튼을 구현하였고 이를 클릭하면 고객상담 채팅 번들을 다운로드하도록 구현

## 구현

### in Vanilla JS

1. 동적 import() 사용하기

```js
const btn = document.querySelector("button");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  import("lodash.sortby")
    .then((module) => module.default)
    .then(sortInput()) // use the imported dependency
    .catch((err) => {
      console.log(err);
    });
});
```

- [dynamic import()](https://v8.dev/features/dynamic-import)를 사용하면 모듈을 지연로딩할 수 있으며 프로미스를 반환한다.

#### 동적 import()

2. 스크립트 태그 자체를 동적으로 페이지에 포함하기 (???)

```js
const loginBtn = document.querySelector("#login");

loginBtn.addEventListener("click", () => {
  const loader = new scriptLoader();
  loader
    .load(["//apis.google.com/js/client:platform.js?onload=showLoginScreen"])
    .then(({ length }) => {
      console.log(`${length} scripts loaded!`);
    });
});
```

### React

- 페이지 진입과 동시에 모든 컴포넌트를 로드할 수 있다.

```jsx
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import EmojiPicker from './EmojiPicker';

const Channel = () => {
  ...
  return (
    <div>
      <MessageList />
      <MessageInput />
      {emojiPickerOpen && <EmojiPicker />}
    </div>
  );
};
```

- React.lazy와 Suspense를 통해 코드스플리팅 및 지연 로딩

```jsx
import React, { lazy, Suspense } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const EmojiPicker = lazy(
  () => import('./EmojiPicker')
);

const Channel = () => {
  ...
  return (
    <div>
      <MessageList />
      <MessageInput />
      {emojiPickerOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <EmojiPicker />
        </Suspense>
      )}
    </div>
  );
};
```

- 특정 컴포넌트 클릭 시 지연 로드
  - <MessageInput>이 클릭되었을 때 <EmojiPicker>가 로드

```jsx
import React, { useState, createElement } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ErrorBoundary from "./ErrorBoundary";

const Channel = () => {
  const [emojiPickerEl, setEmojiPickerEl] = useState(null);

  const openEmojiPicker = () => {
    import(/* webpackChunkName: "emoji-picker" */ "./EmojiPicker")
      .then((module) => module.default)
      .then((emojiPicker) => {
        setEmojiPickerEl(createElement(emojiPicker));
      });
  };

  const closeEmojiPickerHandler = () => {
    setEmojiPickerEl(null);
  };

  return (
    <ErrorBoundary>
      <div>
        <MessageList />
        <MessageInput onClick={openEmojiPicker} />
        {emojiPickerEl}
      </div>
    </ErrorBoundary>
  );
};
```

### Vue

- 컴포넌트를 동적 import하여 사용할 수 있다.
- 특정 컴포넌트 클릭 시 지연 로드

```vue
<template>
  <div>
    <button @click="show = true">Load Emoji Picker</button>
    <div v-if="show">
      <emojipicker></emojipicker>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({ show: false }),
  components: {
    Emojipicker: () => import("./Emojipicker"),
  },
};
</script>
```

- 사용자 인터렉션 발생 시에 로드하도록 하려면 피커의 부모 엘리먼트에 v-if 디렉티브를 사용
- 사용자가 버튼을 클릭하면 조건문의 값을 만족시켜 동적으로 불러온 후 렌더링하도록 하는 것

### Next.js (beta)

지연 로딩 구현시

[참고](https://beta.nextjs.org/docs/optimizing/lazy-loading#example-importing-client-components)

1.  React.lazy()와 Suspense를 사용한다.
2.  `next/dynamic을 사용한다.`

- React.lazy()와 Suspense의 조합이다.

#### 클라이언트 컴포넌트 가져오기

```jsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Client Components:
// Suspense, React.lazy()를 사용하는 경우 클라이언트 구성 요소는 기본적으로 사전 렌더링(SSR)된다.
const ComponentA = dynamic(() => import("../components/A"));
const ComponentB = dynamic(() => import("../components/B"));
// 클라이언트 구성 요소에 대한 사전 렌더링을 비활성화할 수 있다.
const ComponentC = dynamic(() => import("../components/C"), { ssr: false });

export default function ClientComponentExample() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      {/* 즉시 로드하지만 별도의 클라이언트 번들에 있음 */}
      <ComponentA />

      {/* 조건이 충족되는 경우에만 요청 시 로드(인터렉션) */}
      {showMore && <ComponentB />}
      <button onClick={() => setShowMore(!showMore)}>Toggle</button>

      {/* 클라이언트측에서만 로드 */}
      <ComponentC />
    </div>
  );
}
```

#### 서버 컴포넌트 가져오기

```jsx
import dynamic from "next/dynamic";

// Server Component:
const ServerComponent = dynamic(() => import("../components/ServerComponent"));

export default function ServerComponentExample() {
  return (
    <div>
      <ServerComponent />
    </div>
  );
}
```

- 서버 컴포넌트 자체가 아니라 서버 컴포넌트의 하위인 클라이언트 컴포넌트만 지연 로드된다.

### 퍼스트 파티 코드에 상호작용 시 불러오기를 적용하여 점진적 로딩 구현하기

- 해당 패턴은 구글이 항공권 예약이나 사진 앱과 같은 규모가 큰 앱에 적용함

![img](https://patterns-dev-kr.github.io/static/e83e6dd30dddfc3579d0020982c0bd2f/82258/import-on-interaction10.png)

- 장소를 정하기 전 지도 기능 관련 코드는 필요가 없음

![img](https://patterns-dev-kr.github.io/static/31744b8c9a63c13503b3d35834e8570b/b0a17/import-on-interaction11.png)

- CSR로 구현 시 한번의 렌더링을 위해 HTML, JS, CSS를 모두 받아야 하므로, FCP까지 시간이 오래 걸릴 수 있다.

![img](https://patterns-dev-kr.github.io/static/b52df3f363e76a6a943d91d40d848a38/79579/import-on-interaction12.png)

- SSR로 구현 시 FCP시점은 앞당길 수 있으나, TTI와 멀 경우 인터렉션이 안되는 불쾌한 골짜기를 느낄 수 있다.

![img](https://patterns-dev-kr.github.io/static/2bc9075a11255fc1088a5eb1291abf9c/82258/import-on-interaction13.png)

- 실제로 사용자가 원하는 호텔을 찾기 위해 "more filters"를 클릭하면 관련된 코드를 다운로드하기 사작한다.

![img](https://patterns-dev-kr.github.io/static/251b519a893b0fb2004d76665db599d5/8b4c1/import-on-interaction14.png)
사용자가 필요로 하지 않는 여러 기능들은 위한 코드들이 페이지 렌더를 지연시키지 않도록 하도록 한다.

- 최초에는 최소한의 코드만을 다운로드하게 하여 페이지를 빨리 볼 수 있게 한다.
- 사용자의 인터렉션에 적합한 추가 코드를 다운로드하도록 한다.

  - 예시
    - 유휴 시간 이후의 기간
    - 사용자가 관련된 UI, Button 등에 마우스오버 (검색조건 더 보기)
    - 브라우저의 상태 기반 (네트워크 속도, 데이터 세이버 모드 등)

- 라우팅 경로에 따라 코드를 나누는 것처럼 컴포넌트 기준으로 코드를 나누는 것과 같다.

- 코드가 실행되기 전 사용자가 너무 빨리 클릭한 경우에는?
  - [jsAction](https://github.com/google/jsaction)와 같은 경량의 라이브러리를 사용한다.
  - 1. 사용자 인터렉션에 의한 컴포넌트의 다운로드를 트리거한다
  - 2. 사용자 인터렉션을 잘 가지고 있다가 프레임웍이 실행되었을 때 릴레이 해 준다

## 장점

- 필요없는 코드를 분할하고 지연요청하기 때문에, FCP 또는 TTI 시점을 앞당길 수 있다.

## 단점

- 사용자가 클릭 시 스크립트를 다운로드 받는 시간이 오래걸릴 경우 실행까지의 시간이 소요될 수 있다.

  - 중요한 리소스들을 받은 직후 해당 리소스를 prefetch하도록 한다.

- 사용자 인터렉션 없이 없어도 동작해야 하는 경우라면?
  - 기능 요구사항에 따라 트리거 대상이 되는 사용자 인터렉션이 달라질 수 있다.
  - ex) 비디오 플레이어 임베드 예제에서 이 경우 자동 재생 기능: 기존 클릭 에서 스크롤에 따라 지연로딩 하는 등

### import()와 Lazy import의 동작의 차이

- https://plnkr.co/edit/LIUo5wvMsWOj6LOp

- https://stackblitz.com/edit/node-ku9rg2?file=src%2FApp.js

- `lazy(() => import())` 자체로 import가 실행되지 않는다.
