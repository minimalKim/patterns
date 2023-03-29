---
aliases:
  [ISG, ISR, Incremental Static Regeneration, 점진적(증분) 정적 사이트 렌더링]
---

## 배경

- 기존 [[Static Rendering|SSG]]은 렌더링할 컨텐츠가 동적이거나, 자주 변경되는 경우 전체페이지를 다시 빌드하는 것이 비효율적이다.

## 개요

- ISG는 사용자가 요청할 가능성이 높은 페이지들만 미리 렌더링하고, 나머지는 주문형(on-demand)으로 렌더링이 가능하다.
  - 사용자가 pre-rendering 되지 않은 페이지를 요청하면 페이지가 서버에서 렌더링 된 후 CDN에의해 캐시가 가능하다. #LS

## 구현

- `getStaticProps`에 `revalidate` 프로퍼티를 추가하면 된다.

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

// 해당 함수는 서버에서 빌드 시 호출된다.
// (만일 유효성 재검사가 활성화되고 새 요청이 들어오는 경우 서버리스 함수에서 다시 호출될 수 있음)
export async function getStaticProps() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  return {
    props: {
      posts,
    },
    // Next.js 는 페이지 재생성을 시도한다.
    // - 설정한 주기마다 데이터의 갱신여부를 검사하고 업데이트된 데이터로 페이지를 다시 정적으로 생성한다.
    revalidate: 10, // 10초 후
  };
}

// 해당 함수도 서버에서 빌드 시 호출된다.
// (경로가 생성되지 않은 경우 서버리스 함수에서 다시 호출될 수 있음)
export async function getStaticPaths() {
  const res = await fetch("https://.../posts");
  const posts = await res.json();

  // 게시물을 기반으로 미리 렌더링하려는 경로를 가져온다.
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // 빌드 시 아래 경로만 미리 렌더링합니다.
  // { fallback: 'blocking' }은 경로가 존재하지 않는 경우 필요에 따라 서버에서 페이지를 렌더링한다.
  return { paths, fallback: "blocking" };
}

export default Blog;
```

## 성능

- **TTFB** : 초기 HTML에 큰 구성 요소가 포함되어 있지 않기 때문에 Time To First Byte가 빠른 편
- **FCP**: HTML이 파싱 및 렌더링되면 발생
- **LCP**: 큰 이미지나 비디오와 같은 큰 구성 요소가 없는 경우 첫 번째 콘텐츠 페인트와 동시에 발생 가능
- **TTI**:  HTML이 렌더링되고 JavaScript 번들이 다운로드, 파싱 및 실행 후 이벤트 핸들러를 구성 요소에 바인딩한 후에 발생

## 참고

- https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
- https://merrily-code.tistory.com/173
- https://arunoda.me/blog/what-is-nextjs-issg
