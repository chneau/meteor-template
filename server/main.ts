import { Meteor } from "meteor/meteor";
import { Links } from "/imports/api/Links";
import { Users } from "/imports/api/Users";
import { printEnvVars } from "./printEnvVars";

printEnvVars();

Error.stackTraceLimit = Number.POSITIVE_INFINITY;

Meteor.settings.packages = {
	"accounts-base": { ambiguousErrorMessages: true },
};

Links.remove({});
Links.insert({
	title: "Do the Tutorial",
	url: "https://www.meteor.com/tutorials/react/creating-an-app",
});
Links.insert({ title: "Follow the Guide", url: "http://guide.meteor.com" });
Links.insert({ title: "Read the Docs", url: "https://docs.meteor.com" });
Links.insert({ title: "Discussions", url: "https://forums.meteor.com" });

const tryIgnore = (fn: () => void) => {
	try {
		fn();
	} catch (e) {}
};

tryIgnore(() =>
	Users.create({ username: "admin", password: "admin", roles: ["admin"] }),
);
tryIgnore(() => Users.create({ username: "user", password: "user" }));

// auto publish roles information to the user
Meteor.publish(null, function () {
	if (!this.userId) return this.ready();
	return Users.find({ _id: this.userId });
});
