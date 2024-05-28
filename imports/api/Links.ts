import { Mongo } from "meteor/mongo";
import { type ObjectSchema, object, string } from "yup";
import {
	deleteMethod,
	insertMethod,
	subscribeAll,
	subscribeOne,
	subscribeSome,
	updateMethod,
} from "./common";

export interface Link {
	_id?: string | null;
	title: string;
	url: string;
}

const LinkSchema: ObjectSchema<Link> = object({
	_id: string().nullable(),
	title: string().required().label("Title"),
	url: string().required().label("URL"),
});

const LinksCollection = new Mongo.Collection<Link>("links");

export const Links = {
	find: LinksCollection.find.bind(LinksCollection),
	remove: LinksCollection.removeAsync.bind(LinksCollection),
	insert: insertMethod(LinksCollection, LinkSchema),
	update: updateMethod(LinksCollection, LinkSchema),
	delete: deleteMethod(LinksCollection),
	subAll: subscribeAll(LinksCollection),
	subSome: subscribeSome(LinksCollection),
	subOne: subscribeOne(LinksCollection),
	schema: LinkSchema,
};
