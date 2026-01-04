// src/index.js (NOVO CÓDIGO)
// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

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
import EditarCarro from "./pages/3_garagem/editarCarro.jsx";
import NotasTodas from "./pages/3_garagem/notasTodas.jsx";
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

			{element: <ProtectedRoute />, 
			children: [
				{ path: "perfil", element: <Perfil /> },
				{ path: "definicoes", element:<Definicoes /> },

				{ path: "novoCarro", element: <NovoCarro /> },
				{ path: "adicionarPorModelo", element: <AdicionarCarroPorModelo />},
				{ path: "procurarPorEspecificacoes", element: <ProcurarPorEspecificacoes /> },
				{ path: "atualizarPreventivos", element: <AtualizarPreventivos /> },
				{ path: "listaCarrosRecomendados", element: <ListaCarrosRecomendados /> },
				{ path: "listaCarrosSalvos", element:<MostrarCarrosGuardados /> },

				{ path: "garagem", element: <Garagem /> },
				{ path: "todasManutencoes/:carro_id", element: <TodasManutencoes /> },
				{ path: "editarCarro/:carro_id", element: <EditarCarro /> },
				{ path: "notas", element:<NotasTodas /> },



				{ path: "novoCorretivo", element: <NovoCorretivo /> },
				{ path: "novoPreventivo", element: <NovoPreventivo /> },
				{ path: "novoCronico", element: <NovoCronico /> },

				{ path: "todasManutencoes/:carro_id/corretivo/:manutencao_id", element: <VerCorretivo /> },
				{ path: "todasManutencoes/:carro_id/preventivo/:manutencao_id", element: <VerPreventivo />},
				{ path: "todasManutencoes/:carro_id/cronico/:manutencao_id", element:<VerCronico /> },
		],
	},
]
	}]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<React.StrictMode>
		<LocalAppStateProvider>
			<SessionAppStateProvider>
				<RouterProvider router={router}
				fallback={<LoadingSpinner />} />
			</SessionAppStateProvider>
		</LocalAppStateProvider>
	</React.StrictMode>
);

// (Pode remover o 'reportWebVitals' se não o estiver a usar ativamente)
// import reportWebVitals from './reportWebVitals';
// O código 'reportWebVitals()' pode ser mantido ou removido.
// reportWebVitals();
