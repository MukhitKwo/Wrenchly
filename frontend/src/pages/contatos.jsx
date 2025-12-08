// src/pages/Contatos.jsx
import React from 'react';

function Contatos() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Entre em Contato 📧</h1>
      <p>Estamos disponíveis para responder às suas perguntas. Use os detalhes abaixo:</p>
      
      <ul>
        <li>**Email:** contato@wrenchly.pt</li>
        <li>**Telefone:** +351 987 654 321</li>
        <li>**Morada:** Rua das Oficinas, 123, 4000-001 Porto</li>
      </ul>

      {/* Exemplo de formulário de contato simulado */}
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '30px' }}>
        <h3>Formulário de Contato Simples</h3>
        <p>Formulário virá aqui...</p>
      </div>
    </div>
  );
}

export default Contatos;