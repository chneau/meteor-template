import { useTracker } from "meteor/react-meteor-data";
import { Link, Links } from "../api/Links";

export const Info = () => {
  const links = useTracker(() => Links.subAll());

  const makeLink = (link: Link) => {
    return (
      <li key={link._id}>
        <a href={link.url} target="_blank">
          {link.title}
        </a>
      </li>
    );
  };

  return (
    <div>
      <h2>Learn Meteor!</h2>
      <ul>{links.map(makeLink)}</ul>
    </div>
  );
};
