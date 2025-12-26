import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionAppState } from "../../context/appState.session";

export default function MostrarCarrosGuardados() {
	const navigate = useNavigate();
	const { state: getSessionStorage, setState: setSessionStorage } = useSessionAppState();
	const saved_cars = getSessionStorage?.carros_guardados || [];
	const [carrosGuardados, setCarrosGuardados] = useState([]);

	const obterCarros = async () => {
		if (saved_cars.length > 0) {
			setCarrosGuardados(saved_cars);
		} else if (saved_cars.length === 0) {
			setSessionStorage((prev) => ({
				...prev,
				carros_guardados: [],
			}));
		}

		try {
			const res = await fetch("/api/carrosGuardados/");
			const data = await res.json();

			if (res.ok) {
				setCarrosGuardados(data.carrosGuardados_data);

				setSessionStorage((prev) => ({
					...prev,
					carros_guardados: data.carrosGuardados_data,
				}));
			}
		} catch (err) {
			console.error("Erro a buscar carros", err);
		}
	};

	useEffect(() => {
		obterCarros();
	}, []);

	const adicionarCarro = async (nome) => {
		try {
			const res = await fetch("/api/obterCarroSpecs/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				navigate("/adicionarPorModelo", {
					state: {
						initialCarro: data.carro_data,
					},
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const esquecerCarro = async (id) => {
		try {
			const res = await fetch("/api/apagarCarroGuardado/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				setCarrosGuardados((prev) => prev.filter((carro) => carro.id !== id));

				// also update session storage if needed
				setSessionStorage((prev) => ({
					...prev,
					carros_guardados: (prev.carros_guardados || []).filter((carro) => carro.id !== id),
				}));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<h1>Carros Guardados</h1>

			{carrosGuardados.length === 0 ? (
				<p>Nada guardado.</p>
			) : (
				<ul>
					{carrosGuardados.map((carro) => (
						<li key={carro.id} style={{ marginBottom: "8px" }}>
							<strong>{carro.nome}</strong>

							<button style={{ marginLeft: "10px" }} onClick={() => esquecerCarro(carro.id)}>
								Esquecer
							</button>

							<button style={{ marginLeft: "6px" }} onClick={() => adicionarCarro(carro.nome)}>
								Adicionar
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
