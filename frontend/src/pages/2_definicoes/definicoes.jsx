import { useState } from "react";
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

	const [codigoHashed, setCodigoHashed] = useState(null);

	const handleChange = (e) => {
		const { name, type, value, checked } = e.target;
		setDefinicoes((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	/* ================== DEFINIÇÕES ================== */

	const atualizarDefinicoes = async () => {
		try {
			const res = await fetch(
				`/api/atualizarDefinicoes/${definicoes_data.id}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ definicoes }),
				}
			);

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

	/* ================== LOGOUT ================== */

	const logoutUser = async () => {
		if (!window.confirm("Tens a certeza que queres sair da tua conta?")) return;

		try {
			const res = await fetch("/api/logoutUser/", {
				method: "POST",
				credentials: "include",
			});

			if (!res.ok) {
				showFeedback("error", "Erro ao terminar sessão.");
				return;
			}

			clearLocalStorage();
			clearSessionStorage();

			showFeedback("success", "Sessão terminada com sucesso.");
			navigate("/login", { replace: true });
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao terminar sessão.");
		}
	};

	/* ================== PASSWORD ================== */

	const pedirCodigoSecreto = async (password1, password2) => {
		if (!password1 || !password2) {
			showFeedback("error", "Preenche ambos os campos de palavra-passe.");
			return;
		}

		if (password1 !== password2) {
			showFeedback("error", "As palavras-passe não correspondem.");
			return;
		}

		if (!window.confirm("Tens a certeza que queres mudar a palavra-passe?"))
			return;

		try {
			const res = await fetch("/api/pedirCodigoSecreto/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({}),
			});

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao pedir código.");
				return;
			}

			setCodigoHashed(data.hashed_code);
			showFeedback("success", "Código de confirmação enviado.");
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao pedir código.");
		}
	};

	const atualizarPassword = async (password, codigoInput) => {
		if (!codigoInput) {
			showFeedback("error", "Preenche o código de confirmação.");
			return;
		}

		if (!window.confirm("Tens a certeza que queres mudar a palavra-passe?"))
			return;

		try {
			const res = await fetch("/api/atualizarPassword/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password, codigoInput, codigoHashed }),
			});

			const data = await res.json();

			if (!res.ok) {
				showFeedback("error", data.message || "Erro ao atualizar palavra-passe.");
				return;
			}

			showFeedback("success", "Palavra-passe alterada com sucesso.");
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao atualizar palavra-passe.");
		}
	};

	/* ================== APAGAR CONTA ================== */

	const apagarUser = async () => {
		if (!window.confirm("Tens a certeza que queres apagar a tua conta?"))
			return;

		try {
			const res = await fetch("/api/apagarUser/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				showFeedback("error", "Erro ao apagar conta.");
				return;
			}

			clearLocalStorage();
			clearSessionStorage();

			showFeedback("success", "Conta apagada com sucesso.");
			navigate("/registo", { replace: true });
		} catch (error) {
			console.error(error);
			showFeedback("error", "Erro inesperado ao apagar conta.");
		}
	};

	/* ================== UI ================== */

	return (
		<div className="page-box">
			<h1>Definições</h1>

			<select name="tema" value={definicoes.tema} onChange={handleChange}>
				<option value="claro">Claro</option>
				<option value="escuro">Escuro</option>
			</select>

			<label>
				<input
					type="checkbox"
					name="notificacoes"
					checked={definicoes.notificacoes}
					onChange={handleChange}
				/>
				Permitir notificações
			</label>

			<select
				name="linguagem"
				value={definicoes.linguagem}
				onChange={handleChange}
			>
				<option value="pt">Português</option>
				<option value="en">English</option>
			</select>

			<button onClick={atualizarDefinicoes}>Salvar</button>
		</div>
	);
}