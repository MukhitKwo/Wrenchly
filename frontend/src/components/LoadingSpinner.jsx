import "./LoadingSpinner.css";

export default function LoadingSpinner() {
	return (
		<div className="loading-overlay fade-in">
			<div className="loading-content">
				<div className="loading-spinner"></div>
				<p className="loading-text">A carregar…</p>
			</div>
		</div>
	);
}


