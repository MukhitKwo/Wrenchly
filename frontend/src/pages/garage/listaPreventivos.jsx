import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";


export default function ListaPreventivos() {
	const navigate = useNavigate();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();

	// 🔹 Temporário: usar dados do localStorage se existirem
	const preventivos = getLocalStorage.preventivos || [];

	const verPreventivo = (preventivo) => {
		setLocalStorage((prev) => ({
			...prev,
			preventivo_selecionado: preventivo,
		}));

		console.log("=== PREVENTIVO SELECIONADO ===");
		console.log(preventivo);

		navigate("/preventivoDetalhe");
	};



	return (
		<div style={{ padding: "20px" }}>
			<h1>Lista de Preventivos</h1>
			<p>Manutenções preventivas associadas aos veículos.</p>

			<div style={{ marginBottom: "15px" }}>
				<Link to="/preventivoDetalhe">
					<button>Adicionar Preventivo</button>
				</Link>
			</div>

			{preventivos.length === 0 ? (
				<p>Não existem preventivos registados.</p>
			) : (
				<div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
					{preventivos.map((p) => (
						<div
							key={p.id}
							style={{
								border: "1px solid #ccc",
								padding: "10px",
								borderRadius: "5px",
							}}
						>
							<h3>{p.tipo}</h3>
							<p>{p.descricao}</p>
							<p>
								<strong>Intervalo:</strong> {p.intervalo_km} km /{" "}
								{p.intervalo_meses} meses
							</p>

							<button onClick={() => verPreventivo(p)}>Ver</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
