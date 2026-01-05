import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function NovoPreventivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalAppState();

	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;

	const viewed_cars = getSessionStorage.carros_vistos;

	const proxima_manutencao =
		getLocalStorage?.carros_preview?.find((c) => c.id === Number(carro_id))
			?.proxima_manutencao ?? null;

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
		if (!manutencao.nome || !manutencao.kmsEntreTroca || !manutencao.trocadoNaData) {
			showFeedback("error", "Preenche os campos obrigatórios.");
			return;
		}

		try {
			const res = await fetch("/api/criarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao criar manutenção preventiva.");
				return;
			}

			const adicionarRisco = (man) => ({
				...man,
				risco: man.kmsEntreTroca
					? Number(((carro_kms - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2))
					: null,
			});

			const novoPreventivoComRisco = adicionarRisco(data.preventivo_data);

			const carrosVistosAtualizados = adicionarPreventivo(
				viewed_cars,
				Number(carro_id),
				novoPreventivoComRisco
			);

			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: carrosVistosAtualizados,
			}));

			if (
				data.preventivo_data.trocarNaData &&
				(!proxima_manutencao ||
					new Date(data.preventivo_data.trocarNaData) < new Date(proxima_manutencao))
			) {
				atualizarProximaManutencaoData(
					Number(carro_id),
					data.preventivo_data.trocarNaData
				);
			}

			showFeedback("success", "Manutenção preventiva adicionada com sucesso.");
			navigate(-1);
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao guardar manutenção.");
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
				<label>
					Nome:
					<input name="nome" value={manutencao.nome} onChange={handleChange} />
				</label>

				<label>
					Descrição:
					<textarea name="descricao" value={manutencao.descricao} onChange={handleChange} />
				</label>

				<label>
					Dias entre troca:
					<input
						type="number"
						name="diasEntreTroca"
						value={manutencao.diasEntreTroca}
						onChange={handleChange}
					/>
				</label>

				<label>
					Trocado na data:
					<input
						type="date"
						name="trocadoNaData"
						value={manutencao.trocadoNaData}
						onChange={handleChange}
					/>
				</label>

				<label>
					Kms entre troca:
					<input
						type="number"
						name="kmsEntreTroca"
						value={manutencao.kmsEntreTroca}
						onChange={handleChange}
					/>
				</label>

				<label>
					Trocado no km:
					<input
						type="number"
						name="trocadoNoKm"
						value={manutencao.trocadoNoKm}
						onChange={handleChange}
					/>
				</label>
			</div>
		</div>
	);

	function atualizarProximaManutencaoData(carroId, novaData) {
		const carros = [...getLocalStorage.carros_preview];
		const car = carros.find((c) => c.id === carroId);
		if (!car) return;

		car.proxima_manutencao = novaData;

		setLocalStorage((prev) => ({
			...prev,
			carros_preview: carros,
		}));
	}
}

function adicionarPreventivo(viewedCars, carroId, novoPreventivo) {
	return viewedCars.map((car) =>
		car.id !== Number(carroId)
			? car
			: {
				...car,
				manutencoes: {
					...car.manutencoes,
					preventivos: [...car.manutencoes.preventivos, novoPreventivo],
				},
			}
	);
}