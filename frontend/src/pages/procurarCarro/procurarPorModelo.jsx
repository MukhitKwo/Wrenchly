import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";

export default function ProcurarCarroPorModelo() {
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();

	const garagem_id = getLocalStorage.garagem.id;

	const [caracteristicas, setCaracteristicas] = useState({
		marca: null,
		modelo: null,
		ano: null,
		combustivel: null,
		cilindrada: null,
		cavalos: null,
		ano_produzido: null,
		transmissao: null,
		quilometragem: null,
		tipo_corpo: null,
		matricula: null,
		garagem: garagem_id,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCaracteristicas((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const optional = ["cavalos", "tipo_corpo", "matricula"];

	const allFilled = Object.entries(caracteristicas)
		.filter(([key]) => !optional.includes(key))
		.every(([, value]) => value !== null && value !== "");

	const adicionarCarro = async () => {
		if (!allFilled) {
			return alert("Preencha os campos obrigatorios");
		}

		try {
			const res = await fetch("/api/adicionarCarroComModelo/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ caracteristicas }),
			});

			const data = await res.json("");
			console.log(data.message);

			if (res.ok) {
				setLocalStorage((prev) => ({
					...prev,
					carros_preview: [...(prev.carros_preview), data.carroPreview_data], // TODO fix this shit
				}));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Procurar Carro</h1>
			<p>Escolhe como queres procurar um carro.</p>

			<button>Por Modelo</button>

			<Link to="/procurarPorEspecificacoes">
				<button>Por Especificações</button>
			</Link>

			<div>
				<h2>Pesquisar por Modelo</h2>

				<input placeholder="Marca" name="marca" onChange={handleChange} />

				<input placeholder="Modelo" name="modelo" onChange={handleChange} />

				<input type="number" min="0" placeholder="Ano" name="ano" onChange={handleChange} />

				<select name="combustivel" onChange={handleChange}>
					<option value="">Combustível</option>
					<option>Gasolina</option>
					<option>Gasóleo</option>
					<option>Elétrico</option>
					<option>Híbrido</option>
				</select>

				<input type="number" min="0" placeholder="Cilindrada (cc)" name="cilindrada" onChange={handleChange} />

				<input type="number" min="0" placeholder="Cavalos (opcional)" name="cavalos" onChange={handleChange} />

				<input type="number" min="0" placeholder="Ano de Produção" name="ano_produzido" onChange={handleChange} />

				<select name="transmissao" onChange={handleChange}>
					<option value="">Transmissão</option>
					<option>Manual</option>
					<option>Automática</option>
				</select>

				<input type="number" min="0" placeholder="Quilometragem" name="quilometragem" onChange={handleChange} />

				<select name="tipo_corpo" onChange={handleChange}>
					<option value="">Tipo de Corpo (opcional)</option>
					<option>Sedan</option>
					<option>SUV</option>
					<option>Hatchback</option>
					<option>Coupé</option>
					<option>Carrinha</option>
				</select>

				<input placeholder="Matrícula (opcional)" name="matricula" onChange={handleChange} />

				<button type="button" onClick={adicionarCarro}>
					Procurar
				</button>
			</div>
		</div>
	);
}
