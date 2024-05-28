import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { type InferType, array, boolean, date, object, string } from "yup";

const allRoles = ["admin"] as const;
export type Role = (typeof allRoles)[number];

const UserEmailSchema = object({
	address: string().required().label("Email"),
	verified: boolean().required().label("Verified"),
});

const UserSchema = object({
	_id: string().required(),
	username: string().label("Username"),
	emails: array().of(UserEmailSchema).label("Emails"),
	createdAt: date().label("Created At"),
	profile: object().label("Profile"),
	services: object().label("Services"),
	roles: array().of(string<Role>().required()).label("Roles"),
});

export type User = InferType<typeof UserSchema>;

const UsersCollection = Meteor.users;

type AccountsCreateUserOptions = Parameters<typeof Accounts.createUser>[0];
type CreateWithRolesOptions = AccountsCreateUserOptions & { roles?: Role[] };

const createAsync = async (options: CreateWithRolesOptions) => {
	const userId = await Accounts.createUserAsync(options);
	if (userId)
		await Meteor.users.updateAsync(userId, { $set: { roles: options.roles } });
	return userId;
};

export const Users = {
	find: UsersCollection.find.bind(UsersCollection),
	createAsync,
	loginWithPassword: Meteor.loginWithPassword?.bind(Meteor),
	logout: Accounts.logout?.bind(Accounts),
	schema: UserSchema,
};
