import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../../ui/Spinner/Spinner.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

export default function RequireAuth() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <Spinner size="lg" label="Checking your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}