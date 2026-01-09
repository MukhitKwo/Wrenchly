import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function VerCronico() {
	const navigate = useNavigate();
	const { state: session, setState: setSession } = useSessionAppState();
	const { setState: setLocalStorage } = useLocalAppState();
	const { carro_id, manutencao_id } = useParams();

	const viewed_cars = useMemo(
		() => session?.carros_vistos || [],
		[session?.carros_vistos]
	);

	const [manutencao, setManutencao] = useState(null);
	const [edit, setEdit] = useState(false);
	const [carro_km, setCarro_km] = useState(null);

	const showFeedback = useCallback((type, message) => {
		setLocalStorage((prev) => ({
			...prev,
			feedback: { type, message },
		}));
	}, [setLocalStorage]);

	//  handler sessão expirada
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

		setSession((prev) => ({
			...prev,
			carros_vistos: [],
		}));

		navigate("/login", { replace: true });
	}, [setLocalStorage, setSession, navigate]);

	useEffect(() => {
		const car = viewed_cars.find((c) => c.id === Number(carro_id));
		if (!car) return;

		setCarro_km(car.quilometragem);

		const maintenance = car.manutencoes?.cronicos?.find(
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
			const res = await fetch("/api/editarCronico/", {
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

			const updatedCars = viewed_cars.map((car) =>
				car.id === Number(carro_id)
					? {
						...car,
						manutencoes: {
							...car.manutencoes,
							cronicos: car.manutencoes.cronicos.map((c) =>
								c.id === manutencao.id ? data.cronico_data : c
							),
						},
					}
					: car
			);

			setSession((prev) => ({ ...prev, carros_vistos: updatedCars }));
			setEdit(false);
			showFeedback("success", "Manutenção crónica atualizada.");
		} catch (err) {
			console.error(err);
			showFeedback("error", "Erro inesperado ao guardar.");
		}
	};

	const apagarCronico = async () => {
		if (!window.confirm("Apagar este problema crónico?")) return;

		try {
			const res = await fetch("/api/apagarCronico/", {
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

			const updatedCars = viewed_cars.map((car) =>
				car.id === Number(carro_id)
					? {
						...car,
						manutencoes: {
							...car.manutencoes,
							cronicos: car.manutencoes.cronicos.filter(
								(c) => c.id !== manutencao.id
							),
						},
					}
					: car
			);

			setSession((prev) => ({ ...prev, carros_vistos: updatedCars }));
			showFeedback("success", "Manutenção crónica apagada.");
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

			<h1>Manutenção Crónica</h1>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<label>
					Nome:
					<input
						name="nome"
						value={manutencao.nome}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>

				<label>
					Descrição:
					<textarea
						name="descricao"
						value={manutencao.descricao}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>

				<label>
					Kms entre ocorrências:
					<input
						type="number"
						name="kmsEntreTroca"
						value={manutencao.kmsEntreTroca}
						onChange={handleChange}
						disabled={!edit}
					/>
				</label>

				<label>
					Último km registado:
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
				<button onClick={apagarCronico}>Apagar</button>
				<button onClick={edit ? guardarEdicao : () => setEdit(true)}>
					{edit ? "Guardar" : "Editar"}
				</button>
			</div>
		</div>
	);
}