import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

interface SecuredRouteProps {
  children: ReactNode;
}

function SecuredRoute(props: SecuredRouteProps) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-bold text-blue-500">
        loading...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{props.children}</>;
}

export default SecuredRoute;
