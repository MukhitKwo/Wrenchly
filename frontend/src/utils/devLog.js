export async function devLog({ tipo, acao, payload }) {
	try {
		await fetch("http://localhost:8001/api/dev-log/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tipo, acao, payload }),
		});
	} catch (err) {
		console.error("Erro dev-log:", err);
	}
}
