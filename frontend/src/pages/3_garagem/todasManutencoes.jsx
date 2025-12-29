import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";
import ListaCorretivos from "./listaCorretivos";
import ListaCronicos from "./listaCronicos";
import ListaPreventivos from "./listaPreventivos";


export default function TodasManutencoes() {
	const effectRan = useRef(false);
	const { carro_id } = useParams();
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const viewed_cars = getSessionStorage?.carros_vistos || [];
	const navigate = useNavigate();


	const [carro, setCarro] = useState();
	const [corretivos, setCorretivos] = useState([]);
	const [preventivos, setPreventivos] = useState([]);
	const [cronicos, setCronicos] = useState([]);
	const [carroKms, setCarroKms] = useState();
	const [ordenacao, setOrdenacao] = useState("risco");// "risco" | "data"
	const [ordenacaoCorretivos, setOrdenacaoCorretivos] = useState("data");// "data" | "km"


	useEffect(() => {
		if (effectRan.current) return;
		verManutencoes();
		effectRan.current = true;
	});

	const ordenarManutencoes = (lista) => {
		if (!Array.isArray(lista)) return [];

		const copia = [...lista];

		if (ordenacao === "data") {
			return copia.sort(
				(a, b) =>
					new Date(b.trocadoNaData || b.data || 0) -
					new Date(a.trocadoNaData || a.data || 0)
			);
		}

		// default → risco 
		return copia.sort((a, b) => (b.risco ?? -1) - (a.risco ?? -1));
	};
	const ordenarCorretivos = (lista) => {
		if (!Array.isArray(lista)) return [];

		const copia = [...lista];

		if (ordenacaoCorretivos === "km") {
			return copia.sort(
				(a, b) => (b.quilometragem ?? 0) - (a.quilometragem ?? 0)
			);
		}

		// default → data 
		return copia.sort(
			(a, b) =>
				new Date(b.data || 0) -
				new Date(a.data || 0)
		);
	};

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
	if (!carro) {
		return (
			<div style={{ padding: "20px" }}>
				<p>Este carro já não existe.</p>
				<button onClick={() => navigate("/garagem")}>Voltar à Garagem</button>
			</div>
		);
	}
	return (
		<div style={{ padding: "20px" }}>
			<h1>Manutenções</h1>
			<h3>Carro tem: {carroKms}km</h3>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<Link to="/garagem">
					<button style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Voltar</button>
				</Link>
				<Link to={`/editarCarro/${carro_id}`}>
					<button style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Editar Carro</button>
				</Link>
				<button style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>Caraterísticas</button>
			</div>
			<div style={{ marginBottom: "12px" }}>
				<label style={{ marginRight: "10px" }}>Ordenar corretivos por:</label>
				<select
					value={ordenacaoCorretivos}
					onChange={(e) => setOrdenacaoCorretivos(e.target.value)}
				>
					<option value="data">Data</option>
					<option value="km">Quilometragem</option>
				</select>
			</div>
			<div style={{ marginBottom: "15px" }}>
				<label style={{ marginRight: "10px" }}>Ordenar por:</label>
				<select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
					<option value="risco">Risco</option>
					<option value="data">Data</option>
				</select>
			</div>



			{/* ONE grid */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
				<ListaCorretivos corretivos={ordenarCorretivos(corretivos)} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
				<ListaPreventivos preventivos={ordenarManutencoes(preventivos)} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
				<ListaCronicos cronicos={ordenarManutencoes(cronicos)} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
			</div>
		</div>
	);
}
