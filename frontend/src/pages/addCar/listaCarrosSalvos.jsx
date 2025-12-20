import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";

export default function ListaCarrosSalvos() {
    const navigate = useNavigate();
    const { state: getLocalStorage } = useLocalStorage();

    // Fonte principal: carros_preview (vem do loginUser)
    const carrosGuardados = getLocalStorage?.carros_preview || [];

    const imprimirLista = () => {
        console.log("=== LISTA CARROS GUARDADOS ===");
        console.log(carrosGuardados);
    };

    const verCarro = (carro) => {
        console.log("=== CARRO SELECIONADO ===");
        console.log(carro);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Lista de Carros Guardados</h1>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <Link to="/procurarPorModelo">
                    <button>Adicionar Carro</button>
                </Link>

                <button type="button" onClick={imprimirLista}>
                    Imprimir lista na consola
                </button>

                <button type="button" onClick={() => navigate("/ListaManutencoes")}>
                    Manutenções
                </button>

                <button type="button" onClick={() => navigate("/preventivos")}>
                    Preventivos
                </button>

                <button type="button" onClick={() => navigate("/cronicos")}>
                    Crónicos
                </button>
            </div>

            {carrosGuardados.length === 0 ? (
                <p>Não existem carros guardados.</p>
            ) : (
                <div>
                    {carrosGuardados.map((carro, idx) => {
                        // Tentativa de campos comuns (não sei a forma exata do teu objeto)
                        const marca = carro?.marca || carro?.caracteristicas?.marca || "—";
                        const modelo = carro?.modelo || carro?.caracteristicas?.modelo || "—";
                        const ano = carro?.ano || carro?.caracteristicas?.ano || "—";

                        return (
                            <div
                                key={carro?.id ?? carro?.carro_id ?? idx}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    borderRadius: "6px",
                                }}
                            >
                                <p>
                                    <strong>{marca}</strong> {modelo} ({ano})
                                </p>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button type="button" onClick={() => verCarro(carro)}>
                                        Ver (consola)
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log("=== ABRIR DETALHE DO CARRO (placeholder) ===");
                                            console.log(carro);

                                            // Aqui podes adicionar navegação para a página de detalhe do carro
                                        }}
                                    >
                                        Abrir (placeholder)
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
