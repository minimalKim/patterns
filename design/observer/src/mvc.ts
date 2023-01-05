// Model

type State = {
  todos: string[];
};

class Model {
  state: State = {
    todos: [],
  };

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

// View

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
