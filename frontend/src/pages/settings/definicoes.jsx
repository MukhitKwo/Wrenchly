import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function Definicoes() {
	// obter definiçoes do localStorage
	const { state: getLocalStorage, setState: setLocalStorage, clear: clearLocalStorage } = useLocalAppState();
	const { clear: clearSessionStorage } = useSessionAppState();
	const navigate = useNavigate();

	// TODO fix temporario (temporary my ass LMAO)
	const definicoes_data = getLocalStorage?.definicoes || {
		tema: "claro",
		notificacoes: false,
		linguagem: "pt",
	};

	const [definicoes, setDefinicoes] = useState({
		tema: definicoes_data.tema,
		notificacoes: definicoes_data.notificacoes,
		linguagem: definicoes_data.linguagem,
	});

	const handleChange = (e) => {
		const { name, type, value, checked } = e.target;
		setDefinicoes((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
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
				const res = await fetch(`/api/logoutUser/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await res.json();
				console.log(data.message);

				if (res.ok) {
					clearLocalStorage();
					clearSessionStorage();
					navigate("/login");
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	const apagarUser = async () => {
		if (window.confirm("Tens a certeza que queres apagar da tua conta?.")) {
			try {
				const res = await fetch(`/api/apagarUser/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				const data = await res.json();
				console.log(data.message);

				if (res.ok) {
					clearLocalStorage();
					clearSessionStorage();
					navigate("/registo");
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
			<br />
			<button onClick={logoutUser}>Sair da Conta</button>
			<button onClick={apagarUser}>Apagar Conta</button>
		</div>
	);
}
