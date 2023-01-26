# render props

## 요약

- JSX 엘리먼트를 리턴하는 함수를 props를 통해 전달하는 패턴

  - props를 통해 컴포넌트를 동적으로 렌더링

## 구현

```jsx
function Component(props) {
  return <div>{props.render(props.value)}</div>;
}

function App() {
  return <Component render={(value) => <h1>{value}</h1> />;
}
```

- 또는 react 에서 children은 props.children를 통해 접근이 가능하므로, 아래와 같이도 작성이 가능하다.

  - 다만, 해당 패턴은 안티패턴이라는 의견이 있으므로 주의 [참고](https://americanexpress.io/faccs-are-an-antipattern/)

```jsx
function Component(props) {
  return (
    <div>
      <props.children value={props.value}></props.children>
    </div>
  );
}

function App() {
  return <Component>{({ value }) => <h1>{value}</h1>}</Component>;
}
```

## 다른 패턴과의 비교

- 아래는 모두 컴포넌트 간 상태 공유 (및 로직 재사용)를 위해 사용된다.

### HOC

#### 단점

```jsx
const MyComponent = ({ x, y }) => {
  // ...
};

export default withMouse(MyComponent);
```

- HOC 패턴은 이름 충돌의 단점을 가진다.

```jsx
export default withMouse(withPage(MyComponent)); // if withMouse and withPage set the same props, there will be clashing issues
```

- 여래개의 HOC로 wrapping 되는 경우, 트리가 깊어진다.
- 어떤 HOC가 어떤 props와 연관이 있는지 파악하기 어렵다.

### render-props

```jsx
const MyComponent = () => {
  return (
    <Mouse>
      {({ x, y }) => {
        // ...
      }}
    </Mouse>
  );
};
```

- Toggle의 props.children이 JSX 엘리먼트를 리턴하는 함수

#### 장점

- 기존 HOC가 가지던 이름 충돌 문제를 해결한다.
- 기존 HOC가 가지던 HOC의 암시적 props 문제를 명시적으로 props를 전달하는 것으로 해결한다.

#### 단점

- 기능의 분리가 컴포넌트로 되어있으므로, 매우 쉽게 중첩된다. (Wrapper Hell)

```jsx
const MyComponent = () => {
  return (
    <Mouse>
      {
        // Mouse 컴포넌트가 x,y 데이터를 가지며, 하위 children에게 x, y를 props로 내려줌
        ({ x, y }) => (
          <Page>
            {({ x: pageX, y: pageY }) => (
              <Connection>
                {({ api }) => {
                  // ...
                }}
              </Connection>
            )}
          </Page>
        )
      }
    </Mouse>
  );
};
```

### hooks

```jsx
const MyComponent = () => {
  const mousePosition = useMouse();

  // mousePosition.x, mousePosition.y
};
```

#### 장점

- 고정된 props 명칭이 아니기 때문에 개발자가 명명을 할 수 있다.

```jsx
const { x, y } = useMouse();
const { x: pageX, y: pageY } = usePage();
```

- 데이터의 소스를 명확하게 식별한다.
- 중첩의 문제가 해결된다.

## 참고

- https://kentcdodds.com/blog/when-to-not-use-render-props
- https://react-etc.vlpt.us/04.render-prop.html
- https://dev.to/bettercodingacademy/react-hooks-vs-render-props-vs-higher-order-components-1al0
- https://kentcdodds.com/blog/react-hooks-whats-going-to-happen-to-render-props
- https://github.com/better-coding-academy/style-guide#component-types
