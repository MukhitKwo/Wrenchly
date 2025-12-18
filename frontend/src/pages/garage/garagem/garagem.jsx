import { Link } from "react-router-dom";
import './garagem.css';

export default function Garagem() {
	return (
		<div className="page-box">
			<h1>Garagem</h1>

			<div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px", }} >
				<Link to="/procurarPorModelo">
					<button>Adicionar carro</button>
				</Link>
			</div>

			Ja que estas aqui, as definiçoes devem estar na navbar (ja meti), homepage botao nao deve existir na garagem (a logo "wrenhcly" ja faz isso), e quando tu entras na garagem, deve logo mostar os carros todos, e cada carro é tipo um painel que quando clicas, vai para pagina manutencoes.jsx e mostra as manutencoes do carro.
			Em relação aos carros, tu ja consegues meter os paineis com informação real da base de dados. tens de: fazer registro (/registro), se for sucesso vai-te mandar pra garagem, caso não, ve consola. Clica Criar Novo carro e dps Adicionar carro, preenche tudo (podes meter cenas à toa, ainda nao verifica), clica no Procurar umas 3 vezes para teres varios carros, volta à garagem. Agora se abrires a console e fores a "Application", clica no LocalStorage e no http... dentro, vais ver uma "appState" (clica nela) com as informaçoes todas, incluindo carros_preview. Agora para usar esses dados é um bocado mais dificil e vais ter que perguntar na aula. se quiseres fazer ja a cena dos paineis dos carros, usa informaçoes estaticas.

		</div>
	);
}
