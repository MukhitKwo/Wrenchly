import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";
import { useParams } from "react-router-dom";

export default function ListaManutencoes() {
    const navigate = useNavigate();
    const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();
    const { id } = useParams();

    console.log(id);
    

    // Fonte das manutenções (placeholder nesta fase)
    const manutencoes = getLocalStorage?.manutencoes || [];

    const imprimirLista = async () => {
        console.log("=== LISTA DE MANUTENÇÕES ===");
        console.log(manutencoes);

        await devLog({
            tipo: "MANUTENCAO",
            acao: "LISTAR",
            payload: manutencoes,
        });
    };


    const verManutencao = async (manutencao) => {
        setLocalStorage((prev) => ({
            ...prev,
            manutencao_selecionada: manutencao,
        }));

        await devLog({
            tipo: "MANUTENCAO",
            acao: "ABRIR",
            payload: manutencao,
        });

        navigate("/manutencaoDetalhe");
    };
    return (
        <div style={{ padding: "20px" }}>
            <h1>Lista de Manutenções</h1>
            <p>Manutenções associadas aos teus veículos.</p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button type="button" onClick={imprimirLista}>
                    Imprimir lista na consola
                </button>

                <button type="button" onClick={() => navigate("/manutencaoDetalhe")}>
                    Adicionar Manutenção
                </button>

                <Link to="/garagem">
                    <button>Voltar à Garagem</button>
                </Link>
            </div>

            {manutencoes.length === 0 ? (
                <p>Não existem manutenções registadas.</p>
            ) : (
                <div>
                    {manutencoes.map((manutencao, index) => {
                        const tipo = manutencao?.tipo || "—";
                        const data = manutencao?.data || "—";
                        const custo = manutencao?.custo || "—";

                        return (
                            <div
                                key={manutencao.id ?? index}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    borderRadius: "6px",
                                }}
                            >
                                <p>
                                    <strong>{tipo}</strong> | Data: {data} | Custo: {custo}€
                                </p>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button type="button" onClick={() => verManutencao(manutencao)}>
                                        Ver
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            console.log("=== EDITAR MANUTENÇÃO (placeholder) ===");
                                            console.log(manutencao);
                                        }}
                                    >
                                        Editar (placeholder)
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
