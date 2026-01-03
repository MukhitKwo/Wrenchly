import { Navigate, Outlet } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local";

export default function ProtectedRoute() {
  const { state } = useLocalAppState();

  // Se NÃO estiver autenticado → login
  if (!state?.user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado → renderiza a rota
  return <Outlet />;
}

