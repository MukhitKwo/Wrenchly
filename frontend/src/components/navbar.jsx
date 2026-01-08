// src/components/navbar.jsx

import { FaCar, FaCog, FaHome, FaInfoCircle, FaSignInAlt, FaStickyNote, FaUser } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local";
import "./navbar.css";

import logo from "./wrenchly_logo-cropped.svg";

function Navbar() {
	const { state, setState } = useLocalAppState();
	const navigate = useNavigate();
	//eslint-disable-next-line no-unused-vars
	const handleLogout = async () => {
		const confirmLogout = window.confirm("Tens a certeza que queres sair da tua conta?");
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
					<img src={logo} alt="Wrenchly Logo" className="logo-img" />
				</Link>

				<div className="navbar-links">
					
					<NavLink to="/contatos" className={({ isActive }) => (isActive ? "active" : "")}>
						<FaHome style={{ marginRight: "6px" }} />
						Contatos
					</NavLink>
					{isAuthenticated && (
						<>
							<NavLink to="/garagem" className={({ isActive }) => (isActive ? "active" : "")}>
								<FaCar style={{ marginRight: "6px" }} />
								Garagem
							</NavLink>
							<NavLink to="/notas" className={({ isActive }) => (isActive ? "active" : "")}>
								<FaStickyNote style={{ marginRight: "6px" }} />
								Notas
							</NavLink>
							<NavLink to="/definicoes" className={({ isActive }) => (isActive ? "active" : "")}>
								<FaCog style={{ marginRight: "6px" }} />
								Definições
							</NavLink>
							<NavLink to="/perfil" className={({ isActive }) => (isActive ? "active" : "")}>
								<FaUser style={{ marginRight: "6px" }} />
								Perfil
							</NavLink>
						</>
					)}
					{!isAuthenticated && (
						<NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
							<FaSignInAlt style={{ marginRight: "6px" }} />
							Iniciar Sessão	
						</NavLink>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
