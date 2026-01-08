
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";
import "./perfil.css";

export default function Perfil() {
  const navigate = useNavigate();

  const { state: localState, setState: setLocalState, clear: clearLocal } =
    useLocalAppState();
  const { clear: clearSession } = useSessionAppState();

  const user = localState?.user;

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoHashed, setCodigoHashed] = useState(null);

  const showFeedback = (type, message) => {
    setLocalState((prev) => ({
      ...prev,
      feedback: { type, message },
    }));
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    if (!window.confirm("Tens a certeza que queres sair da tua conta?")) return;

    await fetch("/api/logoutUser/", {
      method: "POST",
      credentials: "include",
    });

    clearLocal();
    clearSession();
    showFeedback("success", "Sessão terminada com sucesso.");
    navigate("/login");
  };

  /* ================= APAGAR CONTA ================= */
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "⚠️ Esta ação é irreversível. Tens a certeza que queres apagar a conta?"
      )
    )
      return;

    const res = await fetch("/api/apagarUser/", {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      clearLocal();
      clearSession();
      showFeedback("success", "Conta apagada com sucesso.");
      navigate("/registo");
    } else {
      showFeedback("error", "Erro ao apagar a conta.");
    }
  };

  /* ================= PEDIR CÓDIGO ================= */
  const pedirCodigoSecreto = async () => {
    if (!password1 || !password2) {
      showFeedback("error", "Preenche ambos os campos da palavra-passe.");
      return;
    }

    if (password1 !== password2) {
      showFeedback("error", "As palavras-passe não coincidem.");
      return;
    }

    const res = await fetch("/api/pedirCodigoSecreto/", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      setCodigoHashed(data.hashed_code);
      showFeedback(
        "success",
        "Código de verificação enviado para o teu email."
      );
    } else {
      showFeedback("error", data.message || "Erro ao enviar código.");
    }
  };

  /* ================= ALTERAR PASSWORD ================= */
  const alterarPassword = async () => {
    if (!codigo) {
      showFeedback("error", "Insere o código recebido por email.");
      return;
    }

    const res = await fetch("/api/atualizarPassword/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        password: password1,
        codigoInput: codigo,
        codigoHashed,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setPassword1("");
      setPassword2("");
      setCodigo("");
      setCodigoHashed(null);
      showFeedback("success", "Palavra-passe atualizada com sucesso.");
    } else {
      showFeedback("error", data.message || "Erro ao atualizar palavra-passe.");
    }
  };

  if (!user) return null;

  return (
    <div className="page-box perfil-container">
      <h1>Perfil do Utilizador</h1>

      <div className="perfil-section perfil-info">
        <h2>Informações da Conta</h2>
        <p><strong>Utilizador:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="perfil-divider" />

      <div className="perfil-section">
        <h2>Segurança</h2>

        <div className="perfil-form">
          <label>
            Nova palavra-passe
            <input
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </label>

          <label>
            Confirmar palavra-passe
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </label>
        </div>

        <div className="perfil-actions">
          <button onClick={pedirCodigoSecreto}>
            Pedir código de verificação
          </button>
        </div>

        {codigoHashed && (
          <>
            <div className="perfil-form full">
              <label>
                Código recebido por email
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </label>
            </div>

            <div className="perfil-actions">
              <button onClick={alterarPassword}>
                Alterar palavra-passe
              </button>
            </div>
          </>
        )}
      </div>

      <div className="perfil-divider" />

      <div className="perfil-section">
        <h2>Conta</h2>
        <div className="perfil-actions">
          <button className="secondary" onClick={handleLogout}>
            Sair da Conta
          </button>
          <button className="danger" onClick={handleDeleteAccount}>
            Apagar Conta
          </button>
        </div>
      </div>
    </div>
  );
}