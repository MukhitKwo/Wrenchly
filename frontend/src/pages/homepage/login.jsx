import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/appContext";

export default function Login() {
	// const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate(); // hook to navigate programmatically
	const { state, setState } = useApp(); // access global state

	const handleSubmit = async () => {
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

			if (!res.ok) {
				console.log(data.message); //! FALHOU A DAR LOGIN
			} else {
				console.log(data.message); //* LOGIN SUCESSO

				setState((prev) => ({
					...prev,
					user: data.user_data,
					garagem: data.garagem_data,
					definicoes: data.definicoes_data,
				}));

				navigate("/garagem"); // redirect to home page
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="page-box">
			<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
			<br></br>
			<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<br></br>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
}
