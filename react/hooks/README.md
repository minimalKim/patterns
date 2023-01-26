# hooks

## 목적

React Hooks는 다음을 수행하기 위해 사용할 수 있는 함수

- 컴포넌트에 상태 추가
- 앱 전체에서 여러 컴포넌트 간에 상태 관련 로직을 재사용할 수 있도록 함
- 컴포넌트의 수명 주기 관리

## 사용 규칙

1. 최상위(at the top level)에서만 Hook을 호출해야 함

   - 반복문, 조건문, 중첩된 함수 내에서 Hook을 실행 X
   - 컴포넌트가 렌더링 될 때마다 항상 동일한 순서로 Hook이 호출되는 것이 보장
   - 예시

     ```jsx
     function Form() {
       // 1. name이라는 state 변수를 사용하세요.
       const [name, setName] = useState("Mary");

       // 2. Effect를 사용해 폼 데이터를 저장하세요.
       useEffect(function persistForm() {
         localStorage.setItem("formData", name);
       });

       // 3. surname이라는 state 변수를 사용하세요.
       const [surname, setSurname] = useState("Poppins");

       // 4. Effect를 사용해서 제목을 업데이트합니다.
       useEffect(function updateTitle() {
         document.title = name + " " + surname;
       });

       // ...
     }
     ```

     - React는 Hook이 호출되는 순서에 의존 = 모든 렌더링에서 Hook의 호출 순서는 같다

       ```jsx
       // ------------
       // 첫 번째 렌더링
       // ------------
       useState("Mary"); // 1. 'Mary'라는 name state 변수를 선언합니다.
       useEffect(persistForm); // 2. 폼 데이터를 저장하기 위한 effect를 추가합니다.
       useState("Poppins"); // 3. 'Poppins'라는 surname state 변수를 선언합니다.
       useEffect(updateTitle); // 4. 제목을 업데이트하기 위한 effect를 추가합니다.

       // -------------
       // 두 번째 렌더링
       // -------------
       useState("Mary"); // 1. name state 변수를 읽습니다.(인자는 무시됩니다)
       useEffect(persistForm); // 2. 폼 데이터를 저장하기 위한 effect가 대체됩니다.
       useState("Poppins"); // 3. surname state 변수를 읽습니다.(인자는 무시됩니다)
       useEffect(updateTitle); // 4. 제목을 업데이트하기 위한 effect가 대체됩니다.

       // ...
       ```

     - Hook을 조건문 안에서(예를 들어 persistForm effect) 호출 할 시

       ```jsx
       // 🔴 조건문에 Hook을 사용
       if (name !== "") {
         useEffect(function persistForm() {
           localStorage.setItem("formData", name);
         });
       }
       ```

       - name !== '' 조건은 첫 번째 렌더링에서 true기 때문에 Hook은 동작
       - (사용자가 그 다음 렌더링에서 폼을 초기화하면서 조건이 false가 된다고 가정할 시)

       ```jsx
       useState("Mary"); // 1. name state 변수를 읽습니다. (인자는 무시됩니다)
       // useEffect(persistForm)  // 🔴 Hook을 건너뛰었습니다!
       useState("Poppins"); // 🔴 2 (3이었던). surname state 변수를 읽는 데 실패했습니다.
       useEffect(updateTitle); // 🔴 3 (4였던). 제목을 업데이트하기 위한 effect가 대체되는 데 실패했습니다.
       ```

       - React는 이전 렌더링 때처럼 컴포넌트 내에서 두 번째 Hook 호출이 persistForm effect와 일치할 것이라 예상
       - 건너뛴 useEffect Hook 다음에 호출되는 Hook이 순서가 하나씩 밀리면서 버그를 발생시킴

       - 올바르게 조건부 사용하기

       ```jsx
       useEffect(function persistForm() {
         // 👍 더 이상 첫 번째 규칙을 어기지 않습니다
         if (name !== "") {
           localStorage.setItem("formData", name);
         }
       });
       ```

2. React 함수 컴포넌트 또는 custom hook 내에서만 Hook을 호출해야 함

## custom hook

- 모든 훅이 use로 시작하는것을 볼 수 있다. Rules of Hooks에 따라 모든 Hook들은 use로 시작해야 한다.

## useMemo와 useCallback을 사용함으로써 발생되는 비용과 혜택

### 앞서 생각해보기

- 모든 라인에 있는 코드는 실행이 될때 비용을 수반한다.
- 성능 개선은 항상 비용이 들기 마련이고, 성능 개선의 이득이 항상 그 비용을 상쇄할 수 있는 것은 아니다.

#### useMemo와 useCallback의 목적

1. 참조 동일성 (Referential equality)
2. 비용이 많이 드는 계산 (Computationally expensive calculations)

- 예제 코드

