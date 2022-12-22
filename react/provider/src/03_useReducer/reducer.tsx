import React, { createContext, useReducer } from "react";

type Action = { type: "increment" } | { type: "decrement" };
type Dispatch = (action: Action) => void;
type State = { count: number };

type CountProviderProps = { children: React.ReactNode };

const CountContext = createContext<{ state: State; dispatch: Dispatch } | null>(
  null
);

function countReducer(state: State, action: Action) {
  switch (action.type) {
    case "increment": {
      return { count: state.count + 1 };
    }
    case "decrement": {
      return { count: state.count - 1 };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

function CountProvider({ children }: CountProviderProps) {
  const [state, dispatch] = useReducer(countReducer, { count: 0 });
  const value = { state, dispatch };
  return (
    <CountContext.Provider value={value}>{children}</CountContext.Provider>
  );
}

function useCount() {
  const context = React.useContext(CountContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { CountProvider, useCount };
