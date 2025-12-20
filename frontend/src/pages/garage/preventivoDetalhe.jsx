import { Link } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";
import { devLog } from "../../utils/devLog";


export default function PreventivoDetalhe() {
	const { state: getLocalStorage, setState: setLocalStorage } = useLocalStorage();

	const preventivo = getLocalStorage?.preventivo_selecionado || null;

	const handleChange = (e) => {
		const { name, value } = e.target;

		setLocalStorage((prev) => ({
			...prev,
			preventivo_selecionado: {
				...prev.preventivo_selecionado,
				[name]: value,
			},
		}));
	};

	const guardarPreventivo = async () => {
		console.log("=== GUARDAR PREVENTIVO ===");
		console.log(preventivo);

		setLocalStorage((prev) => {
			const lista = Array.isArray(prev.preventivos) ? prev.preventivos : [];

			const existe = lista.some((p) => p.id === preventivo.id);

			const listaAtualizada = existe
				? lista.map((p) => (p.id === preventivo.id ? { ...p, ...preventivo } : p))
				: [...lista, { ...preventivo, id: Date.now() }];

			return {
				...prev,
				preventivos: listaAtualizada,
				preventivo_selecionado: preventivo,
			};
		});

		await devLog({
			tipo: "PREVENTIVO",
			acao: preventivo.id ? "EDITAR" : "CRIAR",
			payload: preventivo,
		});
	};



	if (!preventivo) {
		return (
			<div className="page-box">
				<h1>Preventivo</h1>
				<p>Nenhum preventivo selecionado.</p>
				<Link to="/preventivos">
					<button>Voltar</button>
				</Link>
			</div>
		);
	}

	return (
		<div className="page-box">
			<h1>Preventivo</h1>

			<input name="tipo" value={preventivo.tipo} onChange={handleChange} />
			<textarea name="descricao" value={preventivo.descricao} onChange={handleChange} />
			<input name="intervalo_km" value={preventivo.intervalo_km} onChange={handleChange} />
			<input name="intervalo_meses" value={preventivo.intervalo_meses} onChange={handleChange} />

			<button onClick={guardarPreventivo}>Guardar</button>

			<Link to="/preventivos">
				<button>Voltar à Lista</button>
			</Link>
		</div>
	);
}
