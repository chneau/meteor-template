import { Mongo } from "meteor/mongo";
import { TypedSubscribe } from "../typed-subscribe";

export interface Link {
  _id?: string;
  title: string;
  url: string;
  createdAt: Date;
}

const LinksCollection = new Mongo.Collection<Link>("links");

const LinksAll = new TypedSubscribe({
  name: "links.all",
  guard: () => true,
  run: () => LinksCollection.find({}, { sort: { createdAt: -1 } }),
});

export const Links = {
  collection: LinksCollection,
  subAll: LinksAll,
};
