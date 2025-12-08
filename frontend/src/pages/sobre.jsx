// src/pages/Sobre.jsx
import React from 'react';

function Sobre() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Sobre Nós 👋</h1>
      <p>
        Bem-vindo à Wrenchly! Somos especializados em manutenção e reparação de equipamentos.
        A nossa missão é fornecer serviços rápidos e confiáveis aos nossos clientes.
      </p>
      {/* Adicione mais conteúdo para preencher a página e permitir o scroll */}
      <div style={{ height: '800px', marginTop: '20px', backgroundColor: '#f5f5f5', padding: '15px' }}>
        <p>A nossa equipa é composta por profissionais certificados...</p>
      </div>
    </div>
  );
}

export default Sobre;