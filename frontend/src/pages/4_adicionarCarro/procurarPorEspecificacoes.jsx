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
		<div style={{ backgroundColor: "#f9f9f9", padding: "25px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
			<h2 style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>Pesquisar por Especificações</h2>

			<div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Categoria</label>
					<select name="categoria" value={especificacoes.categoria} onChange={handleChange} style={{ flex: 1 }}>
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
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Marca</label>
					<input name="marca" value={especificacoes.marca} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Modelo</label>
					<input name="modelo" value={especificacoes.modelo} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Ano mínimo</label>
					<input type="number" name="anoMin" value={especificacoes.anoMin} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Ano máximo</label>
					<input type="number" name="anoMax" value={especificacoes.anoMax} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Combustível</label>
					<select name="combustivel" value={especificacoes.combustivel} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="gasoleo">Diesel</option>
						<option value="gasolina">Gasolina</option>
						<option value="eletrico">Elétrico</option>
						<option value="hibrido">Híbrido</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Transmissão</label>
					<select name="transmissao" value={especificacoes.transmissao} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="manual">Manual</option>
						<option value="automatica">Automática</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Tração</label>
					<select name="tracao" value={especificacoes.tracao} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="fwd">FWD</option>
						<option value="rwd">RWD</option>
						<option value="awd">AWD</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Carroçaria</label>
					<select name="tipoCarroceria" value={especificacoes.tipoCarroceria} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="sedan">Sedan</option>
						<option value="hatchback">Hatchback</option>
						<option value="suv">SUV</option>
						<option value="coupe">Coupé</option>
						<option value="carrinha">Carrinha</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Cavalos mín</label>
					<input type="number" name="cavalosMin" value={especificacoes.cavalosMin} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Cavalos máx</label>
					<input type="number" name="cavalosMax" value={especificacoes.cavalosMax} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Cilindrada mín (cc)</label>
					<input type="number" name="cilindradaMin" value={especificacoes.cilindradaMin} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Cilindrada máx (cc)</label>
					<input type="number" name="cilindradaMax" value={especificacoes.cilindradaMax} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Portas</label>
					<input type="number" name="portas" value={especificacoes.portas} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Lugares</label>
					<input type="number" name="lugares" value={especificacoes.lugares} onChange={handleChange} style={{ flex: 1 }} />
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Ordenar por</label>
					<select name="ordenarPor" value={especificacoes.ordenarPor} onChange={handleChange} style={{ flex: 1 }}>
						<option value="">---</option>
						<option value="ano">Ano</option>
						<option value="cavalos">Cavalos</option>
						<option value="cilindrada">Cilindrada</option>
					</select>
				</div>

				<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
					<label style={{ width: "180px" }}>Ordem</label>
					<select name="ordem" value={especificacoes.ordem} onChange={handleChange} style={{ flex: 1 }}>
						<option value="asc">Ascendente</option>
						<option value="desc">Descendente</option>
					</select>
				</div>
			</div>

			<div style={{ marginTop: "20px", textAlign: "center" }}>
				<button type="button" onClick={() => procurarCarros(especificacoes)} style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
					Procurar
				</button>
			</div>
		</div>
	);
}
