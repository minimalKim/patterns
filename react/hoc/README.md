# HOC (Higher Order Component)

## 요약

- 컴포넌트를 인수로 받아, 새 컴포넌트를 반환하는 함수
- 인수 컴포넌트에게 추가되길 원하는 로직을 가진다.
  - 인수 컴포넌트에게 props를 주입 가능

## 구현

- 클래스형 컴포넌트

  ```jsx
  const withEnhanced = (ComposedComponent) => {
    return class extends React.Component {
        // 생성자 및 기타 공통 라이프 사이클
        constructor() {...}
        componentDidMount() {...}
        //...

        // 내부 컴포넌트를 렌더링
        render() {
            return <ComposedComponent {...this.props} />;
        }
    }
  }

  class MyComponent extends React.Component {
    // 주입 받은 props 활용

    // 실제 렌더링
    render() {
      return <div>My Component</div>;
    }
  }

  export default withEnhanced(MyComponent);
  ```

- 함수형 컴포넌트

  ```jsx
  function withHover(Element) {
    return (props) => {
      const [hovering, setHover] = useState(false);

      return (
        <Element
          {...props}
          hovering={hovering}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      );
    };
  }
  ```

## 장점

- 관심사의 분리
  - 재사용을 위한 코드를 분리하여 관리할 수 있다.

## 단점

- 이름 충돌

  ```js
  function withStyles(Component) {
    return (props) => {
      const style = { padding: "0.2rem", margin: "1rem" };
      return <Component style={style} {...props} />;
    };
  }

  const Button = () = <button style={{ color: 'red' }}>Click me!</button>
  const StyledButton = withStyles(Button)
  ```

  위와 같은 경우 style props가 override 된다.

  ```jsx
  function withStyles(Component) {
    return (props) => {
      const style = {
        padding: "0.2rem",
        margin: "1rem",
        ...props.style,
      };

      return <Component style={style} {...props} />;
    };
  }

  const Button = () = <button style={{ color: 'red' }}>Click me!</button>
  const StyledButton = withStyles(Button)
  ```

- 나쁜 가독성

  - 여래개의 HOC로 wrapping 되는 경우, 트리가 깊어진다.
  - 어떤 HOC가 어떤 props와 연관이 있는지 파악하기 어렵다.

  ```jsx
  <withAuth>
    <withLayout>
      <withLogging>
        <Component />
      </withLogging>
    </withLayout>
  </withAuth>
  ```

## 특징

- 여러 고차 컴포넌트 조합이 가능하다.
- 몇몇 상황에서 HOC패턴은 React의 훅으로 대체할 수 있다.

### Mixin 패턴과의 차이점

![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbrGWlQ%2Fbtro7hc88ls%2FK9uMm5XSMFHxQgTsjfX8GK%2Fimg.png)

#### in React

- Mixin은 등록 한 후 사용
- HOC는 상위 HOC Wrapping 컴포넌트에서 props, attribute 값을 주입받는다.
  - 인수 컴포넌트에서 props등을 통해 HOC의 데이터에 접근 가능하다.
- Mixin은 인수로 받는 컴포넌트를 extends하여, 기능을 추가한 새 클래스 컴포넌트를 반환한다.
  - 인수 컴포넌트에서 바로 Mixin의 프로퍼티와 메소드에 접근 가능하다.

```jsx
const SetIntervalMixin = {
  componentWillMount: function () {
    this.intervals = [];
  },
  setInterval: function () {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function () {
    this.intervals.forEach(clearInterval);
  },
};

const createReactClass = require("create-react-class");
const TickTock = createReactClass({
  mixins: [SetIntervalMixin], // SetIntervalMixin을 사용
  getInitialState: function () {
    return { seconds: 0 };
  },
  componentDidMount: function () {
    this.setInterval(this.tick, 1000); // SetIntervalMixin에서 메서드를 호출
  },
  tick: function () {
    this.setState({ seconds: this.state.seconds + 1 });
  },
  render: function () {
    return <p>React has been running for {this.state.seconds} seconds.</p>;
  },
});
```

참고

- https://jeonghwan-kim.github.io/2022/05/28/react-high-order-component
- https://ko.reactjs.org/docs/pure-render-mixin.html
- https://itmining.tistory.com/124
- https://blue-boy.tistory.com/247
