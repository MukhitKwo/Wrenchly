import { Navigate, Outlet } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local";

export default function ProtectedRoute() {
  const { state } = useLocalAppState();

  if (!state?.user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

