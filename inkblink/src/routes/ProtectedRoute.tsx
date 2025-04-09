import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust path if needed
import { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};
