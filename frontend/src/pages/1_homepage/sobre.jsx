import { useState, useEffect } from "react";
import "./sobre.css";

function Sobre() {
  const text = "Wrenchly";
  const [displayedText, setDisplayedText] = useState("");
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let index = 1;
    let isDeleting = false;
    let timeout;

    const animate = () => {
      if (!isDeleting) {
        setDisplayedText(text.slice(0, index + 1));
        index++;

        if (index === text.length) {
          setBlink(true);
          timeout = setTimeout(() => {
            isDeleting = true;
            setBlink(false);
            animate();
          }, 2000);
          return;
        }
      } else {
        if (index > 1) {
          setDisplayedText(text.slice(0, index));
          index--;
        } else {
          setDisplayedText(text[0]);
          setBlink(true);
          index = 1;
          timeout = setTimeout(() => {
            isDeleting = false;
            setBlink(false);
            animate();
          }, 1000);
          return;
        }
      }

      timeout = setTimeout(animate, 150);
    };

    setDisplayedText(text[0]);
    animate();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="sobre-page">
      <section className="sobre-hero">
        <h1 className={`typewriter ${blink ? "maquinaescrever" : ""}`}>
          {displayedText}
        </h1>
      </section>

      <section className="sobre-section">
        <h2>A nossa visão</h2>
        <p>
          A <strong>Wrenchly</strong> nasceu da necessidade de centralizar toda a
          informação relacionada com a manutenção automóvel num único local.
          O nosso objetivo é simplificar processos, reduzir esquecimentos e
          ajudar os utilizadores a prolongar a vida útil dos seus veículos.
        </p>
        <p>
          Acreditamos que uma boa gestão preventiva reduz custos, aumenta a
          segurança e melhora a experiência de condução.
        </p>
      </section>
      <section className="sobre-cards">
        <div className="card">
          <h3>Garagem Digital</h3>
          <p>
            Gestão completa dos seus veículos com acesso rápido às informações
            mais importantes, sempre atualizadas.
          </p>
        </div>

        <div className="card">
          <h3>Manutenção Organizada</h3>
          <p>
            Registo de manutenções corretivas, preventivas e crónicas, com histórico
            detalhado e fácil de consultar.
          </p>
        </div>

        <div className="card">
          <h3>Cálculo de Risco</h3>
          <p>
            Acompanhamento inteligente baseado em quilometragem e datas para
            antecipar intervenções necessárias.
          </p>
        </div>

        <div className="card">
          <h3>Notas Personalizadas</h3>
          <p>
            Anote observações importantes sobre cada veículo, mantendo tudo
            organizado e acessível.
          </p>
        </div>

        <div className="card">
          <h3>Segurança</h3>
          <p>
            Sistema de autenticação seguro com gestão de conta, palavra-passe
            e sessão protegida.
          </p>
        </div>

        <div className="card">
          <h3>Inteligência Artificial</h3>
          <p>
            Integração com a API Gemini para sugestões inteligentes relacionadas
            com manutenção e veículos.
          </p>
        </div>
      </section>

      <section className="sobre-section destaque">
        <h2>Tecnologia & Arquitetura</h2>
        <p>
          A Wrenchly foi desenvolvida com uma arquitetura moderna, separando
          claramente frontend e backend para garantir escalabilidade,
          manutenção e desempenho.
        </p>

        <ul>
          <li><strong>React</strong> — Aplicação SPA rápida e responsiva</li>
          <li><strong>React Router</strong> — Navegação fluida sem recarregamentos</li>
          <li><strong>Context API</strong> — Gestão centralizada de estado</li>
          <li><strong>Django</strong> — Backend robusto e seguro</li>
          <li><strong>API Gemini</strong> — Funcionalidades inteligentes com IA</li>
        </ul>
      </section>

      <section className="sobre-section">
        <h2>Público-Alvo</h2>
        <p>
          A aplicação destina-se a utilizadores que pretendam um maior controlo
          sobre a manutenção dos seus veículos, desde utilizadores comuns até
          entusiastas automóveis e pequenos negócios.
        </p>
        <ul>
          <li><strong>Proprietários de veículos</strong></li>
          <li><strong>Oficinas e pequenos profissionais</strong></li>
          <li><strong>Entusiastas de automóveis</strong></li>
        </ul>
      </section>

      <section className="sobre-section light">
        <h2>Contexto do Projeto</h2>
        <p>
          Este projeto foi desenvolvido em contexto académico, com foco na
          aplicação de boas práticas de desenvolvimento web, integração de APIs,
          segurança e experiência do utilizador.
        </p>
      </section>

      <footer className="sobre-footer">
        <span>Gestão inteligente para uma condução mais segura</span>
      </footer>
    </div>
  );
}

export default Sobre;
