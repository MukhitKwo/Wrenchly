// src/index.js (NOVO CÓDIGO)
// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

import { LocalAppStateProvider } from "./context/appState.local.jsx";
import { SessionAppStateProvider } from "./context/appState.session.jsx";
import "./index.css";

// Homepage
import Contatos from "./pages/1_homepage/contatos.jsx";
import Home from "./pages/1_homepage/home.jsx";
import Login from "./pages/1_homepage/login.jsx";
import Registo from "./pages/1_homepage/registo.jsx";
import Sobre from "./pages/1_homepage/sobre.jsx";

// Definições
import Definicoes from "./pages/2_definicoes/definicoes.jsx";
import Perfil from "./pages/2_definicoes/perfil.jsx";

// Adicionar carro
import AdicionarCarroPorModelo from "./pages/4_adicionarCarro/adicionarPorModelo.jsx";
import AtualizarPreventivos from "./pages/4_adicionarCarro/atualizarPreventivos.jsx";
import MostrarCarrosGuardados from "./pages/4_adicionarCarro/escolherCarroGuardado.jsx";
import ListaCarrosRecomendados from "./pages/4_adicionarCarro/listaCarrosRecomendados.jsx";
import NovoCarro from "./pages/4_adicionarCarro/novoCarro.jsx";
import ProcurarPorEspecificacoes from "./pages/4_adicionarCarro/procurarPorEspecificacoes.jsx";

// Garagem
import Garagem from "./pages/3_garagem/garagem/garagem.jsx";
import TodasManutencoes from "./pages/3_garagem/todasManutencoes.jsx";

// Detalhes / criação
import NovoCorretivo from "./pages/3_garagem/novoCorretivo.jsx";
import NovoCronico from "./pages/3_garagem/novoCronico.jsx";
import NovoPreventivo from "./pages/3_garagem/novoPreventivo.jsx";
import VerCorretivo from "./pages/3_garagem/verCorretivo.jsx";
import VerCronico from "./pages/3_garagem/verCronico.jsx";
import VerPreventivo from "./pages/3_garagem/verPreventivo.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "sobre", element: <Sobre /> },
			{ path: "contatos", element: <Contatos /> },
			{ path: "login", element: <Login /> },
			{ path: "registo", element: <Registo /> },

			{ path: "perfil", element: <ProtectedRoute><Perfil /></ProtectedRoute> },
			{ path: "definicoes", element: <ProtectedRoute><Definicoes /></ProtectedRoute> },

			{ path: "novoCarro", element: <ProtectedRoute><NovoCarro /></ProtectedRoute> },
			{ path: "adicionarPorModelo", element: <ProtectedRoute><AdicionarCarroPorModelo /></ProtectedRoute> },
			{ path: "procurarPorEspecificacoes", element: <ProtectedRoute><ProcurarPorEspecificacoes /></ProtectedRoute> },
			{ path: "atualizarPreventivos", element: <ProtectedRoute><AtualizarPreventivos /></ProtectedRoute> },
			{ path: "listaCarrosRecomendados", element: <ProtectedRoute><ListaCarrosRecomendados /></ProtectedRoute> },
			{ path: "listaCarrosSalvos", element: <ProtectedRoute><MostrarCarrosGuardados /></ProtectedRoute> },

			{ path: "garagem", element: <ProtectedRoute><Garagem /></ProtectedRoute> },
			{ path: "todasManutencoes/:carro_id", element: <ProtectedRoute><TodasManutencoes /></ProtectedRoute> },

			{ path: "novoCorretivo", element: <ProtectedRoute><NovoCorretivo /></ProtectedRoute> },
			{ path: "novoPreventivo", element: <ProtectedRoute><NovoPreventivo /></ProtectedRoute> },
			{ path: "novoCronico", element: <ProtectedRoute><NovoCronico /></ProtectedRoute> },

			{ path: "todasManutencoes/:carro_id/corretivo/:manutencao_id", element: <ProtectedRoute><VerCorretivo /></ProtectedRoute> },
			{ path: "todasManutencoes/:carro_id/preventivo/:manutencao_id", element: <ProtectedRoute><VerPreventivo /></ProtectedRoute> },
			{ path: "todasManutencoes/:carro_id/cronico/:manutencao_id", element: <ProtectedRoute><VerCronico /></ProtectedRoute> },
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
