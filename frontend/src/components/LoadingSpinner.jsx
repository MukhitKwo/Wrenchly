import "./LoadingSpinner.css";
import logo from "./favicon-32x32.ico"; // substitui pelo caminho da tua imagem

export default function LoadingSpinner({ text = "A carregar…" }) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-spinner">
          {/* Imagem no centro do spinner */}
          <img src={logo} alt="Logo" className="spinner-logo" />
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
}
