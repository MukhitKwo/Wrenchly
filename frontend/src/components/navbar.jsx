// src/components/navbar.jsx

import { Link } from "react-router-dom"; // 👈 Essencial para a navegação sem recarregar
import { useLocalAppState } from "../context/appState.local";
import "./navbar.css";
// 1. O nome do componente deve começar com letra maiúscula (navbar)
function Navbar() {
	const { state } = useLocalAppState();
	return (
		<nav className="navbar">
			<div className="navbar-container">
				{/* Logotipo/Marca: Usa Link para voltar à página inicial */}
				<Link to="/" className="navbar-logo">
					Wrenchly
				</Link>

				<div className="navbar-links">
					{/* 2. Todos os botões usam <Link> e a prop 'to' com os caminhos do seu Router */}
					{/* <Link to="/">Início</Link> */}

					<Link to="/contatos">Contatos</Link>
					<Link to="/garagem">Garagem</Link>
					<Link to="/notas">Notas</Link>

					{/* <Link to="/sobre">Sobre Nós</Link> */}

					{/* <Link to="/perfil">Perfil</Link> */}

					<Link to="/definicoes">Definições</Link>
					{state?.user ? (
						<span>{state.user.username}</span>
					) : (
						<Link to="/login">Sign In</Link>
					)}

				</div>
			</div>
		</nav>
	);
}

// 3. Exporta o componente com o nome corrigido
export default Navbar;
