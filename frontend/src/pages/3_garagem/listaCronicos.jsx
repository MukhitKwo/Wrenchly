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
			<h3>Crónicos</h3>

			<div style={{ marginBottom: "12px" }}>
				<button onClick={() => navigate("/novoCronico", { state: { carro_id: carroId, carro_kms: carroKms } })}>Adicionar Novo</button>
			</div>

			{corretivas.length === 0 ? (
				<p style={{ opacity: 0.6 }}>No chronic maintenances.</p>
			) : (
				corretivas.map((manutencao) => (
					<div
						key={manutencao.id}
						style={{
							border: "1px solid #eee",
							borderRadius: "6px",
							padding: "10px",
							marginBottom: "10px",
							cursor: "pointer",
							transition: "background 0.2s",
							position: "relative",
							borderLeft: `6px solid ${getRiskColor(manutencao.risco)}`,
						}}
						onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
						onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
						onClick={() => navigate(`/todasManutencoes/${carroId}/cronico/${manutencao.id}`)}
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

						{/* Fazer button bottom right */}
						<div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
							<button
								onClick={(e) => {
									e.stopPropagation(); // prevent panel click
									navigate("/novoCorretivo", {
										state: {
											carro_id: carroId,
											carro_kms: carroKms,
											manutencaoData: manutencao,
											tipo: "cronico",
										},
									});
								}}
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
