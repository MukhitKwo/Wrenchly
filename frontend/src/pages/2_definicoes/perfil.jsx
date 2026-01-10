import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import { useSessionAppState } from "../../context/appState.session";
import "./perfil.css";

export default function Perfil() {
	const navigate = useNavigate();

	const { state: localState, setState: setLocalState, clear: clearLocal } = useLocalAppState();
	const { clear: clearSession } = useSessionAppState();

  const user = localState?.user;
  const definicoes_data = localState?.definicoes;

	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const [codigo, setCodigo] = useState("");
	const [codigoHashed, setCodigoHashed] = useState(null);

  const [definicoes, setDefinicoes] = useState({
    tema: definicoes_data?.tema || "claro",
    linguagem: definicoes_data?.linguagem || "pt",
  });

  const showFeedback = (type, message) => {
    setLocalState((prev) => ({
      ...prev,
      feedback: { type, message },
    }));
  };

  /* ============ SESSÃO EXPIRADA ============ */
  const handleForbidden = () => {
    clearLocal();
    clearSession();
    showFeedback("error", "Sessão expirada. Inicia sessão novamente.");
    navigate("/login", { replace: true });
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    if (!window.confirm("Tens a certeza que queres sair da tua conta?")) return;

    try {
      const res = await fetch("/api/logoutUser/", {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 403) {
        handleForbidden();
        return;
      }

      clearLocal();
      clearSession();
      showFeedback("success", "Sessão terminada com sucesso.");
      navigate("/login");
    } catch {
      showFeedback("error", "Erro inesperado ao terminar sessão.");
    }
  };
  const handleDeleteAccount = async () => {
    if (!window.confirm("Esta ação é irreversível. Tens a certeza?")) return;

    try {
      const res = await fetch("/api/apagarUser/", {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 403) {
        handleForbidden();
        return;
      }

      if (res.ok) {
        clearLocal();
        clearSession();
        showFeedback("success", "Conta apagada com sucesso.");
        navigate("/registo");
      } else {
        showFeedback("error", "Erro ao apagar a conta.");
      }
    } catch {
      showFeedback("error", "Erro inesperado ao apagar conta.");
    }
  };
  const pedirCodigoSecreto = async () => {
    if (!password1 || !password2) {
      showFeedback("error", "Preenche ambos os campos.");
      return;
    }

		if (password1 !== password2) {
			showFeedback("error", "As palavras-passe não coincidem.");
			return;
		}

    try {
      const res = await fetch("/api/pedirCodigoSecreto/", {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 403) {
        handleForbidden();
        return;
      }

      const data = await res.json();
      setCodigoHashed(data.hashed_code);
      showFeedback("success", "Código enviado para o email.");
    } catch {
      showFeedback("error", "Erro ao pedir código.");
    }
  };

  const alterarPassword = async () => {
    if (!codigo) {
      showFeedback("error", "Insere o código.");
      return;
    }

    try {
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

      if (res.status === 403) {
        handleForbidden();
        return;
      }

      if (res.ok) {
        setPassword1("");
        setPassword2("");
        setCodigo("");
        setCodigoHashed(null);
        showFeedback("success", "Palavra-passe atualizada.");
      }
    } catch {
      showFeedback("error", "Erro ao atualizar palavra-passe.");
    }
  };
  const atualizarDefinicoes = async () => {
    if (!definicoes_data?.id) return;

    try {
      const res = await fetch(
        `/api/atualizarDefinicoes/${definicoes_data.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ definicoes }),
        }
      );

      if (res.status === 403) {
        handleForbidden();
        return;
      }

      const data = await res.json();

      setLocalState((prev) => ({
        ...prev,
        definicoes: data.definicoes_data,
      }));

      showFeedback("success", "Preferências atualizadas.");
    } catch {
      showFeedback("error", "Erro ao guardar preferências.");
    }
  };

	if (!user) return null;

	return (
		<div className="page-box perfil-container">
			<h1>Perfil do Utilizador</h1>

			<div className="perfil-section perfil-info">
				<h2>Informações da Conta</h2>
				<p>
					<strong>Utilizador:</strong> {user.username}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
			</div>

			<div className="perfil-divider" />

      <div className="perfil-section">
        <h2>Preferências</h2>

        <label>
          Tema
          <select
            value={definicoes.tema}
            onChange={(e) =>
              setDefinicoes((p) => ({ ...p, tema: e.target.value }))
            }
          >
            <option value="claro">Claro</option>
            <option value="escuro">Escuro</option>
          </select>
        </label>

        <div className="perfil-actions">
          <button onClick={atualizarDefinicoes}>
            Guardar preferências
          </button>
        </div>
      </div>

      <div className="perfil-divider" />
      <div className="perfil-section">
        <h2>Segurança</h2>

				<div className="perfil-form">
					<label>
						Nova palavra-passe
						<input type="password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
					</label>

					<label>
						Confirmar palavra-passe
						<input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
					</label>
				</div>

        <div className="perfil-actions">
          <button onClick={pedirCodigoSecreto}>
            Pedir código
          </button>
        </div>

        {codigoHashed && (
          <>
            <input
              type="text"
              placeholder="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <button onClick={alterarPassword}>
              Alterar palavra-passe
            </button>
          </>
        )}
      </div>

			<div className="perfil-divider" />

      <div className="perfil-section">
        <h2>Conta</h2>
        <div className="perfil-actions">
          <button onClick={handleLogout}>Sair</button>
          <button className="danger" onClick={handleDeleteAccount}>
            Apagar conta
          </button>
        </div>
      </div>
    </div>
  );
}
