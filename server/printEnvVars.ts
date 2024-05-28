const envVars = [
	"MONGO_OPLOG_URL", // https://docs.meteor.com/environment-variables.html
	"MONGO_URL",
	"ROOT_URL",
	"PORT",
	// less useful
	"BIND_IP",
	"DDP_DEFAULT_CONNECTION_URL",
	"DISABLE_WEBSOCKETS",
	"HTTP_FORWARDED_COUNT",
	"MAIL_URL",
	"METEOR_DISABLE_OPTIMISTIC_CACHING",
	"METEOR_PROFILE",
	"METEOR_PACKAGE_DIRS",
	"METEOR_SETTINGS",
	"METEOR_SQLITE_JOURNAL_MODE",
	"TOOL_NODE_FLAGS",
	"UNIX_SOCKET_GROUP",
	"UNIX_SOCKET_PATH",
	"UNIX_SOCKET_PERMISSIONS",
];

export const printEnvVars = () => {
	const withValue = envVars.filter((x) => process.env[x]);
	const longest = withValue.reduce(
		(prev, curr) => (prev > curr.length ? prev : curr.length),
		0,
	);
	for (const x of withValue) {
		console.log(`${x.padEnd(longest)} : ${process.env[x]}`);
	}
};
