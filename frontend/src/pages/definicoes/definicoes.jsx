import { useState } from "react";

export default function Definicoes() {
	// definir todos os campos numa unica variavel (menos sets e mais facil de adicionar mais campos)
	const [settings, setSettings] = useState({
		theme: "light",
		notifications: true,
		language: "pt",
	});

	// sempre que algo muda/atualiza, esta função é executada
	const handleChange = (e) => {
		// obtem a informação do target (elemento que foi atualizado)
		const { name, type, value, checked } = e.target;
		// copia os campos do settings (...s)
		setSettings((s) => ({
			...s,
			// mas define o campo atualizado com o novo valor
			// [name] é o nome do campo atualizado (ou a ser atualizado)
			// type é o tipo (texto, checkbox, etc)
			// se o tipo for "checkbox" (notificaçoes é checkbox), define o valor de "checked" (true ou false)
			// se NÂO foi checkbox, define o volor de "value" (o valor)
			[name]: type === "checkbox" ? checked : value,
		}));
		// por fim, troca o campo antigo pelo campo com valor atualizado na copia e salva
	};

	// Se não existisse checkboxes na pagina, o handleChange seria assim
	// const handleChange = (e) => {
	// 	const { name, value } = e.target;
	// 	setSettings((s) => ({
	// 		...s,
	// 		[name]: value,
	// 	}));
	// };

	const salvarDefinicoes = () => {
		console.log("USER SETTINGS", settings);
	};

	const apagarConta = () => {
    // nao vale a pena ter 2 ifs porque estas a verificar a mesma coisa
		if (window.confirm("Tens a certeza que queres apagar a tua conta?.")) {
			console.log("Account Deleted");
		}
	};

	return (
		<div>
			<h1>Settings</h1>

			{/* onchange chama o handleChnage(), e o handleChange() usa o value="" */}
			<select name="theme" value={settings.theme} onChange={handleChange}>
				<option value="claro">Claro</option>
				<option value="escuro">Escuro</option>
			</select>

			{/* onchange chama o handleChnage(), e o handleChange() usa o checked="" (porque não existe value="") */}
			<label>
				<input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} />
				Permitir notificações
			</label>

			{/* onchange chama o handleChnage(), e o handleChange() usa o value="" */}
			<select name="language" value={settings.language} onChange={handleChange}>
				<option value="pt">Português</option>
				<option value="en">English</option>
			</select>

			<button onClick={salvarDefinicoes}>Salvar</button>
			<button onClick={apagarConta} style={{ color: "red" }}>
				Apagar Conta
			</button>
		</div>
	);
}
