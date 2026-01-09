import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function AtualizarPreventivos() {
	const { setState: setLocalState } = useLocalAppState();
	const { state } = useLocation();
	const navigate = useNavigate();

	const carro_data = state?.carro;
	const carro_kms = state?.carroKms;
	const allCronicos_data = state?.cronicos;
	const allPreventivos_data = state?.preventivos;

	const [preventivos, setPreventivos] = useState(allPreventivos_data || []);

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

		navigate("/login", { replace: true });
	}, [setLocalState, navigate]);

	const handleChange = (index, field, value) => {
		const updated = [...preventivos];
		updated[index][field] = value;
		setPreventivos(updated);
	};

	const handleSubmit = async () => {
		try {
			const res = await fetch("/api/adicionarPreventivos/", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					cronicos: allCronicos_data,
					preventivos,
					carro_kms,
				}),
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
						message: data.message || "Erro ao guardar os preventivos.",
					},
				}));
				return;
			}

			const updatedCarPreview = {
				...carro_data,
				proxima_manutencao: data.proxima_manutencao,
			};

			setLocalState((prev) => ({
				...prev,
				carros_preview: [...prev.carros_preview, updatedCarPreview],
				feedback: {
					type: "success",
					message: "Preventivos atualizados com sucesso!",
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
		}
	};

	return (
		<div className="page-box">
			<h1>Atualizar Preventivos</h1>

			{preventivos.length ? (
				preventivos.map((prev, index) => (
					<div
						key={index}
						style={{
							border: "1px solid #ccc",
							padding: "10px",
							marginBottom: "10px",
							borderRadius: "6px",
						}}
					>
						<h3>{prev.nome}</h3>

						<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
							<label>
								Kms Entre Troca:
								<input
									type="number"
									value={prev.kmsEntreTroca}
									onChange={(e) =>
										handleChange(index, "kmsEntreTroca", e.target.value)
									}
									style={{ marginLeft: "5px" }}
								/>
							</label>

							<label>
								Trocado no Km:
								<input
									type="number"
									value={prev.trocadoNoKm}
									onChange={(e) =>
										handleChange(index, "trocadoNoKm", e.target.value)
									}
									style={{ marginLeft: "5px" }}
								/>
							</label>
						</div>

						<div
							style={{
								display: "flex",
								gap: "10px",
								alignItems: "center",
								marginTop: "5px",
							}}
						>
							<label>
								Dias Entre Troca:
								<input
									type="number"
									value={prev.diasEntreTroca}
									onChange={(e) =>
										handleChange(index, "diasEntreTroca", e.target.value)
									}
									style={{ marginLeft: "5px" }}
								/>
							</label>

							<label>
								Trocado na Data:
								<input
									type="date"
									value={prev.trocadoNaData}
									onChange={(e) =>
										handleChange(index, "trocadoNaData", e.target.value)
									}
									style={{ marginLeft: "5px" }}
								/>
							</label>
						</div>
					</div>
				))
			) : (
				<p>Não há preventivos para mostrar.</p>
			)}

			<button
				onClick={handleSubmit}
				style={{ marginTop: "20px", padding: "10px 15px", borderRadius: "4px" }}
			>
				Adicionar
			</button>
		</div>
	);
}