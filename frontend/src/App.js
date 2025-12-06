// Exemplo de como deve estar o seu src/App.js

import { Outlet, Link } from "react-router-dom"; 

function App() {
  return (
    <div>
      {/* Aqui fica a sua barra de navegação */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/sobre">Sobre</Link>
        {/* ... */}
      </nav>

      {/* ESTE É O PONTO CHAVE: Aqui a página atual é renderizada */}
      <main>
        <Outlet /> 
      </main>

      {/* Aqui fica o seu rodapé */}
      <footer>
        <p>Rodapé da App</p>
      </footer>
    </div>
  );
}

export default App;