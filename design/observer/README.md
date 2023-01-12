# Observer Pattern

## 정의

- 객체의 상태 변화를 관찰하는 관찰자(Observer)들의 목록을 객체(Observable)에 등록하여, 상태 변화가 있을 때마다 메서드 등을 통해 객체가 직접 모든 관찰자에게 통지하도록 하는 디자인 패턴

![img](https://ko.wikipedia.org/wiki/옵저버_패턴#/media/파일:Observer.svg)

## 구성

### 관찰자(Observer, Listener)

- 구독 가능한 객체(Observable)의 상태변화를 관찰
- Observable에서 받은 데이터를 처리

### 구독 가능한 객체(Observable, Subject)

- 관찰 대상이 되는 객체
- 이벤트를 전파하는 주체

## 구현

```ts
class Observable {
  observers: Function[];

  constructor() {
    this.observers = [];
  }

  // observer 등록
  subscribe(func: Function) {
    this.observers.push(func);
  }

  // observer 해지
  unsubscribe(func: Function) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  // 이벤트 전파
  notify(data: any) {
    // 각각의 파생 observer들은 이벤트가 발생했을 때 처리할 동작을 정의하고 있음
    this.observers.forEach((observer) => observer(data));
  }
}
```

## 특징

- MVC 패턴을 구현할 때 사용가능하다.
  - 모델(Model)과 뷰(View) 사이를 느슨히 연결하기 위해 사용
  - ex) Model에서 일어나는 이벤트를 통보받는 Observer는 View의 내용을 바꾸는 스위치를 작동

### MVC Pattern

![img](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fdlf6g4%2Fbtrj0LcpNei%2FuJKMEIQ8tlN8LvOqMBJiw0%2Fimg.png)

- 소프트웨어의 비즈니스 로직과 화면(UI)을 구분하는데 중점을 두는 패턴 (관심사의 분리)
  - Model (Observable)
    - 데이터와 비즈니스 로직을 관리
    - 데이터의 상태 변경 시, 일반적으로 View에게 알리며 (화면 변경 가능) Controller에게 알리기도 함 (업데이트된 View를 제거하기 위해 다른 로직이 필요한 경우)
    - 현재의 상태 정보를 변경(mutator)하거나 다른 클래스에게 알릴 수 있는 함수(notifyObservers)가 있어야 한다.
  - View (Observer)
    - 레이아웃과 화면을 처리
    - 표시할 데이터를 Model로부터 받음
    - 여러 개의 Controller를 가질 수 있음
  - Controller (Observer)
    - 명령을 Model과 View 부분으로 실행
    - 사용자로부터의 입력 (이벤트) 에 대한 응답으로 Model or View를 업데이트하는 로직을 포함

#### 구현해보기

![img](https://hoya-kim.github.io/2021/10/26/JavaScript-observer-pattern/uml_mvc_observer_pattern.png)

```ts
type State = {
  todos: string[];
};

class Model {
  state: State = {
    todos: [],
  };

  // observable
  observers: Function[] = [];
  subscribe(observer: Function) {
    this.observers.push(observer);
  }
  notifyObservers() {
    this.observers.forEach((observer) => observer(this.state));
  }

  get todo() {
    return this.state.todos;
  }

  set todos(newTodos: string[]) {
    this.state.todos = newTodos;
    this.notifyObservers();
  }
}

class View {
  // observer
  render(state: State) {
    state.todos.forEach((todo) => {
      console.log("render " + todo);
    });
  }
}

const model = new Model();
const view = new View();

model.subscribe(view.render);

model.todos = ["todo A"]; // render todo A
```

## 장점

- Observable 객체는 이벤트 모니터링을 담당하고 Observer는 수신된 데이터를 처리하는 역할로 분리되어 있기 때문에, 관심사 분리와 단일 책임의 원칙을 강제 할 수 있다.
- 위와 같은 이유로 인해, Observer 객체는 Observable 객체와 강결합되어있지 않고 언제든지 분리될 수 있다.

## 단점

- Observer를 다루는 로직이 복잡해지거나, 너무 많은 Observer들이 구독하고 있을 경우 모든 Observer들에게 이벤트를 전파(notify)하는 데 상당한 시간이 걸릴 수 있다.

## 질문

1. Observer패턴과 Pub-Sub패턴의 차이는?

- 중간에 Message Broker 또는 Event Bus가 존재하는지 여부
  - Observer패턴은 Observer와 Subject가 서로를 인지하지만 Pub-Sub패턴의 경우 서로를 전혀 몰라도 상관없다.
  - Observer패턴에 비해 Pub-Sub패턴이 더 결합도가 낮다.

참고

- 옵저버 패턴

  - https://ko.wikipedia.org/wiki/옵저버_패턴
  - https://jistol.github.io/software%20engineering/2018/04/11/observer-pubsub-pattern/
  - https://gmlwjd9405.github.io/2017/10/01/basic-concepts-of-development-designpattern.html

- MVC 패턴

  - https://www.carloscaballero.io/understanding-mvc-for-frontend-typescript/

  - https://developer.mozilla.org/ko/docs/Glossary/MVC

  - https://velog.io/@teo/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%97%90%EC%84%9C-MV-%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80%EC%9A%94

  - https://murphymoon.tistory.com/entry/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%85%8C%ED%81%AC-MVC-%EB%A6%AC%EB%B7%B0-%EB%A0%88%EC%9D%B4%EC%96%B4-MVC-%ED%8C%A8%ED%84%B4-5%EB%A0%88%EC%9D%B4%EC%96%B4
