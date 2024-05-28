import { Mongo } from "meteor/mongo";
import { type InferType, object, string } from "yup";
import { softRemoveAsyncFn, upsertAsyncFn } from "./common";

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
	upsertAsync: upsertAsyncFn(LinksCollection, LinkSchema),
	softRemoveAsync: softRemoveAsyncFn(LinksCollection),
	// subscribeAll: subscribeAll(LinksCollection),
	// subscribeSome: subscribeSome(LinksCollection),
	// subscribeOne: subscribeOne(LinksCollection),
	schema: LinkSchema,
};
