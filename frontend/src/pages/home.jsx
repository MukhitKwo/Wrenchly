// src/pages/Home.jsx
import React from 'react';

// 1. Defina o componente
function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Página Inicial (Início)</h1>
      <p>Bem-vindo ao Wrenchly! Esta é a primeira página da sua aplicação React.</p>
      {/* Você pode adicionar mais conteúdo e componentes aqui */}
    </div>
  );
}

// 2. Exporte o componente para que o App.js possa usá-lo
export default Home;