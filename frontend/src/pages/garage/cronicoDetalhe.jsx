import { Link } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";


export default function CronicoDetalhe() {
    const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();

    const cronico = getLocalStorage?.cronico_selecionado || null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setLocalStorage((prev) => ({
            ...prev,
            cronico_selecionado: {
                ...prev.cronico_selecionado,
                [name]: type === "checkbox" ? checked : value,
            },
        }));
    };

    const guardarEdicao = async () => {
        console.log("=== EDITAR / GUARDAR CRÓNICO ===");
        console.log(cronico);

        setLocalStorage((prev) => {
            const lista = Array.isArray(prev.cronicos) ? prev.cronicos : [];

            const existe = lista.some((c) => c.id === cronico.id);

            const listaAtualizada = existe
                ? lista.map((c) =>
                    c.id === cronico.id ? { ...c, ...cronico } : c
                )
                : [...lista, { ...cronico, id: Date.now() }];

            const cronicoFinal = existe
                ? { ...cronico }
                : { ...cronico, id: Date.now() };

            return {
                ...prev,
                cronicos: listaAtualizada,
                cronico_selecionado: cronicoFinal,
            };
        });

        await devLog({
            tipo: "CRONICO",
            acao: cronico.id ? "EDITAR" : "CRIAR",
            payload: cronico,
        });
    };




    if (!cronico) {
        return (
            <div className="page-box">
                <h1>Crónico</h1>
                <p>Nenhum crónico selecionado.</p>
                <Link to="/cronicos">
                    <button>Voltar</button>
                </Link>
            </div>
        );
    }

    return (
        <div className="page-box">
            <h1>Crónico</h1>

            <div style={{ display: "grid", gap: "10px", maxWidth: "520px" }}>
                <label>
                    Nome
                    <input
                        type="text"
                        name="nome"
                        value={cronico.nome}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Severidade (não editável)
                    <input type="text" value={cronico.severidade} disabled />
                </label>

                <label style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="checkbox"
                        name="resolvido"
                        checked={Boolean(cronico.resolvido)}
                        onChange={handleChange}
                    />
                    Resolvido
                </label>

                <label>
                    Descrição
                    <textarea
                        name="descricao"
                        value={cronico.descricao}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Quilometragem (não editável)
                    <input type="number" value={cronico.quilometragem} disabled />
                </label>

                <button onClick={guardarEdicao}>Editar / Guardar</button>

                <Link to="/cronicos">
                    <button>Voltar à Lista</button>
                </Link>
            </div>
        </div>
    );
}
