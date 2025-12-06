// src/index.js (NOVO CÓDIGO)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 

// IMPORTAÇÕES NECESSÁRIAS DO ROUTER E DOS COMPONENTES
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App'; // O componente que servirá de Layout (com Navbar e Footer)

// Importa os seus componentes de página
import Home from './pages/home.jsx';
import Contatos from './pages/contatos.jsx';
import Sobre from './pages/sobre.jsx'; 

// (Pode remover o 'reportWebVitals' se não o estiver a usar ativamente)
// import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/",
    // O elemento pai (App) servirá como o Layout.
    // Ele terá um <Outlet /> onde as rotas "children" serão exibidas.
    element: <App />, 
    children: [ 
      {
        // Rota para o caminho exato "/"
        index: true,
        element: <Home />,
      },
      {
        // Rota para "/sobre"
        path: "sobre",
        element: <Sobre />,
      },
      {
        // Rota para "/contatos"
        path: "contatos",
        element: <Contatos />,
      },
    ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Substituímos <App /> pelo provedor de rotas */}
    <RouterProvider router={router} />
  </React.StrictMode>
);

// O código 'reportWebVitals()' pode ser mantido ou removido.
// reportWebVitals();