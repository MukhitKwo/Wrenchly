import { useNavigate } from "react-router-dom";
import { getRiskColor } from "../../utils/riskColor";

export default function ListaCronicos({ cronicos, carroId, carroKms }) {
	const navigate = useNavigate();

	const corretivas = cronicos;

	return (
		<div
			style={{
				border: "1px solid #ddd",
				borderRadius: "8px",
				padding: "12px",
			}}
		>
			<h3>Cronicos</h3>

			<div style={{ marginBottom: "12px" }}>
				<button onClick={() => navigate("/novoCronico", { state: { carro_id: carroId, carro_kms: carroKms } })}>Adicionar Novo</button>
			</div>

			{corretivas.length === 0 ? (
				<p style={{ opacity: 0.6 }}>No corrective maintenances.</p>
			) : (
				corretivas.map((manutencao) => (
					<div
						key={manutencao.id}
						style={{
							borderLeft: `6px solid ${getRiskColor(manutencao.risco)}`,
							paddingLeft: "10px",
							borderBottom: "1px solid #eee",
							paddingBottom: "8px",
							marginBottom: "8px",
						}}
					>
						<strong>{manutencao.nome}</strong>

						<p>Trocar no Km: {manutencao.trocarNoKm} km</p>
						<p>
							Risco:{" "}
							<span
								style={{
									color: getRiskColor(manutencao.risco),
									fontWeight: "bold",
								}}
							>
								{manutencao.risco}
							</span>
						</p>

						{manutencao.notas && <p>Notes: {manutencao.notas}</p>}

						{/* ver cronico */}
						<div style={{ display: "flex", gap: "8px" }}>
							<button onClick={() => navigate(`/todasManutencoes/${carroId}/cronico/${manutencao.id}`)}>Ver</button>
							<button
								onClick={() =>
									navigate("/novoCorretivo", {
										state: {
											carro_id: carroId,
											carro_kms: carroKms,
											manutencaoData: manutencao,
											tipo: "cronico",
										},
									})
								}
							>
								Fazer
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
}
