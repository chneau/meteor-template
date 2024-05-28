import type { Document } from "bson";
import { Meteor } from "meteor/meteor";
import type { Mongo } from "meteor/mongo";
import { type ObjectSchema, array, string } from "yup";
import { TypedMethod } from "../typed-method";
import { TypedSubscribe } from "../typed-subscribe";

export const Roles = <const>["admin"];
export type Role = (typeof Roles)[number];

export const meteorizeError = (fn: Function) => {
	try {
		fn();
	} catch (error: any) {
		throw new Meteor.Error("validation", error.message);
	}
};

type MethodType = (this: Meteor.MethodThisType, ...args: any[]) => any;

interface RoleGuardedMethodProps<TRun extends MethodType> {
	run: TRun;
	roles?: Role[];
	name: string;
}

const checkRoles = (userId: string, roles: Role[]) => {
	const userRoles =
		Meteor.users.findOne(userId, { fields: { roles: 1 } })?.roles ?? [];
	if (!roles.some((role) => userRoles?.includes(role)))
		throw new Meteor.Error(
			"not-authorized",
			"You do not have the required roles",
		);
};

export const RoleGuardedMethod = <TRun extends MethodType>({
	run,
	roles,
	name,
}: RoleGuardedMethodProps<TRun>) => {
	const result = new TypedMethod({
		name,
		guard() {
			if (!this.userId && (this.connection || this.isSimulation))
				throw new Meteor.Error("not-authorized", "You must be logged in");
			if (roles && this.userId) checkRoles(this.userId, roles);
		},
		run,
	});
	return result.call.bind(result);
};

export const insertMethod = <T extends Document>(
	collection: Mongo.Collection<T>,
	schema: ObjectSchema<T>,
	roles?: Role[],
) =>
	RoleGuardedMethod({
		name: `${collection._name}.insert`,
		roles,
		run(doc: T) {
			meteorizeError(
				() => (doc = schema.validateSync(doc, { stripUnknown: true }) as T),
			);
			if (typeof doc._id !== "string") doc._id = undefined;
			return collection.insert(doc as any);
		},
	});

export const updateMethod = <T extends Document>(
	collection: Mongo.Collection<T>,
	schema: ObjectSchema<T>,
	roles?: Role[],
) =>
	RoleGuardedMethod({
		name: `${collection._name}.update`,
		roles,
		run(doc: Partial<T>) {
			meteorizeError(
				() =>
					(doc = schema.cast(doc, {
						stripUnknown: true,
						assert: false,
					}) as Partial<T>),
			);
			return collection.update({ _id: doc._id }, doc);
		},
	});

export const deleteMethod = <T extends Document>(
	collection: Mongo.Collection<T>,
	roles?: Role[],
) => {
	return RoleGuardedMethod({
		name: `${collection._name}.delete`,
		roles,
		run(_id: string) {
			meteorizeError(() => string().required().validateSync(_id));
			return collection.update(
				{ _id: _id as any },
				{
					$set: {
						deletedAtDate: new Date(),
						deletedByUserId: this.userId!,
					} as any,
				},
			);
		},
	});
};

export const subscribeAll = <T extends Document>(
	collection: Mongo.Collection<T>,
	roles?: Role[],
) => {
	const result = new TypedSubscribe({
		name: `${collection._name}.all`,
		guard() {
			if (!this.userId) return false;
			if (roles) {
				const userRoles =
					Meteor.users.findOne(this.userId, { fields: { roles: 1 } })?.roles ??
					[];
				if (!roles.some((role) => userRoles?.includes(role))) return false;
			}
			return true;
		},
		run: (options?: Mongo.Options<T>) =>
			collection.find({ deletedAtDate: { $exists: false } }, options),
	});
	return result.fetch.bind(result);
};

export const subscribeSome = <T extends Document>(
	collection: Mongo.Collection<T>,
	roles?: Role[],
) => {
	const result = new TypedSubscribe({
		name: `${collection._name}.some`,
		guard(ids: string[]) {
			if (!array().of(string()).required().isValidSync(ids)) return false;
			if (!this.userId) return false;
			if (roles) {
				const userRoles =
					Meteor.users.findOne(this.userId, { fields: { roles: 1 } })?.roles ??
					[];
				if (!roles.some((role) => userRoles?.includes(role))) return false;
			}
			return true;
		},
		run: (ids: string[], options?: Mongo.Options<T>) =>
			collection.find({ _id: { $in: ids } } as any, options),
	});
	return result.fetch.bind(result);
};

export const subscribeOne = <T extends Document>(
	collection: Mongo.Collection<T>,
	roles?: Role[],
) => {
	const result = new TypedSubscribe({
		name: `${collection._name}.one`,
		guard(id: string) {
			if (!string().required().isValidSync(id)) return false;
			if (!this.userId) return false;
			if (roles) {
				const userRoles =
					Meteor.users.findOne(this.userId, { fields: { roles: 1 } })?.roles ??
					[];
				if (!roles.some((role) => userRoles?.includes(role))) return false;
			}
			return true;
		},
		run: (id: string, options?: Mongo.Options<T>) =>
			collection.findOne({ _id: id } as any, options),
	});
	return result.fetch.bind(result);
};
