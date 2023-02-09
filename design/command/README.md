# command Pattern

- 명령을 처리하는 객체를 통해 메서드와 실행되는 동작의 결합도를 낮출 수 있다.

- 커맨드 패턴을 사용 시, 특정 작업을 실행하는 개체와 메서드를 호출하는 개체를 분리할 수 있다.

## 예시

### 문제상황

![image](https://refactoring.guru/images/patterns/diagrams/command/problem2-2x.png)

- 다양한 기능을 수행하는 Button을 만들어야할 때, Button의 기능별로 하위 클래스를 만들고, 해당 하위 클래스에는 버튼 클릭 시 실행 되어야하는 코드가 포함된다.

![image](https://refactoring.guru/images/patterns/diagrams/command/problem3-en-2x.png)

- 만일 여러 위치에서 호출해야하는 텍스트복사/붙여넣기와 같은 작업은 여러클래스가 동일한 기능을 구현하게된다.
  - 동일한 기능을 수행하며 중복되는 코드가 생성된다.

### 해결

![image](https://refactoring.guru/images/patterns/diagrams/command/solution1-en-2x.png)

- Command 패턴은 위처럼 GUI가 BusinessLogic에 직접 요청을 전달하는 대신, 위의 update와 같은 메서드를 단일로 가지는 별도의 Command 클래스로 추출하는 것을 제안한다.

![image](https://refactoring.guru/images/patterns/diagrams/command/solution2-en-2x.png)

- Command 객체는 다양한 GUI(Sender)와 비즈니스 논리 객체(Receiver) 간의 링크 역할을 한다.
- GUI와 비즈니스 논리 객체는 서로 요청을 어떻게 전달, 수신하고 처리하는지 알 필요가 없다.
- GUI 객체는 Command를 트리거하여 비즈니스 논리 계층에 접근한다.

명령 패턴은 요청을 객체로 캡슐화하여 다양한 요청을 유사한 방식으로 처리할 수 있는 동작 디자인 패턴입니다. 이것은 요청을 하는 객체와 요청을 수행하는 객체 사이의 느슨한 연결을 허용합니다.

## 구조

![image](https://refactoring.guru/images/patterns/diagrams/command/structure-indexed-2x.png)

1. Sender / Invoker (발신자):

   - 요청을 시작하는 역할.
   - 해당 클래스에는 명령 개체에 대한 참조를 저장하기 위한 필드가 있어야함.
   - **발신자는 요청을 수신자에게 직접 보내는 대신 해당 Command을 트리거**.
   - Sender는 Command 객체를 생성할 책임 X.
   - 일반적으로 생성자를 통해 Client(클라이언트)에서 미리 생성된 Command을 가져옴

2. Command interface (명령 인터페이스):

   - 일반적으로 명령을 실행하기 위한 단일 메서드(execute)만 선언

3. Concrete Command (구체적인 명령):

   - 다양한 종류의 요청을 구현(implements)함
   - 구체적인 명령은 자체적으로 작업을 수행하는 것이 아니라 **비즈니스 논리 개체 중 하나에 호출을 전달하는 것**
   - 요청을 실행하기 위한 메서드를 구현하는 명령 인터페이스의 구현

4. Receiver (수신자):

   - 대부분의 Command들은 요청이 수신자에게 전달되는 방식에 대한 세부 정보만 처리하는 반면, 수신자 자체는 실제 작업을 수행

5. Client (클라이언트):
   - 구체적인 Command 개체를 생성하고 구성
   - 수신자 인스턴스를 포함한 모든 요청 매개변수를 Command 생성자로 전달해야 함
   - 그런 다음 결과 Command는 하나 이상의 발신자와 연결 가능

## 장점

- 단일 책임 원칙
  - 작업을 수신 및 수행하는 클래스(Receiver)와 작업을 호출하는 클래스(Invoker)를 분리가능하다. (서로에 대해 알 필요가 없음)
- 간단한 Command 객체를 복잡한 Command 객체로 조합하여 사용도 가능하다.

- 수명이 지정된 명령을 만들거나. 명령들을 큐에 담아 특정한 시간대(지연 처리)에 처리하는 것도 가능하다.

## 단점

- 발신자와 수신자 사이에 완전히 새로운 계층을 도입하기 때문에 코드가 더 복잡해질 수 있다.

## Meditator,Observer와의 관계

- Command 패턴은 Sender와 Receiver 사이에 단방향 연결을 설정한다.
- Meditator 패턴은 Sender와 Receiver 사이에 직접적인 연결을 제거하며, 중재자 개체를 통해 간접적으로 통신하도록 한다.
- Observer 패턴은 Receiver가 동적으로 수신 요청을 구독 및 구독 취소할 수 있도록한다.
