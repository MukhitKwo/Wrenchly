import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";

export default function Cronicos() {
    const navigate = useNavigate();
    const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();

    // Opcional: filtrar por carro selecionado, se existir
    const carroSelecionado = getLocalStorage?.carro_selecionado || null;

    // Fonte principal: localStorage (se já existir), senão cria exemplos
    const cronicos = Array.isArray(getLocalStorage?.cronicos)
        ? getLocalStorage.cronicos
        : [
            {
                id: 1,
                nome: "Ruído metálico no motor",
                severidade: "Alta",
                resolvido: false,
                descricao: "Ruído ao acelerar entre 2k-3k RPM.",
                quilometragem: 185000,
                carro_id: carroSelecionado?.id || null,
            },
            {
                id: 2,
                nome: "Consumo de óleo elevado",
                severidade: "Média",
                resolvido: true,
                descricao: "Perde ~1L a cada 1000km.",
                quilometragem: 172000,
                carro_id: carroSelecionado?.id || null,
            },
        ];

    const listaFiltrada = carroSelecionado?.id
        ? cronicos.filter((c) => c.carro_id === carroSelecionado.id)
        : cronicos;

    const abrirCronico = async (cronico) => {
        setLocalStorage((prev) => ({
            ...prev,
            cronico_selecionado: cronico,
        }));

        await devLog({
            tipo: "CRONICO",
            acao: "ABRIR",
            payload: cronico,
        });

        navigate("/cronicoDetalhe"); // detalhe
    };


    return (
        <div className="page-box">
            <h1>Lista Crónicos</h1>

            {carroSelecionado?.id ? (
                <p>
                    Carro selecionado: <strong>{carroSelecionado?.nome || carroSelecionado?.modelo || carroSelecionado?.id}</strong>
                </p>
            ) : (
                <p>(Sem carro selecionado — a mostrar todos os crónicos)</p>
            )}

            {listaFiltrada.length === 0 ? (
                <p>Sem crónicos para mostrar.</p>
            ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                    {listaFiltrada.map((c) => (
                        <div
                            key={c.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "10px",
                                display: "grid",
                                gap: "6px",
                            }}
                        >
                            <div>
                                <strong>Nome:</strong> {c.nome}
                            </div>
                            <div>
                                <strong>Severidade:</strong> {c.severidade}
                            </div>
                            <div>
                                <strong>Resolvido:</strong> {c.resolvido ? "Sim" : "Não"}
                            </div>

                            <button type="button" onClick={() => abrirCronico(c)}>
                                Abrir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
