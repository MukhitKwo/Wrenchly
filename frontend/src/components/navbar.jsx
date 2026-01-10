import { useState } from "react";
import { FaBars, FaCar, FaHome, FaPhoneAlt, FaSignInAlt, FaStickyNote, FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useLocalAppState } from "../context/appState.local";
import "./navbar.css";
import logo from "./wrenchly_logo-cropped.svg";

function Navbar() {
	const { state } = useLocalAppState();
	const isAuthenticated = !!state?.user;
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className="navbar">
			<div className="navbar-container">
				<Link to="/" className="navbar-logo">
					<img src={logo} alt="Wrenchly Logo" className="logo-img" />
				</Link>

				<button className="navbar-toggle" onClick={() => setMenuOpen((v) => !v)}>
					<FaBars />
				</button>

				<div className={`navbar-links ${menuOpen ? "open" : ""}`}>
					<NavLink to="/">
						<FaHome />
						<span className="nav-text">Home</span>
					</NavLink>
					<NavLink to="/contatos" onClick={() => setMenuOpen(false)}>
						<FaPhoneAlt />
						<span className="nav-text">Contactos</span>
					</NavLink>

                    <div style={{ borderLeft: "2px solid #185fad", margin: "6px 2px" }}></div>

					{isAuthenticated && (
						<>
							<NavLink to="/garagem" onClick={() => setMenuOpen(false)}>
								<FaCar />
								<span className="nav-text">Garagem</span>
							</NavLink>
							<NavLink to="/notas" onClick={() => setMenuOpen(false)}>
								<FaStickyNote />
								<span className="nav-text">Notas</span>
							</NavLink>
							{/*<NavLink to="/definicoes" onClick={()=>setMenuOpen(false)}><FaCog /> Definições</NavLink>*/}

							<div style={{ borderLeft: "2px solid #185fad", margin: "6px 2px" }}></div>

							<NavLink to="/perfil" onClick={() => setMenuOpen(false)}>
								<FaUser />
								<span className="nav-text">Perfil</span>
							</NavLink>
						</>
					)}

					{!isAuthenticated && (
						<NavLink to="/login" onClick={() => setMenuOpen(false)}>
							<FaSignInAlt />
							<span className="nav-text">Iniciar Sessão</span>
						</NavLink>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
