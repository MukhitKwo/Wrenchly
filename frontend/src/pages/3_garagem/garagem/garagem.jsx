import { Link } from "react-router-dom";
import { useLocalAppState } from "../../../context/appState.local";

import "./garagem.css";

export default function Garagem() {
	const { state: getLocalStorage } = useLocalAppState();
	const carros = getLocalStorage.carros_preview;
	const garagem = getLocalStorage.garagem;

	return (
		<div className="page-box">
			<h1>{garagem.nome}</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px" }}>
				<Link to="/novoCarro">
					<button>Adicionar carro</button>
				</Link>
				<button>Notas todos os carros</button>
			</div>

			<div className="carros-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
				{carros.length === 0 ? (
					<p>Não tens carros na garagem.</p>
				) : (
					carros.map((carro) => (
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
		<div className="carro-panel">
			<h2>{carro.full_name || "Sem nome"}</h2>
			<p>
				<strong>Matrícula:</strong> {carro.matricula ?? "N/A"}
			</p>
			<p>
				<strong>Próxima manutenção:</strong> {diasParaManutencao(carro.proxima_manutencao)}
			</p>
			{carro.foto && <img src={carro.foto} alt={carro.nome} />}
		</div>
	);
}
