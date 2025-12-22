import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";

export default function ListaCarrosRecomendados() {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { state: getLocalStorage } = useLocalStorage();
	const garagem_id = getLocalStorage.garagem.id;
	const candidateCars = state?.candidateCars || [];
	const [savedCars, setSavedCars] = useState([]);

	const handleSave = (car) => {
		// avoid duplicates
		if (!savedCars.includes(car)) {
			setSavedCars([...savedCars, { garagem: garagem_id, nome: car }]);
		}
	};

	const salvarCarros = async (savedCars) => {
		console.log(savedCars);

		try {
			const res = await fetch("/api/salvarCarros/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ savedCars }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				navigate("/garagem");
			}
		} catch (error) {}
	};

	return (
		<div className="page-box">
			<h1>Lista de Carros Recomendados</h1>
			<p>Recomendados por especificações</p>

			{candidateCars.length ? (
				candidateCars.map((car, index) => {
					const isSaved = savedCars.some((c) => c.nome === car);
					return (
						<div
							key={index}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								border: "1px solid #ccc",
								padding: "10px",
								marginBottom: "8px",
								borderRadius: "6px",
							}}
						>
							<span>{car}</span>
							<button onClick={() => handleSave(car)} disabled={isSaved}>
								{isSaved ? "Saved" : "Save"}
							</button>
						</div>
					);
				})
			) : (
				<p>Nenhum carro recomendado.</p>
			)}

			{savedCars.length > 0 && (
				<div style={{ marginTop: "20px" }}>
					<h3>Saved Cars:</h3>
					<ul>
						{savedCars.map((car, index) => (
							<li key={index}>{car.nome}</li>
						))}
					</ul>
				</div>
			)}

			<button onClick={() => salvarCarros(savedCars)}>Save</button>
		</div>
	);
}
