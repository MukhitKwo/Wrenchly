import { useState } from "react";
import { Link } from "react-router-dom";
import defaultImage from "../../../components/car_default_image.jpg";
import { useLocalAppState } from "../../../context/appState.local";

import "./garagem.css";

export default function Garagem() {
	const { state: getLocalStorage } = useLocalAppState();
	const carros = getLocalStorage.carros_preview;
	const garagem = getLocalStorage.garagem;
	const [ordenacaoCarros, setOrdenacaoCarros] = useState("nome");

	const ordenarCarros = (listaCarros) => {
		if (!Array.isArray(listaCarros)) return [];

		const copia = [...listaCarros];

		if (ordenacaoCarros === "criacao") {
			return copia.sort((a, b) => b.id - a.id);
		}

		if (ordenacaoCarros === "manutencao") {
			return copia.sort((a, b) => new Date(a.proxima_manutencao) - new Date(b.proxima_manutencao));
		}

		// default → nome A-Z
		return copia.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
	};

	return (
		<div className="page-box">
			<h1>{garagem.nome}</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px" }}>
				<Link to="/novoCarro">
					<button style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Adicionar carro</button>
				</Link>
				<button style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Notas todos os carros</button>
			</div>
			<div style={{ marginBottom: "16px" }}>
				<label style={{ marginRight: "10px" }}>Ordenar por:</label>
				<select value={ordenacaoCarros} onChange={(e) => setOrdenacaoCarros(e.target.value)}>
					<option value="nome">Nome (A–Z)</option>
					<option value="criacao">Criação</option>
					<option value="manutencao">Manutenção</option>
				</select>
			</div>
			<div className="carros-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
				{carros.length === 0 ? (
					<p>Não tens carros na garagem.</p>
				) : (
					Array.isArray(carros) &&
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
	const diffMillis = proximaManutencao - hoje;
	const diffDias = Math.ceil(diffMillis / (1000 * 60 * 60 * 24));

	if (diffDias >= 0) {
		return `${diffDias} dias`;
	} else {
		return "Pendente";
	}
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
