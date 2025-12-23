import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Preventivo() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const carro_id = state?.carro_id;
	const carro_kms = state?.carro_kms;

	const today = new Date().toISOString().split("T")[0];

	const [manutencao, setManutencao] = useState({
		carro: carro_id,
		nome: "",
		descricao: "",
		diasEntreTroca: 0,
		trocadoNaData: today,
		kmsEntreTroca: "",
		trocadoNoKm: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const guardarManutencao = async () => {
		try {
			const res = await fetch("/api/criarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_kms }),
			});
			const data = await res.json();
			console.log(data.message);
			if (res.ok) navigate(-1);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="page-box">
			<h1>Nova Manutenção Preventiva</h1>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>
				<button onClick={guardarManutencao}>Guardar</button>
			</div>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<input placeholder="Nome" name="nome" value={manutencao.nome} onChange={handleChange} />
				<textarea placeholder="Descrição" name="descricao" value={manutencao.descricao} onChange={handleChange} />

				<input type="number" placeholder="Dias entre troca" name="diasEntreTroca" value={manutencao.diasEntreTroca} onChange={handleChange} />
				<input type="date" name="trocadoNaData" value={manutencao.trocadoNaData} onChange={handleChange} />

				<input type="number" placeholder="Kms entre troca" name="kmsEntreTroca" value={manutencao.kmsEntreTroca} onChange={handleChange} />
				<input type="number" placeholder="Trocado no km" name="trocadoNoKm" value={manutencao.trocadoNoKm} onChange={handleChange} />
			</div>
		</div>
	);
}
