import { useState } from "react";

export const Hello = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev + 1);
  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <button onClick={increment}>Click Me</button>
      <p>You've pressed the button {counter} times.</p>
    </div>
  );
};
