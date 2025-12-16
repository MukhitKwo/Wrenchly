// src/App.js

import { Outlet } from "react-router-dom";
import Navbar from './components/navbar'; // Importar o componente do menu flutuante

function App() {
  return (
    <div className="app-container">
      {/* Menu Flutuante (Sticky) */}
      <Navbar />

      {/* A tag <main> conterá o conteúdo dinâmico (páginas) renderizado pela Router */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Rodapé da Aplicação (Opcional) */}
      <footer className="footer">
        <p style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#eee',
          marginTop: '30px'
        }}>
          Wrenchly © 2025
        </p>
      </footer>
    </div >
  );
}

export default App;