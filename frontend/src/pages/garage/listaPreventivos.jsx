import { useNavigate } from "react-router-dom";

export default function ListaPreventivos({ preventivos, carroId, carroKms }) {
	const navigate = useNavigate();

	const corretivas = preventivos;

	return (
		<div
			style={{
				border: "1px solid #ddd",
				borderRadius: "8px",
				padding: "12px",
			}}
		>
			<h3>Preventivos</h3>

			<div style={{ marginBottom: "12px" }}>
				<button onClick={() => navigate("/preventivo", { state: { carro_id: carroId, carro_kms: carroKms } })}>Adicionar Novo</button>
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

						<p>
							Trocar no Km: {manutencao.trocarNoKm} km | Data: {manutencao.trocarNaData}
						</p>
						<p>Risco: {manutencao.risco}</p>

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
