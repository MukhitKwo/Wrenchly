import { useState } from "react";
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

	const guardarAlteracoes = async () => {
		const res = await fetch("/api/editarCarro/", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				carro_id,
				caracteristicas: form,
			}),
		});

		if (res.ok) {
			// Atualizar carros_vistos (session)
			const carrosAtualizados = getSessionStorage.carros_vistos.map((c) => (c.id === Number(carro_id) ? { ...c, ...form } : c));

			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: carrosAtualizados,
			}));

			// Atualizar carros_preview (local)
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
			}));

			// Voltar à garagem
			navigate("/garagem", { replace: true });
		}
	};

	const handleDeleteCar = async () => {
		if (!window.confirm("Tem a certeza que quer apagar este carro?")) return;

		try {
			await fetch("/api/apagarCarro/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ carro_id: Number(carro_id) }),
			});

			// remover da session (manutenções)
			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: prev.carros_vistos.filter((car) => car.id !== Number(carro_id)),
			}));

			// remover do local (cards da garagem)
			setLocalStorage((prev) => ({
				...prev,
				carros_preview: prev.carros_preview.filter((car) => car.id !== Number(carro_id)),
			}));

			navigate("/garagem");
		} catch (err) {
			console.error("Erro ao apagar carro:", err);
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
			<h1>Editar Carro</h1>

			<div style={{ display: "grid", gap: "10px" }}>
				<label>
					Marca
					<input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" />
				</label>

				<label>
					Modelo
					<input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" />
				</label>

				<label>
					Ano
					<input type="number" name="ano" value={form.ano} onChange={handleChange} placeholder="Ano" />
				</label>
				<label>
					Combustível
					<input name="combustivel" value={form.combustivel} onChange={handleChange} placeholder="Combustível" />
				</label>
				<label>
					Cilindrada
					<input type="number" name="cilindrada" value={form.cilindrada} onChange={handleChange} placeholder="Cilindrada" />
				</label>
				<label>
					Cavalos
					<input name="cavalos" value={form.cavalos} onChange={handleChange} placeholder="Cavalos" />
				</label>
				<label>
					Transmissão
					<input name="transmissao" value={form.transmissao} onChange={handleChange} placeholder="Transmissão" />
				</label>
				<label>
					Quilometragem
					<input type="number" name="quilometragem" value={form.quilometragem} onChange={handleChange} placeholder="Quilometragem" />
				</label>
				<label>
					Matrícula
					<input name="matricula" value={form.matricula} onChange={handleChange} placeholder="Matrícula" />
				</label>
			</div>

			<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>
				<button onClick={guardarAlteracoes}>Guardar Alterações</button>
				<button onClick={handleDeleteCar} style={{ background: "#d9534f", color: "white" }}>
					Eliminar Carro
				</button>
			</div>
		</div>
	);
}
