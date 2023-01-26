import React, { useState } from "react";

// hoc
function withTemperatureInput(Component) {
  return (props) => {
    const [value, setValue] = useState("0");

    return (
      <div>
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <Component {...props} value={value}></Component>
      </div>
    );
  };
}

export const Temperature = withTemperatureInput(({ value }) => (
  <>
    <Kelvin value={value} />
    <Fahrenheit value={value} />
  </>
));

// render-props
function TemperatureInput(props) {
  const [value, setValue] = useState("0");

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <props.children value={value}> </props.children>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Temperature Converter</h1>

      <TemperatureInput>
        {({ value }) => (
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>
        )}
      </TemperatureInput>
    </div>
  );
}

// hooks
function TemperatureInput({ value, handleChange }) {
  return <input value={value} onChange={(e) => handleChange(e.target.value)} />;
}

export default function App() {
  const [value, setValue] = useState("0");

  return (
    <div className="App">
      <h1>Temperature Converter</h1>
      <TemperatureInput value={value} handleChange={setValue} />
      <Kelvin value={value} />
      <Fahrenheit value={value} />
    </div>
  );
}
