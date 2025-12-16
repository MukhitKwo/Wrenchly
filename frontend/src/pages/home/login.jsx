import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../context/appContext";

export default function Login() {
	// const [email, setEmail] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const navigate = useNavigate(); // hook to navigate programmatically
	const { setState: setLocalStorage } = useLocalStorage(); // access global state

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
				setLocalStorage((prev) => ({
					...prev,
					user: data.user_data,
					garagem: data.garagem_data,
					definicoes: data.definicoes_data,
					carros_preview: data.carroPreview_data,
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
			<button onClick={loginUser}>Submit</button>
		</div>
	);
}
