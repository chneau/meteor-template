import { useTracker } from "meteor/react-meteor-data";
import { Hello } from "../Hello";
import { Info } from "../Info";
import { Links } from "/imports/api/Links";

export const HomePage = () => {
  const links = useTracker(() => Links.subAll());
  return (
    <>
      <Hello />
      <Info links={links} />
    </>
  );
};
