import React, { useState } from "react";

export default function ProcurarCarroPor() {
  const [modo, setModo] = useState("modelo");


  /* ESTADOS POR ESPECIFICAÇÕES */
  const [marcaEsp, setMarcaEsp] = useState("");
  const [combustivelEsp, setCombustivelEsp] = useState("");
  const [cilindradaEsp, setCilindradaEsp] = useState("");
  const [cavalosEsp, setCavalosEsp] = useState("");
  const [transmissaoEsp, setTransmissaoEsp] = useState("");
  const [anoEsp, setAnoEsp] = useState("");
  const [tipoCorpoEsp, setTipoCorpoEsp] = useState("");
  const [economia, setEconomia] = useState("");
  const [alcance, setAlcance] = useState("");


  /* ESTADOS POR MODELO */
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [combustivel, setCombustivel] = useState("");
  const [cilindrada, setCilindrada] = useState("");
  const [cavalos, setCavalos] = useState("");
  const [ano, setAno] = useState("");
  const [transmissao, setTransmissao] = useState("");
  const [tipoCorpo, setTipoCorpo] = useState("");
  const [matricula, setMatricula] = useState("");


  const procurarEspecificacoes = () => {
    console.log("=== PESQUISA POR ESPECIFICAÇÕES ===");
    console.log({
      marcaEsp,
      combustivelEsp,
      cilindradaEsp,
      cavalosEsp,
      transmissaoEsp,
      anoEsp,
      tipoCorpoEsp,
      economia,
      alcance,
    });
  };


  const procurarModelo = () => {
    console.log("=== PESQUISA POR MODELO ===");
    console.log({
      marca,
      modelo,
      combustivel,
      cilindrada,
      cavalos,
      ano,
      transmissao,
      tipoCorpo,
      matricula,
    });
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1>Procurar Carro</h1>
      <p>Escolhe como queres procurar um carro.</p>


      <button onClick={() => setModo("modelo")}>Por Modelo</button>
      <button onClick={() => setModo("especificacoes")} style={{ marginLeft: "10px" }}>
        Por Especificações
      </button>


      {/* POR ESPECIFICAÇÕES */}
      {modo === "especificacoes" && (
        <div>
          <h2>Pesquisar por Especificações</h2>


          <input placeholder="Marca" value={marcaEsp} onChange={e => setMarcaEsp(e.target.value)} />


          <select value={combustivelEsp} onChange={e => setCombustivelEsp(e.target.value)}>
            <option value="">Combustível</option>
            <option>Gasolina</option>
            <option>Gasóleo</option>
            <option>Elétrico</option>
            <option>Híbrido</option>
          </select>


          <input type="number" min="0" placeholder="Cilindrada (cc)"
            value={cilindradaEsp} onChange={e => setCilindradaEsp(e.target.value)} />


          <input type="number" min="0" placeholder="Cavalos (opcional)"
            value={cavalosEsp} onChange={e => setCavalosEsp(e.target.value)} />


          <select value={transmissaoEsp} onChange={e => setTransmissaoEsp(e.target.value)}>
            <option value="">Transmissão</option>
            <option>Manual</option>
            <option>Automática</option>
          </select>


          <input type="number" min="0" placeholder="Ano de Produção"
            value={anoEsp} onChange={e => setAnoEsp(e.target.value)} />


          <select value={tipoCorpoEsp} onChange={e => setTipoCorpoEsp(e.target.value)}>
            <option value="">Tipo de Corpo (opcional)</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Coupé</option>
            <option>Carrinha</option>
          </select>


          <input placeholder="Economia de Combustível"
            value={economia} onChange={e => setEconomia(e.target.value)} />


          <input placeholder="Alcance"
            value={alcance} onChange={e => setAlcance(e.target.value)} />


          <button type="button" onClick={procurarEspecificacoes}>
            Procurar
          </button>
        </div>
      )}


      {/* POR MODELO */}
      {modo === "modelo" && (
        <div>
          <h2>Pesquisar por Modelo</h2>

          <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
          
          <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />


          <select value={combustivel} onChange={e => setCombustivel(e.target.value)}>
            <option value="">Combustível</option>
            <option>Gasolina</option>
            <option>Gasóleo</option>
            <option>Elétrico</option>
            <option>Híbrido</option>
          </select>

          <input type="number" min="0" placeholder="Cilindrada (cc)"
            value={cilindrada} onChange={e => setCilindrada(e.target.value)} />


          <input type="number" min="0" placeholder="Cavalos (opcional)"
            value={cavalos} onChange={e => setCavalos(e.target.value)} />


          <input type="number" min="0" placeholder="Ano de Produção"
            value={ano} onChange={e => setAno(e.target.value)} />


          <select value={transmissao} onChange={e => setTransmissao(e.target.value)}>
            <option value="">Transmissão</option>
            <option>Manual</option>
            <option>Automática</option>
          </select>


          <select value={tipoCorpo} onChange={e => setTipoCorpo(e.target.value)}>
            <option value="">Tipo de Corpo (opcional)</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Hatchback</option>
            <option>Coupé</option>
            <option>Carrinha</option>
          </select>


          <input placeholder="Matrícula (opcional)"
            value={matricula} onChange={e => setMatricula(e.target.value)} />


          <button type="button" onClick={procurarModelo}>
            Procurar
          </button>
        </div>

      )}
      
    </div>
  );
}
