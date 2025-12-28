import { useNavigate, useParams } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function EditarCarro() {
	const navigate = useNavigate();
	const { carro_id } = useParams();
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalAppState();

	const handleDeleteCar = async () => {
		if (!window.confirm("Apagar este carro?")) return;

		try {
			const res = await fetch("/api/apagarCarro/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ carro_id: Number(carro_id) }),
			});

			const data = await res.json();
            console.log(data.message);
            

			const carrosPreview = getLocalStorage.carros_preview;

			const updatedCars = carrosPreview.filter((car) => car.id !== Number(carro_id));

			setLocalStorage((prev) => ({
				...prev,
				carros_preview: updatedCars,
			}));

			navigate("/garagem");
		} catch (err) {
			console.error("Error deleting car:", err);
		}
	};

	return (
		<div>
			<h1>Editar Carro</h1>
			<button onClick={handleDeleteCar} style={{ padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
				Eliminar Carro
			</button>
		</div>
	);
}
