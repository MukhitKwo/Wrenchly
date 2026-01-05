import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function EditarNota() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, setState } = useLocalAppState();

    const nota = state.notas.find((n) => n.id === Number(id));
    const [texto, setTexto] = useState(nota?.texto || "");
    const [loading, setLoading] = useState(false);

    if (!nota) return <p>Nota não encontrada</p>;

    const guardar = async () => {
        if (!texto.trim()) {
            setState((prev) => ({
                ...prev,
                feedback: {
                    type: "error",
                    message: "A nota não pode estar vazia.",
                },
            }));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/editarNota/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nota_id: nota.id, texto }),
            });

            if (!res.ok) {
                throw new Error();
            }

            setState((prev) => ({
                ...prev,
                notas: prev.notas.map((n) =>
                    n.id === nota.id ? { ...n, texto } : n
                ),
                feedback: {
                    type: "success",
                    message: "Nota atualizada com sucesso.",
                },
            }));

            navigate("/notas");
        } catch (err) {
            setState((prev) => ({
                ...prev,
                feedback: {
                    type: "error",
                    message: "Erro ao atualizar a nota.",
                },
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-box">
            <h1>Editar Nota</h1>

            <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={5}
                disabled={loading}
            />

            <button onClick={guardar} disabled={loading}>
                {loading ? "A guardar..." : "Guardar"}
            </button>
        </div>
    );
}