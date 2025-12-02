import React, { useState } from "react";

function App() {
	// State to track whether we're showing the Login form (true) or Register form (false)
	const [isLogin, setIsLogin] = useState(true);

	// Function to toggle between Login and Register forms
	const toggleForm = () => {
		setIsLogin(!isLogin);
	};

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			{/* Show Login or Register form based on isLogin state */}
			{isLogin ? <Login /> : <Register />}

			{/* Button to switch between forms */}
			<button onClick={toggleForm} style={{ marginTop: "20px" }}>
				{isLogin ? "Go to Register" : "Go to Login"}
			</button>
		</div>
	);
}

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Replace URL with your real login API endpoint
			const response = await fetch("/api/loginUser/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			console.log(data);

			if (data.success) {
				// login successful
				// e.g., redirect with React Router
				alert("Login Successful");
			} else {
				// login failed
				alert(data.error);
			}
		} catch (error) {
			alert("Error: " + error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<h2>Login</h2>
			<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
			<br />
			<br />
			<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
			<br />
			<br />
			<button type="submit" disabled={loading}>
				{loading ? "Logging in..." : "Login"}
			</button>
		</form>
	);
}

function Register() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/registerUser/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password }),
			});

			const data = await response.json();

			if (data.success) {
				alert("Registered successfully!");
			} else {
				alert(data.error);
			}
		} catch (err) {
			alert("Network error: " + err.message);
		}
	};

	return (
		<form onSubmit={handleRegister}>
			<h2>Register</h2>
			<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
			<br />
			<br />
			<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			<br />
			<br />
			<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
			<br />
			<br />
			<button type="submit">Register</button>
		</form>
	);
}

export default App;
