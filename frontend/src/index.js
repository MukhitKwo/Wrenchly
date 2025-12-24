// src/index.js (NOVO CÓDIGO)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LocalAppStateProvider } from "./context/appState.local.jsx";
import { SessionAppStateProvider } from "./context/appState.session.jsx";
import App from "./App"; // O componente que servirá de Layout (com navbar e Footer)
import "./index.css";

// Importa os seus componentes de página
import Contatos from "./pages/home/contatos.jsx";
import Home from "./pages/home/home.jsx";
import Sobre from "./pages/home/sobre.jsx";

import Login from "./pages/home/login.jsx";
import Registo from "./pages/home/registo.jsx";

import Definicoes from "./pages/settings/definicoes.jsx";
import Perfil from "./pages/settings/perfil.jsx";

import Garagem from "./pages/garage/garagem/garagem.jsx";

import TodasManutencoes from "./pages/garage/todasManutencoes.jsx";
import ListaCorretivos from "./pages/garage/listaCorretivos.jsx";
import ListaPreventivos from "./pages/garage/listaPreventivos.jsx";
import ListaCronicos from "./pages/garage/listaCronicos.jsx";

import Corretivo from "./pages/garage/corretivo.jsx";
import Preventivo from "./pages/garage/preventivo.jsx";
import Cronico from "./pages/garage/cronico.jsx";

import ListaCarrosRecomendados from "./pages/addCar/listaCarrosRecomendados.jsx";
import ListaCarrosSalvos from "./pages/addCar/listaCarrosSalvos.jsx";
import ProcurarPorEspecificacoes from "./pages/addCar/procurarPorEspecificacoes.jsx";
import AdicionarCarroPorModelo from "./pages/addCar/adicionarPorModelo.jsx";
import AtualizarCronicosPreventivos from "./pages/addCar/atualizarCronicosPreventivos.jsx";

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
			{ path: "registo", element: <Registo /> },
			{ path: "login", element: <Login /> },
			{ path: "definicoes", element: <Definicoes /> },
			{ path: "garagem", element: <Garagem /> },
			{ path: "todasManutencoes/:id", element: <TodasManutencoes /> },
			{ path: "listaCorretivos/:id", element: <ListaCorretivos /> },
			{ path: "listaPreventivos/:id", element: <ListaPreventivos /> },
			{ path: "listaCronicos/:id", element: <ListaCronicos /> },
			{ path: "corretivo", element: <Corretivo /> },
			{ path: "preventivo", element: <Preventivo /> },
			{ path: "cronico", element: <Cronico /> },
			{ path: "adicionarPorModelo", element: <AdicionarCarroPorModelo /> },
			{ path: "procurarPorEspecificacoes", element: <ProcurarPorEspecificacoes /> },
			{ path: "atualizarCronicosPreventivos", element: <AtualizarCronicosPreventivos /> },
			{ path: "listaCarrosRecomendados", element: <ListaCarrosRecomendados /> },
			{ path: "listaCarrosSalvos", element: <ListaCarrosSalvos /> },
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<LocalAppStateProvider>
			<SessionAppStateProvider>
				<RouterProvider router={router} />
			</SessionAppStateProvider>
		</LocalAppStateProvider>
	</React.StrictMode>
);

// (Pode remover o 'reportWebVitals' se não o estiver a usar ativamente)
// import reportWebVitals from './reportWebVitals';
// O código 'reportWebVitals()' pode ser mantido ou removido.
// reportWebVitals();
