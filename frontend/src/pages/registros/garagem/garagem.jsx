import { Link } from "react-router-dom";
import './garagem.css';
import { useState } from "react";

export default function Garagem() {
	const [secao, setSecao] = useState("homepage");
	return (
		<div className="page-box">
			<h1>Garagem</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px", }} >
				<button className="buttonStyles" onClick={() => setSecao("homepage")}> Homepage </button>
				<button className="buttonStyles" onClick={() => setSecao("criar")}> Criar novo carro </button>
				<button className="buttonStyles" onClick={() => setSecao("definicoes")}> Definições </button>
			</div>

			{/* HOMEPAGE */}
			{secao === "homepage" && (
				<div style={{ padding: "20px" }}>
					<p>lista arros aqui</p>

					<Link to="/manutencoes">
						<button>Ver Manutenções</button>
					</Link>
				</div>
			)}

			{/* CRIAR CARRO */}
			{secao === "criar" && (
				<div style={{ padding: "20px" }}>
					<p>Formulário de criação do carro</p>
				</div>
			)}

			{/* DEFINIÇÕES */}
			{secao === "definicoes" && (
				<div style={{ padding: "20px" }}>
					<p>Aqui ficam as definições</p>
				</div>
			)}
		</div>
	);
}
