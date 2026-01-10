import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function EditarCarro() {
	const navigate = useNavigate();
	const { carro_id } = useParams();
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalAppState();

	const carro = getSessionStorage.carros_vistos?.find((c) => c.id === Number(carro_id));

	const [form, setForm] = useState({
		marca: carro?.marca || "",
		modelo: carro?.modelo || "",
		ano: carro?.ano || "",
		quilometragem: carro?.quilometragem || "",
		matricula: carro?.matricula || "",
		cavalos: carro?.cavalos || "",
		combustivel: carro?.combustivel || "",
		transmissao: carro?.transmissao || "",
		cilindrada: carro?.cilindrada || "",
	});

	const [loading, setLoading] = useState(false);

	// sessão expirada
	const handleForbidden = useCallback(() => {
		setLocalStorage((prev) => ({
			...prev,
			user: null,
			garagem: null,
			definicoes: null,
			carros_preview: [],
			notas: [],
			feedback: {
				type: "error",
				message: "Sessão expirada. Inicia sessão novamente.",
			},
		}));

		setSessionStorage((prev) => ({
			...prev,
			carros_vistos: [],
		}));

		navigate("/login", { replace: true });
	}, [setLocalStorage, setSessionStorage, navigate]);

	const guardarAlteracoes = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/editarCarro/", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					carro_id,
					caracteristicas: form,
				}),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			if (!res.ok) throw new Error();

			// atualizar session
			const carrosAtualizados = getSessionStorage.carros_vistos.map((c) => (c.id === Number(carro_id) ? { ...c, ...form } : c));

			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: carrosAtualizados,
			}));

			// atualizar local
			const carrosPreviewAtualizados = getLocalStorage.carros_preview.map((car) =>
				car.id === Number(carro_id)
					? {
							...car,
							full_name: `${form.marca} ${form.modelo} ${form.ano}`,
							matricula: form.matricula,
					  }
					: car
			);

			setLocalStorage((prev) => ({
				...prev,
				carros_preview: carrosPreviewAtualizados,
				feedback: {
					type: "success",
					message: "Carro atualizado com sucesso.",
				},
			}));

			navigate("/garagem", { replace: true });
		} catch {
			setLocalStorage((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Erro ao guardar alterações.",
				},
			}));
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteCar = async () => {
		if (!window.confirm("Tem a certeza que quer apagar este carro?")) return;

		setLoading(true);
		try {
			const res = await fetch("/api/apagarCarro/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ carro_id: Number(carro_id) }),
			});

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			if (!res.ok) throw new Error();

			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: prev.carros_vistos.filter((car) => car.id !== Number(carro_id)),
			}));

			setLocalStorage((prev) => ({
				...prev,
				carros_preview: prev.carros_preview.filter((car) => car.id !== Number(carro_id)),
				feedback: {
					type: "success",
					message: "Carro eliminado com sucesso.",
				},
			}));

			navigate("/garagem");
		} catch {
			setLocalStorage((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Erro ao eliminar o carro.",
				},
			}));
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="page-box" style={{ padding: "10px" }}>
			<button onClick={() => navigate(-1)} disabled={loading}>
				Voltar
			</button>
			<h1>Editar Carro</h1>

			<div style={{ display: "grid", gap: "10px" }}>
				<label>
					Marca
					<input name="marca" value={form.marca} onChange={handleChange} />
				</label>
				<label>
					Modelo
					<input name="modelo" value={form.modelo} onChange={handleChange} />
				</label>
				<label>
					Ano
					<input type="number" name="ano" value={form.ano} onChange={handleChange} />
				</label>
				<label>
					Combustível
					<input name="combustivel" value={form.combustivel} onChange={handleChange} />
				</label>
				<label>
					Cilindrada
					<input type="number" name="cilindrada" value={form.cilindrada} onChange={handleChange} />
				</label>
				<label>
					Cavalos
					<input name="cavalos" value={form.cavalos} onChange={handleChange} />
				</label>
				<label>
					Transmissão
					<input name="transmissao" value={form.transmissao} onChange={handleChange} />
				</label>
				<label>
					Quilometragem
					<input type="number" name="quilometragem" value={form.quilometragem} onChange={handleChange} />
				</label>
				<label>
					Matrícula
					<input name="matricula" value={form.matricula} onChange={handleChange} />
				</label>
			</div>

			<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
				<button onClick={handleDeleteCar} disabled={loading} style={{ background: "#d9534f", color: "white" }}>
					{loading ? "A eliminar..." : "Eliminar Carro"}
				</button>

				<button onClick={guardarAlteracoes} disabled={loading}>
					{loading ? "A guardar..." : "Guardar Alterações"}
				</button>
			</div>
		</div>
	);
}
