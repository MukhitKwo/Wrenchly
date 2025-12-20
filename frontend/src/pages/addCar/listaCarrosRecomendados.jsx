import { useLocation } from "react-router-dom";

export default function ListaCarrosRecomendados() {
	const { state } = useLocation();

	const candidateCars = state?.candidateCars;

	console.log(candidateCars);

	return (
		<div className="page-box">
			<h1>Pagina listaCarrosRecomendados</h1>
			<p>recomendados por especificaçoes</p>
		</div>
	);
}
