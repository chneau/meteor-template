import { useFind, useTracker } from "meteor/react-meteor-data";
import { Links } from "/imports/api/Links";
import { Hello } from "../Hello";
import { Info } from "../Info";

export const HomePage = () => {
	const sub = useTracker(() => Links.subscribeAll());
	const links = useFind(() => Links.find({}), [sub.ready()]);
	return (
		<>
			<Hello />
			<Info links={links} />
		</>
	);
};
