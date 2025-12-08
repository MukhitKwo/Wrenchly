// src/components/navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // 👈 Essencial para a navegação sem recarregar
import './navbar.css'; 

// 1. O nome do componente deve começar com letra maiúscula (navbar)
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* Logotipo/Marca: Usa Link para voltar à página inicial */}
        <Link to="/" className="navbar-logo"> 
          Wrenchly
        </Link>
        
        <div className="navbar-links">
          {/* 2. Todos os botões usam <Link> e a prop 'to' com os caminhos do seu Router */}
          <Link to="/">Início/Garagem</Link>
          
          <Link to="/sobre">Sobre Nós</Link>
          
          {/* Garante que o path é '/contatos' para corresponder à sua rota */}
          <Link to="/contatos">Contatos</Link>
        </div>
      </div>
    </nav>
  );
}

// 3. Exporta o componente com o nome corrigido
export default Navbar;