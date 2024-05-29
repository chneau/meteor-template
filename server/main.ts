import { Meteor } from "meteor/meteor";
import { Links } from "/imports/api/Links";
import { Users } from "/imports/api/Users";
import { printEnvVars } from "./printEnvVars";

printEnvVars();

Error.stackTraceLimit = Number.POSITIVE_INFINITY;

Meteor.settings.packages = {
	"accounts-base": { ambiguousErrorMessages: true },
};

await Links.removeAsync({});
await Links.upsertAsync({
	title: "Do the Tutorial",
	url: "https://www.meteor.com/tutorials/react/creating-an-app",
});
await Links.upsertAsync({
	title: "Follow the Guide",
	url: "http://guide.meteor.com",
});
await Links.upsertAsync({
	title: "Read the Docs",
	url: "https://docs.meteor.com",
});
await Links.upsertAsync({
	title: "Discussions",
	url: "https://forums.meteor.com",
});

await Users.createAsync({
	username: "admin",
	password: "admin",
	roles: ["admin"],
}).catch(() => 0);
await Users.createAsync({ username: "user", password: "user" }).catch(() => 0);

// auto publish roles information to the user
Meteor.publish(null, function () {
	if (!this.userId) return this.ready();
	return Users.find({ _id: this.userId });
});
