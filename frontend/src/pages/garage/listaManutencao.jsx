import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ListaManutencoes() {
	const navigate = useNavigate();
	const { id } = useParams();

	// Fonte das manutenções (placeholder nesta fase)
	const [manutencoes, setManutencoes] = useState([]);

	useEffect(() => {
		verManutencao();
	}, []);

	const verManutencao = async () => {
		try {
			const res = await fetch(`/api/listarManutencoes/?carro_id=${id}`, {
				method: "GET",
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				setManutencoes(data.manutencoes_data);
			}
		} catch (error) {
			console.log(error);
		}

		// navigate("/manutencaoDetalhe");
	};
	return (
		<div style={{ padding: "20px" }}>
			<h1>Lista de Manutenções</h1>
			<p>Manutenções associadas aos teus veículos.</p>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<Link to="/garagem">
					<button>Voltar à Garagem</button>
				</Link>

				<button type="button" onClick={() => navigate("/manutencao", { state: { carro_id: id } })}>
					Adicionar Manutenção
				</button>
			</div>

			{manutencoes.length === 0 ? (
				<p>Não existem manutenções registadas.</p>
			) : (
				manutencoes.map((manutencao) => (
					<div
						key={manutencao.id}
						style={{
							border: "1px solid #ccc",
							padding: "10px",
							marginBottom: "10px",
							borderRadius: "6px",
						}}
					>
						<p>
							<strong>{manutencao.nome}</strong>
							<br />
							<small>{manutencao.tipo}</small>
						</p>
						<p>Data: {manutencao.data}</p>
						<p>KMs: {manutencao.kms}</p>
						{manutencao.notas && <p>Notas: {manutencao.notas}</p>}

						<div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
							<button onClick={() => navigate(`/manutencao/${manutencao.id}`)}>Ver</button>

							<button onClick={() => console.log("Editar", manutencao)}>Editar</button>
						</div>
					</div>
				))
			)}
		</div>
	);
}
