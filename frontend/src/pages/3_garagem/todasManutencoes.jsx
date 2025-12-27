import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSessionAppState } from "../../context/appState.session";
import ListaCorretivos from "./listaCorretivos";
import ListaPreventivos from "./listaPreventivos";
import ListaCronicos from "./listaCronicos";

export default function TodasManutencoes() {
	const effectRan = useRef(false);
	const { carro_id } = useParams();
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const viewed_cars = getSessionStorage?.carros_vistos || [];

	const [carro, setCarro] = useState();
	const [corretivos, setCorretivos] = useState([]);
	const [preventivos, setPreventivos] = useState([]);
	const [cronicos, setCronicos] = useState([]);
	const [carroKms, setCarroKms] = useState();

	useEffect(() => {
		if (effectRan.current) return;
		verManutencoes();
		effectRan.current = true;
	});

	const verManutencoes = async () => {
		if (viewed_cars.length > 0) {
			const car_data = viewed_cars.find((car) => car.id === Number(carro_id));

			if (car_data != null) {
				setCarroKms(car_data.quilometragem);
				setCarro(car_data);
				setCorretivos(car_data.manutencoes.corretivos);
				setPreventivos(car_data.manutencoes.preventivos);
				setCronicos(car_data.manutencoes.cronicos);
				return;
			}
		} else if (viewed_cars.length === 0) {
			setSessionStorage((prev) => ({
				...prev,
				carros_vistos: [], // append instead of overwrite
			}));
		}

		try {
			console.log(carro_id);

			const res = await fetch(`/api/obterTodasManutencoes/?carro_id=${carro_id}`);

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				const carroKms = data.carro_data.quilometragem;

				const AdicionarRisco = (manutencao) =>
					manutencao.map((man) => ({
						...man,
						risco: Number(((carroKms - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2)), // TODO risco com data e km (75/25?)
					}));

				const preventivoComRisco = AdicionarRisco(data.preventivos_data);
				const cronicoComRisco = AdicionarRisco(data.cronicos_data);

				setCarro(data.carro_data);
				setCarroKms(carroKms);

				setCorretivos(data.corretivos_data);
				setPreventivos(preventivoComRisco);
				setCronicos(cronicoComRisco);

				setSessionStorage((prev) => ({
					...prev,
					carros_vistos: [
						...prev.carros_vistos,
						{
							...data.carro_data,
							manutencoes: {
								corretivos: data.corretivos_data,
								preventivos: preventivoComRisco,
								cronicos: cronicoComRisco,
							},
						},
					],
				}));
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Manutenções</h1>
			<h3>Carro tem: {carroKms}km</h3>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<Link to="/garagem">
					<button>Voltar</button>
				</Link>
				<button>Editar Carro</button>
				<button>Caraterísticas</button>
			</div>

			{/* ONE grid */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
				<ListaCorretivos corretivos={corretivos} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
				<ListaPreventivos preventivos={preventivos} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
				<ListaCronicos cronicos={cronicos} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
			</div>
		</div>
	);
}
