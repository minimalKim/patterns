# Provider pattern

## 요약

- 여러 개의 자식 컴포넌트에서 데이터를 사용할 수 있게 한다.

## 구현

- src 디렉토리 참고
- 주로 컴포넌트 트리 내 여러 레벨에 있는 다수의 컴포넌트에 주어야 할 때 사용
  ex) theme, data cache

## 장점

- prop drilling의 발생을 방지 할 수 있다.
  -> 애플리케이션이 커질 때 값 수정에 용이

## 단점

- 컨텍스트를 참조하는 모든 컴포넌트는 컨텍스트가 변경 될 시 모두 리렌더링 된다.
  -> 어떤 컴포넌트가 어떤 컨텍스트를 소비하는지 주의하지 않으면 성능 문제가 발생
  -> 사용되는 데이터를 가진 provider 별로 분리가 필요

- context provider를 사용하는 특정 레이어를 지정하지 않는 이상, 어느 곳에서 상태 주입을 하였는지 파악하기 힘들어 질 위험이 있다.

## 사용하기 전 고려할 것

- 컴포넌트 합성(composition)으로 해결되는 문제인가?
  - drilling이 발생하는 props들이 특정 컴포넌트로 분리가 가능한 경우

## Context API vs Redux

### 상태관리를 이루기 위해 기본적으로 필요한 기능

1. 초기값을 저장 (store의 defaultState)
2. 상태 값을 조회 (store의 state)
3. 상태 값을 업데이트 (dispatch 및 setState)

- context API 단독으로는 상태관리 시스템이 아니며, 상태 주입(injection) 시스템이다. (상태를 전달하기만 함)
- useState, useReducer등의 Hook와 함께 사용할 때, 상태관리 시스템으로써 사용 가능

참고

- https://javascriptpatterns.vercel.app/patterns/react-patterns/provider-pattern
- https://kentcdodds.com/blog/how-to-use-react-context-effectively
- [Why React Context is Not a "State Management" Tool (and Why It Doesn't Replace Redux)](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/)

과제

- https://javascriptpatterns.vercel.app/patterns/react-patterns/provider-pattern#exercise
- 완성: https://stackblitz.com/edit/react-ts-wyd65u?file=components/Listings.tsx
