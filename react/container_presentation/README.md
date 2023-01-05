# Container / Presentation

## 요약

- 비즈니스 로직과 View를 분리하여 관심사의 분리(SoC)를 강제한다

## 구성

### 1. Presentational Components

- 데이터가 화면에 어떻게 보여지는 지에만 관심이 있다.
  - 자체 state가 있는 경우가 드물거나, View에 관련된 상태만을 갖는다.
  - props를 통해서만 데이터, callback를 받는다.
  - 종종 props.children을 통해 조합이 가능하다.
- 상태 관리, API 호출, 라우팅 등 앱에서 담당하는 부분에 종속성을 가지고 있지 않다. (non-side-effect)

### 2. Container Component

- 데이터가 어떻게 동작하는지에만 관심이 있다. (주로 비즈니스 관련 로직을 다룬다.)
  - 일반적으로 일부 래핑 div를 제외하고 자체 DOM 마크업이 없으며 스타일이 없다.
  - 주로 데이터들의 소스로 사용되므로 자체 상태를 가진다.
- 상태 관리, API 호출, 라우팅 등에 접근하는 로직을 가진다. (side-effect)
- Presentational 컴포넌트 또는 다른 Container 컴포넌트에 데이터, callback를 전달하는 역할을 한다.

## 구현

```jsx
import React, { useState, useEffect } from "react";
import { LoadingListings, Listing, ListingsGrid } from "../components";

function ListingsContainerComponent() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch("https://my.cms.com/listings")
      .then((res) => res.json())
      .then((res) => setListings(res.listings));
  }, []);

  return <Listings listings={listings} />;
}

function ListingsPresentationalComponent(props) {
  if (props.listings.length === 0) {
    return <LoadingListings />;
  }

  return (
    <ListingsGrid>
      {listings.map((listing) => (
        <Listing listing={listing} />
      ))}
    </ListingsGrid>
  );
}
```

## 장점

1. 관심사의 분리(SoC)
2. 재사용성

   - Presentational 컴포넌트는 side-effect에 대한 직접적인 종속성이 없으므로, 재사용에 용이하다.

3. 유연성

   - Presentational 컴포넌트는 비즈니스 로직과 분리되어있으므로, 해당 비즈니스에 대한 이해도가 낮은 사람도 쉽게 이해할 수있다.

4. 테스팅
   - Presentational 컴포넌트는 순수 함수처럼 동작하기 때문에, 테스트를 하기 쉽다.

## 단점

1. 로직의 재사용이 가능한 react hooks와 달리, Container 컴포넌트의 재사용은 불가능하다.

   -> Container 기능만을 위한 컴포넌트를 생성하는 것이 아닌, 특정 계층에서 Container 기능을 수행하는 방법?

2. 과잉 사용 시 래퍼 지옥(wrapper hell)을 야기할 수 있다.

## React Hooks VS Container/Presentational Component

- 서로가 서로를 대체하지는 않는다 (역할과 장점이 명확하다.)
  - React Hooks는 로직의 재사용성, Container/Presentational Component는 Presentational 컴포넌트의 재사용성
- 둘의 장점을 사용하기 위한 라이브러리: react-hooks-compose

## 질문

1.  React Hooks와 Container/Presentational Component는 서로를 대체한다?

참고

- https://javascriptpatterns.vercel.app/patterns/react-patterns/conpres
- https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
- https://yujonglee.com/socwithhooks.html
- https://dev.to/ornio/container-view-pattern-in-react-inc-hooks-5404
- https://www.zerocho.com/category/React/post/57e1428c11a9b10015e803aa
