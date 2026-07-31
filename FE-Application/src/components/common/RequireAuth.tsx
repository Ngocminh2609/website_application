import React from "react";
import {Navigate} from "react-router-dom";
import type {User} from "../../types/auth";

interface RequireAuthProps {
    user: User | null;
    roles?: string[];
    children: React.ReactNode;
    redirectTo?: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
                                                     user,
                                                     roles,
                                                     children,
                                                     redirectTo = "/login",
                                                 }) => {
    if (!user) return <Navigate to={redirectTo} replace/>;
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/" replace/>;
    }
    return <>{children}</>;
};

export default RequireAuth;
