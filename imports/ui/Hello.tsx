import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCounter } from "react-use";
import { Users } from "../api/Users";
import { Authorize } from "./components/Authorize";

export const Hello = () => {
	const [counter, { inc }] = useCounter(0);
	const user = useTracker(() => Meteor.user());
	return (
		<div>
			<h1>Welcome to Meteor!</h1>
			<Button onClick={() => inc()}>Click Me</Button>
			<p>You've pressed the button {counter} times.</p>
			<ButtonGroup>
				<Button
					onClick={() => Users.loginWithPassword("user", "user")}
					disabled={user?.username === "user"}
				>
					Login as user
				</Button>
				<Button
					onClick={() => Users.loginWithPassword("admin", "admin")}
					disabled={user?.username === "admin"}
				>
					Login as admin
				</Button>
				<Button
					variant="danger"
					onClick={() => Users.logout()}
					disabled={!user}
				>
					Logout
				</Button>
			</ButtonGroup>
			<Authorize>
				<p>You can see this only if you are logged in.</p>
			</Authorize>
			<Authorize roles={["admin"]}>
				<p>You can see this only if you are logged in and are an admin.</p>
			</Authorize>
			<div>
				<Link to="/admin">Try accessing /admin</Link>
			</div>
		</div>
	);
};
