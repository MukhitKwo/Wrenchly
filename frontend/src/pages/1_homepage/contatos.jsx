import React from 'react';

function Contatos() {
  const abrirGmail = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=wrenchly.notification@gmail.com",
      "_blank"
    );
  };

  const fazerChamada = () => {
    window.location.href = "tel:+351912345678";
  };

  const abrirMaps = () => {
    const morada = "Rua Comandante Pinho e Freitas, nº 28, 3750-127 Águeda, Portugal";
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(morada)}`,
      "_blank"
    );
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '900px',
    padding: '14px 0',
    fontSize: '1.05rem'
  };

  const iconStyle = {
    width: '26px',
    cursor: 'pointer',
    marginLeft: '16px'
  };

  const formInputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  };

  const formButtonStyle = {
    padding: '12px 25px',
    backgroundColor: '#D44638',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  return (
    <div
      className="page-box"
      style={{
        maxWidth: '1100px',
        margin: '80px auto 0 auto',
        padding: '40px 20px'
      }}
    >
      <h1 style={{ marginBottom: '20px', paddingBottom:'20px' }}>Entre em Contato</h1>

      <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>
        Estamos disponíveis para responder às suas perguntas. Use o método de contato que preferir:
      </p>

      {/* Email */}
      <div style={rowStyle}>
        <div><strong>Email:</strong> wrenchly.notification@gmail.com</div>
        <img
          src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico"
          alt="Enviar email"
          title="Enviar email"
          onClick={abrirGmail}
          style={iconStyle}
        />
      </div>

      {/* Telefone */}
      <div style={rowStyle}>
        <div><strong>Telefone:</strong> +351 912 345 678</div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/724/724664.png"
          alt="Ligar"
          title="Ligar"
          onClick={fazerChamada}
          style={iconStyle}
        />
      </div>

      {/* Morada */}
      <div style={rowStyle}>
        <div>
          <strong>Morada:</strong> Rua Comandante Pinho e Freitas, nº 28, 3750 – 127 Águeda
        </div>
        <img
          src="https://maps.gstatic.com/favicon3.ico"
          alt="Ver no Google Maps"
          title="Ver direções no Google Maps"
          onClick={abrirMaps}
          style={iconStyle}
        />
      </div>

      {/* Formulário de Contato Funcional */}
      <div
        style={{
          border: '1px solid #ccc',
          padding: '50px',
          marginTop: '50px',
          borderRadius: '8px'
        }}
      >
        <h3 style={{ marginBottom: '20px' }}>Formulário de Contato Simples</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const nome = e.target.nome.value;
            const email = e.target.email.value;
            const assunto = e.target.assunto.value;
            const mensagem = e.target.mensagem.value;

            const mailtoLink = `mailto:wrenchly.notification@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\n${mensagem}`)}`;

            window.location.href = mailtoLink;
          }}
        >
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            required
            style={formInputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            style={formInputStyle}
          />

          <input
            type="text"
            name="assunto"
            placeholder="Assunto"
            required
            style={formInputStyle}
          />

          <textarea
            name="mensagem"
            placeholder="Mensagem"
            required
            rows="6"
            style={formInputStyle}
          />

          <button type="submit" style={formButtonStyle}>Enviar Email</button>
        </form>
      </div>
    </div>
  );
}

export default Contatos;
