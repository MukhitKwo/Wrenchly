import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProcurarPorEspecificacoes() {
	/* ESTADOS POR ESPECIFICAÇÕES */
	const [marcaEsp, setMarcaEsp] = useState("");
	const [combustivelEsp, setCombustivelEsp] = useState("");
	const [cilindradaEsp, setCilindradaEsp] = useState("");
	const [cavalosEsp, setCavalosEsp] = useState("");
	const [transmissaoEsp, setTransmissaoEsp] = useState("");
	const [anoEsp, setAnoEsp] = useState("");
	const [tipoCorpoEsp, setTipoCorpoEsp] = useState("");
	const [economia, setEconomia] = useState("");
	const [alcance, setAlcance] = useState("");

    

	const procurarEspecificacoes = () => {
		console.log("=== PESQUISA POR ESPECIFICAÇÕES ===");
		console.log({
			marcaEsp,
			combustivelEsp,
			cilindradaEsp,
			cavalosEsp,
			transmissaoEsp,
			anoEsp,
			tipoCorpoEsp,
			economia,
			alcance,
		});
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Procurar Carro</h1>
			<p>Escolhe como queres procurar um carro.</p>

			<Link to="/procurarPorModelo">
				<button>Por Modelo</button>
			</Link>
			<button>Por Especificações</button>

			<div>
				<h2>Pesquisar por Especificações</h2>

				<input placeholder="Marca" value={marcaEsp} onChange={(e) => setMarcaEsp(e.target.value)} />

				<select value={combustivelEsp} onChange={(e) => setCombustivelEsp(e.target.value)}>
					<option value="">Combustível</option>
					<option>Gasolina</option>
					<option>Gasóleo</option>
					<option>Elétrico</option>
					<option>Híbrido</option>
				</select>

				<input type="number" min="0" placeholder="Cilindrada (cc)" value={cilindradaEsp} onChange={(e) => setCilindradaEsp(e.target.value)} />

				<input type="number" min="0" placeholder="Cavalos (opcional)" value={cavalosEsp} onChange={(e) => setCavalosEsp(e.target.value)} />

				<select value={transmissaoEsp} onChange={(e) => setTransmissaoEsp(e.target.value)}>
					<option value="">Transmissão</option>
					<option>Manual</option>
					<option>Automática</option>
				</select>

				<input type="number" min="0" placeholder="Ano de Produção" value={anoEsp} onChange={(e) => setAnoEsp(e.target.value)} />

				<select value={tipoCorpoEsp} onChange={(e) => setTipoCorpoEsp(e.target.value)}>
					<option value="">Tipo de Corpo (opcional)</option>
					<option>Sedan</option>
					<option>SUV</option>
					<option>Hatchback</option>
					<option>Coupé</option>
					<option>Carrinha</option>
				</select>

				<input placeholder="Economia de Combustível" value={economia} onChange={(e) => setEconomia(e.target.value)} />

				<input placeholder="Alcance" value={alcance} onChange={(e) => setAlcance(e.target.value)} />

				<button type="button" onClick={procurarEspecificacoes}>
					Procurar
				</button>
			</div>
		</div>
	);
}
