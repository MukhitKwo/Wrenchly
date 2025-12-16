// src/index.js (NOVO CÓDIGO)
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { AppProvider } from "./context/appContext.jsx"; // your context

// IMPORTAÇÕES NECESSÁRIAS DO ROUTER E DOS COMPONENTES
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App"; // O componente que servirá de Layout (com navbar e Footer)

// Importa os seus componentes de página
import Home from "./pages/homepage/home.jsx";
import Contatos from "./pages/homepage/contatos.jsx";
import Sobre from "./pages/homepage/sobre.jsx";

import Login from "./pages/homepage/login.jsx";
import Registro from "./pages/homepage/registro.jsx";

import Garagem from "./pages/garagemUser/garagem.jsx";
import Manutencoes from "./pages/garagemUser/manutencoes.jsx";
import Preventivos from "./pages/garagemUser/preventivos.jsx";
import Cronicos from "./pages/garagemUser/cronicos.jsx";

import ManutencaoDetalhe from "./pages/garagemUser/manutencaoDetalhe.jsx";
import PreventivoDetalhe from "./pages/garagemUser/preventivoDetalhe.jsx";
import CronicoDetalhe from "./pages/garagemUser/cronicoDetalhe.jsx";

import ProcurarCarroPorModelo from "./pages/procurarCarro/procurarPorModelo.jsx";
import ProcurarPorEspecificacoes from "./pages/procurarCarro/procurarPorEspecificacoes.jsx";
import ListaCarrosRecomendados from "./pages/procurarCarro/listaCarrosRecomendados.jsx";
import ListaCarrosSalvos from "./pages/procurarCarro/listaCarrosSalvos.jsx";


import Definicoes from "./pages/definicoesUser/definicoes.jsx";
import Perfil from "./pages/definicoesUser/perfil.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		// O elemento pai (App) servirá como o Layout.
		// Ele terá um <Outlet /> onde as rotas "children" serão exibidas.
		element: <App />,
		children: [
			{ index: true, element: <Home /> }, // Rota para o caminho exato "/"
			{ path: "sobre", element: <Sobre /> }, // Rota para "/sobre"
			{ path: "contatos", element: <Contatos /> }, // Rota para "/contatos"
			{ path: "perfil", element: <Perfil /> }, //rota para "/perfil"
			{ path: "login", element: <Login /> },
			{ path: "registro", element: <Registro /> },
			{ path: "garagem", element: <Garagem /> },
			{ path: "manutencoes", element: <Manutencoes /> },
			{ path: "preventivos", element: <Preventivos /> },
			{ path: "cronicos", element: <Cronicos /> },
			{ path: "garagem", element: <Garagem /> },
			{ path: "manutencaoDetalhe", element: <ManutencaoDetalhe /> },
			{ path: "preventivoDetalhe", element: <PreventivoDetalhe /> },
			{ path: "cronicoDetalhe", element: <CronicoDetalhe /> },
			{ path: "procurarPorModelo", element: <ProcurarCarroPorModelo /> },
			{ path: "procurarPorEspecificacoes", element: <ProcurarPorEspecificacoes /> },
			{ path: "listaCarrosRecomendados", element: <ListaCarrosRecomendados /> },
			{ path: "listaCarrosSalvos", element: <ListaCarrosSalvos /> },
			{ path: "definicoes", element: <Definicoes /> },
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<AppProvider>
			<RouterProvider router={router} />
		</AppProvider>
	</React.StrictMode>
);

// (Pode remover o 'reportWebVitals' se não o estiver a usar ativamente)
// import reportWebVitals from './reportWebVitals';
// O código 'reportWebVitals()' pode ser mantido ou removido.
// reportWebVitals();
