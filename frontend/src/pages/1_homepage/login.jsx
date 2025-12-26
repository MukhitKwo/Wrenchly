import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";

export default function Login() {
	// const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate(); // hook to navigate programmatically
	const { setState: setLocalStorage } = useLocalAppState();
	const { setState: setSessionStorage } = useSessionAppState();

	const loginUser = async () => {
		// console.log({ email, username, password });

		if (!username || !password) {
			alert("Please fill in all fields");
			return;
		}

		try {
			const res = await fetch("/api/loginUser/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				setLocalStorage({
					user: data.user_data,
					garagem: data.garagem_data,
					definicoes: data.definicoes_data,
					carros_preview: data.carrosPreview_data,
					notas: data.notas_data,
				});

				navigate("/garagem"); // redirect to home page
			}
		} catch (err) {
			console.error(err);
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
			<h2 style={{ marginBottom: "20px" }}>Login</h2>

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
					Register
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
		</div>
	);
}
