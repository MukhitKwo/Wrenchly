import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ListaCarrosRecomendados() {
	const navigate = useNavigate();
	const { state } = useLocation();

	const { state: getLocalStorage, setState: setLocalState } = useLocalAppState();
	const { setState: setSessionState } = useSessionAppState();

	const garagem_id = getLocalStorage.garagem.id;
	const candidateCars = state?.candidateCars || [];

	const [savedCars, setSavedCars] = useState([]);
	const [loading, setLoading] = useState(false);

	// sessão expirada
	const handleForbidden = useCallback(() => {
		setLocalState((prev) => ({
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

		setSessionState({});
		navigate("/login", { replace: true });
	}, [setLocalState, setSessionState, navigate]);

	const handleSave = (car) => {
		if (!savedCars.some((c) => c.nome === car)) {
			setSavedCars((prev) => [...prev, { garagem: garagem_id, nome: car }]);
		}
	};

	const salvarCarros = async () => {
		if (savedCars.length === 0) {
			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Seleciona pelo menos um carro para guardar.",
				},
			}));
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("/api/salvarCarros/", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ savedCars }),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				setLocalState((prev) => ({
					...prev,
					feedback: {
						type: "error",
						message: data.message || "Erro ao guardar os carros.",
					},
				}));
				return;
			}

			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "success",
					message: "Carros guardados com sucesso.",
				},
			}));

			navigate("/garagem");
		} catch (error) {
			console.error(error);
			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Erro inesperado. Tenta novamente.",
				},
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page-box">
			<h1>Lista de Carros Recomendados</h1>
			<p>Recomendados por especificações</p>

			{candidateCars.length ? (
				candidateCars.map((car, index) => {
					const isSaved = savedCars.some((c) => c.nome === car);
					return (
						<div
							key={index}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								border: "1px solid #ccc",
								padding: "10px",
								marginBottom: "8px",
								borderRadius: "6px",
							}}
						>
							<span>{car}</span>
							<button onClick={() => handleSave(car)} disabled={isSaved}>
								{isSaved ? "Guardado" : "Guardar"}
							</button>
						</div>
					);
				})
			) : (
				<p>Nenhum carro recomendado.</p>
			)}

			{savedCars.length > 0 && (
				<div style={{ marginTop: "20px" }}>
					<h3>Carros selecionados:</h3>
					<ul>
						{savedCars.map((car, index) => (
							<li key={index}>{car.nome}</li>
						))}
					</ul>
				</div>
			)}

			<button onClick={salvarCarros} style={{ marginTop: "15px" }}>
				Guardar carros
			</button>
			{loading && <LoadingSpinner text="A guardar veiculos..." />}
		</div>
	);
}
