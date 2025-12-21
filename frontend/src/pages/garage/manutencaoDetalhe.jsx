import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";

export default function ManutencaoDetalhe() {
	const { state: getLocalStorage } = useLocalStorage();
	const carro_id = getLocalStorage?.carro_selecionado?.id || null;

	const [manutencao, setManutencao] = useState({
		id: Date.now(),
		tipo: "",
		descricao: "",
		data: "",
		custo: "",
		quilometragem: "",
		carro: carro_id,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const guardarManutencao = async () => {
		console.log("=== MANUTENÇÃO SUBMETIDA ===");
		console.log(manutencao);

		await devLog({
			tipo: "MANUTENCAO",
			acao: "CRIAR",
			payload: manutencao,
		});

		alert("Manutenção registada (ver TERMINAL do Django)");
	};

	return (
		<div className="page-box">
			<h1>Manutenção</h1>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<Link to="/listaManutencoes">
					<button>Voltar</button>
				</Link>

				<button type="button" onClick={guardarManutencao}>
					Guardar
				</button>
			</div>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<input placeholder="Tipo de manutenção" name="tipo" value={manutencao.tipo} onChange={handleChange} />

				<textarea placeholder="Descrição" name="descricao" value={manutencao.descricao} onChange={handleChange} />

				<input type="date" name="data" value={manutencao.data} onChange={handleChange} />

				<input type="number" placeholder="Custo (€)" name="custo" value={manutencao.custo} onChange={handleChange} />

				<input type="number" placeholder="Quilometragem" name="quilometragem" value={manutencao.quilometragem} onChange={handleChange} />
			</div>
		</div>
	);
}
