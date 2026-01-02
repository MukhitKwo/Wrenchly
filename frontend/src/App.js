// src/App.js

import { Outlet } from "react-router-dom";
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Importa o ProtectedRoute

function App() {
  return (
    <div className="app-container">
      {/* Menu Flutuante (Sticky) */}
      <Navbar />

      {/* Conteúdo principal */}
      <main className="main-content">
        {/* Spinner + proteção automática em todas as páginas */}
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
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
    </div>
  );
}

export default App;
