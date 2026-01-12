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
    </div>
  );
}

export default Sobre;
