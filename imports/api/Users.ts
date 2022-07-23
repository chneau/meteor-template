import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { array, boolean, date, object, ObjectSchema, string } from "yup";
import { Role, updateMethod } from "./common";

export interface User extends Meteor.User {}

const UserEmailSchema: ObjectSchema<Meteor.UserEmail> = object({
  address: string().required().label("Email"),
  verified: boolean().required().label("Verified"),
});

const UserSchema: ObjectSchema<User> = object({
  _id: string().required(),
  username: string().label("Username"),
  emails: array().of(UserEmailSchema).required().label("Emails"),
  createdAt: date().label("Created At"),
  profile: object().label("Profile"),
  services: object().label("Services"),
  roles: array().of(string<Role>().required()).nullable().label("Roles"),
});

const UsersCollection = Meteor.users;

type AccountsCreateUserOptions = Parameters<typeof Accounts.createUser>[0];
interface CreateWithRolesOptions extends AccountsCreateUserOptions {
  roles?: Role[];
}

const createWithRoles = (options: CreateWithRolesOptions) => {
  const userId = Accounts.createUser(options);
  if (userId) Meteor.users.update(userId, { $set: { roles: options.roles } });
  return userId;
};

export const Users = {
  find: UsersCollection.find.bind(UsersCollection),
  create: createWithRoles,
  update: updateMethod(UsersCollection, UserSchema, ["admin"]),
  schema: UserSchema,
};
