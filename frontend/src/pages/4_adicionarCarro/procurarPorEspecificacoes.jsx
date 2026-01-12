import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalAppState } from "../../context/appState.local";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./adicionarEProcurar.css";

export default function ProcurarPorEspecificacoes() {
  const navigate = useNavigate();
  const { setState } = useLocalAppState();

  const [especificacoes, setEspecificacoes] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEspecificacoes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForbidden = useCallback(() => {
    setState((prev) => ({
      ...prev,
      user: null,
      garagem: null,
      carros_preview: [],
      notas: [],
      feedback: {
        type: "error",
        message: "Sessão expirada. Inicia sessão novamente.",
      },
    }));

    navigate("/login", { replace: true });
  }, [setState, navigate]);

  const procurarCarros = async (specs) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8001/api/procurarCarros/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ specs }),
      });

      if (res.status === 403) {
        handleForbidden();
        return;
      }

      const data = await res.json();
      if (!res.ok) return;

      navigate("/listaCarrosRecomendados", {
        state: { candidateCars: data.candidateCars_data },
      });
    } catch (error) {
      console.error(error);
      setState((prev) => ({
        ...prev,
        feedback: {
          type: "error",
          message: "Erro inesperado ao procurar carros.",
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Pesquisar por Especificações</h2>

      <div className="form-grid">
        <div className="form-row">
          <label>Categoria</label>
          <select
            name="categoria"
            value={especificacoes.categoria || ""}
            onChange={handleChange}
          >
            <option value="">Tipo / Categoria</option>
            <optgroup label="Carro">
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="coupe">Coupé</option>
              <option value="carrinha">Carrinha</option>
            </optgroup>
            <optgroup label="Mota">
              <option value="naked">Naked</option>
              <option value="sport">Sport</option>
              <option value="touring">Touring</option>
              <option value="custom">Custom</option>
              <option value="adv">Adventure</option>
            </optgroup>
          </select>
        </div>

        <div className="form-row">
          <label>Marca</label>
          <input
            name="marca"
            value={especificacoes.marca || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Modelo</label>
          <input
            name="modelo"
            value={especificacoes.modelo || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Ano mínimo</label>
          <input
            type="number"
            name="anoMin"
            value={especificacoes.anoMin || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Ano máximo</label>
          <input
            type="number"
            name="anoMax"
            value={especificacoes.anoMax || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Combustível</label>
          <select
            name="combustivel"
            value={especificacoes.combustivel || ""}
            onChange={handleChange}
          >
            <option value="">---</option>
            <option value="gasoleo">Diesel</option>
            <option value="gasolina">Gasolina</option>
            <option value="eletrico">Elétrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        <div className="form-row">
          <label>Transmissão</label>
          <select
            name="transmissao"
            value={especificacoes.transmissao || ""}
            onChange={handleChange}
          >
            <option value="">---</option>
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
          </select>
        </div>

        <div className="form-row">
          <label>Tração</label>
          <select
            name="tracao"
            value={especificacoes.tracao || ""}
            onChange={handleChange}
          >
            <option value="">---</option>
            <option value="fwd">FWD</option>
            <option value="rwd">RWD</option>
            <option value="awd">AWD</option>
          </select>
        </div>

        <div className="form-row">
          <label>Carroçaria</label>
          <select
            name="tipoCarroceria"
            value={especificacoes.tipoCarroceria || ""}
            onChange={handleChange}
          >
            <option value="">---</option>
            <option value="sedan">Sedan</option>
            <option value="hatchback">Hatchback</option>
            <option value="suv">SUV</option>
            <option value="coupe">Coupé</option>
            <option value="carrinha">Carrinha</option>
          </select>
        </div>

        <div className="form-row">
          <label>Cavalos mín</label>
          <input
            type="number"
            name="cavalosMin"
            value={especificacoes.cavalosMin || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Cavalos máx</label>
          <input
            type="number"
            name="cavalosMax"
            value={especificacoes.cavalosMax || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Cilindrada mín (cc)</label>
          <input
            type="number"
            name="cilindradaMin"
            value={especificacoes.cilindradaMin || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Cilindrada máx (cc)</label>
          <input
            type="number"
            name="cilindradaMax"
            value={especificacoes.cilindradaMax || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Portas</label>
          <input
            type="number"
            name="portas"
            value={especificacoes.portas || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Lugares</label>
          <input
            type="number"
            name="lugares"
            value={especificacoes.lugares || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Ordenar por</label>
          <select
            name="ordenarPor"
            value={especificacoes.ordenarPor || ""}
            onChange={handleChange}
          >
            <option value="">---</option>
            <option value="ano">Ano</option>
            <option value="cavalos">Cavalos</option>
            <option value="cilindrada">Cilindrada</option>
          </select>
        </div>
        <div className="form-row">
          <label>Ordem</label>
          <select
            name="ordem"
            value={especificacoes.ordem || "asc"}
            onChange={handleChange}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="submit-btn"
          type="button"
          onClick={() => procurarCarros(especificacoes)}
        >
          Procurar
        </button>
      </div>

      {loading && <LoadingSpinner text="A procurar veiculos..." />}
    </div>
  );
}
