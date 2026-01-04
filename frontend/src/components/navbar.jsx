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

		await fetch("/api/logoutUser/", {
			method: "POST",
			credentials: "include",
		});

		// 🔹 Limpa estado global
		setState({
			user: null,
			garagem: null,
			definicoes: null,
			carros_preview: [],
			notas: [],
		});

		// 🔹 Redirect automático
		navigate("/login");
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

					{/* 🔒 Apenas se estiver autenticado */}
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
