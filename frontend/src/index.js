// src/index.js (NOVO CÓDIGO)
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LocalAppStateProvider } from "./context/appState.local.jsx";
import { SessionAppStateProvider } from "./context/appState.session.jsx";
import App from "./App"; // O componente que servirá de Layout (com navbar e Footer)
import "./index.css";

// Importa os seus componentes de página
import Contatos from "./pages/1_homepage/contatos.jsx";
import Home from "./pages/1_homepage/home.jsx";
import Sobre from "./pages/1_homepage/sobre.jsx";

import Login from "./pages/1_homepage/login.jsx";
import Registo from "./pages/1_homepage/registo.jsx";

import Definicoes from "./pages/2_definicoes/definicoes.jsx";
import Perfil from "./pages/2_definicoes/perfil.jsx";

import NovoCarro from "./pages/4_adicionarCarro/novoCarro.jsx";
import AdicionarCarroPorModelo from "./pages/4_adicionarCarro/adicionarPorModelo.jsx";
import AtualizarPreventivos from "./pages/4_adicionarCarro/atualizarPreventivos.jsx";
import ProcurarPorEspecificacoes from "./pages/4_adicionarCarro/procurarPorEspecificacoes.jsx";
import ListaCarrosRecomendados from "./pages/4_adicionarCarro/listaCarrosRecomendados.jsx";
import MostrarCarrosGuardados from "./pages/4_adicionarCarro/escolherCarroGuardado.jsx";

import Garagem from "./pages/3_garagem/garagem/garagem.jsx";

import TodasManutencoes from "./pages/3_garagem/todasManutencoes.jsx";
import ListaCorretivos from "./pages/3_garagem/listaCorretivos.jsx";
import ListaPreventivos from "./pages/3_garagem/listaPreventivos.jsx";
import ListaCronicos from "./pages/3_garagem/listaCronicos.jsx";

import NovoCorretivo from "./pages/3_garagem/novoCorretivo.jsx";
import VerCorretivo from "./pages/3_garagem/verCorretivo.jsx";
import NovoPreventivo from "./pages/3_garagem/novoPreventivo.jsx";
import VerPreventivo from "./pages/3_garagem/verPreventivo.jsx";
import NovoCronico from "./pages/3_garagem/novoCronico.jsx";
import VerCronico from "./pages/3_garagem/verCronico.jsx";

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
			{ path: "novoCarro", element: <NovoCarro /> },
			{ path: "adicionarPorModelo", element: <AdicionarCarroPorModelo /> },
			{ path: "procurarPorEspecificacoes", element: <ProcurarPorEspecificacoes /> },
			{ path: "atualizarPreventivos", element: <AtualizarPreventivos /> },
			{ path: "listaCarrosRecomendados", element: <ListaCarrosRecomendados /> },
			{ path: "listaCarrosSalvos", element: <MostrarCarrosGuardados /> },
			{ path: "garagem", element: <Garagem /> },
			{ path: "todasManutencoes/:carro_id", element: <TodasManutencoes /> },
			{ path: "listaCorretivos", element: <ListaCorretivos /> },
			{ path: "listaPreventivos", element: <ListaPreventivos /> },
			{ path: "listaCronicos", element: <ListaCronicos /> },
			{ path: "novoCorretivo", element: <NovoCorretivo /> },
			{ path: "/todasManutencoes/:carro_id/corretivo/:manutencao_id", element: <VerCorretivo /> },
			{ path: "novoPreventivo", element: <NovoPreventivo /> },
			{ path: "/todasManutencoes/:carro_id/preventivo/:manutencao_id", element: <VerPreventivo /> },
			{ path: "novoCronico", element: <NovoCronico /> },
			{ path: "/todasManutencoes/:carro_id/cronico/:manutencao_id", element: <VerCronico /> },
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
