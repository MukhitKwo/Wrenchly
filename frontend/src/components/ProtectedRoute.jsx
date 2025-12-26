import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local.jsx";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
	const { state } = useLocalAppState();
	const [loading, setLoading] = useState(true);
	const [autenticado, setAutenticado] = useState(false);

	useEffect(() => {
		// Simula validação de sessão (API no futuro)
		const timer = setTimeout(() => {
			if (state?.user) {
				setAutenticado(true);
			}
			setLoading(false);
		}, 600);

		return () => clearTimeout(timer);
	}, [state]);

	// Spinner global
	if (loading) {
		return <LoadingSpinner text="A verificar sessão..." />;
	}

	//  Bloqueio de acesso
	if (!autenticado) {
		return <Navigate to="/login" replace />;
	}

	// Acesso permitido
	return children;
}

