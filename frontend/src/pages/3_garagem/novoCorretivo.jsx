import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function NovoCorretivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const { setState: setLocalStorage } = useLocalAppState();

	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;

	const manutencaoData = state?.manutencaoData || {};
	const tipo = state?.tipo || "corretivo";

	const viewed_cars = getSessionStorage.carros_vistos;

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
		nota: ""
	});

	const showFeedback = (type, message) => {
		setLocalStorage((prev) => ({
			...prev,
			feedback: { type, message },
		}));
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const guardarManutencao = async () => {
		if (!manutencao.nome || !manutencao.quilometragem || !manutencao.data) {
			showFeedback("error", "Preenche os campos obrigatórios.");
			return;
		}

		try {
			const res = await fetch("/api/criarCorretivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao guardar manutenção.");
				return;
			}

			let updatedPreventivos = [];
			let updatedCronicos = [];

			if (tipo === "preventivo") {
				const resUpdate = await fetch("/api/atualizarPreventivoDataKm/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						manutencaoData,
						km: manutencao.quilometragem,
						data: manutencao.data,
					}),
				});
				const dataUpdate = await resUpdate.json();

				if (resUpdate.ok) {
					updatedPreventivos = atualizarPreventivoNoSession(
						viewed_cars,
						carro_id,
						manutencaoData.id,
						{
							trocadoNoKm: dataUpdate.trocadoNoKm,
							trocarNoKm: dataUpdate.trocarNoKm,
							trocadoNaData: dataUpdate.trocadoNaData,
							trocarNaData: dataUpdate.trocarNaData,
						}
					);

					const proximaData = proximaManutencao(updatedPreventivos);

					setLocalStorage((prev) => ({
						...prev,
						carros_preview: prev.carros_preview.map((car) =>
							car.id === Number(carro_id)
								? { ...car, proxima_manutencao: proximaData }
								: car
						),
					}));
				}
			}

			if (tipo === "cronico") {
				const resUpdate = await fetch("/api/atualizarCronicoKm/", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						manutencaoData,
						km: manutencao.quilometragem,
					}),
				});
				const dataUpdate = await resUpdate.json();

				if (resUpdate.ok) {
					updatedCronicos = atualizarCronicoEmMemoria(
						viewed_cars,
						carro_id,
						manutencaoData.id,
						{
							trocadoNoKm: dataUpdate.trocadoNoKm,
							trocarNoKm: dataUpdate.trocarNoKm,
						}
					);
				}
			}

			const novoKm = Number(data.carro_km);

			const updatedCarros = atualizarCarroComRisco(
				viewed_cars,
				carro_id,
				novoKm,
				data.corretivo_data,
				updatedPreventivos,
				updatedCronicos
			);

			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: updatedCarros,
			}));

			showFeedback("success", "Manutenção registada com sucesso.");
			navigate(-1);
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao guardar manutenção.");
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
				<label>
					Nome:
					<input name="nome" value={manutencao.nome} onChange={handleChange} />
				</label>

				<label>
					Tipo:
					<select name="tipo" value={manutencao.tipo} onChange={handleChange}>
						<option value="corretivo">Corretivo</option>
						<option value="preventivo">Preventivo</option>
						<option value="cronico">Crónico</option>
					</select>
				</label>

				<label>
					Descrição:
					<textarea name="descricao" value={manutencao.descricao} onChange={handleChange} />
				</label>

				<label>
					Quilometragem:
					<input type="number" name="quilometragem" value={manutencao.quilometragem} onChange={handleChange} />
				</label>

				<label>
					Data:
					<input type="date" name="data" value={manutencao.data} onChange={handleChange} />
				</label>

				<label>
					Custo (€):
					<input type="number" name="custo" value={manutencao.custo} onChange={handleChange} />
				</label>

				<label>
					Notas:
					<textarea name="nota" value={manutencao.nota} onChange={handleChange} />
				</label>
			</div>
		</div>
	);
}

function recalcularRisco(arr, novoKm) {
	return arr.map((man) => ({
		...man,
		risco: man.kmsEntreTroca
			? Number(((novoKm - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2))
			: null,
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
				preventivos: updatedPreventivos.length
					? recalcularRisco(updatedPreventivos, novoKm)
					: recalcularRisco(car.manutencoes.preventivos, novoKm),
				cronicos: updatedCronicos.length
					? recalcularRisco(updatedCronicos, novoKm)
					: recalcularRisco(car.manutencoes.cronicos, novoKm),
			},
		};
	});
}

function atualizarPreventivoNoSession(viewedCars, carroId, manutencaoId, novosDados) {
	const car = viewedCars.find((c) => c.id === Number(carroId));
	if (!car) return [];
	return car.manutencoes.preventivos.map((p) =>
		p.id === manutencaoId ? { ...p, ...novosDados } : p
	);
}

function atualizarCronicoEmMemoria(viewedCars, carroId, manutencaoId, novosDados) {
	const car = viewedCars.find((c) => c.id === Number(carroId));
	if (!car) return [];
	return car.manutencoes.cronicos.map((c) =>
		c.id === manutencaoId ? { ...c, ...novosDados } : c
	);
}

function proximaManutencao(preventivos) {
	const datasValidas = preventivos
		.map((p) => p.trocarNaData)
		.filter(Boolean)
		.map((d) => new Date(d));

	const closestDate = new Date(Math.min(...datasValidas));
	return closestDate.toISOString().split("T")[0];
}
