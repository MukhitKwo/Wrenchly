import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSessionAppState } from "../../context/appState.session";
import usePageLoader from "../../hooks/usePageLoader";
import ListaCorretivos from "./listaCorretivos";
import ListaCronicos from "./listaCronicos";
import ListaPreventivos from "./listaPreventivos";

export default function TodasManutencoes() {
	const { carro_id } = useParams();
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const viewed_cars = useMemo(
		() => getSessionStorage?.carros_vistos || [],
		[getSessionStorage]
	);
	const { loading, runWithLoading } = usePageLoader(true);
	const navigate = useNavigate();

	const [carro, setCarro] = useState();
	const [corretivos, setCorretivos] = useState([]);
	const [preventivos, setPreventivos] = useState([]);
	const [cronicos, setCronicos] = useState([]);
	const [carroKms, setCarroKms] = useState();
	const [ordenacao, setOrdenacao] = useState("km");

	const ordenarManutencoes = (listaManutencoes) => {
		if (!Array.isArray(listaManutencoes)) return [];

		const copia = [...listaManutencoes];

		if (ordenacao === "risco") {
			return copia.sort((a, b) => b.risco - a.risco);
		}

		if (ordenacao === "data") {
			return copia.sort((a, b) => new Date(a.trocarNaData) - new Date(b.trocarNaData));
		}

		return copia.sort((a, b) => a.trocarNoKm - b.trocarNoKm);
	};

	const verManutencoes = useCallback(async () => {
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
		}

		try {
			const res = await fetch(`/api/obterTodasManutencoes/?carro_id=${carro_id}`);
			const data = await res.json();

			if (res.ok) {
				const carroKms = data.carro_data.quilometragem;

				const AdicionarRisco = (manutencao) =>
					manutencao.map((man) => ({
						...man,
						risco: Number(((carroKms - man.trocadoNoKm) / man.kmsEntreTroca).toFixed(2)),
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
						...(prev.carros_vistos || []),
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
	}, [carro_id, viewed_cars, setSessionStorage]);

	useEffect(() => {
		runWithLoading(() => verManutencoes());
	}, [runWithLoading, verManutencoes]);


	if (loading) {
		return <LoadingSpinner text="A carregar manutenções..." />;
	}
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
			<div style={{ marginBottom: "15px" }}>
				<label style={{ marginRight: "10px" }}>Ordenar preventivos e cronicos por:</label>
				<select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
					<option value="km">Quilometragem</option>
					<option value="data">Data</option>
					<option value="risco">Risco</option>
				</select>
			</div>

			{/* ONE grid */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
				<ListaCorretivos
					corretivos={corretivos.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0))}
					carroId={carro_id}
					carroKms={carro?.quilometragem || 0}
				/>
				<ListaPreventivos preventivos={ordenarManutencoes(preventivos)} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
				<ListaCronicos cronicos={ordenarManutencoes(cronicos)} carroId={carro_id} carroKms={carro?.quilometragem || 0} />
			</div>
		</div>
	);
}
