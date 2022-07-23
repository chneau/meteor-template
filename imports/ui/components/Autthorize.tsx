import { ReactNode, useContext } from "react";
import { AccountContext } from "../contexts/AccountContext";
import { Role } from "/imports/api/common";

interface AuthCheckProps {
  role?: Role | Role[];
  children: ReactNode;
}

export const Authorize = ({ role: is, children }: AuthCheckProps) => {
  const { user } = useContext(AccountContext);
  if (
    user == null ||
    (typeof is == "string" && !user?.roles?.includes(is)) ||
    (typeof is == "object" && !user?.roles?.some((role) => is.includes(role)))
  )
    return null;
  return <>{children}</>;
};
