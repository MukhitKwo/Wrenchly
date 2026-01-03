import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function EditarNota() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, setState } = useLocalAppState();

    const nota = state.notas.find((n) => n.id === Number(id));
    const [texto, setTexto] = useState(nota?.texto || "");

    const guardar = async () => {
        const res = await fetch("/api/editarNota/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nota_id: nota.id, texto }),
        });

        if (res.ok) {
            setState((prev) => ({
                ...prev,
                notas: prev.notas.map((n) =>
                    n.id === nota.id ? { ...n, texto } : n
                ),
            }));

            navigate("/notas");
        }
    };

    if (!nota) return <p>Nota não encontrada</p>;

    return (
        <div className="page-box">
            <h1>Editar Nota</h1>

            <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={5}
            />

            <button onClick={guardar}>Guardar</button>
        </div>
    );
}
