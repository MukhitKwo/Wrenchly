import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";

export default function Corretivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;
	const viewed_cars = getSessionStorage.carros_vistos;

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
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			const data = await res.json("");
			console.log(data.message);

			if (res.ok) {
				const updatedCarros = viewed_cars.map((car) =>
					car.id === Number(carro_id)
						? {
								...car,
								quilometragem: Number(data.carro_km),
								manutencoes: {
									...car.manutencoes,
									corretivos: [...car.manutencoes.corretivos, data.corretivo_data],
								},
						  }
						: car
				);

				setSessionStorage((prev) => ({ ...prev, carros_vistos: updatedCarros }));

				navigate(-1);
			}
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