```jsx
function CandyDispenser() {
  const initialCandies = ["snickers", "skittles", "twix", "milky way"];
  const [candies, setCandies] = React.useState(initialCandies);
  const dispense = (candy) => {
    setCandies((allCandies) => allCandies.filter((c) => c !== candy));
  };
  return (
    <div>
      <h1>Candy Dispenser</h1>
      <div>
        <div>Available Candy</div>
        {candies.length === 0 ? (
          <button onClick={() => setCandies(initialCandies)}>refill</button>
        ) : (
          <ul>
            {candies.map((candy) => (
              <li key={candy}>
                <button onClick={() => dispense(candy)}>grab</button> {candy}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

- 성능면에서 어떤 코드가 더 나을까?

1. 기존의 코드

   ```jsx
   const dispense = (candy) => {
     setCandies((allCandies) => allCandies.filter((c) => c !== candy));
   };
   ```

   - 컴포넌트가 두번째로 렌더링 될 시, 원본 dispense 함수가 garbage collected 되고 (메모리 공간을 없애고) 새로운 함수가 생성된다.

2. useCallback으로 수정한 코드

   ```jsx
   const dispense = (candy) => {
     setCandies((allCandies) => allCandies.filter((c) => c !== candy));
   };

   const dispenseCb = useCallback(dispense, []);
   ```

- 두개의 dispense 함수는 같은 일을 수행하지만, useCallback 버전이 더 많은 작업을 처리한다.

  1. 함수를 정의
  2. 배열([])을 정의, 논리적인 표현들을 통해 property들을 세팅하고 실행하는 useCallback을 실행

  - 더 많은 작업을 실행하고, 더 많은 메모리를 사용한다.

- 컴포넌트가 두번째로 렌더링 될 시, 원본 dispense 함수가 garbage collected 되지 않는다. (메모리 사용 측면에서 비효율적?)

  - 배열안의 종속 값 => 리액트는 동일성 체크를 위해 종속된 값들의 참조를 계속 가지고 있다.

### 언제 useMemo와 useCallback을 사용해야 할까?

#### 참조로 사용되어 동일성 (Referential equality)이 지켜져야하는 경우

```jsx
function Foo({ bar, baz }) {
  const options = { bar, baz }; // options는 매 순간마다 새로 만들어지게 된다.
  React.useEffect(() => {
    buzz(options);
  }, [options]); // bar 또는 baz가 바뀔 때 재실행하기를 원하였으나, 결론적으로는 항상 true이므로, 렌더될 때마다 실행되게 된다.
  return <div>foobar</div>;
}

function Blub() {
  return <Foo bar="bar value" baz={3} />;
}
```

1. bar, baz props가 원시 타입 값일 경우

   ```jsx
   function Foo({ bar, baz }) {
     React.useEffect(() => {
       const options = { bar, baz };
       buzz(options);
     }, [bar, baz]); //  bar, baz props가 바뀔 때마다 실행
     return <div>foobar</div>;
   }
   ```

2. bar, baz props가 객체 타입 값일 경우

   ```jsx
   function Foo({ bar, baz }) {
     React.useEffect(() => {
       const options = { bar, baz };
       buzz(options);
     }, [bar, baz]);
     return <div>foobar</div>;
   }

   function Blub() {
     const bar = React.useCallback(() => {}, []);
     const baz = React.useMemo(() => [1, 2, 3], []);
     return <Foo bar={bar} baz={baz} />;
   }
   ```

- 해당 props로 내려주는 상위 레이어에서, 해당 객체 타입 값을 Memoization 하는 것이 필요

#### 비용이 많이 드는 계산 (Computationally expensive calculations)인 경우

1. 기존 코드

   ```jsx
   function RenderPrimes({ iterations, multiplier }) {
     // 비용이 많이 드는 함수
     const primes = calculatePrimes(iterations, multiplier);
     return <div>Primes! {primes}</div>;
   }
   ```

2. useMemo

   ```jsx
   function RenderPrimes({ iterations, multiplier }) {
     const primes = React.useMemo(
       () => calculatePrimes(iterations, multiplier),
       [iterations, multiplier]
     );
     return <div>Primes! {primes}</div>;
   }
   ```

##### 결론

- 모든 추상화(그리고 성능 최적화)에는 비용이 든다
- [the AHA Programming principle (Avoid Hasty Abstractions))](https://kentcdodds.com/blog/aha-programming)를 적용하여 전과 후를 비교해보기

  - 추상화는 이렇게 사용하는 것이 옳다고 생각할때 사용
  - 그리고 추상화를 사용하는 것이 맞다고 생각할때까지는 중복되는 코드를 무서워 하지 말기
  - 이득없이 비용이 발생되는 상황에서 도움

- useCallback과 useMemo를 사용함으로써

  - 동료가 보기에 코드가 더 복잡해 질 수 있고
  - dependencies 배열을 잘못 사용할수도 있으며
  - 내부 훅을 호출함으로써 성능상 안쓰느니 못하게 만들 수도 있고
  - dependency들과 memoized된 값들이 가비지 컬랙터가 안되게 만들수도 있음

- 성능상 이점을 원한다면, 위 비용들의 발생을 감수할수도 있지만 손익분실 계산이 최우선이 되어야 함

##### lazy-initial state

```jsx
const [state, setState] = useState(initialState);
```

- 최초 렌더링 시, 반환된 state(state)는 첫 번째 전달된 인자(initialState)의 값과 동일
- State Hook을 현재의 state와 동일한 값으로 갱신하는 경우 React는 자식을 렌더링 한다거나 무엇을 실행하는 것을 회피하고 그 처리를 종료
  - `Object.is(value1, value2)`를 통해 비교

```jsx
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

- initialState 인자는 초기 렌더링 시에 사용하는 state
  - 그 이후의 렌더링 시에는 해당 값은 무시
- 초기 state가 고비용 계산의 결과라면, 초기 렌더링 시에만 실행될 함수를 사용 가능

참고

- https://ko.reactjs.org/docs/hooks-rules.html
- https://kentcdodds.com/blog/aha-programming
- https://goongoguma.github.io/2021/04/26/When-to-useMemo-and-useCallback/
