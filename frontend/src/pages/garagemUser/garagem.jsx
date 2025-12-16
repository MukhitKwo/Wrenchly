import { Link } from "react-router-dom";

export default function Garagem() {
	return (
		<div className="page-box">
			<h1>Pagina Lista Garagem</h1>

			<Link to="/procurarPorModelo">
				<button>Adicionar carro</button>
			</Link>

			<Link to="/definicoes">
				<button>Definições</button>
			</Link>

			<p>lista arros aqui</p>
		</div>
	);
}
