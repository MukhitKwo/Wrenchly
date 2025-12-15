import { useState } from "react";
import { useApp as useLocalStorage } from "../../context/appContext";
import { useNavigate } from "react-router-dom";

export default function Definicoes() {
	// obter definiçoes do localStorage
	const { state: getLocalStorage, setState: setLocalStorage, clearAppState: clearLocalStorage } = useLocalStorage();
	const navigate = useNavigate();

	// TODO fix temporario
	const definicoes_data = getLocalStorage?.definicoes || {
		tema: "claro",
		notificacoes: false,
		linguagem: "pt",
	};

	// definir todos os campos numa unica variavel (menos sets e mais facil de adicionar mais campos)
	const [definicoes, setDefinicoes] = useState({
		tema: definicoes_data.tema,
		notificacoes: definicoes_data.notificacoes,
		linguagem: definicoes_data.linguagem,
	});

	// sempre que algo muda/atualiza, esta função é executada
	const handleChange = (e) => {
		// obtem a informação do target (elemento que foi atualizado)
		const { name, type, value, checked } = e.target;
		// copia os campos previos (antigos) do settings (...prev)
		setDefinicoes((prev) => ({
			...prev,
			// mas define o campo atualizado com o novo valor
			// [name] é o name="" do elemento atualizado (ou a ser atualizado)
			// type é o tipo (texto, checkbox, etc)
			// se o tipo for "checkbox" (notificaçoes é checkbox), define o valor de "checked" (true ou false)
			// se NÂO foi checkbox, define o volor de "value" (o valor)
			[name]: type === "checkbox" ? checked : value,
		}));
		// por fim, troca o campo antigo pelo campo com valor atualizado na copia e salva
	};

	const atualizarDefinicoes = async () => {
		try {
			const res = await fetch(`/api/atualizarDefinicoes/${definicoes_data.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ definicoes }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				setLocalStorage((prev) => ({
					...prev,
					definicoes: data.definicoes_data,
				}));
			}
		} catch (error) {
			console.error(error);
		}
	};

	const logoutUser = async () => {
		if (window.confirm("Tens a certeza que queres sair da tua conta?.")) {
			try {
				const res = await fetch(`/api/logoutUser`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await res.json();
				console.log(data.message);

				if (res.ok) {
					navigate("/login");
					clearLocalStorage(); // TODO resolver erro de variaveis quando se apaga o storage
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<div>
			<h1>Definições</h1>

			<div>
				{/* onchange chama o handleChnage(), e o handleChange() usa o value="" */}
				<select name="tema" value={definicoes.theme} onChange={handleChange}>
					<option value="claro">Claro</option>
					<option value="escuro">Escuro</option>
				</select>
			</div>

			<div>
				<label>
					{/* onchange chama o handleChnage(), e o handleChange() usa o checked="" (porque não existe value="") */}
					<input type="checkbox" name="notificacoes" checked={definicoes.notifications} onChange={handleChange} />
					Permitir notificações
				</label>
			</div>

			<div>
				{/* onchange chama o handleChnage(), e o handleChange() usa o value="" */}
				<select name="linguagem" value={definicoes.language} onChange={handleChange}>
					<option value="pt">Português</option>
					<option value="en">English</option>
				</select>
			</div>

			<button onClick={atualizarDefinicoes}>Salvar</button>
			<button onClick={logoutUser}>Sair da Conta</button>
		</div>
	);
}
