import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function Cronico() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const { setState: setLocalStorage } = useLocalAppState();

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

	const showFeedback = (type, message) => {
		setLocalStorage((prev) => ({
			...prev,
			feedback: { type, message },
		}));
	};

	//  handler para sessão expirada
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const guardarManutencao = async () => {
		if (!manutencao.nome || !manutencao.kmsEntreTroca) {
			showFeedback("error", "Preenche os campos obrigatórios.");
			return;
		}

		try {
			const res = await fetch("http://localhost:8001/api/criarCronico/", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao criar manutenção crónica.");
				return;
			}

			const adicionarRisco = (man) => ({
				...man,
				risco: man.kmsEntreTroca
					? Number(((carro_kms - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2))
					: null,
			});

			const novoCronicoComRisco = adicionarRisco(data.cronico_data);

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

			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: updatedCarros,
			}));

			showFeedback("success", "Manutenção crónica adicionada com sucesso.");
			navigate(-1);
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao guardar manutenção.");
		}
	};

	return (
		<div className="page-box">
			<h1>Nova Manutenção Crónica</h1>

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
}