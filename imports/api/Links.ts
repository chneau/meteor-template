import { Mongo } from "meteor/mongo";
import { type InferType, object, string } from "yup";
import {
	softRemoveAsyncFn,
	subscribeAllFn,
	subscribeOneFn,
	subscribeSomeFn,
	upsertAsyncFn,
} from "./common";

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
	subscribeAll: subscribeAllFn(LinksCollection),
	subscribeSome: subscribeSomeFn(LinksCollection),
	subscribeOne: subscribeOneFn(LinksCollection),
	schema: LinkSchema,
};
