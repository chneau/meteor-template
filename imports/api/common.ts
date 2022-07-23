import { Document } from "bson";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { ObjectSchema, string } from "yup";
import { TypedMethod } from "../typed-method";

export const Roles = <const>["admin"];
export type Role = typeof Roles[number];

export const meteorizeError = (fn: Function) => {
  try {
    fn();
  } catch (error: any) {
    throw new Meteor.Error("validation", error.message);
  }
};

const checkRoles = (userId: string, roles: Role[]) => {
  const userRoles = Meteor.users.findOne(userId, { fields: { roles: 1 } })?.roles ?? [];
  if (!roles.some((role) => userRoles?.includes(role))) throw new Meteor.Error("not-authorized", "You do not have the required roles");
};

interface RoleGuardedMethodProps<TRun extends (this: Meteor.MethodThisType, ...args: any[]) => any> {
  run: TRun;
  roles?: Role[];
  name: string;
}

const RoleGuardedMethod = <TRun extends (this: Meteor.MethodThisType, ...args: any[]) => any>({ run, roles, name }: RoleGuardedMethodProps<TRun>) => {
  const result = new TypedMethod({
    name,
    guard() {
      if (!this.userId && (this.connection || this.isSimulation)) throw new Meteor.Error("not-authorized", "You must be logged in");
      if (roles && this.userId) checkRoles(this.userId, roles);
    },
    run,
  });
  return result.call.bind(result);
};

export const insertMethod = <T extends Document>(collection: Mongo.Collection<T>, schema: ObjectSchema<T>, roles?: Role[]) => {
  return RoleGuardedMethod({
    name: "links.insert",
    roles,
    run(doc: T) {
      meteorizeError(() => (doc = schema.validateSync(doc, { stripUnknown: true }) as T));
      if (typeof doc._id != "string") delete doc._id;
      return collection.insert(doc as any);
    },
  });
};

export const updateMethod = <T extends Document>(collection: Mongo.Collection<T>, schema: ObjectSchema<T>, roles?: Role[]) => {
  return RoleGuardedMethod({
    name: "links.update",
    roles,
    run(doc: Partial<T>) {
      meteorizeError(() => (doc = schema.cast(doc, { stripUnknown: true, assert: false }) as Partial<T>));
      return collection.update({ _id: doc._id }, doc);
    },
  });
};

export const deleteMethod = <T extends Document>(collection: Mongo.Collection<T>, roles?: Role[]) => {
  return RoleGuardedMethod({
    name: "links.delete",
    roles,
    run(_id: string) {
      meteorizeError(() => string().required().validateSync(_id));
      return collection.update({ _id: _id as any }, { $set: { deletedAtDate: new Date(), deletedByUserId: this.userId! } as any });
    },
  });
};

export const removeMethod = <T extends Document>(collection: Mongo.Collection<T>, roles?: Role[]) => {
  return RoleGuardedMethod({
    name: "links.remove",
    roles,
    run(_id: string) {
      meteorizeError(() => string().required().validateSync(_id));
      return collection.remove({ _id: _id as any });
    },
  });
};
