import { Mongo } from "meteor/mongo";
import { object, ObjectSchema, string } from "yup";
import { TypedSubscribe } from "../typed-subscribe";
import { deleteMethod, insertMethod, updateMethod } from "./common";

export interface Link {
  _id?: string | null;
  title: string;
  url: string;
}

export const LinkSchema: ObjectSchema<Link> = object({
  _id: string().nullable(),
  title: string().required().label("Title"),
  url: string().required().label("URL"),
});

const LinksCollection = new Mongo.Collection<Link>("links");

const LinksAll = new TypedSubscribe({
  name: "links.all",
  guard: () => true,
  run: () => LinksCollection.find({}, { sort: { createdAt: -1 } }),
});

export const Links = {
  find: LinksCollection.find.bind(LinksCollection),
  insert: insertMethod(LinksCollection, LinkSchema),
  update: updateMethod(LinksCollection, LinkSchema),
  delete: deleteMethod(LinksCollection),
  subAll: LinksAll,
};
