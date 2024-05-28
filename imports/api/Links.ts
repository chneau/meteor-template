import { Mongo } from "meteor/mongo";
import { type InferType, object, string } from "yup";
import { softRemoveAsync, upsertAsync } from "./common";

const LinkSchema = object({
	_id: string().nullable(),
	title: string().required().label("Title"),
	url: string().required().label("URL"),
});

export type Link = InferType<typeof LinkSchema>;

const LinksCollection = new Mongo.Collection<Link>("links");

export const Links = {
	find: LinksCollection.find.bind(LinksCollection),
	removeAsync: LinksCollection.removeAsync.bind(LinksCollection),
	upsertAsync: (doc: Link) => upsertAsync(LinksCollection, LinkSchema, doc),
	softRemoveAsync: (id: string) => softRemoveAsync(LinksCollection, id),
	// subscribeAll: subscribeAll(LinksCollection),
	// subscribeSome: subscribeSome(LinksCollection),
	// subscribeOne: subscribeOne(LinksCollection),
	schema: LinkSchema,
};
