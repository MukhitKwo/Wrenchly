import "./LoadingSpinner.css";

export default function LoadingSpinner({ text = "A carregar…" }) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
}