import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ListaCorretivos from "./listaCorretivos";
import ListaPreventivos from "./listaPreventivos";
import ListaCronicos from "./listaCronicos";

export default function TodasManutencoes() {
	const { id } = useParams();

	const [carro, setCarro] = useState();
	const [corretivos, setCorretivos] = useState([]);
	const [preventivos, setPreventivos] = useState([]);
	const [cronicos, setCronicos] = useState([]);

	useEffect(() => {
		verManutencoes();
	}, []);

	const verManutencoes = async () => {
		try {
			const res = await fetch(`/api/obterTodasManutencoes/?carro_id=${id}`);
			const data = await res.json();

			console.log(data.message);
			if (res.ok) {
				// TODO salvar em SessionStorage
				setCarro(data.carro_data);
				setCorretivos(data.corretivos_data);
				setPreventivos(data.preventivos_data);
				setCronicos(data.cronicos_data);
			}
		} catch (err) {
			console.log(err);
		}
	};


	return (
		<div style={{ padding: "20px" }}>
			<h1>Manutenções</h1>

			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<Link to="/garagem">
					<button>Voltar</button>
				</Link>
				<button>Editar Carro</button>
			</div>

			{/* ONE grid */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
				<ListaCorretivos corretivos={corretivos} carroId={id} />
				<ListaPreventivos preventivos={preventivos} carroId={id} carroKms={carro?.quilometragem || 0} />
				<ListaCronicos cronicos={cronicos} carroId={id} carroKms={carro?.quilometragem || 0} />
			</div>
		</div>
	);
}
