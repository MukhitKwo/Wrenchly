import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";
import { useParams } from "react-router-dom";

export default function VerCorretivo() {
	const navigate = useNavigate();
	const { state: session, setState: setSession } = useSessionAppState();
	const { carro_id, manutencao_id } = useParams();

	const viewed_cars = session.carros_vistos || [];

	const [manutencao, setManutencao] = useState(null);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		// emcontrar o carro
		const car = viewed_cars.find((c) => c.id === Number(carro_id));
		if (!car) return;

		// encontrar a manutencao
		const maintenance = car.manutencoes?.corretivos?.find((m) => m.id === Number(manutencao_id));
		if (maintenance) setManutencao(maintenance);
	}, [carro_id, manutencao_id, viewed_cars]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({ ...prev, [name]: value }));
	};

	const guardarEdicao = async () => {
		try {
			const res = await fetch("/api/editarCorretivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao }),
			});

			const data = await res.json();
			console.log(data.message);

			console.log(data.corretivo_data);

			if (res.ok) {
				const updatedCars = viewed_cars.map((car) =>
					car.id === Number(carro_id)
						? {
								...car,
								manutencoes: {
									...car.manutencoes,
									corretivos: car.manutencoes.corretivos.map((c) => (c.id === manutencao.id ? data.corretivo_data : c)),
								},
						  }
						: car
				);

				setSession((prev) => ({ ...prev, carros_vistos: updatedCars }));
				setEdit(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const apagarCronico = async () => {
		if (!window.confirm("Apagar este problema crónico?")) return;

		try {
			const res = await fetch("/api/apagarCorretivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: manutencao.id, carro_id: manutencao.carro }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				const updatedCars = viewed_cars.map((car) =>
					car.id === Number(carro_id)
						? {
								...car,
								manutencoes: {
									...car.manutencoes,
									corretivos: car.manutencoes.corretivos.filter((c) => c.id !== manutencao.id),
								},
						  }
						: car
				);
				setSession((prev) => ({ ...prev, carros_vistos: updatedCars }));
				navigate(-1);
			}
		} catch (err) {
			console.log(err);
		}
	};

	if (!manutencao) return <div>Carregando...</div>;

	return (
		<div className="page-box">
			{/* Voltar button on top */}
			<div style={{ marginBottom: "15px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>
			</div>

			<h1>Manutenção Crónica</h1>

			{/* Inputs */}
			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Nome:</span>
					<input name="nome" value={manutencao.nome} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Descrição:</span>
					<textarea name="descricao" value={manutencao.descricao} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Tipo:</span>
					<select name="tipo" value={manutencao.tipo} onChange={handleChange} disabled={!edit}>
						<option value="corretiva">Corretiva</option>
						<option value="preventiva">Preventiva</option>
						<option value="cronica">Crónica</option>
					</select>
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Data:</span>
					<input type="date" name="data" value={manutencao.data} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Custo (€):</span>
					<input type="number" name="custo" value={manutencao.custo} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Quilometragem:</span>
					<input type="number" name="quilometragem" value={manutencao.quilometragem} onChange={handleChange} disabled={!edit} />
				</div>
			</div>

			{/* Edit / Delete buttons at bottom */}
			<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
				<button onClick={apagarCronico}>Apagar</button>
				<button onClick={edit ? guardarEdicao : () => setEdit(true)}>{edit ? "Guardar" : "Editar"}</button>
			</div>
		</div>
	);
}
