function navbar() {
	return (
		// ja tem navbar na App
		<nav className="Navbar">
			<div className="navbar-container">
				<a href="/" className="navbar-logo" style={{ color: "black" }}>
					Wrenchly
				</a>
				<br />
				ANTÓNIO SE ESTÁS A LER ISTO, PRECISO QUE ME DIGAS SE AQUI É INDICADO METER LOGO A PARTE DA GARAGEM COM OS CARROS ETC, DIZME SE QUERES BOTOES AQUI
				<br />
				Estás num bom caminho, mas a homepage nao deve ter garagem (Inicio/Garagem). Caso o utilizador esteja logado (django salva sessão no browser), deverá
				aparecer *apenas* a garagem com os carros! Caso não esteja, mostra a homepage.
				<br />
				Na homepage podes dexar o que está, mas tira o botao Inicio (clicar no "Wrenchly" leva ao inicio) e troca o Perfil por Login e Registro (dois butoes
				individuais).
				<br />
				Na garagem tem 3 buttoes: definições, criar carro novo e homepage. Cada carro é uma box interativa que quando clicas, aparecem as manuteções, mas
				adiciona mais 2 botoes temporarios para preventivos e cronicos.
			</div>
		</nav>
	);
}

export default navbar;
