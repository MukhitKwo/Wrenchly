import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProcurarPorEspecificacoes() {
	const navigate = useNavigate();

	const [especificacoes, setEspecificacoes] = useState({
		categoria: "",
		marca: "",
		modelo: "",
		combustivel: "",
		transmissao: "",
		tipoCarroceria: "",

		tracao: "",
		portas: "",
		lugares: "",

		anoMin: "",
		anoMax: "",
		cilindradaMin: "",
		cilindradaMax: "",
		cavalosMin: "",
		cavalosMax: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEspecificacoes((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const procurarCarros = async (specs) => {
		console.log(specs);

		try {
			const res = await fetch("/api/procurarCarros/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ specs: specs }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				navigate("/listaCarrosRecomendados", {
					state: { candidateCars: data.candidateCars_data },
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "900px" }}>
			<h1>Procurar Carro</h1>
			<p>Escolhe como queres procurar um carro.</p>

			<div style={{ marginBottom: "16px" }}>
				<Link to="/procurarPorModelo">
					<button>Por Modelo</button>
				</Link>
				<button disabled style={{ marginLeft: "8px" }}>
					Por Especificações
				</button>
			</div>

			<div>
				<h2>Pesquisar por Especificações</h2>

				{/* Categoria / Tipo */}
				<select name="categoria" value={especificacoes.categoria} onChange={handleChange}>
					<option value="">Tipo / Categoria</option>
					<optgroup label="Carro">
						<option value="sedan">Sedan</option>
						<option value="suv">SUV</option>
						<option value="hatchback">Hatchback</option>
						<option value="coupe">Coupé</option>
						<option value="carrinha">Carrinha</option>
					</optgroup>
					<optgroup label="Mota">
						<option value="naked">Naked</option>
						<option value="sport">Sport</option>
						<option value="touring">Touring</option>
						<option value="custom">Custom</option>
						<option value="adv">Adventure</option>
					</optgroup>
				</select>

				{/* Marca / Modelo */}
				<input placeholder="Marca" name="marca" value={especificacoes.marca} onChange={handleChange} />

				<input placeholder="Modelo" name="modelo" value={especificacoes.modelo} onChange={handleChange} />

				{/* Ano */}
				<input type="number" placeholder="Ano mín" name="anoMin" value={especificacoes.anoMin} onChange={handleChange} />

				<input type="number" placeholder="Ano máx" name="anoMax" value={especificacoes.anoMax} onChange={handleChange} />

				{/* Combustível */}
				<select name="combustivel" value={especificacoes.combustivel} onChange={handleChange}>
					<option value="">Combustível</option>
					<option value="gasoleo">Diesel</option>
					<option value="gasolina">Gasolina</option>
					<option value="eletrico">Elétrico</option>
					<option value="hibrido">Híbrido</option>
				</select>

				{/* Transmissão */}
				<select name="transmissao" value={especificacoes.transmissao} onChange={handleChange}>
					<option value="">Transmissão</option>
					<option value="manual">Manual</option>
					<option value="automatica">Automática</option>
				</select>

				{/* Tração */}
				<select name="tracao" value={especificacoes.tracao} onChange={handleChange}>
					<option value="">Tração</option>
					<option value="fwd">FWD</option>
					<option value="rwd">RWD</option>
					<option value="awd">AWD</option>
				</select>

				{/* Carroçaria */}
				<select name="tipoCarroceria" value={especificacoes.tipoCarroceria} onChange={handleChange}>
					<option value="">Carroçaria</option>
					<option value="sedan">Sedan</option>
					<option value="hatchback">Hatchback</option>
					<option value="suv">SUV</option>
					<option value="coupe">Coupé</option>
					<option value="carrinha">Carrinha</option>
				</select>

				{/* Potência / Motor */}
				<input type="number" placeholder="Cavalos mín" name="cavalosMin" value={especificacoes.cavalosMin} onChange={handleChange} />

				<input type="number" placeholder="Cavalos máx" name="cavalosMax" value={especificacoes.cavalosMax} onChange={handleChange} />

				<input type="number" placeholder="Cilindrada mín (cc)" name="cilindradaMin" value={especificacoes.cilindradaMin} onChange={handleChange} />

				<input type="number" placeholder="Cilindrada máx (cc)" name="cilindradaMax" value={especificacoes.cilindradaMax} onChange={handleChange} />

				{/* Portas / Lugares */}
				<input type="number" min="2" max="5" placeholder="Portas" name="portas" value={especificacoes.portas} onChange={handleChange} />

				<input type="number" min="1" max="9" placeholder="Lugares" name="lugares" value={especificacoes.lugares} onChange={handleChange} />

				{/* Ordenação */}
				<select name="ordenarPor" value={especificacoes.ordenarPor} onChange={handleChange}>
					<option value="">Ordenar por</option>
					<option value="ano">Ano</option>
					<option value="cavalos">Cavalos</option>
					<option value="cilindrada">Cilindrada</option>
				</select>

				<select name="ordem" value={especificacoes.ordem} onChange={handleChange}>
					<option value="asc">Ascendente</option>
					<option value="desc">Descendente</option>
				</select>

				<button type="button" onClick={() => procurarCarros(especificacoes)}>
					Procurar
				</button>
			</div>
		</div>
	);
}
