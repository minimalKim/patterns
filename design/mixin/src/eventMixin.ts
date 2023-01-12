type Constructor<T> = new (...args: any[]) => T;

type Handler = (value: string) => void;

type Observers = { [key in string]: Handler[] };

// mixin은 아래를 수행하는 함수이다.
// - 생성자(constructor)를 받음
// - 생성자를 확장하여 새 기능을 추가한 클래스 생성
// - 새 클래스 반환

const EventMixin = <T extends Constructor<any>>(Base: T) =>
  class extends Base {
    private _eventHandlers: Observers = {};

    // 이벤트 구독 (subscribe)
    addEventListener(eventName: string, handler: Handler) {
      if (!this._eventHandlers[eventName]) {
        this._eventHandlers[eventName] = [];
      }
      this._eventHandlers[eventName].push(handler);
    }

    // 이벤트 구독 취소 (unsubscribe)
    removeEventListener(eventName: string, handler: Handler) {
      let handlers = this._eventHandlers[eventName];
      if (!handlers) {
        return;
      }
      this._eventHandlers[eventName] = handlers.filter(
        (_handler) => _handler !== handler
      );
    }

    // 이벤트 생성 (notify)
    trigger(eventName: string, ...args: any) {
      if (!this._eventHandlers[eventName]) {
        return;
      }
      this._eventHandlers[eventName].forEach((handler) => {
        handler.apply(this, args);
      });
    }
  };

class Menu {
  // mixin이 기존 클래스 메서드를 덮어쓰는 현상 발생
  trigger() {
    console.log("this will be override");
  }
}

class MenuWithEvent extends EventMixin(Menu) {
  choose(value: string) {
    // select 이벤트를 구독
    this.trigger("select", value);
    console.log("select finish!");
  }
}

let menu = new MenuWithEvent();

const onSelect = (value: string) => console.log(`선택된 메뉴: ${value}`);

// 메뉴 항목을 선택할 때 호출될 핸들러 추가
menu.addEventListener("select", onSelect);

// 이벤트가 트리거 되면 핸들러가 실행
menu.choose("Hot Americano ☕️");
// 선택된 메뉴: Hot Americano ☕️
// select finish!

menu.removeEventListener("select", onSelect);

menu.choose("Ice Americano");
// select finish!
