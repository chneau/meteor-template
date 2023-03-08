import { useTracker } from "meteor/react-meteor-data";
import { Hello } from "../Hello";
import { Info } from "../Info";

export const HomePage = () => {
  const links = useTracker(() => Info.subAll());
  return (
    <>
      <Hello />
      <Info links={links} />
    </>
  );
};
