import { Navigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}
