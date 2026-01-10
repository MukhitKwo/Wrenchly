import {React, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Login() {
	// const [email, setEmail] = React.useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate(); // hook to navigate programmatically
	const { setState: setLocalStorage } = useLocalAppState();
	const [loading, setLoading] = useState(false); // new state

	const loginUser = async () => {
		// console.log({ email, username, password });

		if (!username || !password) {
			setLocalStorage((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Preenche todos os campos",
				},
			}));
			return;
		}

		setLoading(true);

		try {
			const res = await fetch("http://localhost:8001/api/loginUser/", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				credentials: 'include',
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			if (!res.ok) {
				setLocalStorage((prev) => ({
					...prev,
					feedback: {
						type: "error",
						message: "Utilizador ou password incorretos",
					},
				}));
				return;
			}

			if (res.ok) {
				setLocalStorage({
					user: data.user_data,
					garagem: data.garagem_data,
					definicoes: data.definicoes_data,
					carros_preview: data.carrosPreview_data,
					notas: data.notas_data,
					feedback: {
						type: "success",
						message: "Login efetuado com sucesso",
					},
				});

				navigate("/garagem");
			}
		} catch (err) {
			setLocalStorage((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Erro de ligação ao servidor",
				},
			}));
		} finally {
			setLoading(false); // hide spinner
		}
	};

	return (
		<div
			className="page-box"
			style={{
				maxWidth: "400px",
				margin: "50px auto",
				padding: "30px",
				borderRadius: "12px",
				boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
				backgroundColor: "#fff",
				textAlign: "center",
				fontFamily: "sans-serif",
			}}
		>
			<h2 style={{ marginBottom: "20px" }}>LOGIN</h2>

			<input
				type="text"
				placeholder="Utilizador"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
			/>

			<input
				type="password"
				placeholder="Palavra-passe"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
			/>

			<div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
				<button
					onClick={() => navigate("/registo")}
					style={{
						flex: 1,
						padding: "12px",
						borderRadius: "8px",
						border: "1px solid #4CAF50",
						backgroundColor: "white",
						color: "#4CAF50",
						fontSize: "16px",
						cursor: "pointer",
					}}
				>
					Registar
				</button>

				<button
					onClick={loginUser}
					style={{
						flex: 1,
						padding: "12px",
						borderRadius: "8px",
						border: "none",
						backgroundColor: "#4CAF50",
						color: "white",
						fontSize: "16px",
						cursor: "pointer",
					}}
				>
					Login
				</button>
			</div>
			{loading && <LoadingSpinner text="A iniciar sessão..." />}
		</div>
	);
}
