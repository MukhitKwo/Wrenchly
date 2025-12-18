import { Link } from "react-router-dom";
import { useLocalStorage } from "../../../context/appContext";

import "./garagem.css";

export default function Garagem() {
	const { state: getLocalStorage } = useLocalStorage();
	const carros = getLocalStorage.carros_preview;

	return (
		<div className="page-box">
			<h1>Garagem</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px" }}>
				<Link to="/procurarPorModelo">
					<button>Adicionar carro</button>
				</Link>
			</div>

			<div className="carros-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
				{carros.length === 0 ? (
					<p>Não tens carros na garagem.</p>
				) : (
					carros.map((carro, index) => (
						<div
							key={index}
							className="carro-panel"
							style={{
								border: "1px solid #ccc",
								borderRadius: "8px",
								padding: "15px",
								width: "200px",
								textAlign: "center",
								boxShadow: "2px 2px 6px rgba(0,0,0,0.1)",
							}}
						>
							<h2>{carro.marca || carro.modelo || "Sem marca"}</h2>
							<p>
								<strong>Marca:</strong> {carro.marca || "N/A"}
							</p>
							<p>
								<strong>Modelo:</strong> {carro.modelo || "N/A"}
							</p>
							<p>
								<strong>Ano:</strong> {carro.ano || "N/A"}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}
