import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";
import { useLocalAppState } from "../../context/appState.local";

export default function NovoCorretivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalAppState();

	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;

	const manutencaoData = state?.manutencaoData || {};
	const tipo = state?.tipo || "corretivo";

	const viewed_cars = getSessionStorage.carros_vistos;

	const [notas, setNotas] = useState("");

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
					updatedPreventivos = atualizarPreventivoNoSession(viewed_cars, carro_id, manutencaoData.id, {
						trocadoNoKm: dataUpdate.trocadoNoKm,
						trocarNoKm: dataUpdate.trocarNoKm,
						trocadoNaData: dataUpdate.trocadoNaData,
						trocarNaData: dataUpdate.trocarNaData,
					});

					const proximaData = proximaManutencao(updatedPreventivos);

					setLocalStorage((prev) => {
						const updatedCarrosPreview = prev.carros_preview.map((car) => {
							if (car.id === Number(carro_id)) {
								const updatedCar = {
									...car,
									proxima_manutencao: proximaData,
								};
								return updatedCar;
							}
							return car;
						});

						return {
							...prev,
							carros_preview: updatedCarrosPreview,
						};
					});
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
					updatedCronicos = atualizarCronicoEmMemoria(viewed_cars, carro_id, manutencaoData.id, {
						trocadoNoKm: dataUpdate.trocadoNoKm,
						trocarNoKm: dataUpdate.trocarNoKm,
					});
				}
			}

			if (res.ok) {
				const novoKm = Number(data.carro_km);

				const updatedCarros = atualizarCarroComRisco(viewed_cars, carro_id, novoKm, data.corretivo_data, updatedPreventivos, updatedCronicos);
				setSessionStorage((prev) => ({ ...prev, carros_vistos: updatedCarros }));

				// if (updatedPreventivos.length > 0) {
				// 	console.log("update data");
				// 	syncProximaManutencao();
				// }

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
				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Nome:</span>
					<input name="nome" value={manutencao.nome} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Tipo:</span>
					<select name="tipo" value={manutencao.tipo} onChange={handleChange}>
						<option value="corretivo">Corretivo</option>
						<option value="preventivo">Preventivo</option>
						<option value="cronico">Crónico</option>
					</select>
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Descrição:</span>
					<textarea name="descricao" value={manutencao.descricao} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Quilometragem:</span>
					<input type="number" name="quilometragem" value={manutencao.quilometragem} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Data:</span>
					<input type="date" name="data" value={manutencao.data} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Custo (€):</span>
					<input type="number" name="custo" value={manutencao.custo} onChange={handleChange} />
				</label>

				<label style={{ display: "flex", flexDirection: "column" }}>
					<span style={{ width: "120px" }}>Notas:</span>
					<textarea name="notas" value={notas} onChange={handleChangeNotas} />
				</label>
			</div>
		</div>
	);

	//==============

	function syncProximaManutencao() {
		const carrosVistos = getSessionStorage.carros_vistos ?? [];
		const carrosPreview = getLocalStorage.carros_preview ?? [];
		const today = new Date();

		const updatedPreview = carrosPreview.map((previewCar) => {
			const carroVisto = carrosVistos.find((carro) => carro.id === previewCar.id);

			console.log(carroVisto);

			if (!carroVisto) return previewCar;

			const preventivos = carroVisto.manutencoes?.preventivos ?? [];

			const proximaData = getProximaDataPreventiva(preventivos, today);

			// console.log(proximaData);

			return {
				...previewCar,
				proxima_manutencao: proximaData,
			};
		});

		setLocalStorage({
			...getLocalStorage,
			carros_preview: updatedPreview,
		});
	}

	function getProximaDataPreventiva(preventivos, today) {
		const datasFuturas = preventivos
			.map((p) => new Date(p.trocarNaData))
			.filter((d) => !isNaN(d) && d >= today)
			.sort((a, b) => a - b);

		if (!datasFuturas.length) return null;

		return datasFuturas[0].toISOString().split("T")[0];
	}
}

function recalcularRisco(arr, novoKm) {
	return arr.map((man) => ({
		...man,
		risco: man.kmsEntreTroca ? Number(((novoKm - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2)) : null,
	}));
}

function atualizarCarroComRisco(viewedCars, carroId, novoKm, corretivo, updatedPreventivos, updatedCronicos) {
	return viewedCars.map((car) => {
		if (car.id !== Number(carroId)) return car;

		return {
			...car,
			quilometragem: novoKm,
			manutencoes: {
				...car.manutencoes,
				corretivos: [...car.manutencoes.corretivos, corretivo],
				preventivos: updatedPreventivos.length ? recalcularRisco(updatedPreventivos, novoKm) : recalcularRisco(car.manutencoes.preventivos, novoKm),
				cronicos: updatedCronicos.length ? recalcularRisco(updatedCronicos, novoKm) : recalcularRisco(car.manutencoes.cronicos, novoKm),
			},
		};
	});
}

function atualizarPreventivoNoSession(viewedCars, carroId, manutencaoId, novosDados) {
	const car = viewedCars.find((c) => c.id === Number(carroId));
	if (!car) return [];

	return car.manutencoes.preventivos.map((p) => (p.id === manutencaoId ? { ...p, ...novosDados } : p));
}

function atualizarCronicoEmMemoria(viewedCars, carroId, manutencaoId, novosDados) {
	const car = viewedCars.find((c) => c.id === Number(carroId));
	if (!car) return [];

	return car.manutencoes.cronicos.map((c) => (c.id === manutencaoId ? { ...c, ...novosDados } : c));
}

function proximaManutencao(preventivos) {
	const datasValidas = preventivos
		.map((p) => p.trocarNaData) // get all dates
		.filter((d) => d) // remove null/undefined
		.map((d) => new Date(d)); // convert to Date objects

	const closestDate = new Date(Math.min(...datasValidas));
	return closestDate.toISOString().split("T")[0];
}
