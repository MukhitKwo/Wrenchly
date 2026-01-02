import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local.jsx";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { state } = useLocalAppState();
  const location = useLocation(); // deteta mudança de rota

  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    // Sempre que muda a rota, mostra spinner
    setLoading(true);

    const timer = setTimeout(() => {
      if (state?.user) setAutenticado(true);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [state, location.pathname]); // o spinner reinicia quando muda de página

  if (loading) return <LoadingSpinner />;           // Spinner em todas as páginas
  if (!autenticado) return <Navigate to="/login" replace />; // Bloqueio se não autenticado

  return children;
}