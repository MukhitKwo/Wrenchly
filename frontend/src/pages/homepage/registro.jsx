import React from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate(); // hook to navigate programmatically

	const handleSubmit = async () => {
		// console.log({ email, username, password });

		try {
			const res = await fetch("/api/registerUser/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, username, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				console.log(data.message); //! FALHOU A CRIAR USER OU GARAGEM
			} else {
				console.log(data.message); //* CRIOU USER E GARAGEM
				navigate("/garagem"); // redirect to home page
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="page-box">
			<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<br></br>
			<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
			<br></br>
			<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<br></br>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
}
