import { CreateLink } from "../CreateLink";
import { HomePage } from "./HomePage";

export const AdminPage = () => {
	return (
		<>
			<h1>This is the admin page</h1>
			<HomePage />
			<CreateLink onCreated={(x) => console.log(x)} />
		</>
	);
};
