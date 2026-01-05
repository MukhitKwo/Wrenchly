import { useState } from "react";
import ProcurarCarroPorModelo from "./adicionarPorModelo";
import MostrarCarrosGuardados from "./escolherCarroGuardado";
import ProcurarPorEspecificacoes from "./procurarPorEspecificacoes";

export default function NovoCarro() {
	const [selected, setSelected] = useState("modelo");

	const renderComponent = () => {
		switch (selected) {
			case "modelo":
				return <ProcurarCarroPorModelo />;
			case "especificacoes":
				return <ProcurarPorEspecificacoes />;
			case "guardado":
				return <MostrarCarrosGuardados />;
			default:
				return <ProcurarCarroPorModelo />;
		}
	};

	return (
		<div style={{ padding: "20px", fontFamily: "sans-serif" }}>
			<h1 style={{ textAlign: "center", marginBottom: "20px" }}>Escolha uma opção</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px" }}>
				<button onClick={() => setSelected("modelo")} style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
					Adicionar por Modelo
				</button>
				<button onClick={() => setSelected("especificacoes")} style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
					Procurar por Especificações
				</button>
				<button onClick={() => setSelected("guardado")} style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
					Escolher um carro guardado
				</button>
			</div>

			<div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "12px" }}>{renderComponent()}</div>
		</div>
	);
}
