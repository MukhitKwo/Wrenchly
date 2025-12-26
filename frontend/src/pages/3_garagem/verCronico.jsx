import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";

export default function VerCronico() {
	const navigate = useNavigate();
	const { state: session, setState: setSession } = useSessionAppState();
	const { carro_id, manutencao_id } = useParams();

	const viewed_cars = session.carros_vistos || [];

	const [manutencao, setManutencao] = useState(null);
	const [edit, setEdit] = useState(false);
	const [carro_km, setCarro_km] = useState(null);

	useEffect(() => {
		const car = viewed_cars.find((c) => c.id === Number(carro_id));
		if (!car) return;

		setCarro_km(car.quilometragem);

		const maintenance = car.manutencoes?.cronicos?.find((m) => m.id === Number(manutencao_id));
		if (maintenance) setManutencao(maintenance);
	}, [carro_id, manutencao_id, viewed_cars]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({ ...prev, [name]: value }));
	};

	const guardarEdicao = async () => {
		try {
			const res = await fetch("/api/editarCronico/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_km }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			const updatedCars = viewed_cars.map((car) =>
				car.id === Number(carro_id)
					? {
							...car,
							manutencoes: {
								...car.manutencoes,
								cronicos: car.manutencoes.cronicos.map((c) => (c.id === manutencao.id ? data.cronico_data : c)),
							},
					  }
					: car
			);

			setSession((prev) => ({ ...prev, carros_vistos: updatedCars }));
			setEdit(false);
		} catch (err) {
			console.log(err);
		}
	};

	const apagarCronico = async () => {
		if (!window.confirm("Apagar este problema crónico?")) return;

		try {
			const res = await fetch("/api/apagarCronico/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: manutencao.id, carro_id: manutencao.carro }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message);

			const updatedCars = viewed_cars.map((car) =>
				car.id === Number(carro_id)
					? {
							...car,
							manutencoes: {
								...car.manutencoes,
								cronicos: car.manutencoes.cronicos.filter((c) => c.id !== manutencao.id),
							},
					  }
					: car
			);

			setSession((prev) => ({ ...prev, carros_vistos: updatedCars }));
			navigate(-1);
		} catch (err) {
			console.log(err);
		}
	};

	if (!manutencao) return <div>Carregando...</div>;

	return (
		<div className="page-box">
			<div style={{ marginBottom: "15px" }}>
				<button onClick={() => navigate(-1)}>Voltar</button>
			</div>

			<h1>Manutenção Crónica</h1>

			<div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
				<input placeholder="Nome" name="nome" value={manutencao.nome} onChange={handleChange} disabled={!edit} />

				<textarea placeholder="Descrição" name="descricao" value={manutencao.descricao} onChange={handleChange} disabled={!edit} />

				<input
					type="number"
					placeholder="Kms entre ocorrências"
					name="kmsEntreTroca"
					value={manutencao.kmsEntreTroca}
					onChange={handleChange}
					disabled={!edit}
				/>

				<input type="number" placeholder="Último km registado" name="trocadoNoKm" value={manutencao.trocadoNoKm} onChange={handleChange} disabled={!edit} />
			</div>

			<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
				<button onClick={apagarCronico}>Apagar</button>
				<button onClick={edit ? guardarEdicao : () => setEdit(true)}>{edit ? "Guardar" : "Editar"}</button>
			</div>
		</div>
	);
}
