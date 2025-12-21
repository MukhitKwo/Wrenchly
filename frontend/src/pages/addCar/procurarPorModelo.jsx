import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { useNavigate } from "react-router-dom";

export default function ProcurarCarroPorModelo() {
	const navigate = useNavigate();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();
	const garagem_id = getLocalStorage.garagem.id;

	const [caracteristicas, setCaracteristicas] = useState({
		categoria: "",
		marca: "",
		modelo: "",
		ano: "",
		combustivel: "",
		cilindrada: "",
		cavalos: "",
		transmissao: "",
		quilometragem: "",
		matricula: "",
		garagem: garagem_id,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCaracteristicas((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const optional = ["cavalos", "matricula"];

	const allFilled = Object.entries(caracteristicas)
		.filter(([key]) => !optional.includes(key))
		.every(([, value]) => value !== null && value !== "");

	const adicionarCarro = async () => {
		if (!allFilled) {
			return alert("Preencha os campos obrigatorios");
		}

		try {
			const res = await fetch("/api/adicionarCarro/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ caracteristicas }),
			});

			const data = await res.json("");
			console.log(data.message);

			if (res.ok) {
				navigate("/atualizarCronicosPreventivos", {
					state: { carro: data.carro_data, preventivos: data.allPreventivos },
				});

				// setLocalStorage((prev) => ({
				// 	...prev,
				// 	carros_preview: [...prev.carros_preview, data.carroPreview_data], // TODO fix this shit
				// }));
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

				<select name="categoria" onChange={handleChange}>
					<option value="">Tipo / Categoria</option>

					<optgroup label="Carro">
						<option value="carro:sedan">Sedan</option>
						<option value="carro:suv">SUV</option>
						<option value="carro:hatchback">Hatchback</option>
						<option value="carro:coupe">Coupé</option>
						<option value="carro:carrinha">Carrinha</option>
					</optgroup>

					<optgroup label="Mota">
						<option value="mota:naked">Naked</option>
						<option value="mota:sport">Sport</option>
						<option value="mota:touring">Touring</option>
						<option value="mota:custom">Custom</option>
						<option value="mota:adv">Adventure</option>
					</optgroup>

					<optgroup label="Scooter">
						<option value="scooter:urbana">Urbana</option>
						<option value="scooter:maxi">Maxi-scooter</option>
					</optgroup>

					<optgroup label="Quad / ATV">
						<option value="quad:trabalho">Trabalho</option>
						<option value="quad:lazer">Lazer</option>
					</optgroup>

					<optgroup label="Trator">
						<option value="tractor:agricola">Agrícola</option>
						<option value="tractor:industrial">Industrial</option>
					</optgroup>
				</select>

				<input placeholder="Marca" name="marca" onChange={handleChange} />

				<input placeholder="Modelo" name="modelo" onChange={handleChange} />

				<input type="number" min="0" placeholder="Ano" name="ano" onChange={handleChange} />

				{/* <input type="number" min="0" placeholder="Ano Produzido" name="ano_produzido" onChange={handleChange} /> */}

				<select name="combustivel" onChange={handleChange}>
					<option value="">Combustível</option>
					<option value="gasoleo">Diesel</option>
					<option value="gasolina">Gasolina</option>
					<option value="eletrico">Elétrico</option>
					<option value="hibrido">Híbrido</option>
				</select>

				<input type="number" min="0" placeholder="Cilindrada (cc)" name="cilindrada" onChange={handleChange} />

				<input type="number" min="0" placeholder="Cavalos (opcional)" name="cavalos" onChange={handleChange} />

				<select name="transmissao" onChange={handleChange} defaultValue="">
					<option value="" disabled>
						Transmissão
					</option>
					<option value="manual:4speed">Manual 4-speed</option>
					<option value="manual:5speed">Manual 5-speed</option>
					<option value="manual:6speed">Manual 6-speed</option>
					<option value="automatica">Automática</option>
				</select>

				<input type="number" min="0" placeholder="Quilometragem" name="quilometragem" onChange={handleChange} />

				<input placeholder="Matrícula (opcional)" name="matricula" onChange={handleChange} />

				<button type="button" onClick={adicionarCarro}>
					Adicionar
				</button>
			</div>
		</div>
	);
}
