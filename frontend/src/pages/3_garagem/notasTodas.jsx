import { useCallback, useEffect, useState } from "react";
import { useLocalAppState } from "../../context/appState.local";


export default function NotasTodas() {
    const { state, setState } = useLocalAppState();

    const notas = state?.notas || [];
    const carros = state?.carros_preview || [];

    const [loading, setLoading] = useState(true);
    const [notaEmEdicao, setNotaEmEdicao] = useState(null);
    const [textoEdicao, setTextoEdicao] = useState("");

    const [mostrarForm, setMostrarForm] = useState(false);
    const [textoNota, setTextoNota] = useState("");
    const [carroSelecionado, setCarroSelecionado] = useState("");

    const carregarNotas = useCallback(async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/notas/", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setState((prev) => ({
                    ...prev,
                    notas: data.notas_data,
                }));
            }
        } catch (err) {
            console.error("Erro ao carregar notas:", err);
        } finally {
            setLoading(false);
        }
    }, [setState]);


    useEffect(() => {
        carregarNotas();
    }, [carregarNotas]);

    const getNomeCarro = (carroId) => {
        const carro = carros.find((c) => c.id === Number(carroId));
        return carro ? carro.full_name : `Carro #${carroId}`;
    };
    const criarNota = async () => {
        if (!textoNota || !carroSelecionado) return;

        const res = await fetch("/api/criarNota/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                carro_id: carroSelecionado,
                texto: textoNota,
            }),
        });

        if (res.ok) {
            await carregarNotas();
            setTextoNota("");
            setCarroSelecionado("");
            setMostrarForm(false);
        }
    };

    const guardarNota = async (id) => {
        const res = await fetch("/api/editarNota/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                texto: textoEdicao,
            }),
        });

        if (res.ok) {
            await carregarNotas();
            setNotaEmEdicao(null);
        }
    };

    const apagarNota = async (id) => {
        if (!window.confirm("Apagar esta nota?")) return;

        const res = await fetch("/api/apagarNota/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        if (res.ok) {
            await carregarNotas();
        }
    };
    if (loading) {
        return <p>A carregar notas...</p>;
    }

    return (
        <div className="page-box">
            <h1>Notas de todos os carros</h1>

            <button onClick={() => setMostrarForm(!mostrarForm)}>
                + Nova Nota
            </button>

            {mostrarForm && (
                <div style={{ border: "1px solid #ccc", padding: 15, borderRadius: 8, marginTop: 15 }}>
                    <select
                        value={carroSelecionado}
                        onChange={(e) => setCarroSelecionado(e.target.value)}
                    >
                        <option value="">Selecionar carro</option>
                        {carros.map((carro) => (
                            <option key={carro.id} value={carro.id}>
                                {carro.full_name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Escrever nota..."
                        value={textoNota}
                        onChange={(e) => setTextoNota(e.target.value)}
                        style={{ width: "100%", marginTop: 10 }}
                    />

                    <button onClick={criarNota}>Guardar Nota</button>
                </div>
            )}

            {!notas.length && <p>Não existem notas registadas.</p>}

            <div style={{ display: "grid", gap: 15, marginTop: 20 }}>
                {notas.map((nota) => (
                    <div
                        key={nota.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: 15,
                            borderRadius: 8,
                        }}
                    >
                        <strong>{getNomeCarro(nota.carro)}</strong>

                        {notaEmEdicao === nota.id ? (
                            <textarea
                                value={textoEdicao}
                                onChange={(e) => setTextoEdicao(e.target.value)}
                                style={{ width: "100%", marginTop: 8 }}
                            />
                        ) : (
                            <p>{nota.nota}</p>
                        )}

                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={() => {
                                    setNotaEmEdicao(nota.id);
                                    setTextoEdicao(nota.nota);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                style={{ background: "#d9534f", color: "white" }}
                                onClick={() => apagarNota(nota.id)}
                            >
                                Apagar
                            </button>
                        </div>

                        {notaEmEdicao === nota.id && (
                            <div style={{ marginTop: 10 }}>
                                <button onClick={() => guardarNota(nota.id)}>
                                    Guardar
                                </button>
                                <button onClick={() => setNotaEmEdicao(null)}>
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
