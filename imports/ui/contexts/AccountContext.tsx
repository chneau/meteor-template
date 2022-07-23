import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { createContext, ReactNode } from "react";

interface AccountInfo {
  user?: Meteor.User;
  userId?: string;
}

export const AccountContext = createContext({} as AccountInfo);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const account = useTracker(() => {
    const userId = Meteor.userId() ?? undefined;
    const user = Meteor.user() ?? undefined;
    return { user, userId };
  });
  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>;
};
