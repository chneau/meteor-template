import { type ReactNode, useContext } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";
import type { Role } from "/imports/api/common";
import { AccountContext } from "../contexts/AccountContext";

interface AuthCheckProps {
	roles?: Role[];
	children: ReactNode;
}

export const Authorize = ({ roles, children }: AuthCheckProps) => {
	const { user } = useContext(AccountContext);
	if (
		user == null ||
		(Array.isArray(roles) && !user?.roles?.some((role) => roles.includes(role)))
	)
		return null;
	return <>{children}</>;
};

export const PrivateRoute = ({
	path,
	element,
	roles,
}: { path: string; element: ReactNode; roles?: Role[] }) => (
	<Route path={path} element={<PrivateRouteGuard roles={roles} />}>
		<Route path={path} element={element} />
	</Route>
);

const PrivateRouteGuard = ({ roles }: { roles?: Role[] }) => {
	const { user, userId } = useContext(AccountContext);
	if (userId != null && user == null) return <></>; // waits full data loading
	if (roles == null) return <Outlet />;
	if (user == null) return <Navigate to="/" />;
	if (roles.length === 0) return <Outlet />;
	if (!user.roles?.some((x) => roles.includes(x))) return <Navigate to="/" />;
	return <Outlet />;
};
