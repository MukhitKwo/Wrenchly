import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";

export default function NovoPreventivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;
	const viewed_cars = getSessionStorage.carros_vistos;

	const today = new Date().toISOString().split("T")[0];

	const [manutencao, setManutencao] = useState({
		carro: carro_id,
		nome: "",
		descricao: "",
		diasEntreTroca: "",
		trocadoNaData: today,
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
		const valoresExtremos =
			manutencao.kmsEntreTroca < 1000 ||
			manutencao.kmsEntreTroca > 100000 ||
			manutencao.diasEntreTroca < 7 ||
			manutencao.diasEntreTroca > 3650;

		if (valoresExtremos) {
			const confirmar = window.confirm(
				"Os valores introduzidos parecem fora do normal. Tens a certeza que estão corretos?"
			);

			if (!confirmar) return;
		}

		try {
			const res = await fetch("/api/criarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				const AdicionarRisco = (man) => ({
					...man,
					risco: man.kmsEntreTroca ? Number(((carro_kms - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2)) : null, // TODO risco com data
				});

				const novoPreventivoComRisco = AdicionarRisco(data.preventivo_data);

				const updatedCarros = viewed_cars.map((car) =>
					car.id === Number(carro_id)
						? {
							...car,
							manutencoes: {
								...car.manutencoes,
								preventivos: [...car.manutencoes.preventivos, novoPreventivoComRisco],
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
			<h1>Nova Manutenção Preventiva</h1>

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
					<span style={{ width: "140px" }}>Dias entre troca:</span>
					<input type="number" name="diasEntreTroca" value={manutencao.diasEntreTroca} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "140px" }}>Trocado na data:</span>
					<input type="date" name="trocadoNaData" value={manutencao.trocadoNaData} onChange={handleChange} />
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
