import { useTracker } from "meteor/react-meteor-data";
import { useAsync } from "react-use";
import { Links } from "/imports/api/Links";
import { Hello } from "../Hello";
import { Info } from "../Info";

export const HomePage = () => {
	const sub = useTracker(() => Links.subscribeAll());
	const links = useAsync(
		async () => await Links.find().fetchAsync(),
		[sub.ready()],
	);

	return (
		<>
			<Hello />
			{links.value ? <Info links={links.value} /> : "Loading..."}
		</>
	);
};
