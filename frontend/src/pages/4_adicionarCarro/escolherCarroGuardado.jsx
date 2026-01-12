import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function MostrarCarrosGuardados() {
	const navigate = useNavigate();
	const { state: sessionState, setState: setSessionState } = useSessionAppState();
	const { setState: setLocalState } = useLocalAppState();

	const fetchedRef = useRef(false);
	const [status, setStatus] = useState("idle");
	const [action, setAction] = useState({ id: null, type: null });
	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingtext] = useState(false);

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

	useEffect(() => {
		if (fetchedRef.current) return;
		fetchedRef.current = true;

		const fetchCarros = async () => {
			setStatus("loading");
			setLoading(true);
			setLoadingtext("A obter veiculos guardados...");
			try {
				const res = await fetch("http://localhost:8001/api/listarCarrosGuardados/", {
					credentials: "include",
				});

				if (res.status === 403) {
					handleForbidden();
					return;
				}

				const data = await res.json();
				if (!res.ok) throw new Error();

				setSessionState((prev) => ({
					...prev,
					carros_guardados: data.carrosGuardados_data,
				}));

				setStatus("idle");
			} catch (err) {
				console.error("Erro a buscar carros guardados", err);
				setStatus("error");
			} finally {
				setLoading(false);
			}
		};

		fetchCarros();
	}, [setSessionState, handleForbidden]);

	const adicionarCarro = async (nome, id) => {
		setAction({ id, type: "add" });
		setLoading(true);
		setLoadingtext("A obter info do veiculo...");
		try {
			const res = await fetch("http://localhost:8001/api/obterCarroSpecs/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ nome }),
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
						message: "Erro ao carregar o carro guardado.",
					},
				}));
				return;
			}

			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "success",
					message: "Carro carregado com sucesso.",
				},
			}));

			navigate("/adicionarPorModelo", {
				state: { initialCarro: data.carro_data },
			});
		} catch (error) {
			console.error(error);
			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Erro inesperado ao abrir o carro.",
				},
			}));
		} finally {
			setAction({ id: null, type: null });
			setLoading(false);
		}
	};

	const esquecerCarro = async (id) => {
		setAction({ id, type: "delete" });

		try {
			const res = await fetch("http://localhost:8001/api/apagarCarroGuardado/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ id }),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			if (!res.ok) {
				setLocalState((prev) => ({
					...prev,
					feedback: {
						type: "error",
						message: "Erro ao apagar o carro.",
					},
				}));
				return;
			}

			setSessionState((prev) => ({
				...prev,
				carros_guardados: prev.carros_guardados.filter((c) => c.id !== id),
			}));

			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "success",
					message: "Carro removido dos guardados.",
				},
			}));
		} catch (error) {
			console.error(error);
			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Erro inesperado ao apagar.",
				},
			}));
		} finally {
			setAction({ id: null, type: null });
		}
	};

	const carros = sessionState?.carros_guardados || [];

	return (
		<div className="page-box">
			<h1>Carros Guardados</h1>

			{status === "error" && <p style={{ color: "red" }}>Erro ao carregar carros.</p>}

			{status === "idle" && carros.length === 0 && <p>Nada guardado.</p>}

			{status === "idle" && carros.length > 0 && (
				<ul>
					{carros.map((carro) => (
						<li key={carro.id} style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
							<strong>{carro.nome}</strong>

							<button
								onClick={() => esquecerCarro(carro.id)}
								disabled={action.id === carro.id}
							>
								{action.id === carro.id && action.type === "delete" ? "A apagar…" : "Esquecer"}
							</button>

							<button
								onClick={() => adicionarCarro(carro.nome, carro.id)}
								disabled={action.id === carro.id}
							>
								{action.id === carro.id && action.type === "add" ? "A abrir…" : "Adicionar"}
							</button>
						</li>

					))}
				</ul>
			)}
			{loading && <LoadingSpinner text={loadingText} />}
		</div>
	);
}
