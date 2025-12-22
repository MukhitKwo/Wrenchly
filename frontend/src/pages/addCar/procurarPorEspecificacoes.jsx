import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ProcurarPorEspecificacoes() {
	const navigate = useNavigate();

	const [especificacoes, setEspecificacoes] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEspecificacoes((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const procurarCarros = async (specs) => {
		try {
			const res = await fetch("/api/procurarCarros/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
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
		<div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "sans-serif" }}>
			<h1 style={{ textAlign: "center", marginBottom: "10px" }}>Procurar Carro</h1>
			<p style={{ textAlign: "center", marginBottom: "20px" }}>Escolhe como queres procurar um carro.</p>

			<div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px" }}>
				<Link to="/adicionarPorModelo">
					<button style={{ padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>Por Modelo</button>
				</Link>
				<button disabled style={{ padding: "10px 20px", borderRadius: "6px", cursor: "not-allowed" }}>
					Por Especificações
				</button>
			</div>

			<div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
				<h2 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Pesquisar por Especificações</h2>

				{/* Grid para campos */}
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
					{/* Categoria / Tipo */}
					<select name="categoria" value={especificacoes.categoria} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
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
					<input placeholder="Marca" name="marca" value={especificacoes.marca} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }} />
					<input placeholder="Modelo" name="modelo" value={especificacoes.modelo} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }} />

					{/* Ano */}
					<input
						type="number"
						placeholder="Ano mín"
						name="anoMin"
						value={especificacoes.anoMin}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<input
						type="number"
						placeholder="Ano máx"
						name="anoMax"
						value={especificacoes.anoMax}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>

					{/* Combustível */}
					<select name="combustivel" value={especificacoes.combustivel} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Combustível</option>
						<option value="gasoleo">Diesel</option>
						<option value="gasolina">Gasolina</option>
						<option value="eletrico">Elétrico</option>
						<option value="hibrido">Híbrido</option>
					</select>

					{/* Transmissão */}
					<select name="transmissao" value={especificacoes.transmissao} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Transmissão</option>
						<option value="manual">Manual</option>
						<option value="automatica">Automática</option>
					</select>

					{/* Tração */}
					<select name="tracao" value={especificacoes.tracao} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Tração</option>
						<option value="fwd">FWD</option>
						<option value="rwd">RWD</option>
						<option value="awd">AWD</option>
					</select>

					{/* Carroçaria */}
					<select name="tipoCarroceria" value={especificacoes.tipoCarroceria} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Carroçaria</option>
						<option value="sedan">Sedan</option>
						<option value="hatchback">Hatchback</option>
						<option value="suv">SUV</option>
						<option value="coupe">Coupé</option>
						<option value="carrinha">Carrinha</option>
					</select>

					{/* Potência / Motor */}
					<input
						type="number"
						placeholder="Cavalos mín"
						name="cavalosMin"
						value={especificacoes.cavalosMin}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<input
						type="number"
						placeholder="Cavalos máx"
						name="cavalosMax"
						value={especificacoes.cavalosMax}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>

					<input
						type="number"
						placeholder="Cilindrada mín (cc)"
						name="cilindradaMin"
						value={especificacoes.cilindradaMin}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<input
						type="number"
						placeholder="Cilindrada máx (cc)"
						name="cilindradaMax"
						value={especificacoes.cilindradaMax}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>

					{/* Portas / Lugares */}
					<input
						type="number"
						min="2"
						max="5"
						placeholder="Portas"
						name="portas"
						value={especificacoes.portas}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>
					<input
						type="number"
						min="1"
						max="9"
						placeholder="Lugares"
						name="lugares"
						value={especificacoes.lugares}
						onChange={handleChange}
						style={{ padding: "8px", borderRadius: "6px" }}
					/>

					{/* Ordenação */}
					<select name="ordenarPor" value={especificacoes.ordenarPor} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="">Ordenar por</option>
						<option value="ano">Ano</option>
						<option value="cavalos">Cavalos</option>
						<option value="cilindrada">Cilindrada</option>
					</select>

					<select name="ordem" value={especificacoes.ordem} onChange={handleChange} style={{ padding: "8px", borderRadius: "6px" }}>
						<option value="asc">Ascendente</option>
						<option value="desc">Descendente</option>
					</select>
				</div>

				<div style={{ marginTop: "20px", textAlign: "center" }}>
					<button
						type="button"
						onClick={() => procurarCarros(especificacoes)}
						style={{ padding: "10px 25px", borderRadius: "8px", border: "none", backgroundColor: "#4CAF50", color: "white", cursor: "pointer" }}
					>
						Procurar
					</button>
				</div>
			</div>
		</div>
	);
}
