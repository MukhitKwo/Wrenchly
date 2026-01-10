import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";

export default function Registo() {
	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate(); // hook to navigate programmatically
	const { setState: setLocalStorage } = useLocalAppState(); // access global state

	const registarUser = async () => {
		// console.log({ email, username, password });

		if (!username || !password || !email) {
			setLocalStorage((prev) => ({
				...prev,
				feedback: {
					type: "error",
					message: "Preenche todos os campos",
				},
			}));
			return;
		}


		try {
			const res = await fetch("http://localhost:8001/api/registerUser/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, username, password }),
			});

			const data = await res.json();
			if (!res.ok) {
				setLocalStorage((prev) => ({
					...prev,
					feedback: {
						type: "error",
						message: "Erro ao criar conta",
					},
				}));
				return;
			}


			if (res.ok) {
				setLocalStorage((prev) => ({
					...prev,
					user: data.user_data,
					garagem: data.garagem_data,
					definicoes: data.definicoes_data,
					carros_preview: data.carroPreview_data,
					notas: data.notas_data,
					feedback: {
						type: "success",
						message: "Conta criada com sucesso",
					},
				}));

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
			<h2 style={{ marginBottom: "20px" }}>Register</h2>

			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
			/>

			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
			/>

			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
			/>

			<div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
				<button
					onClick={() => navigate("/login")}
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
					Login
				</button>

				<button
					onClick={registarUser}
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
					Register
				</button>
			</div>
		</div>
	);
}
