import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./adicionarEProcurar.css";

export default function ProcurarCarroPorModelo() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { state: getLocalStorage, setState: setLocalState } = useLocalAppState();

	const garagem_id = getLocalStorage.garagem.id;
	const initialCarro = state?.initialCarro || {};

	const [loading, setLoading] = useState(false);
	const [loadingText, setLoadingtext] = useState(false);

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
			setLoading(true);
			setLoadingtext("A criar veiculo...");

			const res = await fetch("http://localhost:8001/api/adicionarCarro/", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ caracteristicas }),
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
						message: data.message,
					},
				}));
				return;
			}

			if (file) {
				setLoadingtext("A adicionar imagem...");
				const carroId = data.carro_data.id;
				const formData = new FormData();
				formData.append("image", file);
				formData.append("carro_id", carroId);

				const resImage = await fetch("http://localhost:8001/api/adicionarCarroImagem/", {
					method: "POST",
					credentials: "include",
					body: formData,
				});

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

			setLocalState((prev) => ({
				...prev,
				feedback: {
					type: "success",
					message: "A carregar os preventivos...",
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
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="form-container">
			<h2>Adicionar por Modelo</h2>

			<div className="form-grid">
				<div className="form-row">
					<label>Categoria</label>
					<select name="categoria" value={caracteristicas.categoria} onChange={handleChange}>
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

				<div className="form-row">
					<label>Marca</label>
					<input name="marca" value={caracteristicas.marca} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Modelo</label>
					<input name="modelo" value={caracteristicas.modelo} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Ano</label>
					<input type="number" name="ano" value={caracteristicas.ano} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Combustível</label>
					<select name="combustivel" value={caracteristicas.combustivel} onChange={handleChange}>
						<option value="">---</option>
						<option value="gasoleo">Diesel</option>
						<option value="gasolina">Gasolina</option>
						<option value="eletrico">Elétrico</option>
						<option value="hibrido">Híbrido</option>
					</select>
				</div>

				<div className="form-row">
					<label>Cilindrada (cc)</label>
					<input type="number" name="cilindrada" value={caracteristicas.cilindrada} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Cavalos</label>
					<input type="number" name="cavalos" value={caracteristicas.cavalos} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Transmissão</label>
					<select name="transmissao" value={caracteristicas.transmissao} onChange={handleChange}>
						<option value="">---</option>
						<option value="manual:5speed">Manual 5-speed</option>
						<option value="manual:6speed">Manual 6-speed</option>
						<option value="automatica">Automática</option>
					</select>
				</div>

				<div className="form-row">
					<label>Quilometragem</label>
					<input type="number" name="quilometragem" value={caracteristicas.quilometragem} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Matrícula</label>
					<input name="matricula" value={caracteristicas.matricula} onChange={handleChange} />
				</div>

				<div className="form-row">
					<label>Imagem</label>
					<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
				</div>
			</div>

			<div style={{ textAlign: "center" }}>
				<button className="submit-btn" type="button" onClick={adicionarCarro}>
					Adicionar
				</button>
			</div>

			{loading && <LoadingSpinner text={loadingText} />}
		</div>
	);
}
