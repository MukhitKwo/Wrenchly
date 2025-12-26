import "./LoadingSpinner.css";

export default function LoadingSpinner({ text = "A carregar..." }) {
	return (
		<div className="loading-overlay">
			<div className="spinner-box">
				<div className="spinner" />
				<p>{text}</p>
			</div>
		</div>
	);
}

