# mediator / middleware (중재자) 패턴

## 요약

- 컴포넌트들이 서로 직접 통신하는 대신, **중재자 역할을 하는 객체 또는 함수를 통해 통신**하도록 하는 패턴

## 특징

- 각각의 컴포넌트(객체, Colleague는)들이 서로 통신하여 다대다 관계를 이루는 대신, 모든 요청을 중재자에게 보냄
- 많은 Colleague 간의 통신을 용이하게 하는 데 사용
  - 각각의 Colleague들의 서로 호출하여 통신해야 하는 구현하기 어려운 다대다 관계를 구현하기 쉬운 다대일로 처리 가능

## 장점

- 느슨한 결합: Colleague들이 서로를 명시적으로 참조하지 않도록 함
- 개체 간 통신 축소: Colleague는 Mediator와만 통신하면 된다. 실질적으로 중재자 패턴은 필요한 통신 채널(프로토콜)을 다대다에서 일대다로 줄인다.
- 관심사의 분리: 통신 관련 로직이 Mediator에 집중되어있으므로, 수정이나 확장에 용이하다.

## 단점

- 복잡성: Mediator의 통신 로직이 집중되어있으므로, 잘못된 Mediator의의 설계는 복잡성을 증가시킬 수 있다.

### 옵저버 패턴과의 차이점

#### 공통점

- 중재자가 Colleague들에게 notify(통신, 데이터 전달)한다는 점은 관찰자 패턴과 유사

### 차이점

- 관찰자 패턴은 Observer(Listener)와 Observable(Subject)간의 통신에 의미를 둠

  - Observer(Listener)가 notify를 통해 정보를 받기만 하는데, 중재자 패턴은 Mediator와 Colleague가 서로 상호작용
    (user.send -> chatroom.sendMessage, chatroom.sendMessage -> user.receive)

- 관찰자 패턴은 1개의 Observable(Subject) 대해 N개의 Observer(Listener)가 존재
- 중재자 패턴은 M개의 Observable(Subject)와 N개의 Observer(Listener) 사이에서 1개의 Mediator와 통해 통신 (브로커 또는 메시지 브로커 또는 이벤트 버스를 통해 송신자와 수신자가 소통하는 발행 - 구독 패턴에 가까움)

https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTHaNB%2FbtqBtGF6tbR%2F6nSNAnpnb7Mw2LqF6aibV0%2Fimg.png

## 관련

### Express Middleware

- Express는 자체적인 최소한의 기능을 갖춘 라우팅 및 미들웨어 웹 프레임워크이다.
- 미들웨어 함수는 request와 respond 주기 사이에서, 요청 오브젝트(req), 응답 오브젝트 (res), 그 다음의 미들웨어 함수 대한 액세스 권한을 갖는 함수이다.

```js
const middleware = (req, res, next) => {
  // do stuffs
  next();
};
```

참고

- https://velog.io/@sang-mini/MediatorMiddleware-%ED%8C%A8%ED%84%B4
- https://www.oodesign.com/mediator-pattern
- https://expressjs.com/ko/guide/using-middleware.html
- https://muniftanjim.dev/blog/basic-middleware-pattern-in-javascript/
