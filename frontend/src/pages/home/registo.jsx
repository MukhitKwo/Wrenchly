import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";

export default function Registo() {
	const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate(); // hook to navigate programmatically
	const { setState: setLocalStorage } = useLocalStorage(); // access global state

	const registarUser = async () => {
		// console.log({ email, username, password });

		if (!username || !password || !email) {
			alert("Please fill in all fields");
			return;
		}

		try {
			const res = await fetch("/api/registerUser/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, username, password }),
			});

			const data = await res.json();
			console.log(data.message);

			if (res.ok) {
				setLocalStorage((prev) => ({
					...prev,
					user: data.user_data,
					garagem: data.garagem_data,
					definicoes: data.definicoes_data,
					carros_preview: data.carroPreview_data
				}));

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
			<button onClick={registarUser}>Submit</button>
		</div>
	);
}
