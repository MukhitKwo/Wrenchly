// src/pages/Perfil.jsx

import React from 'react';

function Perfil() {
  // Dados de utilizador fictícios (pode ser substituído por dados reais de uma API)
  const utilizador = {
    nome: "Rui Tolstykh",
    email: "macaco@wrenchly.pt",
    cargo: "Mecânico Aldrabão",
    membroDesde: "Setembro 2025",
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>👤 Perfil do Utilizador</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>{utilizador.nome}</h2>
        
        <p><strong>Email:</strong> {utilizador.email}</p>
        <p><strong>Cargo:</strong> {utilizador.cargo}</p>
        <p><strong>Membro Desde:</strong> {utilizador.membroDesde}</p>
        
        <button 
          style={{ 
            marginTop: '15px', 
            padding: '10px 15px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
}

export default Perfil;