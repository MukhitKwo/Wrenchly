// src/components/navbar.jsx
import React from 'react';

function navbar() {
  return (
    <nav className="Navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          Wrenchly
        </a>
        <div className="navbar-links">
          <a href="#inicio">Início</a>
          <a href="#sobre">Sobre Nós</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
    </nav>
  );
}

export default navbar;