import "./LoadingSpinner.css";

export default function LoadingSpinner({ text = "A carregar..." }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "50vh",
				color: "#555",
				gap: "16px",
			}}
		>
			<div
				style={{
					width: "48px",
					height: "48px",
					border: "4px solid #ddd",
					borderTop: "4px solid #222",
					borderRadius: "50%",
					animation: "spin 1s linear infinite",
				}}
			/>
			<span>{text}</span>

			<style>
				{`
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
				`}
			</style>
		</div>
	);
}


