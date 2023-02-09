{
  interface Order {
    menu: string;
    id: string;
  }

  class OrderManager {
    orders: Order[];

    constructor() {
      this.orders = [];
    }

    placeOrder(menu: string, id: string) {
      this.orders.push({ menu, id });
      return `You have successfully ordered ${menu} (${id})`;
    }

    trackOrder(id: string) {
      return `Your order ${id} will arrive in 20minutes.`;
    }

    cancelOrder(id: string) {
      this.orders = this.orders.filter((order) => order.id !== id);
      return `You have canceled your order ${id}`;
    }
  }

  const manager = new OrderManager();
  console.log(manager.placeOrder("Pad Thai", "1234")); // You have successfully ordered Pad Thai (1234)
  console.log(manager.trackOrder("1234")); // Your order 1234 will arrive in 20minutes.
  console.log(manager.cancelOrder("1234")); // You have canceled your order 1234
}

// manager의 메서드를 직접 사용하는 도중, 나중에 특정 메서드의 이름을 변경하거나 메서드의 기능을 변경해야 하는 경우 발생 가능
// ex) placeOrder -> addOrder로 변경 시 전체 코드베이스 수정 필요
// 대신 manager 객체로부터 메서드 분리 및 각각의 명령을 처리하는 함수 만들기

{
  interface Order {
    menu: string;
    id: string;
  }

  // Commander
  class OrderManager {
    orders: Order[];

    constructor() {
      this.orders = [];
    }

    execute(command: Command) {
      return command.execute(this.orders);
    }
  }

  // PlaceOrderCommand, CancelOrderCommand, TrackOrderCommand
  class Command {
    execute: (args: any) => string;

    constructor(execute: (args: any) => string) {
      this.execute = execute;
    }
  }

  function PlaceOrderCommand(menu: string, id: string): Command {
    return new Command((orders: Order[]) => {
      orders.push({ menu, id });
      return `You have successfully ordered ${menu} (${id})`;
    });
  }

  function CancelOrderCommand(id: string) {
    return new Command((orders: Order[]) => {
      orders = orders.filter((order) => order.id !== id);
      return `You have canceled your order ${id}`;
    });
  }

  function TrackOrderCommand(id: string) {
    return new Command(() => `Your order ${id} will arrive in 20 minutes.`);
  }

  const manager = new OrderManager();
  const a = new PlaceOrderCommand("Pad Thai", "1234") as Command;

  manager.execute(new PlaceOrderCommand("Pad Thai", "1234"));
  manager.execute(new TrackOrderCommand("1234"));
  manager.execute(new CancelOrderCommand("1234"));
}
