import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function ProcurarCarroPorModelo() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { state: getLocalStorage, setState: setLocalState } = useLocalAppState();

	const garagem_id = getLocalStorage.garagem.id;
	const initialCarro = state?.initialCarro || {};

	const [caracteristicas, setCaracteristicas] = useState({
		categoria: "",
		marca: "",
		modelo: "",
		ano: "",
		combustivel: "",
		cilindrada: "",
		cavalos: "",
		transmissao: "",
		quilometragem: "",
		matricula: "",
		imagem_url: "",
		garagem: garagem_id,
		...initialCarro,
	});

	const [file, setFile] = useState(null);

	/* ================== 403 ================== */
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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCaracteristicas((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const optional = ["cavalos", "matricula", "imagem_url"];
	const allFilled = Object.entries(caracteristicas)
		.filter(([key]) => !optional.includes(key))
		.every(([, value]) => value !== null && value !== "");

	const adicionarCarro = async () => {
		if (!allFilled) {
			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Preencha todos os campos obrigatórios.",
				},
			}));
			return;
		}

		try {
			const res = await fetch("/api/adicionarCarro/", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ caracteristicas }),
			});

			//  403 antes de tentar ler JSON
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
						message: data.message || "Erro ao adicionar o carro.",
					},
				}));
				return;
			}

			// upload da imagem
			if (file) {
				const carroId = data.carro_data.id;
				const formData = new FormData();
				formData.append("image", file);
				formData.append("carro_id", carroId);

				const resImage = await fetch("/api/adicionarCarroImagem/", {
					method: "POST",
					credentials: "include", //  cookie/sessão
					body: formData,
				});

				// 403 no upload também
				if (resImage.status === 403) {
					handleForbidden();
					return;
				}

				if (!resImage.ok) {
					setLocalState((prev) => ({
						...prev,
						feedback: {
							type: "error",
							message: "O carro foi criado, mas a imagem falhou.",
						},
					}));
				} else {
					const imgData = await resImage.json();
					data.carro_data.imagem_url = imgData.imagem_url || null;
				}
			}

			// sucesso
			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "success",
					message: "Carro adicionado com sucesso.",
				},
			}));

			navigate("/atualizarPreventivos", {
				state: {
					carro: data.carro_data,
					carroKms: data.carro_kms,
					cronicos: data.allCronicos,
					preventivos: data.allPreventivos,
				},
			});
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
		<div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px" }}>
			<h2 style={{ marginBottom: "20px" }}>Pesquisar por Modelo</h2>

			<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
				{/* Categoria */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Categoria</label>
					<select name="categoria" value={caracteristicas.categoria} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<optgroup label="Carro">
							<option value="carro:sedan">Sedan</option>
							<option value="carro:suv">SUV</option>
							<option value="carro:hatchback">Hatchback</option>
							<option value="carro:coupe">Coupé</option>
							<option value="carro:carrinha">Carrinha</option>
						</optgroup>
					</select>
				</div>

				{/* Marca */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Marca</label>
					<input name="marca" value={caracteristicas.marca} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Modelo */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Modelo</label>
					<input name="modelo" value={caracteristicas.modelo} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Ano */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Ano</label>
					<input type="number" name="ano" value={caracteristicas.ano} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Combustível */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Combustível</label>
					<select name="combustivel" value={caracteristicas.combustivel} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="gasoleo">Diesel</option>
						<option value="gasolina">Gasolina</option>
						<option value="eletrico">Elétrico</option>
						<option value="hibrido">Híbrido</option>
					</select>
				</div>

				{/* Cilindrada */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Cilindrada (cc)</label>
					<input type="number" name="cilindrada" value={caracteristicas.cilindrada} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Cavalos */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Cavalos</label>
					<input type="number" name="cavalos" value={caracteristicas.cavalos} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Transmissão */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Transmissão</label>
					<select name="transmissao" value={caracteristicas.transmissao} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="manual:5speed">Manual 5-speed</option>
						<option value="manual:6speed">Manual 6-speed</option>
						<option value="automatica">Automática</option>
					</select>
				</div>

				{/* Quilometragem */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Quilometragem</label>
					<input type="number" name="quilometragem" value={caracteristicas.quilometragem} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Matrícula */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Matrícula</label>
					<input name="matricula" value={caracteristicas.matricula} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				{/* Imagem */}
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Imagem</label>
					<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ flex: 1 }} />
				</div>
			</div>

			<div style={{ marginTop: "20px", textAlign: "center" }}>
				<button type="button" onClick={adicionarCarro} style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
					Adicionar
				</button>
			</div>
		</div>
	);
}