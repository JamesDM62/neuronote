import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Protects a route from being accessed unless the user is authenticated.
 * Wrap your route elements in <ProtectedRoute> to guard them.
 */
export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.session.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
