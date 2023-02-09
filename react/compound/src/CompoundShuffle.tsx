import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

const ShuffleContext = createContext({
  value: 0,
  setValue: (value: number) => {},
  shuffle: (value: number) => {},
  reset: () => {},
});

interface CompoundShuffleProps extends PropsWithChildren<{}> {}

// compound 상위 컴포넌트는 context를 생성하여 하위 컴포넌트와 상태를 공유한다.
export function CompoundShuffle({ children }: CompoundShuffleProps) {
  const [value, setValue] = useState(0);

  const shuffle = (_value: number) => {
    const nums = _value.toString().split("");
    const shuffledNumber = +nums.sort(() => Math.random() - 0.5).join("");
    setValue(shuffledNumber);
  };

  const reset = () => {
    setValue(0);
  };

  return (
    <ShuffleContext.Provider value={{ value, setValue, shuffle, reset }}>
      {children}
    </ShuffleContext.Provider>
  );
}

// Input 컴포넌트
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
}

export function Input({ ...props }: InputProps) {
  const shuffleContext = useContext(ShuffleContext);
  3;
  const handleChange = (e: InputEvent) =>
    shuffleContext.setValue(+(e.target as HTMLInputElement).value);

  return (
    <input
      type="number"
      value={shuffleContext.value}
      onChange={handleChange}
      {...props}
    />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ type, hidden, children, ...props }: ButtonProps) {
  const shuffleContext = useContext(ShuffleContext);
  const isButton = type === "button";
  const isReset = type === "reset";

  const clickHandler = () => {
    if (isButton) {
      shuffleContext.shuffle(shuffleContext.value);
    } else if (isReset) {
      shuffleContext.reset();
    }
  };

  return (
    <button type={type} hidden={hidden} {...props} onClick={clickHandler}>
      {children}
    </button>
  );
}
