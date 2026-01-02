import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local.jsx";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { state } = useLocalAppState();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    // Sempre que muda de rota, inicia o loading
    setLoading(true);

    // Verifica imediatamente se o user existe
    if (state?.user) {
      setAutenticado(true);
      setLoading(false); // spinner desaparece automaticamente
    } else {
      // Se não houver user, ainda bloqueia, mas spinner desaparece imediatamente
      setAutenticado(false);
      setLoading(false);
    }
  }, [state, location.pathname]);

  if (loading) return <LoadingSpinner />;           // spinner aparece enquanto loading = true
  if (!autenticado) return <Navigate to="/login" replace />; // bloqueio de acesso

  return children;
}
