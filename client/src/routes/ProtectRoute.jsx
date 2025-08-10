import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../store/user-store";

export default function ProtectedRoute() {
  const tokenFromStore = useUser((s) => s.token);
  const token = tokenFromStore || localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
