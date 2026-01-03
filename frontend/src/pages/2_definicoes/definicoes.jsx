import { useState } from "react";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function Definicoes() {
	// obter definiçoes do localStorage
	const { state: getLocalStorage, setState: setLocalStorage, clear: clearLocalStorage } = useLocalAppState();
	const { clear: clearSessionStorage } = useSessionAppState();


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
					window.location.href = "/login";
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	const [codigoHashed, setCodigoHashed] = useState();

	const pedirCodigoSecreto = async (password1, password2) => {
		if (!password1 || !password2) {
			alert("Por favor, preencha ambos os campos");
			return;
		}

		if (password1 !== password2) {
			alert("As palavras-passe não correspondem");
			return;
		}

		if (window.confirm("Tens a certeza que queres mudar a tua palavra-passe?.")) {
			try {
				const res = await fetch(`/api/pedirCodigoSecreto/`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({}),
				});

				const data = await res.json();
				console.log(data.message);

				if (res.ok) {
					setCodigoHashed(data.hashed_code);
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	const atualizarpassword = async (password, codigoInput) => {
		if (!codigoInput) {
			alert("Preencha o campo");
			return;
		}

		if (window.confirm("Tens a certeza que queres mudar a tua palavra-passe?.")) {
			try {
				const res = await fetch(`/api/atualizarPassword/`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ password, codigoInput, codigoHashed }),
				});

				const data = await res.json();
				console.log(data.message);

				if (res.ok) {
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
					window.location.href = "/registo";
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
				<select name="tema" value={definicoes.tema} onChange={handleChange}>
					<option value="claro">Claro</option>
					<option value="escuro">Escuro</option>
				</select>
			</div>

			<div>
				<label>
					{/* onchange chama o handleChnage(), e o handleChange() usa o checked="" (porque não existe value="") */}
					<input type="checkbox" name="notificacoes" checked={definicoes.notificacoes} onChange={handleChange} />
					Permitir notificações
				</label>
			</div>

			<div>
				{/* onchange chama o handleChnage(), e o handleChange() usa o value="" */}
				<select name="linguagem" value={definicoes.linguagem} onChange={handleChange}>
					<option value="pt">Português</option>
					<option value="en">English</option>
				</select>
			</div>

			<button onClick={atualizarDefinicoes}>Salvar</button>

			<div>
				<br />
				<label>
					Nova palavra-passe
					<br />
					<input type="password" id="password1" />
				</label>
				<br />
				<label>
					Confirmar palavra-passe
					<br />
					<input type="password" id="password2" />
				</label>
				<br />
				<button
					onClick={() => {
						const password1 = document.getElementById("password1").value;
						const password2 = document.getElementById("password2").value;
						pedirCodigoSecreto(password1, password2);
					}}
				>
					Alterar Palavra-passe
				</button>

				<br />
				<label>
					Inserir codigo
					<br />
					<input type="text" id="codigoInput" />
				</label>
				<br />
				<button
					onClick={() => {
						const password1 = document.getElementById("password1").value;
						const codigoInput = document.getElementById("codigoInput").value;
						atualizarpassword(password1, codigoInput);
					}}
				>
					Alterar Palavra-passe
				</button>
			</div>

			<br />
			<button onClick={apagarUser}>Apagar Conta</button>
			<button onClick={logoutUser}>Sair da Conta</button>
		</div>
	);
}
