---
aliases: [SSG, 서버사이드렌더링]
---

## 개요

- HTML 콘텐츠가 서버에서 **빌드 시점**에 미리 생성
  - 사용자가 접속할 수 있는 각 라우팅 경로에 대응하는 HTML 파일을 미리 생성, 제공
- 특정 사용자에 따라 UI 변경이 없는 정적컨텐츠에 적합 - ex. 블로그, 커머스 상품페이지

## 성능

- 빠른 FCP, TTI
- [[TTFB]]: 초기에 HTML은 빌드 시 이미 생성되어있기 때문에 빠른편
- [[FCP]]: HTML이 파싱 및 렌더링 되면 발생
  -  [[Client Side Rendering|CSR]]과 다르게 JS 파싱 완료 이전에 기본 컨텐츠를 볼 수 있다. 👍
- [[LCP]]: 큰 이미지 및 비디오가 없는 경우, [[FCP]]와 동시에 발생 가능
- [[TTI]]: HTML이 렌더링 된 이후, JS가 다운로드, 파싱 및 실행되어 이벤트 핸들러를 요소에 바인딩한 후 발생 가능
  - JS의 크기를 줄일 수록[[FCP]]와 [[TTI]]의 갭을 줄일 수 있다. (인터렉트 가능 시간 줄이기)

## 장점 👍

1. 캐시 가능
   - 미리 렌더링된 HTML 파일을 CDN에서 제공하도록 할 수 있다.
   - 요청이 원본 서버까지 갈 필요가 없음
2. 가용성
   - 서버에서 따로 백엔드 API나 DB에 접근 할 필요가 없으므로, 다운되더라도 기존에 생성된 페이지 파일을 사용할 수 있다.

## 단점 👎

1. 동적 데이터
   - 컨텐츠가 변경될 때 마다 매번 새로 빌드해야 하며, 컨텐츠 변경 이후 배포하지 않으면 이전 컨텐츠가 계속 보여지는 이슈가 발생할 수 있다. (-> ISG로 어느정도 해결)

## 구현 (Next.js)

### 동적 데이터

#### 1. 빌드 시 동적 데이터 가져오기

- 상품 개별 페이지는  `/products/101`, `/products/102`, `/products/103` 등으로 접근할 수 있다.
  - Next.js의 `getStaticPath()` 를 동적 라우팅과 조합하여 사용할 수 있다.

```jsx
// pages/products/[id].js

// getStaticPaths()에서 빌드 시 사전 렌더링하려는 제품 페이지(/products/[id])의 ID 목록을 반환해야 한다.
// 우선 데이터베이스에서 모든 제품 리스트를 가져와야 한다.
export async function getStaticPaths() {
  const products = await getProductsFromDatabase();

  const paths = products.map((product) => ({
    params: { id: product.id },
  }));

  // fallback: false는 올바른 ID가 없는 페이지가 404임을 의미한다.
  return { paths, fallback: false };
}

// 매개변수에는 생성된 각 페이지의 ID가 포함된다.
export async function getStaticProps({ params }) {
  return {
    props: {
      product: await getProductFromDatabase(params.id),
    },
  };
}

export default function Product({ product }) {
  // Render product
}
```

- getStaticPaths와 getStaticProps는 빌드 시 서버측에서 실행되어 가져온 데이터가 포함된 HTML을 생성한다.

##### 장점

- 정적으로 콘텐츠 생성 -> 캐시가능, SEO, 고가용성 등
- 빌드시 동적으로 데이터 갱신 가능

##### 단점

- 콘텐츠 업데이트 필요 시 웹사이트를 재빌드 및 재배포 해야함
- 동적 데이터가 많을 경우, 빌드시간이 길어질 수 있음

#### 2. 클라이언트에서 동적 데이터 가져오기

```jsx
import useSWR from "swr";
import { Listings, ListingsSkeleton } from "../components";

export default function Home() {
  const { data, loading } = useSWR("/api/listings", (...args) =>
    fetch(...args).then((res) => res.json())
  );

  if (loading) {
    return <ListingsSkeleton />;
  }

  return <Listings listings={data.listings} />;
}
```

- 스켈레톤 및 기본 데이터를 SSG 방식으로 사용하는 방식

##### 장점

- 정적으로 콘텐츠 생성 -> 캐시가능, SEO, 고가용성 등
- 클라이언트에서 동적으로 데이터 갱신 가능

##### 단점

- 모든 페이지 로드에서 데이터가 요청되므로 1번보다 서버 비용이 증가될 수 있음
