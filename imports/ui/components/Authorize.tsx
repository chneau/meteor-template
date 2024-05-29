import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import type { ReactNode } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";

type AuthCheckProps = {
	roles?: string[];
	children: ReactNode;
};
export const Authorize = ({ roles, children }: AuthCheckProps) => {
	const user = useTracker(() => Meteor.user());
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
}: { path: string; element: ReactNode; roles?: string[] }) => (
	<Route path={path} element={<PrivateRouteGuard roles={roles} />}>
		<Route path={path} element={element} />
	</Route>
);

const PrivateRouteGuard = ({ roles }: { roles?: string[] }) => {
	const { user, userId } = useTracker(() => ({
		user: Meteor.user(),
		userId: Meteor.userId(),
	}));
	if (userId != null && user == null) return <></>; // waits full data loading
	if (roles == null) return <Outlet />;
	if (user == null) return <Navigate to="/" />;
	if (roles.length === 0) return <Outlet />;
	if (!user.roles?.some((x) => roles.includes(x))) return <Navigate to="/" />;
	return <Outlet />;
};
