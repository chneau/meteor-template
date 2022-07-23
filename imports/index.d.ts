declare module "meteor/meteor" {
  namespace Meteor {
    interface User {
      roles?: import("imports/api/common").Role[] | null;
    }
  }
}
