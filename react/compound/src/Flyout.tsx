import React, {
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
} from "react";

const FlyOutContext = React.createContext({
  open: false,
  toggle: () => {},
  value: "",
  setValue: (value: string) => {},
});

// FlyOut 관련 상태를 관리 및 Provider를 제공
function FlyOut(props: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const toggle = useCallback(() => setOpen((state) => !state), []);

  return (
    <FlyOutContext.Provider value={{ open, toggle, value, setValue }}>
      <div className="flyout">{props.children}</div>
    </FlyOutContext.Provider>
  );
}

// Flyout의 open을 결정 (toggle을 호출)
function Input(props: PropsWithChildren) {
  const { value, toggle, setValue } = React.useContext(FlyOutContext);

  return (
    <input
      onFocus={toggle}
      onBlur={toggle}
      className="flyout-input"
      value={value}
      {...props}
    />
  );
}

// ListItem들을 랜더링
function List({ children }: PropsWithChildren) {
  const { open } = useContext(FlyOutContext);

  return (
    open && (
      <div className="flyout-list">
        <ul>{children}</ul>
      </div>
    )
  );
}

function Item({ children, value }: PropsWithChildren<{ value: string }>) {
  const { setValue } = useContext(FlyOutContext);

  return (
    <li
      onMouseDown={() => {
        setValue(value);
      }}
      className="flyout-list-item"
    >
      {children}
    </li>
  );
}

FlyOut.Input = Input;
FlyOut.List = List;
FlyOut.Item = Item;

export { FlyOut };
