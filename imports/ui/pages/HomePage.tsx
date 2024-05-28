import { useTracker } from "meteor/react-meteor-data";
import { Links } from "/imports/api/Links";
import { Hello } from "../Hello";
import { Info } from "../Info";

export const HomePage = () => {
	const links = useTracker(() => Links.subscribeAll());
	return (
		<>
			<Hello />
			<Info links={links} />
		</>
	);
};
