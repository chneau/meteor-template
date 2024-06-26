import { Meteor } from "meteor/meteor";
import type { Mongo } from "meteor/mongo";
import type { AnyObjectSchema } from "yup";

export type Document = { [key: string]: unknown };

const updateAsync = async <T extends Document>(
	collection: Mongo.Collection<T>,
	schema: AnyObjectSchema,
	_id: string,
	updates: Partial<T>,
) => {
	const validated = await schema.validate(updates, { stripUnknown: true });
	await collection.updateAsync(_id, { $set: validated });
	return _id;
};

const insertAsync = async <T extends Document>(
	collection: Mongo.Collection<T>,
	schema: AnyObjectSchema,
	doc: T,
) => {
	const validated = await schema.validate(doc, { stripUnknown: true });
	return await collection.insertAsync(validated);
};

const upsertAsync = async <T extends Document>(
	collection: Mongo.Collection<T>,
	schema: AnyObjectSchema,
	doc: T,
) => {
	if (typeof doc._id === "string") {
		return updateAsync(collection, schema, doc._id, doc);
	}
	return insertAsync(collection, schema, doc);
};

export const upsertAsyncFn =
	<T extends Document>(
		collection: Mongo.Collection<T>,
		schema: AnyObjectSchema,
	) =>
	async (doc: T) =>
		upsertAsync(collection, schema, doc);

const softRemoveAsync = async <T extends Document>(
	collection: Mongo.Collection<T>,
	_id: string,
) => {
	return await collection.updateAsync(_id, {
		$set: { _deleted: true } as unknown as T,
	});
};

export const softRemoveAsyncFn =
	<T extends Document>(collection: Mongo.Collection<T>) =>
	async (_id: string) =>
		softRemoveAsync(collection, _id);

export const subscribeAll = <T extends Document>(
	collection: Mongo.Collection<T>,
): (() => Mongo.Cursor<T>) => {
	Meteor.subscribe(`${collection._name}.all`);
	return () =>
		collection.find({
			_deleted: { $ne: true },
		} as unknown as Mongo.Selector<T>);
};

export const publishAll = <T extends Document>(
	collection: Mongo.Collection<T>,
): void => {
	Meteor.publish(`${collection._name}.all`, () =>
		collection.find({
			_deleted: { $ne: true },
		} as unknown as Mongo.Selector<T>),
	);
};

type MeteorMethod = Parameters<typeof Meteor.methods>[0][string];
export const meteorMethodFn = <T extends MeteorMethod>(
	name: string,
	method: T,
) => {
	if (Meteor.isServer) {
		Meteor.methods({ [name]: method });
	}
	return (...args: Parameters<T>) => {
		return Meteor.callAsync(name, ...args) as ReturnType<T>;
	};
};

type MeteorPublish = Parameters<typeof Meteor.publish>[1];
const meteorSubscribeFn = <T extends MeteorPublish>(
	name: string,
	publish: T,
) => {
	if (Meteor.isServer) {
		Meteor.publish(name, publish);
	}
	return (...args: Parameters<T>) => Meteor.subscribe(name, ...args);
};

export const subscribeAllFn = <T extends Document>(
	collection: Mongo.Collection<T>,
) => {
	const name = `${collection._name}.all`;
	const publish: MeteorPublish = function () {
		if (!this.userId) return this.ready();
		return collection.find({
			_deleted: { $ne: true },
		} as unknown as Mongo.Selector<T>);
	};
	return meteorSubscribeFn(name, publish);
};

export const subscribeSomeFn = <T extends Document>(
	collection: Mongo.Collection<T>,
) => {
	const name = `${collection._name}.some`;
	const publish: MeteorPublish = function (ids: string[]) {
		if (!this.userId) return this.ready();
		return collection.find({
			_id: { $in: ids },
		} as unknown as Mongo.Selector<T>);
	};
	return meteorSubscribeFn(name, publish);
};

export const subscribeOneFn = <T extends Document>(
	collection: Mongo.Collection<T>,
) => {
	const name = `${collection._name}.one`;
	const publish: MeteorPublish = function (_id: string) {
		if (!this.userId) return this.ready();
		return collection.find({ _id } as unknown as Mongo.Selector<T>);
	};
	return meteorSubscribeFn(name, publish);
};
