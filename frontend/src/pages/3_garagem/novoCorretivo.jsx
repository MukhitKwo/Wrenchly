import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";

export default function NovoCorretivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;
	const viewed_cars = getSessionStorage.carros_vistos;
	const [notas, setNotas] = useState("");

	const manutencaoData = state?.manutencaoData || {};
	const tipo = state?.tipo || "corretivo";

	const today = new Date();
	const dateToday = today.toISOString().split("T")[0];

	const [manutencao, setManutencao] = useState({
		carro: carro_id,
		nome: manutencaoData.nome || "",
		tipo: tipo,
		descricao: "",
		quilometragem: "",
		custo: "",
		data: dateToday,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleChangeNotas = (e) => {
		setNotas(e.target.value);
	};

	const guardarManutencao = async () => {
		try {
			const res = await fetch("/api/criarCorretivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			const data = await res.json();
			console.log(data.message);

			let updatedPreventivos = [];
			let updatedCronicos = [];

			if (tipo === "preventivo") {
				const resUpdate = await fetch("/api/atualizarPreventivoDataKm/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ manutencaoData, km: manutencao.quilometragem, data: manutencao.data }),
				});
				const dataUpdate = await resUpdate.json();
				console.log(dataUpdate.message);

				if (resUpdate.ok) {
					updatedPreventivos = viewed_cars
						.find((car) => car.id === Number(carro_id))
						.manutencoes.preventivos.map((p) =>
							p.id === manutencaoData.id
								? {
										...p,
										trocadoNoKm: dataUpdate.trocadoNoKm,
										trocarNoKm: dataUpdate.trocarNoKm,
										trocadoNaData: dataUpdate.trocadoNaData,
										trocarNaData: dataUpdate.trocarNaData,
								  }
								: p
						);
				}
			}

			if (tipo === "cronico") {
				const resUpdate = await fetch("/api/atualizarCronicoKm/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ manutencaoData, km: manutencao.quilometragem }),
				});
				const dataUpdate = await resUpdate.json();
				console.log(dataUpdate.message);

				if (resUpdate.ok) {
					updatedCronicos = viewed_cars
						.find((car) => car.id === Number(carro_id))
						.manutencoes.cronicos.map((c) =>
							c.id === manutencaoData.id
								? {
										...c,
										trocadoNoKm: dataUpdate.trocadoNoKm,
										trocarNoKm: dataUpdate.trocarNoKm,
								  }
								: c
						);
				}
			}

			if (res.ok) {
				const novoKm = Number(data.carro_km);

				const recalcularRisco = (arr) =>
					arr.map((man) => ({
						...man,
						risco: man.kmsEntreTroca ? Number(((novoKm - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2)) : null,
					}));

				const updatedCarros = viewed_cars.map((car) =>
					car.id === Number(carro_id)
						? {
								...car,
								quilometragem: novoKm,
								manutencoes: {
									...car.manutencoes,
									corretivos: [...car.manutencoes.corretivos, data.corretivo_data],
									preventivos: updatedPreventivos.length ? recalcularRisco(updatedPreventivos) : recalcularRisco(car.manutencoes.preventivos),
									cronicos: updatedCronicos.length ? recalcularRisco(updatedCronicos) : recalcularRisco(car.manutencoes.cronicos),
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

				<select name="tipo" value={manutencao.tipo} onChange={handleChange}>
					<option value="corretivo">Corretivo</option>
					<option value="preventivo">Preventivo</option>
					<option value="cronico">Cronico</option>
				</select>

				<textarea placeholder="Descrição" name="descricao" value={manutencao.descricao} onChange={handleChange} />

				<input type="number" placeholder="Quilometragem" name="quilometragem" value={manutencao.quilometragem} onChange={handleChange} />

				<input type="date" name="data" value={manutencao.data} onChange={handleChange} />

				<input type="number" placeholder="Custo (€)" name="custo" value={manutencao.custo} onChange={handleChange} />

				<textarea placeholder="Notas" name="notas" value={notas} onChange={handleChangeNotas} />
			</div>
		</div>
	);
}
