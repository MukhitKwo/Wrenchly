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
					body: formData,
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
		<div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px" }}>
			<h2 style={{ marginBottom: "20px" }}>Pesquisar por Modelo</h2>

			<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Categoria</label>
					<select name="categoria" onChange={handleChange} style={{ flex: 1 }}>
						<option value="">Tipo / Categoria</option>
						<optgroup label="Carro">
							<option value="carro:sedan">Sedan</option>
							<option value="carro:suv">SUV</option>
							<option value="carro:hatchback">Hatchback</option>
							<option value="carro:coupe">Coupé</option>
							<option value="carro:carrinha">Carrinha</option>
						</optgroup>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Marca</label>
					<input name="marca" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Modelo</label>
					<input name="modelo" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Ano</label>
					<input type="number" name="ano" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Combustível</label>
					<select name="combustivel" onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="gasoleo">Diesel</option>
						<option value="gasolina">Gasolina</option>
						<option value="eletrico">Elétrico</option>
						<option value="hibrido">Híbrido</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Cilindrada (cc)</label>
					<input type="number" name="cilindrada" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Cavalos</label>
					<input type="number" name="cavalos" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Transmissão</label>
					<select name="transmissao" onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="manual:5speed">Manual 5-speed</option>
						<option value="manual:6speed">Manual 6-speed</option>
						<option value="automatica">Automática</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Quilometragem</label>
					<input type="number" name="quilometragem" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Matrícula</label>
					<input name="matricula" onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "160px" }}>Imagem</label>
					<input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} style={{ flex: 1 }} />
				</div>
			</div>

			<div style={{ marginTop: "20px", textAlign: "center" }}>
				<button type="button" onClick={adicionarCarro}>
					Adicionar
				</button>
			</div>
		</div>
	);
}
