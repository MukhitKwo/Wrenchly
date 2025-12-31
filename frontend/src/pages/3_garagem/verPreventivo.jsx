import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function VerPreventivo() {
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();;
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalAppState();

	const navigate = useNavigate();
	const { carro_id, manutencao_id } = useParams();

	const viewed_cars = useMemo(
		() => getSessionStorage?.carros_vistos || [],
		[getSessionStorage?.carros_vistos]
	);


	const proxima_manutencao = getLocalStorage?.carros_preview?.find((c) => c.id === Number(carro_id))?.proxima_manutencao ?? null;

	const [manutencao, setManutencao] = useState(null);
	const [edit, setEdit] = useState(false);
	const [carro_km, setCarro_km] = useState(null);

	useEffect(() => {
		console.log(viewed_cars);
		console.log(carro_id);
		console.log(manutencao_id);

		const car = viewed_cars.find((c) => c.id === Number(carro_id));
		console.log(car);
		if (!car) return;

		setCarro_km(car.quilometragem);

		const maintenance = car.manutencoes?.preventivos?.find((m) => m.id === Number(manutencao_id));
		if (maintenance) setManutencao(maintenance);
	}, [carro_id, manutencao_id, viewed_cars]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setManutencao((prev) => ({ ...prev, [name]: value }));
	};

	const guardarEdicao = async () => {
		try {
			const res = await fetch("/api/editarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ manutencao, carro_km }),
			});

			const data = await res.json();
			console.log(data.message);

			const updatedCars = atualizarPreventivo(viewed_cars, carro_id, manutencao.id, data.preventivo_data, carro_km);
			setSessionStorage((prev) => ({ ...prev, carros_vistos: updatedCars }));

			if (new Date(data.preventivo_data.trocarNaData) < new Date(proxima_manutencao)) {
				console.log("New date is closer");
				atualizarProximaManutencaoData(Number(carro_id), data.preventivo_data.trocarNaData);
			}

			setEdit(false);
		} catch (err) {
			console.log(err);
		}
	};

	const apagarPreventivo = async () => {
		if (!window.confirm("Apagar esta manutenção preventiva?")) return;

		try {
			const res = await fetch("/api/apagarPreventivo/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: manutencao.id, carro_id: manutencao.carro }),
			});

			const data = await res.json();
			console.log(data.message);

			const updatedCars = removerPreventivo(viewed_cars, carro_id, manutencao.id);
			setSessionStorage((prev) => ({ ...prev, carros_vistos: updatedCars }));

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

			<h1>Manutenção Preventiva</h1>

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
					<span>Dias entre troca:</span>
					<input type="number" name="diasEntreTroca" value={manutencao.diasEntreTroca} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Trocado na data:</span>
					<input type="date" name="trocadoNaData" value={manutencao.trocadoNaData} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Kms entre troca:</span>
					<input type="number" name="kmsEntreTroca" value={manutencao.kmsEntreTroca} onChange={handleChange} disabled={!edit} />
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<span>Trocado no km:</span>
					<input type="number" name="trocadoNoKm" value={manutencao.trocadoNoKm} onChange={handleChange} disabled={!edit} />
				</div>
			</div>

			<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
				<button onClick={apagarPreventivo}>Apagar</button>
				<button onClick={edit ? guardarEdicao : () => setEdit(true)}>{edit ? "Guardar" : "Editar"}</button>
			</div>
		</div>
	);

	function atualizarProximaManutencaoData(carroId, novaData) {
		const carros = [...getLocalStorage.carros_preview];

		const car = carros.find((c) => c.id === carroId);
		if (!car) return;

		car.proxima_manutencao = novaData; // mutation, but isolated

		setLocalStorage({
			...getLocalStorage,
			carros_preview: carros,
		});
	}
}

function atualizarPreventivo(viewedCars, carroId, manutencaoId, novoPreventivo, carro_km) {
	return viewedCars.map((car) => {
		if (car.id !== Number(carroId)) return car;

		return {
			...car,
			manutencoes: {
				...car.manutencoes,
				preventivos: car.manutencoes.preventivos.map((p) => {
					if (p.id !== manutencaoId) return p;

					// Calculate risco
					const risco =
						novoPreventivo.kmsEntreTroca != null ? Number(((carro_km - novoPreventivo.trocadoNoKm) / novoPreventivo.kmsEntreTroca).toFixed(2)) : null;

					return {
						...novoPreventivo,
						risco,
					};
				}),
			},
		};
	});
}

function removerPreventivo(viewedCars, carroId, manutencaoId) {
	return viewedCars.map((car) => {
		if (car.id !== Number(carroId)) return car;

		return {
			...car,
			manutencoes: {
				...car.manutencoes,
				preventivos: car.manutencoes.preventivos.filter((p) => p.id !== manutencaoId),
			},
		};
	});
}
