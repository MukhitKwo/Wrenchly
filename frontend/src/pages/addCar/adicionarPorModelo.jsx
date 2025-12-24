import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function ProcurarCarroPorModelo() {
	const navigate = useNavigate();

	const { state: getLocalStorage } = useLocalAppState();
	const garagem_id = getLocalStorage.garagem.id;

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
		foto: "",
		garagem: garagem_id,
	});
	const [file, setFile] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCaracteristicas((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const optional = ["cavalos", "matricula", "foto"];
	const allFilled = Object.entries(caracteristicas)
		.filter(([key]) => !optional.includes(key))
		.every(([, value]) => value !== null && value !== "");

	const adicionarCarro = async () => {
		if (!allFilled) return alert("Preencha os campos obrigatorios");

		try {
			const res = await fetch("/api/adicionarCarro/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ caracteristicas }),
			});

			const data = await res.json();
			console.log(data.message);

			// send image (if exists)
			if (file) {
				const carroId = data.carro_data.id;
				const formData = new FormData();
				formData.append("image", file);
				formData.append("carro_id", carroId);

				const resImage = await fetch("/api/adicionarCarroImagem/", {
					method: "POST",
					body: formData, // multipart/form-data
				});
				const imgData = await resImage.json();
				console.log(imgData.message);
			}

			if (res.ok) {
				navigate("/atualizarCronicosPreventivos", { state: { carro: data.carro_data, carroKms: data.carro_kms, preventivos: data.allPreventivos } });
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
			<h1 style={{ textAlign: "center", marginBottom: "10px" }}>Procurar Carro</h1>
			<p style={{ textAlign: "center", marginBottom: "30px" }}>Escolhe como queres procurar um carro.</p>

			<div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "40px" }}>
				<button style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #ccc", cursor: "pointer" }}>Por Modelo</button>

				<Link to="/procurarPorEspecificacoes">
					<button style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #ccc", cursor: "pointer" }}>Por Especificações</button>
				</Link>
			</div>

			<div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
				<h2 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Pesquisar por Modelo</h2>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
					<select name="categoria" onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Tipo / Categoria</option>
						<optgroup label="Carro">
							<option value="carro:sedan">Sedan</option>
							<option value="carro:suv">SUV</option>
							<option value="carro:hatchback">Hatchback</option>
							<option value="carro:coupe">Coupé</option>
							<option value="carro:carrinha">Carrinha</option>
						</optgroup>
						<optgroup label="Mota">
							<option value="mota:naked">Naked</option>
							<option value="mota:sport">Sport</option>
							<option value="mota:touring">Touring</option>
							<option value="mota:custom">Custom</option>
							<option value="mota:adv">Adventure</option>
						</optgroup>
						<optgroup label="Scooter">
							<option value="scooter:urbana">Urbana</option>
							<option value="scooter:maxi">Maxi-scooter</option>
						</optgroup>
						<optgroup label="Quad / ATV">
							<option value="quad:trabalho">Trabalho</option>
							<option value="quad:lazer">Lazer</option>
						</optgroup>
						<optgroup label="Trator">
							<option value="tractor:agricola">Agrícola</option>
							<option value="tractor:industrial">Industrial</option>
						</optgroup>
					</select>

					<input placeholder="Marca" name="marca" onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }} />
					<input placeholder="Modelo" name="modelo" onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }} />
					<input type="number" min="0" placeholder="Ano" name="ano" onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }} />
					<select name="combustivel" onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Combustível</option>
						<option value="gasoleo">Diesel</option>
						<option value="gasolina">Gasolina</option>
						<option value="eletrico">Elétrico</option>
						<option value="hibrido">Híbrido</option>
					</select>
					<input
						type="number"
						min="0"
						placeholder="Cilindrada (cc)"
						name="cilindrada"
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<input
						type="number"
						min="0"
						placeholder="Cavalos (opcional)"
						name="cavalos"
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<select name="transmissao" onChange={handleChange} defaultValue="" style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="" disabled>
							Transmissão
						</option>
						<option value="manual:4speed">Manual 4-speed</option>
						<option value="manual:5speed">Manual 5-speed</option>
						<option value="manual:6speed">Manual 6-speed</option>
						<option value="automatica">Automática</option>
					</select>
					<input
						type="number"
						min="0"
						placeholder="Quilometragem"
						name="quilometragem"
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<input placeholder="Matrícula (opcional)" name="matricula" onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }} />
					<input type="file" accept="image/*" name="image" onChange={(e) => setFile(e.target.files[0])} style={{ padding: "6px", borderRadius: "6px" }} />
				</div>

				<div style={{ marginTop: "20px", textAlign: "center" }}>
					<button
						type="button"
						onClick={adicionarCarro}
						style={{ padding: "10px 25px", borderRadius: "8px", border: "none", backgroundColor: "#4CAF50", color: "white", cursor: "pointer" }}
					>
						Adicionar
					</button>
				</div>
			</div>
		</div>
	);
}
