import { useLocation } from "react-router-dom";

export default function ListaCarrosRecomendados() {
	const { state } = useLocation();

	const candidateCars = state?.candidateCars;

	console.log(candidateCars);

	return (
		<div className="page-box">
			<h1>Lista de Carros Recomendados</h1>
			<p>Recomendados por especificações (nao funciona ainda)</p>

			{candidateCars.length ? (
				candidateCars.map((car, index) => (
					<div
						key={index}
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							border: "1px solid #ccc",
							padding: "10px",
							marginBottom: "8px",
							borderRadius: "6px",
						}}
					>
						<span>{car}</span>
						<button>Save</button>
					</div>
				))
			) : (
				<p>Nenhum carro recomendado.</p>
			)}
		</div>
	);
}
