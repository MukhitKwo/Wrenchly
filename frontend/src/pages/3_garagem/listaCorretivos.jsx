import { useNavigate } from "react-router-dom";

export default function ListaCorretivos({ corretivos, carroId, carroKms }) {
	const navigate = useNavigate();

	const corretivas = corretivos;

	return (
		<div
			style={{
				border: "1px solid #ddd",
				borderRadius: "8px",
				padding: "12px",
			}}
		>
			<h3>Corretivos</h3>

			<div style={{ marginBottom: "12px" }}>
				<button onClick={() => navigate("/novoCorretivo", { state: { carro_id: carroId, carro_kms: carroKms } })}>Adicionar Novo</button>
			</div>

			{corretivas.length === 0 ? (
				<p style={{ opacity: 0.6 }}>No corrective maintenances.</p>
			) : (
				corretivas.map((manutencao) => (
					<div
						key={manutencao.id}
						style={{
							borderBottom: "1px solid #eee",
							paddingBottom: "8px",
							marginBottom: "8px",
						}}
					>
						<strong>{manutencao.nome}</strong>

						<p>No Kms: {manutencao.quilometragem}</p>
						<p>Date: {manutencao.data}</p>

						{manutencao.notas && <p>Notes: {manutencao.notas}</p>}

						<div style={{ display: "flex", gap: "8px" }}>
							<button
								onClick={() =>
									navigate(`/manutencao/${manutencao.id}`, {
										state: { carro_id: carroId },
									})
								}
							>
								View
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
}
