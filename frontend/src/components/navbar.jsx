import { useState } from "react";
import {
    FaBars,
    FaCar,
    FaHome,
    FaInfoCircle,
    FaSignInAlt,
    FaStickyNote,
    FaUser
} from "react-icons/fa";
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

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <FaBars />
                </button>

                <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
                    <NavLink to="/"> <FaHome />  Home </NavLink>
                    <NavLink to="/contatos" onClick={()=>setMenuOpen(false)}> <FaInfoCircle />  Contatos </NavLink>

                    {isAuthenticated && (
                        <>
                            <NavLink to="/garagem" onClick={()=>setMenuOpen(false)}><FaCar /> Garagem</NavLink>
                            <NavLink to="/notas" onClick={()=>setMenuOpen(false)}><FaStickyNote /> Notas</NavLink>
                            {/*<NavLink to="/definicoes" onClick={()=>setMenuOpen(false)}><FaCog /> Definições</NavLink>*/}
                            <NavLink to="/perfil" onClick={()=>setMenuOpen(false)}><FaUser /> Perfil</NavLink>
                        </>
                    )}

                    {!isAuthenticated && (
                        <NavLink to="/login" onClick={()=>setMenuOpen(false)}>
                            <FaSignInAlt /> Iniciar Sessão
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;