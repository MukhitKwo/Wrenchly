import { Link } from "react-router-dom";
import { useLocalStorage } from "../../../context/appContext";

import "./garagem.css";

export default function Garagem() {
	const { state: getLocalStorage } = useLocalStorage();
	const carros = getLocalStorage.carros_preview;
	const garagem = getLocalStorage.garagem;

	return (
		<div className="page-box">
			<h1>{garagem.nome}</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px" }}>
				<Link to="/adicionarPorModelo">
					<button>Adicionar carro</button>
				</Link>
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

function CarroCard({ carro }) {
	return (
		<div className="carro-panel">
			<h2>{carro.full_name || "Sem nome"}</h2>
			<p>
				<strong>Matrícula:</strong> {carro.matricula ?? "N/A"}
			</p>
			<p>
				<strong>Próxima manutenção:</strong> {carro.proxima_manutencao ?? "N/A"}
			</p>
			{carro.foto && <img src={carro.foto} alt={carro.nome} />}
		</div>
	);
}
