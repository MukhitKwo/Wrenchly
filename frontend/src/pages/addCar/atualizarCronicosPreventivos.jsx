import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
export default function AtualizarCronicosPreventivos() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { state: getLocalStorage } = useLocalStorage();
	//tava a dar erro aqui
	//const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();
	const carro_data = state?.carro;
	const allPreventivos_data = state?.preventivos;
	const [preventivos, setPreventivos] = useState(allPreventivos_data || []);
	const handleChange = (index, field, value) => {
		const updated = [...preventivos];
		updated[index][field] = value;
		setPreventivos(updated);
	};

	const handleSubmit = async () => {
		try {
			const res = await fetch("/api/adicionarPreventivos/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ preventivos }),
			});

			const data = await res.json("");
			console.log(data.message);

			if (res.ok) {
				const updatedCarPreview = { ...carro_data, proxima_manutencao: data.proxima_manutencao };
				setLocalStorage((prev) => ({
					...prev,
					carros_preview: [...prev.carros_preview, updatedCarPreview],
				}));

				navigate("/garagem");
			}
		} catch (error) {
			console.log(error);
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
						<h3>{prev.descricao}</h3>

						<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
							<label>
								Kms Entre Troca:
								<input
									type="number"
									value={prev.kmsEntreTroca}
									onChange={(e) => handleChange(index, "kmsEntreTroca", e.target.value)}
									style={{ marginLeft: "5px" }}
								/>
							</label>

							<label>
								Trocado no Km:
								<input
									type="number"
									value={prev.trocadoNoKm}
									onChange={(e) => handleChange(index, "trocadoNoKm", e.target.value)}
									style={{ marginLeft: "5px" }}
								/>
							</label>
						</div>

						<div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "5px" }}>
							<label>
								Dias Entre Troca:
								<input
									type="number"
									value={prev.diasEntreTroca}
									onChange={(e) => handleChange(index, "diasEntreTroca", e.target.value)}
									style={{ marginLeft: "5px" }}
								/>
							</label>

							<label>
								Trocado na Data:
								<input
									type="date"
									value={prev.trocadoNaData}
									onChange={(e) => handleChange(index, "trocadoNaData", e.target.value)}
									style={{ marginLeft: "5px" }}
								/>
							</label>
						</div>
					</div>
				))
			) : (
				<p>Não há preventivos para mostrar.</p>
			)}

			<button onClick={handleSubmit} style={{ marginTop: "20px", padding: "10px 15px", borderRadius: "4px" }}>
				Submit
			</button>
		</div>
	);
}
