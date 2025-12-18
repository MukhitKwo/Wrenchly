import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './garagem.css';

export default function Garagem() {
    const [carros, setCarros] = useState([]);

    useEffect(() => {
        // Tenta buscar os carros da base de dados ou localStorage
        const fetchCarros = async () => {
            try {
                // Se tiveres uma API real, substitui esta URL
                const response = await fetch("http://localhost:3000/carros"); // <-- muda para a tua API real
                if (!response.ok) throw new Error("Erro ao buscar carros");
                const data = await response.json();
                setCarros(data);
            } catch (error) {
                console.log("Não foi possível buscar da API, a usar localStorage...", error);
                // fallback para localStorage
                const appState = JSON.parse(localStorage.getItem("appState"));
                if (appState && appState.carros_preview) {
                    setCarros(appState.carros_preview);
                }
            }
        };

        fetchCarros();
    }, []);

    return (
        <div className="page-box">
            <h1>Garagem</h1>

            <div style={{ display: "flex", justifyContent: "center", gap: "14px", padding: "20px" }} >
                <Link to="/procurarPorModelo">
                    <button>Adicionar carro</button>
                </Link>
            </div>

            <div className="carros-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {carros.length === 0 ? (
                    <p>Não tens carros na garagem.</p>
                ) : (
                    carros.map((carro, index) => (
                        <div key={index} className="carro-panel" style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", width: "200px", textAlign: "center", boxShadow: "2px 2px 6px rgba(0,0,0,0.1)" }}>
                            <h2>{carro.marca || carro.modelo || "Sem marca"}</h2>
                            <p><strong>Modelo:</strong> {carro.modelo || "N/A"}</p>
                            <p><strong>Ano:</strong> {carro.ano || "N/A"}</p>
                            <p><strong>Cor:</strong> {carro.cor || "N/A"}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
