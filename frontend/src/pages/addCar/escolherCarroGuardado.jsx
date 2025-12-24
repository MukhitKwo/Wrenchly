import { Link, useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useEffect, useState, useRef } from "react";

export default function MostrarCarrosGuardados() {
	const navigate = useNavigate();
	const { state: getLocalStorage } = useLocalAppState();

	const [carrosSalvos, setCarrosSalvos] = useState([]);

	// Fonte principal: carros_preview (vem do loginUser)
	// const carrosSalvos = getLocalStorage?.carros_preview || [];

	const obterCarros = async () => {
		try {
			const res = await fetch("/api/carrosGuardados/", {
				method: "GET",
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				setCarrosSalvos(data.carrosGuardados_data);
				console.log(data.carrosGuardados_data);
			}
		} catch (error) {}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Lista de Carros Guardados</h1>

			<button type="button" onClick={() => obterCarros()}>
				Obter Carros (temporario)
			</button>

			{carrosSalvos.length === 0 ? (
				<p>Não existem carros guardados.</p>
			) : (
				<div>
					{carrosSalvos.map((carro, idx) => {
						const marca = carro?.marca || carro?.caracteristicas?.marca || "—";
						const modelo = carro?.modelo || carro?.caracteristicas?.modelo || "—";
						const ano = carro?.ano || carro?.caracteristicas?.ano || "—";

						return (
							<div
								key={carro?.id ?? carro?.carro_id ?? idx}
								style={{
									border: "1px solid #ccc",
									padding: "10px",
									marginBottom: "10px",
									borderRadius: "6px",
								}}
							>
								<p>
									<strong>{marca}</strong> {modelo} ({ano})
								</p>

								<div style={{ display: "flex", gap: "10px" }}>
									<button type="button">Adicionar Carro</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
