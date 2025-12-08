// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css'; // Vamos criar este ficheiro de estilos no próximo passo

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Wrenchly
        </a>
        <div className="navbar-links">
          <a href="#inicio">Início</a>
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre Nós</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;