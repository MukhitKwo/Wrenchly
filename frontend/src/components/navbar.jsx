// src/components/navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local";
import "./navbar.css";

function Navbar() {
    const { state, setState } = useLocalAppState();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = window.confirm(
            "Tens a certeza que queres sair da tua conta?"
        );
        if (!confirmLogout) return;

        try {
            const res = await fetch("/api/logoutUser/", {
                method: "POST",
                credentials: "include",
            });

            // mesmo que a API falhe, limpa a sessão local
            if (!res.ok) {
                setState((prev) => ({
                    ...prev,
                    feedback: {
                        type: "error",
                        message: "Erro ao terminar sessão, mas foste desconectado localmente.",
                    },
                }));
            }

            // Limpa estado global + mete feedback
            setState({
                user: null,
                garagem: null,
                definicoes: null,
                carros_preview: [],
                notas: [],
                feedback: {
                    type: "success",
                    message: "Sessão terminada com sucesso.",
                },
            });

            // Redirect automático
            navigate("/login", { replace: true });
        } catch (err) {
            console.error(err);

            // fallback: limpar e avisar
            setState({
                user: null,
                garagem: null,
                definicoes: null,
                carros_preview: [],
                notas: [],
                feedback: {
                    type: "error",
                    message: "Erro inesperado ao terminar sessão.",
                },
            });

            navigate("/login", { replace: true });
        }
    };

    const isAuthenticated = !!state?.user;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Wrenchly
                </Link>

                <div className="navbar-links">
                    {/* Público */}
                    <Link to="/contatos">Contatos</Link>

                    {/* Apenas se estiver autenticado */}
                    {isAuthenticated && (
                        <>
                            <Link to="/garagem">Garagem</Link>
                            <Link to="/notas">Notas</Link>
                            <Link to="/definicoes">Definições</Link>
                        </>
                    )}

                    {/* Auth */}
                    {isAuthenticated ? (
                        <span className="navbar-user">
                            <span>{state.user.username}</span>
                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </span>
                    ) : (
                        <Link to="/login">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;