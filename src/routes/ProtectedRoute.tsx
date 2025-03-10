// ProtectedRoute.tsx
import { Navigate } from "react-router-dom"; // Changed from NavLink
import { useContext, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // You might want to throw an error here since AuthContext should be available
    return null;
  }

  // Use Navigate instead of NavLink for redirection
  return authContext.user ? 
  ( 
    <div>
      {children}
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}
