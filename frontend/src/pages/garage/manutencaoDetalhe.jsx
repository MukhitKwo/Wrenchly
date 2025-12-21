import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";

export default function ManutencaoDetalhe() {
	const { state: getLocalStorage } = useLocalStorage();
	const carro_id = getLocalStorage?.carro_selecionado?.id;

	const [manutencao, setManutencao] = useState({
		nome: "",
		descricao: "",
		tipo: "",
		data: "",
		custo: "",
		quilometragem: "",
		carro: carro_id,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const guardarManutencao = async () => {
		console.log(manutencao);

		try {
			const res = await fetch("/api/manutencao/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ manutencao }),
			});

			const data = await res.json("");
			console.log(data.message);

			if (res.ok) {
				console.log("sup");

				// navigate("/atualizarCronicosPreventivos", {
				// 	state: { carro: data.carro_data, preventivos: data.allPreventivos },
				// });
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="page-box">
			<h1>Manutenção</h1>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<Link to="/listaManutencoes">
					<button>Voltar</button>
				</Link>

				<button type="button" onClick={guardarManutencao}>
					Guardar
				</button>
			</div>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<input placeholder="Nome" name="nome" value={manutencao.nome} onChange={handleChange} />

				<textarea placeholder="Descrição" name="descricao" value={manutencao.descricao} onChange={handleChange} />

				<select name="tipo" value={manutencao.tipo} onChange={handleChange}>
					<option value="corretiva">Corretiva</option>
					<option value="preventiva">Preventiva</option>
					<option value="cronica">Cronica</option>
				</select>

				<input type="date" name="data" value={manutencao.data} onChange={handleChange} />

				<input type="number" placeholder="Custo (€)" name="custo" value={manutencao.custo} onChange={handleChange} />

				<input type="number" placeholder="Quilometragem" name="quilometragem" value={manutencao.quilometragem} onChange={handleChange} />
			</div>
		</div>
	);
}
