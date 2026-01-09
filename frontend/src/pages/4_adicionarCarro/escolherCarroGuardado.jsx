import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function MostrarCarrosGuardados() {
	const navigate = useNavigate();
	const { state: sessionState, setState: setSessionState } = useSessionAppState();
	const { setState: setLocalState } = useLocalAppState();

	const fetchedRef = useRef(false);
	const [status, setStatus] = useState("idle"); // idle | loading | error
	const [action, setAction] = useState({ id: null, type: null });

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

	useEffect(() => {
		if (fetchedRef.current) return;
		fetchedRef.current = true;

		const fetchCarros = async () => {
			setStatus("loading");
			try {
				const res = await fetch("/api/listarCarrosGuardados/", {
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
			}
		};

		fetchCarros();
	}, [setSessionState, handleForbidden]);

	const adicionarCarro = async (nome, id) => {
		setAction({ id, type: "add" });

		try {
			const res = await fetch("/api/obterCarroSpecs/", {
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
		}
	};

	const esquecerCarro = async (id) => {
		setAction({ id, type: "delete" });

		try {
			const res = await fetch("/api/apagarCarroGuardado/", {
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

			{status === "loading" && <p>A carregar carros guardados…</p>}
			{status === "error" && <p style={{ color: "red" }}>Erro ao carregar carros.</p>}

			{status === "idle" && carros.length === 0 && <p>Nada guardado.</p>}

			{status === "idle" && carros.length > 0 && (
				<ul>
					{carros.map((carro) => (
						<li key={carro.id} style={{ marginBottom: "8px" }}>
							<strong>{carro.nome}</strong>

							<button
								onClick={() => esquecerCarro(carro.id)}
								disabled={action.id === carro.id}
							>
								{action.id === carro.id && action.type === "delete"
									? "A apagar…"
									: "Esquecer"}
							</button>

							<button
								onClick={() => adicionarCarro(carro.nome, carro.id)}
								disabled={action.id === carro.id}
							>
								{action.id === carro.id && action.type === "add"
									? "A abrir…"
									: "Adicionar"}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}