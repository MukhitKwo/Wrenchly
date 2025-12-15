import { useState } from "react";

export default function Definicoes() {
  const [tema, setTema] = useState("claro");
  const [notificacoes, setNotificacoes] = useState(true);
  const [lingua, setLingua] = useState("pt");


  const guardarDefinicoes = () => {
    console.log(" DEFINIÇÕES DO UTILIZADOR ");
    console.log({ tema, notificacoes, lingua });
  };


  const apagarConta = () => {
    const confirmacao = window.confirm(
      "Tens a certeza que queres apagar a tua conta? Esta ação é irreversível."
    );

    if (confirmacao) {
      alert("Conta apagada com sucesso (simulação).");
      console.log("Conta do utilizador apagada");
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Definições</h1>
      <p>Definições do utilizador na aplicação</p>


      {/* Tema */}
      <div>
        <label>Tema:</label>
        <select value={tema} onChange={(e) => setTema(e.target.value)}>
          <option value="claro">Claro</option>
          <option value="escuro">Escuro</option>
        </select>
      </div>


      {/* Notificações */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificacoes}
            onChange={(e) => setNotificacoes(e.target.checked)}
          />
          Ativar notificações
        </label>
      </div>

      {/* Língua */}
      <div>
        <label>Língua:</label>
        <select value={lingua} onChange={(e) => setLingua(e.target.value)}>
          <option value="pt">Português</option>
          <option value="en">English</option>
        </select>
      </div>

      <button type="button" onClick={guardarDefinicoes}>
        Guardar Definições
      </button>

      <hr />


      {/* Apagar conta */}
      <div>
        <button type="button" onClick={apagarConta} style={{ color: "red" }}>
          Apagar Conta
        </button>
      </div>
    </div>
  );
}
