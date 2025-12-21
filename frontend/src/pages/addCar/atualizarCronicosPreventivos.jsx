import { useLocation } from "react-router-dom";

export default function AtualizarCronicosPreventivos() {
	const { state } = useLocation();

	const carroInfo = state?.carroInfo;

	console.log(carroInfo.nome);
	console.log(carroInfo.matricula);
	console.log(carroInfo.foto);
	console.log(carroInfo.allCronicos_data);
	console.log(carroInfo.allPreventivos_data);

	return (
		<div className="page-box">
			<h1>Pagina atualizarCronicosPreventivos</h1>
		</div>
	);
}
