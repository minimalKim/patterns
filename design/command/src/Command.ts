{
  /**
   * Command 인터페이스는 명령을 실행하기 위한 메서드를 선언합니다.
   */
  interface Command {
    execute(): void;
  }

  /**
   * 일부 명령은 자체적으로 간단한 작업을 구현할 수 있습니다.
   */
  class SimpleCommand implements Command {
    private payload: string;

    constructor(payload: string) {
      this.payload = payload;
    }

    public execute(): void {
      console.log(
        `SimpleCommand: See, I can do simple things like printing (${this.payload})`
      );
    }
  }

  /**
   * 그러나 일부 명령은 "수신자"라고 하는 다른 객체에 더 복잡한 작업을 위임할 수 있습니다.
   */
  class ComplexCommand implements Command {
    private receiver: Receiver;

    /**
     * 수신자의 메소드를 시작하는 데 필요한 컨텍스트 데이터.
     */
    private a: string;

    private b: string;

    /**
     * 복잡한 명령은 생성자를 통해 모든 컨텍스트 데이터와 함께 하나 또는 여러 수신자 객체를 받아들일 수 있습니다.
     */
    constructor(receiver: Receiver, a: string, b: string) {
      this.receiver = receiver;
      this.a = a;
      this.b = b;
    }

    /**
     * 명령은 수신기의 모든 메서드에 위임할 수 있습니다.
     */
    public execute(): void {
      console.log(
        "ComplexCommand: Complex stuff should be done by a receiver object."
      );
      this.receiver.doSomething(this.a);
      this.receiver.doSomethingElse(this.b);
    }
  }

  /**
   * Receiver 클래스에는 몇 가지 중요한 비즈니스 논리가 포함되어 있습니다.
   * 그들은 요청 수행과 관련된 모든 종류의 작업을 수행하는 방법을 알고 있습니다.
   * 실제로 모든 클래스는 수신기 역할을 할 수 있습니다.
   */
  class Receiver {
    public doSomething(a: string): void {
      console.log(`Receiver: Working on (${a}.)`);
    }

    public doSomethingElse(b: string): void {
      console.log(`Receiver: Also working on (${b}.)`);
    }
  }

  /**
   * Invoker는 하나 또는 여러 명령과 연결됩니다. 명령에 요청을 보냅니다.
   */
  class Invoker {
    private onStart!: Command;

    private onFinish!: Command;

    /**
     * Initialize commands.
     */
    public setOnStart(command: Command): void {
      this.onStart = command;
    }

    public setOnFinish(command: Command): void {
      this.onFinish = command;
    }

    /**
     * Invoker는 구체적인 명령이나 수신자 클래스에 의존하지 않습니다.
     * Invoker는 명령을 실행하여 요청을 수신자에게 간접적으로 전달합니다.
     */
    public doSomethingImportant(): void {
      console.log("Invoker: Does anybody want something done before I begin?");
      if (this.isCommand(this.onStart)) {
        this.onStart.execute();
      }

      console.log("Invoker: ...doing something really important...");

      console.log("Invoker: Does anybody want something done after I finish?");
      if (this.isCommand(this.onFinish)) {
        this.onFinish.execute();
      }
    }

    private isCommand(object: Command): object is Command {
      return object.execute !== undefined;
    }
  }

  /**
   * 클라이언트 코드는 모든 명령으로 호출자를 매개변수화할 수 있습니다.
   */
  const invoker = new Invoker();
  invoker.setOnStart(new SimpleCommand("Say Hi!"));
  const receiver = new Receiver();
  invoker.setOnFinish(
    new ComplexCommand(receiver, "Send email", "Save report")
  );

  invoker.doSomethingImportant();

  // SimpleCommand: See, I can do simple things like printing (Say Hi!)
  // Invoker: ...doing something really important...
  // Invoker: Does anybody want something done after I finish?
  // ComplexCommand: Complex stuff should be done by a receiver object.
  // Receiver: Working on (Send email.)
  // Receiver: Also working on (Save report.)
}
