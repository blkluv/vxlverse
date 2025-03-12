import { Navigate, useLocation } from "react-router-dom";
import { pb } from "../../lib/pocketbase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = pb.authStore.isValid;
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the intended destination
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} // Pass the location they were trying to access
        replace 
      />
    );
  }

  return <>{children}</>;
}
