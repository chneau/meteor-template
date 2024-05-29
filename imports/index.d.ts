declare module "meteor/meteor" {
	namespace Meteor {
		interface User {
			roles?: string[] | null;
		}
	}
}

declare module "meteor/mongo" {
	namespace Mongo {
		interface Collection<T extends import("mongodb").Document, U = T> {
			_name: string;
		}
	}
}
