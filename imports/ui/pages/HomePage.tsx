import { useFind, useTracker } from "meteor/react-meteor-data";
import { Links } from "/imports/api/Links";
import { Hello } from "../Hello";
import { Info } from "../Info";

export const HomePage = () => {
	useTracker(() => Links.subscribeAll());
	const links = useFind(() => Links.find({}));
	return (
		<>
			<Hello />
			<Info links={links} />
		</>
	);
};
