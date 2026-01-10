import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../components/car_default_image.jpg";
import { useLocalAppState } from "../../context/appState.local";
import { FaPlus } from "react-icons/fa";

import "./garagem.css";

export default function Garagem() {
	const { state: getLocalStorage, setState } = useLocalAppState();
	const navigate = useNavigate();

	const carros = getLocalStorage.carros_preview || [];
	const garagem = getLocalStorage.garagem;

	const [ordenacaoCarros, setOrdenacaoCarros] = useState("criacao");

	const handleForbidden = useCallback(() => {
		setState((prev) => ({
			...prev,
			user: null,
			garagem: null,
			definicoes: null,
			carros_preview: [],
			notas: [],
			feedback: {
				type: "error",
				message: "Sessão expirada. Inicia sessão novamente.",
			},
		}));

		navigate("/login", { replace: true });
	}, [setState, navigate]);

	// proteção contra sessão expirada / estado inválido
	useEffect(() => {
		if (!garagem) {
			handleForbidden();
		}
	}, [garagem, handleForbidden]);

	const ordenarCarros = (listaCarros) => {
		if (!Array.isArray(listaCarros)) return [];

		const copia = [...listaCarros];

		if (ordenacaoCarros === "nome") {
			return copia.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
		}

		if (ordenacaoCarros === "manutencao") {
			return copia.sort((a, b) => new Date(a.proxima_manutencao) - new Date(b.proxima_manutencao));
		}

		return copia.sort((a, b) => b.id - a.id);
	};

	if (!garagem) return null; // evita render intermédio

	return (
		<div>
			<div className="garage-header">
				{/* Left */}
				<div className="garage-left">
					<label>Ordenar por:</label>
					<select value={ordenacaoCarros} onChange={(e) => setOrdenacaoCarros(e.target.value)}>
						<option value="criacao">Criação</option>
						<option value="nome">Nome (A–Z)</option>
						<option value="manutencao">Manutenção</option>
					</select>
				</div>

				{/* Center */}
				<h1 className="garage-title">{garagem.nome}</h1>

				{/* Right */}
				<div className="garage-right">
					<Link to="/novoCarro">
						<button className="standar-button">
							<FaPlus style={{ marginRight: "8px" }} />
							Adicionar carro
						</button>
					</Link>
				</div>
			</div>

			<div
				className="carros-container"
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "20px",
					justifyContent: "center",
				}}
			>
				{carros.length === 0 ? (
					<p>Não tens carros na garagem.</p>
				) : (
					ordenarCarros(carros).map((carro) => (
						<Link key={carro.id} to={`/todasManutencoes/${carro.id}`} className="carro-link">
							<CarroCard carro={carro} />
						</Link>
					))
				)}
			</div>
		</div>
	);
}

function diasParaManutencao(data) {
	if (!data) return "N/A";

	const proximaManutencao = new Date(data);
	const hoje = new Date();
	const diffDias = Math.ceil((proximaManutencao - hoje) / (1000 * 60 * 60 * 24));

	return diffDias >= 0 ? `${diffDias} dias` : "Pendente";
}

function CarroCard({ carro }) {
	return (
		<div
			className="carro-panel"
			style={{
				backgroundImage: `url(${carro.imagem_url || defaultImage})`,
			}}
		>
			<div className="carro-overlay">
				<div className="carro-header">
					<h2>{carro.full_name || "Sem nome"}</h2>
					<span className="carro-matricula">{carro.matricula ?? "N/A"}</span>
				</div>

				<div className="carro-footer">
					<strong>Próxima manutenção:</strong> {diasParaManutencao(carro.proxima_manutencao)}
				</div>
			</div>
		</div>
	);
}
