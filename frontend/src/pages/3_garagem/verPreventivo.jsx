import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function VerPreventivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalAppState();

	const navigate = useNavigate();
	const { carro_id, manutencao_id } = useParams();

	const viewed_cars = useMemo(
		() => getSessionStorage?.carros_vistos || [],
		[getSessionStorage?.carros_vistos]
	);

	const proxima_manutencao =
		getLocalStorage?.carros_preview?.find((c) => c.id === Number(carro_id))
			?.proxima_manutencao ?? null;

	const [manutencao, setManutencao] = useState(null);
	const [edit, setEdit] = useState(false);
	const [carro_km, setCarro_km] = useState(null);

	const showFeedback = useCallback((type, message) => {
		setLocalStorage((prev) => ({
			...prev,
			feedback: { type, message },
		}));
	}, [setLocalStorage]);

	// sessão expirada
	const handleForbidden = useCallback(() => {
		setLocalStorage((prev) => ({
			...prev,
			user: null,
			garagem: null,
			definicoes: null,
			carros_preview: [],
			notas: [],
			feedback: {
				type: "error",
				message: "Sessão expirada. Inicia sessão novamente.",
			},
		}));

		setSessionStorage((prev) => ({
			...prev,
			carros_vistos: [],
		}));

		navigate("/login", { replace: true });
	}, [setLocalStorage, setSessionStorage, navigate]);

	useEffect(() => {
		const car = viewed_cars.find((c) => c.id === Number(carro_id));
		if (!car) return;

		setCarro_km(car.quilometragem);

		const maintenance = car.manutencoes?.preventivos?.find(
			(m) => m.id === Number(manutencao_id)
		);
		if (maintenance) setManutencao(maintenance);
	}, [carro_id, manutencao_id, viewed_cars]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({ ...prev, [name]: value }));
	};

	const guardarEdicao = async () => {
		try {
			const res = await fetch("http://localhost:8001/api/editarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ manutencao, carro_km }),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao guardar alterações.");
				return;
			}

			const updatedCars = atualizarPreventivo(
				viewed_cars,
				carro_id,
				manutencao.id,
				data.preventivo_data,
				carro_km
			);

			setSessionStorage((prev) => ({ ...prev, carros_vistos: updatedCars }));

			if (
				proxima_manutencao &&
				new Date(data.preventivo_data.trocarNaData) < new Date(proxima_manutencao)
			) {
				atualizarProximaManutencaoData(
					Number(carro_id),
					data.preventivo_data.trocarNaData
				);
			}

			setEdit(false);
			showFeedback("success", "Manutenção preventiva atualizada.");
		} catch (err) {
			console.error(err);
			showFeedback("error", "Erro inesperado ao guardar.");
		}
	};

	const apagarPreventivo = async () => {
		if (!window.confirm("Apagar esta manutenção preventiva?")) return;

		try {
			const res = await fetch("http://localhost:8001/api/apagarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					id: manutencao.id,
					carro_id: manutencao.carro,
				}),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao apagar manutenção.");
				return;
			}

			const updatedCars = removerPreventivo(
				viewed_cars,
				carro_id,
				manutencao.id
			);

			setSessionStorage((prev) => ({ ...prev, carros_vistos: updatedCars }));
			showFeedback("success", "Manutenção preventiva apagada.");
			navigate(-1);
		} catch (err) {
			console.error(err);
			showFeedback("error", "Erro inesperado ao apagar.");
		}
	};

	if (!manutencao) return <div>Carregando...</div>;

	return (
		<div className="page-box">
			<div style={{ marginBottom: "15px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>
			</div>

			<h1>Manutenção Preventiva</h1>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<label>
					Nome:
					<input name="nome" value={manutencao.nome} onChange={handleChange} disabled={!edit} />
				</label>

				<label>
					Descrição:
					<textarea name="descricao" value={manutencao.descricao} onChange={handleChange} disabled={!edit} />
				</label>

				<label>
					Dias entre troca:
					<input
						type="number"
						name="diasEntreTroca"
						value={manutencao.diasEntreTroca}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>

				<label>
					Trocado na data:
					<input
						type="date"
						name="trocadoNaData"
						value={manutencao.trocadoNaData}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>

				<label>
					Kms entre troca:
					<input
						type="number"
						name="kmsEntreTroca"
						value={manutencao.kmsEntreTroca}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>

				<label>
					Trocado no km:
					<input
						type="number"
						name="trocadoNoKm"
						value={manutencao.trocadoNoKm}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>
			</div>

			<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
				<button onClick={apagarPreventivo}>Apagar</button>
				<button onClick={edit ? guardarEdicao : () => setEdit(true)}>
					{edit ? "Guardar" : "Editar"}
				</button>
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
function atualizarPreventivo(viewedCars, carroId, manutencaoId, novoPreventivo, carro_km) {
	return viewedCars.map((car) => {
		if (car.id !== Number(carroId)) return car;

		return {
			...car,
			manutencoes: {
				...car.manutencoes,
				preventivos: car.manutencoes.preventivos.map((p) => {
					if (p.id !== manutencaoId) return p;

					const risco =
						novoPreventivo.kmsEntreTroca != null
							? Number(
								((carro_km - novoPreventivo.trocadoNoKm) /
									novoPreventivo.kmsEntreTroca).toFixed(2)
							)
							: null;

					return { ...novoPreventivo, risco };
				}),
			},
		};
	});
}

function removerPreventivo(viewedCars, carroId, manutencaoId) {
	return viewedCars.map((car) => {
		if (car.id !== Number(carroId)) return car;

		return {
			...car,
			manutencoes: {
				...car.manutencoes,
				preventivos: car.manutencoes.preventivos.filter(
					(p) => p.id !== manutencaoId
				),
			},
		};
	});
}