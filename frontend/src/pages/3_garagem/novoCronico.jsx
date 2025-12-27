import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";

export default function Cronico() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;
	const viewed_cars = getSessionStorage.carros_vistos;

	const [manutencao, setManutencao] = useState({
		carro: carro_id,
		nome: "",
		descricao: "",
		kmsEntreTroca: "",
		trocadoNoKm: carro_kms,
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
			const res = await fetch("/api/criarCronico/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				console.log(data.cronico_data);

				const AdicionarRisco = (man) => ({
					...man,
					risco: man.kmsEntreTroca ? Number(((carro_kms - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2)) : null,
				});

				const novoCronicoComRisco = AdicionarRisco(data.cronico_data);

				const updatedCarros = viewed_cars.map((car) =>
					car.id === Number(carro_id)
						? {
								...car,
								manutencoes: {
									...car.manutencoes,
									cronicos: [...car.manutencoes.cronicos, novoCronicoComRisco],
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
			<h1>Nova Manutenção Crônica</h1>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>
				<button onClick={guardarManutencao}>Guardar</button>
			</div>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "140px" }}>Nome:</span>
					<input name="nome" value={manutencao.nome} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "140px" }}>Descrição:</span>
					<textarea name="descricao" value={manutencao.descricao} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "140px" }}>Kms entre troca:</span>
					<input type="number" name="kmsEntreTroca" value={manutencao.kmsEntreTroca} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "140px" }}>Trocado no km:</span>
					<input type="number" name="trocadoNoKm" value={manutencao.trocadoNoKm} onChange={handleChange} />
				</label>
			</div>
		</div>
	);
}
