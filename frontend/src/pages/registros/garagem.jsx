import { Link } from "react-router-dom";

export default function Garagem() {
	return (
		<div className="page-box">
			<h1>Pagina Lista Garagem</h1>
			<p>lista arros aqui</p>

			<Link to="/manutencoes">
				<button>Ver Manutenções</button>
			</Link>
		</div>
	);
}
