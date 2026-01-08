// src/pages/Sobre.jsx

function Sobre() {
  return (
    <div
      className="page-box"
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Wrenchly</h1>

      <p>
        A <strong>Wrenchly</strong> é uma aplicação web desenvolvida com o objetivo de
        facilitar a gestão de veículos e respetivas manutenções. A aplicação permite
        ao utilizador acompanhar o estado do seu automóvel de forma simples,
        organizada e eficiente, centralizando toda a informação num único local.
      </p>

      <hr />

      <h2 style={{ textAlign: "center" }}>Objetivo da Aplicação</h2>
      <p>
        O principal objetivo  é ajudar os utilizadores a manter um
        histórico detalhado das manutenções realizadas nos seus veículos, evitando
        esquecimentos e promovendo uma melhor tomada de decisão relativamente a
        reparações futuras e manutenções preventivas.
      </p>

      <hr />

      <h2 style={{ textAlign: "center" }}>Funcionalidades Principais</h2>
      <ul>
        <li>Gestão de veículos na garagem</li>
        <li>Registo de manutenções corretivas, preventivas e crónicas</li>
        <li>Cálculo de risco com base na quilometragem</li>
        <li>Criação, edição e remoção de notas associadas aos veículos</li>
        <li>Sistema de autenticação (login, registo e logout)</li>
        <li>Gestão de definições do utilizador</li>
        <li>Feedback visual para ações do utilizador</li>
      </ul>

      <hr />

      <h2 style={{ textAlign: "center" }}>Tecnologias Utilizadas</h2>
      <p>
        A aplicação foi desenvolvida utilizando tecnologias modernas de
        desenvolvimento web, divididas entre frontend e backend:
      </p>

      <ul>
        <li>
          <strong>React</strong> – biblioteca JavaScript para construção da interface
          do utilizador
        </li>
        <li>
          <strong>React Router</strong> – gestão da navegação entre páginas da aplicação
        </li>
        <li>
          <strong>Context API</strong> – gestão de estado global (utilizador, notas,
          feedback, etc.)
        </li>
        <li>
          <strong>Django</strong> – framework backend responsável pela lógica do
          servidor e gestão de dados
        </li>
        <li>
          <strong>API do Gemini</strong> – utilizada para funcionalidades inteligentes
          baseadas em inteligência artificial
        </li>
        <li>
          <strong>JavaScript</strong>, <strong>HTML</strong> e <strong>CSS</strong> –
          lógica, estrutura e estilo da aplicação
        </li>
      </ul>

      <hr />

      <h2 style={{ textAlign: "center" }}>Público-Alvo</h2>
      <p>
        Destinada a qualquer pessoa que pretenda manter um controlo mais
        organizado sobre a manutenção do seu veículo, incluindo utilizadores comuns,
        entusiastas de automóveis ou pequenos negócios ligados à manutenção automóvel.
      </p>

      <hr />

      <h2 style={{ textAlign: "center" }}>Contexto do Projeto</h2>
      <p>
        Este projeto foi desenvolvido em contexto académico, com o objetivo de
        aplicar conhecimentos de desenvolvimento frontend e backend, integração de
        APIs, autenticação de utilizadores e boas práticas de desenvolvimento de
        aplicações web.
      </p>

      <hr />
    </div>
  );
}

export default Sobre;