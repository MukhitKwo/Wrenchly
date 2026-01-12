import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function Definicoes() {
	const navigate = useNavigate();

	const {
		state: getLocalStorage,
		setState: setLocalStorage,
		clear: clearLocalStorage,
	} = useLocalAppState();

	const { clear: clearSessionStorage } = useSessionAppState();

	const showFeedback = (type, message) => {
		setLocalStorage((prev) => ({
			...prev,
			feedback: { type, message },
		}));
	};

	const handleForbidden = useCallback(() => {
		clearLocalStorage();
		clearSessionStorage();

		setLocalStorage((prev) => ({
			...prev,
			feedback: {
				type: "error",
				message: "Sessão expirada. Inicia sessão novamente.",
			},
		}));

		navigate("/login", { replace: true });
	}, [clearLocalStorage, clearSessionStorage, setLocalStorage, navigate]);

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
		if (!definicoes_data?.id) {
			showFeedback("error", "Definições não carregadas. Faz login novamente.");
			return;
		}

		try {
			const res = await fetch(
				`/api/atualizarDefinicoes/${definicoes_data.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ definicoes }),
				}
			);

			if (res.status === 403) {
				handleForbidden();
				return;
			}

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao guardar definições.");
				return;
			}

			setLocalStorage((prev) => ({
				...prev,
				definicoes: data.definicoes_data,
			}));

			showFeedback("success", "Definições atualizadas com sucesso.");
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao guardar definições.");
		}
	};
	return (
		<div className="page-box">
			<h1>Definições</h1>

			<label>
				Tema
				<select name="tema" value={definicoes.tema} onChange={handleChange}>
					<option value="claro">Claro</option>
					<option value="escuro">Escuro</option>
				</select>
			</label>
			<label>
				Linguagem
				<select
					name="linguagem"
					value={definicoes.linguagem}
					onChange={handleChange}
				>
					<option value="pt">Português</option>
					<option value="en">English</option>
				</select>
			</label>

			<button
				onClick={atualizarDefinicoes}
				disabled={!definicoes_data?.id}
			>
				Guardar definições
			</button>
		</div>
	);
}