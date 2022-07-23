import { useState } from "react";
import { Button } from "react-bootstrap";
import { Users } from "../api/Users";
import { Authorize } from "./components/Autthorize";

export const Hello = () => {
  const [counter, setCounter] = useState(0);
  const increment = () => setCounter((prev) => prev + 1);
  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <Button onClick={increment}>Click Me</Button>
      <p>You've pressed the button {counter} times.</p>
      <Button onClick={() => Users.logout()}>Logout</Button>
      <Button onClick={() => Users.loginWithPassword("user", "user")}>Login as user</Button>
      <Button onClick={() => Users.loginWithPassword("admin", "admin")}>Login as admin</Button>
      <Authorize>
        <p>You can see this only if you are logged in.</p>
      </Authorize>
      <Authorize role={"admin"}>
        <p>You can see this only if you are logged in and are an admin.</p>
      </Authorize>
    </div>
  );
};
