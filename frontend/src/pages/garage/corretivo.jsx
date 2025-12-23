import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Corretivo() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;

	const today = new Date();
	const todayOnly = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

	const [manutencao, setManutencao] = useState({
		carro: carro_id,
		nome: "",
		tipo: "corretiva",
		descricao: "",
		quilometragem: "",
		custo: 0.0,
		data: todayOnly,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const guardarManutencao = async () => {
		try {
			const res = await fetch("/api/criarCorretivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao }),
			});

			const data = await res.json("");
			console.log(data.message);
			if (res.ok) navigate(-1);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="page-box">
			<h1>Nova Manutenção Corretiva</h1>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>

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
